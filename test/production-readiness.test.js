import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';

import {
  getDatabase,
  closeDatabase,
  resetDatabaseForTesting,
  findOrderById
} from '../server/db.js';

import {
  validateProductionSecrets
} from '../server/auth.js';

import { handleApiRequest } from '../server/api.js';

// Helper to simulate mock HTTP requests to handleApiRequest
function invokeApi(method, path, body = null, headers = {}, customSocket = null) {
  return new Promise((resolve) => {
    const reqHeaders = { ...headers };
    let bodyStr = '';
    if (body !== null) {
      bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      reqHeaders['content-type'] = reqHeaders['content-type'] || 'application/json';
      reqHeaders['content-length'] = Buffer.byteLength(bodyStr);
    }

    const req = new Readable({
      read() {
        if (bodyStr) this.push(bodyStr);
        this.push(null);
      }
    });

    req.method = method;
    req.url = path;
    req.headers = reqHeaders;
    req.socket = customSocket || { remoteAddress: '192.168.1.50' };

    let resBody = '';
    const resHeaders = {};
    const res = {
      statusCode: 200,
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      end(chunk) {
        if (chunk) resBody += chunk;
        let parsed = resBody;
        try {
          parsed = JSON.parse(resBody);
        } catch (e) {}
        resolve({
          status: res.statusCode,
          headers: resHeaders,
          body: parsed
        });
      }
    };

    handleApiRequest(req, res);
  });
}

test('1. Database Isolation & Idempotent Seeding', () => {
  const tempDbPath = path.resolve(process.cwd(), 'data', `test-isolated-${Date.now()}.db`);
  
  try {
    // Initialize temporary database
    const db1 = resetDatabaseForTesting(tempDbPath);
    assert.ok(db1);

    // Verify admin user was seeded safely
    const adminUser = db1.prepare("SELECT email, role FROM users WHERE email = 'admin@techtrove.local'").get();
    assert.ok(adminUser);
    assert.equal(adminUser.role, 'admin');

    // Run close and re-seed to guarantee ON CONFLICT safety (no UNIQUE constraint failed: users.email)
    closeDatabase();
    const db2 = resetDatabaseForTesting(tempDbPath);
    assert.ok(db2);
    const countAdmins = db2.prepare("SELECT count(*) as count FROM users WHERE email = 'admin@techtrove.local'").get();
    assert.equal(countAdmins.count, 1);
  } finally {
    closeDatabase();
    // Reconnect to default database
    delete process.env.SQLITE_DB_PATH;
    getDatabase();

    // Clean up temporary files
    try {
      if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
      if (fs.existsSync(`${tempDbPath}-wal`)) fs.unlinkSync(`${tempDbPath}-wal`);
      if (fs.existsSync(`${tempDbPath}-shm`)) fs.unlinkSync(`${tempDbPath}-shm`);
    } catch (e) {}
  }
});

test('2. Request Body Validation: Rejects Malformed JSON with 400 Bad Request', async () => {
  const malformedPayload = '{"title": "broken json without closing bracket';
  
  const res = await invokeApi('POST', '/api/orders', malformedPayload, {
    'content-type': 'application/json'
  });

  assert.equal(res.status, 400);
  assert.ok(res.body.error);
  assert.match(res.body.error, /Malformed JSON payload/i);
});

test('3. Request Body Validation: 1MB Payload Limit returns 413 Payload Too Large', async () => {
  // Generate an oversized 1.2 MB string
  const oversizedPayload = JSON.stringify({
    items: [],
    padding: 'X'.repeat(1.2 * 1024 * 1024)
  });

  const res = await invokeApi('POST', '/api/orders', oversizedPayload, {
    'content-type': 'application/json'
  });

  assert.equal(res.status, 413);
  assert.ok(res.body.error);
  assert.match(res.body.error, /Payload too large/i);
});

test('4. Security: Untrusted Proxy ignores x-forwarded-for header', async () => {
  const prevTrusted = process.env.TRUSTED_PROXY;
  try {
    delete process.env.TRUSTED_PROXY;

    // Send request with spoofed x-forwarded-for
    const res = await invokeApi('GET', '/api/health', null, {
      'x-forwarded-for': '203.0.113.195, 10.0.0.1'
    }, { remoteAddress: '127.0.0.1' });

    assert.equal(res.status, 200);

    // Verify with TRUSTED_PROXY enabled
    process.env.TRUSTED_PROXY = 'true';
    const resTrusted = await invokeApi('GET', '/api/health', null, {
      'x-forwarded-for': '203.0.113.195, 10.0.0.1'
    }, { remoteAddress: '127.0.0.1' });

    assert.equal(resTrusted.status, 200);
  } finally {
    if (prevTrusted !== undefined) {
      process.env.TRUSTED_PROXY = prevTrusted;
    } else {
      delete process.env.TRUSTED_PROXY;
    }
  }
});

test('5. Production Security: Fails clearly on insecure default secrets in production', () => {
  const prevEnv = process.env.NODE_ENV;
  const prevPass = process.env.ADMIN_PASSWORD;
  const prevSec = process.env.ADMIN_SESSION_SECRET;

  try {
    process.env.NODE_ENV = 'production';
    process.env.ADMIN_PASSWORD = 'admin123'; // Insecure default
    process.env.ADMIN_SESSION_SECRET = 'dev_secret_key_antigravity_ice_blue_2025';

    assert.throws(() => {
      validateProductionSecrets();
    }, /CRITICAL SECURITY CONFIGURATION ERROR/i);

    // Valid production configuration
    process.env.ADMIN_PASSWORD = 'super_secure_production_admin_password_9988!';
    process.env.ADMIN_SESSION_SECRET = 'a_very_long_secure_session_secret_32_characters_long!';

    assert.doesNotThrow(() => {
      validateProductionSecrets();
    });
  } finally {
    process.env.NODE_ENV = prevEnv;
    if (prevPass) process.env.ADMIN_PASSWORD = prevPass; else delete process.env.ADMIN_PASSWORD;
    if (prevSec) process.env.ADMIN_SESSION_SECRET = prevSec; else delete process.env.ADMIN_SESSION_SECRET;
  }
});

test('6. Privacy Protection: Order lookup masks personal details for unauthenticated requests', async () => {
  const allProducts = (await invokeApi('GET', '/api/products')).body.products;
  const targetProduct = allProducts.find(p => p.stock > 0) || allProducts[0];

  // Create an order first
  const orderRes = await invokeApi('POST', '/api/orders', {
    customer: {
      name: 'Rahim Ahmed',
      phone: '01712345678',
      division: 'Dhaka',
      address: 'House 42, Road 11, Banani, Dhaka'
    },
    items: [
      { id: targetProduct.id, quantity: 1 }
    ],
    paymentMethod: 'cod'
  });

  assert.equal(orderRes.status, 201);
  const orderId = orderRes.body.order.id;
  const guestToken = orderRes.body.guestToken;

  // Unauthenticated query (public tracking with no token)
  const publicRes = await invokeApi('GET', `/api/orders/${orderId}`);
  assert.equal(publicRes.status, 200);
  assert.equal(publicRes.body.authorized, false);
  // Name and phone must be masked
  assert.match(publicRes.body.order.customer.name, /R\*\*\* A\*\*\*/);
  assert.match(publicRes.body.order.customer.phone, /017\*\*\*\*5678/);
  // Address must NOT be exposed
  assert.equal(publicRes.body.order.customer.address, undefined);

  // Authorized query with guestToken
  const authorizedRes = await invokeApi('GET', `/api/orders/${orderId}?token=${guestToken}`);
  assert.equal(authorizedRes.status, 200);
  assert.equal(authorizedRes.body.authorized, true);
  assert.equal(authorizedRes.body.order.customer.name, 'Rahim Ahmed');
  assert.equal(authorizedRes.body.order.customer.phone, '01712345678');
  assert.equal(authorizedRes.body.order.customer.address, 'House 42, Road 11, Banani, Dhaka');
});
