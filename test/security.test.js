import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable, Writable } from 'node:stream';
import crypto from 'node:crypto';

import {
  getDatabase,
  createProduct,
  updateProductStatus,
  createOrderWithReservation,
  findOrderById,
  createUser,
  createSession
} from '../server/db.js';

import {
  generateAdminToken,
  createCustomerSession,
  createPhoneOtp
} from '../server/auth.js';

import { handleApiRequest } from '../server/api.js';
import { handleServerRequest, resolveSecureStaticPath, decodePathRecursively } from '../server/server.js';
import { getPaymentProvider, isPaymentConfigured, getPaymentConfigurationStatus } from '../server/payments/index.js';
import { SandboxPaymentProvider } from '../server/payments/sandbox.js';

// Helper to simulate mock HTTP requests to handleApiRequest
function invokeApi(method, path, body = null, headers = {}) {
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
    req.socket = { remoteAddress: '127.0.0.1' };

    let resBody = '';
    const resHeaders = {};
    const res = {
      statusCode: 200,
      setHeader(name, value) {
        resHeaders[name.toLowerCase()] = value;
      },
      writeHead(code, headers) {
        this.statusCode = code;
        if (headers) Object.assign(resHeaders, headers);
      },
      end(chunk) {
        if (chunk) resBody += chunk;
        let parsed = resBody;
        try {
          parsed = JSON.parse(resBody);
        } catch (e) {}
        resolve({
          status: this.statusCode,
          headers: resHeaders,
          body: parsed,
          rawBody: resBody
        });
      }
    };

    handleApiRequest(req, res);
  });
}

// Helper to simulate mock HTTP requests to handleServerRequest (Static + API)
function invokeServer(method, urlPath, headers = {}) {
  return new Promise((resolve) => {
    const req = new Readable({
      read() {
        this.push(null);
      }
    });

    req.method = method;
    req.url = urlPath;
    req.headers = { host: 'localhost:3000', ...headers };

    let resBody = '';
    const resHeaders = {};
    let statusCode = 200;

    const res = new Writable({
      write(chunk, encoding, callback) {
        if (chunk) resBody += chunk.toString();
        callback();
      }
    });

    res.statusCode = 200;
    res.setHeader = function(name, value) {
      resHeaders[name.toLowerCase()] = value;
    };
    res.writeHead = function(code, headers) {
      statusCode = code;
      this.statusCode = code;
      if (headers) {
        for (const [k, v] of Object.entries(headers)) {
          resHeaders[k.toLowerCase()] = v;
        }
      }
    };

    const originalEnd = res.end.bind(res);
    res.end = function(chunk) {
      if (chunk) resBody += chunk.toString();
      originalEnd();
    };

    res.on('finish', () => {
      resolve({
        status: statusCode,
        headers: resHeaders,
        body: resBody
      });
    });

    handleServerRequest(req, res);
  });
}

// =============================================================================
// 1. Payment Bypass & Spoofing Security
// =============================================================================

test('Security: Payment verification bypass attempt without signature is rejected', async () => {
  const prevSandbox = process.env.ENABLE_SANDBOX_PAYMENT;
  process.env.ENABLE_SANDBOX_PAYMENT = 'true';
  try {
    const prodId = `sec_prod_${Date.now()}`;
    createProduct({
      id: prodId,
      sku: `SKU-SEC-${Date.now()}`,
      title: 'Security Target Headset',
      category: 'audio',
      price: 2500,
      stock: 20,
      status: 'published'
    });

    const orderRes = await invokeApi('POST', '/api/orders', {
      customer: { name: 'Payment Bypass Target', phone: '01711223344', address: 'Dhanmondi, Dhaka' },
      items: [{ id: prodId, quantity: 1 }],
      paymentMethod: 'online'
    });

    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.order.id;

    // Attacker attempts to mark order as paid by posting provider: 'sandbox' without valid cryptographic signature
    const bypassAttempt = await invokeApi('POST', '/api/payment/verify', {
      orderId,
      provider: 'sandbox',
      status: 'success'
    });

    assert.equal(bypassAttempt.status, 400);
    assert.equal(bypassAttempt.body.verified, false);

    // Verify order in database was NOT marked as paid
    const checkOrder = findOrderById(orderId);
    assert.notEqual(checkOrder.paymentStatus, 'paid', 'Order must NOT be marked as paid through unsigned verification bypass');
  } finally {
    if (prevSandbox !== undefined) process.env.ENABLE_SANDBOX_PAYMENT = prevSandbox;
    else delete process.env.ENABLE_SANDBOX_PAYMENT;
  }
});

test('Security: Sandbox payments are strictly disabled in production mode', async () => {
  const prevEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';

    // Provider lookup must return null for sandbox in production
    const provider = getPaymentProvider('sandbox');
    assert.equal(provider, null, 'getPaymentProvider must strictly refuse sandbox in production');

    const config = getPaymentConfigurationStatus();
    assert.equal(config.sandbox, false, 'getPaymentConfigurationStatus must show sandbox: false in production');

    // Instantiated sandbox provider must refuse initiatePayment and verifyPayment
    const directSandbox = new SandboxPaymentProvider();
    assert.equal(directSandbox.isConfigured(), false);

    await assert.rejects(
      async () => {
        await directSandbox.initiatePayment({ id: 'ORD-PROD-TEST', total: 1000, customer: { name: 'A', phone: '01712345678' } });
      },
      /strictly disabled in production mode/i
    );

    const verifyAttempt = await directSandbox.verifyPayment({
      sessionId: 'sbx_123',
      orderId: 'ORD-PROD-TEST',
      signature: 'dummy'
    });
    assert.equal(verifyAttempt.verified, false);
    assert.match(verifyAttempt.reason, /strictly disabled in production mode/i);
  } finally {
    process.env.NODE_ENV = prevEnv;
  }
});

test('Security: Payment verification never returns full customer personal details to unauthenticated callers', async () => {
  const prodId = `sec_prod_priv_${Date.now()}`;
  createProduct({
    id: prodId,
    sku: `SKU-PRIV-${Date.now()}`,
    title: 'Privacy Verification Test Product',
    category: 'wearables',
    price: 2100,
    stock: 15,
    status: 'published'
  });

  const orderRes = await invokeApi('POST', '/api/orders', {
    customer: {
      name: 'Confidential Customer',
      phone: '01799887766',
      address: 'Secret Villa 404, Gulshan-2, Dhaka',
      notes: 'Gate Code #9876'
    },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(orderRes.status, 201);
  const orderId = orderRes.body.order.id;

  // Unauthenticated caller queries /api/payment/verify for this order
  const verifyRes = await invokeApi('POST', '/api/payment/verify', {
    orderId
  });

  // Response must never leak customer address, phone number, notes, or guestToken
  assert.equal(verifyRes.body.order, undefined, 'Full order object must not be exposed to unauthenticated verify callers');
  if (verifyRes.body.customer) {
    assert.equal(verifyRes.body.customer.address, undefined);
    assert.equal(verifyRes.body.customer.notes, undefined);
  }
});

test('Security: Payment initiation requires valid guest tracking token or account authorization', async () => {
  const prevSandbox = process.env.ENABLE_SANDBOX_PAYMENT;
  process.env.ENABLE_SANDBOX_PAYMENT = 'true';
  try {
    const prodId = `sec_init_${Date.now()}`;
    createProduct({
      id: prodId,
      sku: `SKU-INIT-${Date.now()}`,
      title: 'Payment Init Authorization Item',
      category: 'charging',
      price: 2200,
      stock: 10,
      status: 'published'
    });

    const orderRes = await invokeApi('POST', '/api/orders', {
      customer: { name: 'Customer Target', phone: '01744556677', address: 'Banani, Dhaka' },
      items: [{ id: prodId, quantity: 1 }],
      paymentMethod: 'online'
    });

    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.order.id;

    // Unauthenticated caller attempts to initiate payment without guest token
    const unauthorizedInit = await invokeApi('POST', '/api/payment/initiate', {
      orderId
    });
    assert.equal(unauthorizedInit.status, 403, 'Payment initiation must reject unauthorized callers');

    // Wrong token attempt
    const wrongTokenInit = await invokeApi('POST', '/api/payment/initiate', {
      orderId,
      guestToken: 'invalid_forged_token_xyz'
    });
    assert.equal(wrongTokenInit.status, 403);
  } finally {
    if (prevSandbox !== undefined) process.env.ENABLE_SANDBOX_PAYMENT = prevSandbox;
    else delete process.env.ENABLE_SANDBOX_PAYMENT;
  }
});

// =============================================================================
// 2. Static-File Serving & Path Traversal Protection
// =============================================================================

test('Security: Static file server rejects unencoded and encoded path traversal attempts', async () => {
  // 1. Unencoded traversal
  const unencodedRes = await invokeServer('GET', '/../../package.json');
  assert.equal(unencodedRes.status, 403);
  assert.match(unencodedRes.body, /path traversal/i);

  // 2. Encoded traversal (%2e%2e = ..)
  const encodedRes = await invokeServer('GET', '/%2e%2e/%2e%2e/package.json');
  assert.equal(encodedRes.status, 403);
  assert.match(encodedRes.body, /path traversal/i);

  // 3. Double-encoded traversal (%252e%252e)
  const doubleEncodedRes = await invokeServer('GET', '/%252e%252e/%252e%252e/package.json');
  assert.equal(doubleEncodedRes.status, 403);
  assert.match(doubleEncodedRes.body, /path traversal/i);

  // 4. Traversal under /uploads/
  const uploadsTraversal = await invokeServer('GET', '/uploads/../../server/server.js');
  assert.equal(uploadsTraversal.status, 403);
  assert.match(uploadsTraversal.body, /path traversal/i);

  // 5. Encoded traversal under /uploads/
  const uploadsEncoded = await invokeServer('GET', '/uploads/%2e%2e%2fpackage.json');
  assert.equal(uploadsEncoded.status, 403);
  assert.match(uploadsEncoded.body, /path traversal/i);

  // 6. Null byte injection
  const nullByteRes = await invokeServer('GET', '/uploads/image.png%00/../../package.json');
  assert.ok(nullByteRes.status === 400 || nullByteRes.status === 403);

  // 7. Legitimate static file access works
  const legitimateFile = await invokeServer('GET', '/assets/products/p01-pro-tws-white.jpg');
  assert.equal(legitimateFile.status, 200);
  assert.match(legitimateFile.headers['content-type'], /image\/jpeg/);
});

// =============================================================================
// 3. Checkout Idempotency & Replay Protection
// =============================================================================

test('Security: Idempotency keys are bound to requester and request contents; never replayed to different requesters', async () => {
  const prodId = `sec_idemp_prod_${Date.now()}`;
  createProduct({
    id: prodId,
    sku: `SKU-IDEMP-${Date.now()}`,
    title: 'Idempotency Protection Item',
    category: 'cases',
    price: 2600,
    stock: 50,
    status: 'published'
  });

  const sharedKey = `idemp_sec_test_${Date.now()}`;

  // Customer A submits order
  const orderA = await invokeApi('POST', '/api/orders', {
    idempotencyKey: sharedKey,
    customer: { name: 'Customer A', phone: '01710101010', address: 'Mohakhali, Dhaka' },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(orderA.status, 201);
  const orderAId = orderA.body.order.id;
  const guestTokenA = orderA.body.guestToken;

  // Attacker / Customer B attempts to replay Customer A's idempotency key
  const replayCustomerB = await invokeApi('POST', '/api/orders', {
    idempotencyKey: sharedKey,
    customer: { name: 'Attacker B', phone: '01720202020', address: 'Unknown Location' },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(replayCustomerB.status, 409, 'Replay with different requester identity must be rejected with 409 Conflict');
  assert.equal(replayCustomerB.body.order, undefined, 'Customer A order details must NOT be replayed to Customer B');
  assert.equal(replayCustomerB.body.guestToken, undefined, 'Customer A guestToken must NOT be leaked to Customer B');

  // Customer A replays same key with modified request payload (different items/total)
  const replayPayloadMismatch = await invokeApi('POST', '/api/orders', {
    idempotencyKey: sharedKey,
    customer: { name: 'Customer A', phone: '01710101010', address: 'Mohakhali, Dhaka' },
    items: [{ id: prodId, quantity: 5 }], // Changed quantity
    paymentMethod: 'cod'
  });

  assert.equal(replayPayloadMismatch.status, 422, 'Replay with mismatched payload must be rejected with 422 Unprocessable Entity');

  // Customer A replays identical payload: succeeds with cached response
  const replayLegitimate = await invokeApi('POST', '/api/orders', {
    idempotencyKey: sharedKey,
    customer: { name: 'Customer A', phone: '01710101010', address: 'Mohakhali, Dhaka' },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(replayLegitimate.status, 200);
  assert.equal(replayLegitimate.body.order.id, orderAId);
  assert.equal(replayLegitimate.body.guestToken, guestTokenA);
});

// =============================================================================
// 4. Unpublished & Archived Product Access
// =============================================================================

test('Security: Unpublished/archived products are hidden from public catalog and direct routes, exposed only to authenticated admin', async () => {
  const secretProdId = `unpublished_${Date.now()}`;
  createProduct({
    id: secretProdId,
    sku: `SKU-UNPUB-${Date.now()}`,
    title: 'Confidential Prototype Device',
    category: 'wearables',
    price: 9999,
    stock: 5,
    status: 'published'
  });

  // Archive the product
  updateProductStatus(secretProdId, 'archived');

  // 1. Public catalog with includeArchived=true must IGNORE the query param and NOT return the archived item
  const publicCatalog = await invokeApi('GET', '/api/products?includeArchived=true');
  assert.equal(publicCatalog.status, 200);
  const foundInPublic = publicCatalog.body.products.find(p => p.id === secretProdId);
  assert.equal(foundInPublic, undefined, 'Archived product must never appear in public catalog route');

  // 2. Direct public product detail query must return 404
  const publicDetail = await invokeApi('GET', `/api/products/${secretProdId}`);
  assert.equal(publicDetail.status, 404, 'Public route for archived product must return 404 Not Found');

  // 3. Authenticated admin query to /api/admin/products MUST return the archived product
  const adminToken = generateAdminToken();
  const adminCatalog = await invokeApi('GET', '/api/admin/products', null, {
    authorization: `Bearer ${adminToken}`
  });
  assert.equal(adminCatalog.status, 200);
  const foundInAdmin = adminCatalog.body.products.find(p => p.id === secretProdId);
  assert.ok(foundInAdmin, 'Admin catalog must include archived products for authorized store managers');
  assert.equal(foundInAdmin.status, 'archived');
});

// =============================================================================
// 5. Guest-Order Ownership & Claiming with Token or OTP
// =============================================================================

test('Security: Guest order claiming requires valid guest token or verified phone OTP; phone-only matching is rejected', async () => {
  const targetPhone = '01788776655';
  const prodId = `sec_claim_prod_${Date.now()}`;
  createProduct({
    id: prodId,
    sku: `SKU-CLAIM-${Date.now()}`,
    title: 'Order Claim Test Item',
    category: 'charging',
    price: 2050,
    stock: 20,
    status: 'published'
  });

  // Create guest order
  const guestOrderRes = await invokeApi('POST', '/api/orders', {
    customer: { name: 'Legitimate Buyer', phone: targetPhone, address: 'Uttara, Dhaka' },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(guestOrderRes.status, 201);
  const orderId = guestOrderRes.body.order.id;
  const realGuestToken = guestOrderRes.body.guestToken;

  // Attacker creates an account claiming the target customer phone number
  const attackerEmail = `attacker_${Date.now()}@test.local`;
  const attacker = createUser({
    email: attackerEmail,
    name: 'Attacker Impersonator',
    phone: targetPhone
  });
  const attackerSession = createCustomerSession(attacker.id);

  // 1. Attacker attempts to claim order with phone matching alone (no guest token, no OTP)
  const phoneOnlyClaim = await invokeApi('POST', '/api/customer/orders/link-guest', {
    orderId
  }, {
    authorization: `Bearer ${attackerSession}`
  });

  assert.equal(phoneOnlyClaim.status, 403, 'Claiming an order without guestToken or OTP must be rejected with 403');
  assert.match(phoneOnlyClaim.body.error, /ownership verification/i);

  // 2. Attacker attempts with invalid/forged guest token
  const fakeTokenClaim = await invokeApi('POST', '/api/customer/orders/link-guest', {
    orderId,
    guestToken: 'forged_guest_token_12345'
  }, {
    authorization: `Bearer ${attackerSession}`
  });
  assert.equal(fakeTokenClaim.status, 403);

  // 3. Legitimate user linking with verified guest token succeeds
  const legitTokenClaim = await invokeApi('POST', '/api/customer/orders/link-guest', {
    orderId,
    guestToken: realGuestToken
  }, {
    authorization: `Bearer ${attackerSession}`
  });
  assert.equal(legitTokenClaim.status, 200);
  assert.equal(legitTokenClaim.body.success, true);

  // 4. Create second guest order for testing OTP linking
  const guestOrder2Res = await invokeApi('POST', '/api/orders', {
    customer: { name: 'Legitimate Buyer 2', phone: targetPhone, address: 'Mirpur, Dhaka' },
    items: [{ id: prodId, quantity: 1 }],
    paymentMethod: 'cod'
  });
  const order2Id = guestOrder2Res.body.order.id;

  // Request OTP for phone
  const otpRes = await invokeApi('POST', '/api/auth/otp/request', {
    phone: targetPhone
  });
  assert.equal(otpRes.status, 200);
  const receivedOtp = otpRes.body.devOtp;
  assert.ok(receivedOtp, 'OTP request should return generated code in test mode');

  // Linking with verified OTP succeeds
  const legitOtpClaim = await invokeApi('POST', '/api/customer/orders/link-guest', {
    orderId: order2Id,
    otp: receivedOtp
  }, {
    authorization: `Bearer ${attackerSession}`
  });
  assert.equal(legitOtpClaim.status, 200);
  assert.equal(legitOtpClaim.body.success, true);

  // Attempting to reuse the consumed OTP fails
  const reuseOtpClaim = await invokeApi('POST', '/api/customer/orders/link-guest', {
    orderId: order2Id,
    otp: receivedOtp
  }, {
    authorization: `Bearer ${attackerSession}`
  });
  assert.equal(reuseOtpClaim.status, 403);
});
