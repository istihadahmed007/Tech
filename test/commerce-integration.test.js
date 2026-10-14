import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { Readable } from 'node:stream';
import {
  getDatabase,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  adjustProductStock,
  getInventoryAdjustments,
  createOrderWithReservation,
  finalizeOrderPayment,
  cancelOrderAndReleaseReservation,
  findOrderById,
  createUser,
  createReview,
  getProductReviews,
  createPromotion,
  getActivePromotions
} from '../server/db.js';

import {
  hashPassword,
  verifyPasswordHash,
  generateAdminToken,
  verifyAdminToken,
  createCustomerSession
} from '../server/auth.js';

import { handleApiRequest } from '../server/api.js';

// Helper to simulate mock HTTP requests to handleApiRequest
function invokeApi(method, path, body = null, headers = {}) {
  return new Promise((resolve) => {
    const reqHeaders = { ...headers };
    let bodyStr = '';
    if (body) {
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
        let parsed = null;
        try {
          parsed = JSON.parse(resBody);
        } catch (e) {
          parsed = resBody;
        }
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

test('1. Product edits and restocking persist with audit trail', () => {
  const prodId = `test_prod_${Date.now()}`;
  const created = createProduct({
    id: prodId,
    sku: `SKU-${Date.now()}`,
    title: 'Frost Magnetic Battery Pack',
    category: 'powerbanks',
    price: 3200,
    stock: 10,
    status: 'published'
  });

  assert.equal(created.stock, 10);
  assert.equal(created.price, 3200);

  // Edit product title and price
  updateProduct(prodId, {
    title: 'Glacial Magnetic Power Bank 10K',
    price: 3500
  });

  const updated = getProductById(prodId);
  assert.equal(updated.title, 'Glacial Magnetic Power Bank 10K');
  assert.equal(updated.price, 3500);

  // Restock inventory with audit record
  const restockResult = adjustProductStock(prodId, null, 15, 'Supplier Restock Batch #49', 'admin_tester');
  assert.equal(restockResult.newStock, 25);

  const reloaded = getProductById(prodId);
  assert.equal(reloaded.stock, 25);

  // Verify adjustment audit history
  const adjustments = getInventoryAdjustments(prodId);
  assert.ok(adjustments.length > 0);
  assert.equal(adjustments[0].quantity_change, 15);
  assert.equal(adjustments[0].reason, 'Supplier Restock Batch #49');
  assert.equal(adjustments[0].adjusted_by, 'admin_tester');
});

test('2. Unauthorized users cannot edit products or read another customer orders', async () => {
  // Non-admin request to create or edit product
  const unauthEdit = await invokeApi('POST', '/api/admin/products', {
    title: 'Malicious Product Injection',
    price: 100
  }, {});
  assert.equal(unauthEdit.status, 403, 'Should reject unauthorized product creation with 403');

  // Customer A places an order
  const userA = createUser({
    email: `cust_a_${Date.now()}@test.com`,
    name: 'Customer A',
    passwordHash: hashPassword('secret123')
  });

  const orderRes = await invokeApi('POST', '/api/orders', {
    customer: {
      name: 'Customer A',
      phone: '01711223344',
      address: 'House 5, Road 2, Gulshan',
      division: 'Dhaka'
    },
    items: [{ id: 'aura-frost-magsafe-case', quantity: 1 }],
    paymentMethod: 'cod'
  });

  assert.equal(orderRes.status, 201);
  const orderId = orderRes.body.order.id;
  const guestToken = orderRes.body.guestToken;

  // Customer B tries to view Customer A's order without token
  const userB = createUser({
    email: `cust_b_${Date.now()}@test.com`,
    name: 'Customer B',
    passwordHash: hashPassword('secret123')
  });
  const userBToken = createCustomerSession(userB.id);

  const unauthLookup = await invokeApi('GET', `/api/orders/${orderId}`, null, {
    authorization: `Bearer ${userBToken}`
  });

  // Must return masked customer details to protect personal address
  assert.equal(unauthLookup.body.authorized, false);
  assert.ok(!unauthLookup.body.order.customer.address, 'Street address must be omitted for unauthorized viewers');
  assert.match(unauthLookup.body.order.customer.phone, /\*\*\*\*/, 'Phone number must be masked');

  // Authorized lookup with guest security token unlocks full details
  const authLookup = await invokeApi('GET', `/api/orders/${orderId}?token=${guestToken}`);
  assert.equal(authLookup.body.authorized, true);
  assert.equal(authLookup.body.order.customer.address, 'House 5, Road 2, Gulshan');
});

test('3. Checkout uses server prices and rejects invalid quantities', async () => {
  // Reject negative quantity
  const negativeQty = await invokeApi('POST', '/api/orders', {
    customer: { name: 'Test', phone: '01712345678', address: 'Dhaka' },
    items: [{ id: 'aura-frost-magsafe-case', quantity: -3 }],
    paymentMethod: 'cod'
  });
  assert.equal(negativeQty.status, 400);

  // Reject zero quantity
  const zeroQty = await invokeApi('POST', '/api/orders', {
    customer: { name: 'Test', phone: '01712345678', address: 'Dhaka' },
    items: [{ id: 'aura-frost-magsafe-case', quantity: 0 }],
    paymentMethod: 'cod'
  });
  assert.equal(zeroQty.status, 400);

  // Client tampering with price: server recalculates canonical database price
  const realProd = getProductById('aura-frost-magsafe-case');
  const tamperedOrder = await invokeApi('POST', '/api/orders', {
    customer: { name: 'Price Tamperer', phone: '01712345678', address: 'Banani, Dhaka' },
    items: [{ id: 'aura-frost-magsafe-case', quantity: 1, price: 50 }], // Tampered 50 vs real ~2450
    paymentMethod: 'cod'
  });

  assert.equal(tamperedOrder.status, 201);
  assert.equal(tamperedOrder.body.order.items[0].price, realProd.price, 'Server must enforce canonical DB price');
  assert.equal(tamperedOrder.body.order.subtotal, realProd.price);
});

test('4. Concurrent orders cannot oversell limited stock', () => {
  const scarceProdId = `scarce_${Date.now()}`;
  createProduct({
    id: scarceProdId,
    sku: `SCARCE-${Date.now()}`,
    title: 'Ultra Rare Titanium Cable',
    category: 'charging',
    price: 1500,
    stock: 2, // Only 2 in stock
    status: 'published'
  });

  // Order 1 reserves 2 items (full stock)
  const order1 = createOrderWithReservation({
    customer: { name: 'Buyer 1', phone: '01711111111', division: 'Dhaka', address: 'Dhaka' },
    items: [{ id: scarceProdId, quantity: 2, price: 1500, title: 'Rare Cable' }],
    subtotal: 3000,
    deliveryFee: 0,
    total: 3000,
    paymentMethod: 'online'
  });
  assert.ok(order1.order);

  // Concurrent Order 2 attempts to buy 1 item while active reservation exists
  assert.throws(() => {
    createOrderWithReservation({
      customer: { name: 'Buyer 2', phone: '01722222222', division: 'Dhaka', address: 'Dhaka' },
      items: [{ id: scarceProdId, quantity: 1, price: 1500, title: 'Rare Cable' }],
      subtotal: 1500,
      deliveryFee: 60,
      total: 1560,
      paymentMethod: 'online'
    });
  }, /Insufficient stock/i);
});

test('5. Duplicate checkout requests and payment notifications are idempotent', async () => {
  const idempKey = `idemp_unique_${Date.now()}`;
  const payload = {
    idempotencyKey: idempKey,
    customer: { name: 'Idempotency Tester', phone: '01788888888', address: 'Mirpur, Dhaka' },
    items: [{ id: 'aura-frost-magsafe-case', quantity: 1 }],
    paymentMethod: 'cod'
  };

  // First checkout request
  const firstReq = await invokeApi('POST', '/api/orders', payload);
  assert.equal(firstReq.status, 201);
  const firstOrderId = firstReq.body.order.id;

  // Duplicate checkout request with identical idempotency key
  const secondReq = await invokeApi('POST', '/api/orders', payload);
  assert.equal(secondReq.status, 200);
  assert.equal(secondReq.body.order.id, firstOrderId, 'Must return the same order without creating duplicate');

  // Idempotent Payment Finalization: Calling finalizeOrderPayment multiple times
  const onlineOrder = createOrderWithReservation({
    customer: { name: 'Payment Tester', phone: '01799999999', division: 'Dhaka', address: 'Uttara' },
    items: [{ id: 'aura-frost-magsafe-case', quantity: 1, price: 2450, title: 'Case' }],
    subtotal: 2450,
    deliveryFee: 0,
    total: 2450,
    paymentMethod: 'online'
  });

  const stockBefore = getProductById('aura-frost-magsafe-case').stock;

  // First capture notification
  const pay1 = finalizeOrderPayment({
    orderId: onlineOrder.order.id,
    provider: 'sslcommerz',
    transactionId: 'TXN_TEST_101'
  });
  assert.equal(pay1.paymentStatus, 'paid');
  const stockAfter1 = getProductById('aura-frost-magsafe-case').stock;
  assert.equal(stockAfter1, stockBefore - 1);

  // Duplicate webhook / verification notification
  const pay2 = finalizeOrderPayment({
    orderId: onlineOrder.order.id,
    provider: 'sslcommerz',
    transactionId: 'TXN_TEST_101'
  });
  assert.equal(pay2.paymentStatus, 'paid');
  const stockAfter2 = getProductById('aura-frost-magsafe-case').stock;
  assert.equal(stockAfter2, stockAfter1, 'Stock must NOT be decremented twice on duplicate notification');
});

test('6. Payment cancellation releases inventory reservation and supports retry', () => {
  const testProdId = `res_prod_${Date.now()}`;
  createProduct({
    id: testProdId,
    sku: `RES-${Date.now()}`,
    title: 'Reserved GaN Charger',
    category: 'charging',
    price: 2100,
    stock: 5,
    status: 'published'
  });

  const orderResult = createOrderWithReservation({
    customer: { name: 'Cancel Test', phone: '01712345678', division: 'Dhaka', address: 'Dhaka' },
    items: [{ id: testProdId, quantity: 2, price: 2100, title: 'Charger' }],
    subtotal: 4200,
    deliveryFee: 0,
    total: 4200,
    paymentMethod: 'online'
  });

  // Cancel order: releases the 2 reserved units
  cancelOrderAndReleaseReservation(orderResult.order.id, 'Customer cancelled gateway transaction');
  const cancelledOrder = findOrderById(orderResult.order.id);
  assert.equal(cancelledOrder.status, 'cancelled');

  // Now a subsequent buyer can successfully reserve the full 5 units
  const retryOrder = createOrderWithReservation({
    customer: { name: 'Next Buyer', phone: '01755555555', division: 'Dhaka', address: 'Dhaka' },
    items: [{ id: testProdId, quantity: 5, price: 2100, title: 'Charger' }],
    subtotal: 10500,
    deliveryFee: 0,
    total: 10500,
    paymentMethod: 'online'
  });
  assert.ok(retryOrder.order);
});

test('7. Only customers with delivered orders can review products', () => {
  const prodId = 'aura-frost-magsafe-case';
  const user = createUser({
    email: `reviewer_${Date.now()}@test.com`,
    name: 'Verified Customer',
    passwordHash: hashPassword('pass123')
  });

  // Try to review product without delivered order -> Throws error
  assert.throws(() => {
    createReview({
      productId: prodId,
      userId: user.id,
      rating: 5,
      comment: 'Fake review attempt',
      userName: user.name
    });
  }, /Only customers who purchased and received this product can write a verified review/i);

  // Create delivered order for this customer
  const db = getDatabase();
  const orderId = `DELIV-${Date.now()}`;
  db.prepare(`
    INSERT INTO orders (
      id, user_id, customer_name, customer_phone, customer_division, customer_address,
      subtotal, delivery_fee, total, payment_method, payment_status, status, timeline_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'delivered', '[]', ?, ?)
  `).run(orderId, user.id, user.name, '01712345678', 'Dhaka', 'Dhaka', 2450, 0, 2450, 'cod', 'paid', new Date().toISOString(), new Date().toISOString());

  db.prepare(`
    INSERT INTO order_items (order_id, product_id, sku, title, price, quantity, subtotal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(orderId, prodId, prodId, 'Case', 2450, 1, 2450);

  // Now review submission succeeds!
  const review = createReview({
    productId: prodId,
    userId: user.id,
    orderId,
    rating: 5,
    comment: 'Exceptional frosted glass build quality and genuine MagSafe lock.',
    userName: user.name
  });
  assert.equal(review.rating, 5);

  // Duplicate review attempt by same user for same product is rejected
  assert.throws(() => {
    createReview({
      productId: prodId,
      userId: user.id,
      orderId,
      rating: 4,
      comment: 'Duplicate review',
      userName: user.name
    });
  }, /already submitted a review/i);
});

test('8. Expired promotions stop applying', () => {
  const expiredCode = `EXP_${Date.now()}`;
  createPromotion({
    code: expiredCode,
    title: 'Expired Clearance Discount',
    discountType: 'percentage',
    discountValue: 20,
    startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 5 * 86400000).toISOString(), // Expired 5 days ago
    isActive: true
  });

  const activePromotions = getActivePromotions();
  const foundExpired = activePromotions.find(p => p.code === expiredCode);
  assert.equal(foundExpired, undefined, 'Expired promotion must not be included in active promotions');
});

test('9. Standalone Production Server serves routes and API endpoints', async () => {
  // Verify that invokeApi returns correct health response
  const healthRes = await invokeApi('GET', '/api/health');
  assert.equal(healthRes.status, 200);
  assert.equal(healthRes.body.status, 'healthy');

  // Verify that products endpoint returns items
  const prodRes = await invokeApi('GET', '/api/products');
  assert.equal(prodRes.status, 200);
  assert.ok(Array.isArray(prodRes.body.products));
  assert.ok(prodRes.body.products.length > 0);
});
