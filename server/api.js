import { getDb, saveDb, findOrderById, updateOrder, adjustInventory } from './db.js';
import { verifyPassword, generateAdminToken, verifyAdminToken } from './auth.js';
import { getPaymentProvider, getPaymentConfigurationStatus, isPaymentConfigured, PAYMENT_STATUS, ORDER_STATUS } from './payments/index.js';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';
import { calculateDeliveryFee } from '../src/utils/pricing.js';

// Server-side lookup of catalog products for canonical price and stock validation
function getCanonicalProduct(productId) {
  return INITIAL_PRODUCTS.find(p => p.id === productId) || null;
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method;

  const parseBody = () => new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
  });

  const sendJson = (statusCode, data) => {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  };

  const sendRedirect = (location) => {
    res.statusCode = 302;
    res.setHeader('Location', location);
    res.end();
  };

  try {
    // 1. Health & Payment Config Info
    if (pathname === '/api/health' && method === 'GET') {
      const config = getPaymentConfigurationStatus();
      return sendJson(200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        paymentConfig: config
      });
    }

    // 1b. Payment Configuration Status
    if (pathname === '/api/payment/config' && method === 'GET') {
      return sendJson(200, getPaymentConfigurationStatus());
    }

    // 2. Admin Login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const body = await parseBody();
      if (verifyPassword(body.password)) {
        const token = generateAdminToken();
        return sendJson(200, { success: true, token });
      }
      return sendJson(401, { success: false, error: 'Invalid admin credentials' });
    }

    // 3. Admin Orders List
    if (pathname === '/api/admin/orders' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      if (!verifyAdminToken(authHeader)) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }
      const db = getDb();
      return sendJson(200, { orders: db.orders || [] });
    }

    // 4. Admin Update Order Status
    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const authHeader = req.headers['authorization'];
      if (!verifyAdminToken(authHeader)) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }
      const orderId = pathname.split('/')[4];
      const body = await parseBody();
      const validStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(body.status)) {
        return sendJson(400, { error: 'Invalid order status' });
      }

      const order = updateOrder(orderId, {
        status: body.status,
        timelineNote: body.note || `Status updated to ${body.status}`
      });

      if (!order) return sendJson(404, { error: 'Order not found' });
      return sendJson(200, { success: true, order });
    }

    // 5. Admin Restock Inventory
    if (pathname === '/api/admin/inventory/restock' && method === 'POST') {
      const authHeader = req.headers['authorization'];
      if (!verifyAdminToken(authHeader)) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      const { productId, count } = body;
      if (!productId || typeof count !== 'number' || count <= 0) {
        return sendJson(400, { error: 'Invalid restock parameters' });
      }
      adjustInventory(productId, -count); // Negative delta increases net available stock
      return sendJson(200, { success: true, message: `Restocked ${count} units` });
    }

    // 6. Create Order with Strict Server-Side Validation
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseBody();
      const db = getDb();

      // Idempotency guard
      if (body.idempotencyKey && db.processedIdempotencyKeys[body.idempotencyKey]) {
        return sendJson(200, {
          success: true,
          duplicateDetected: true,
          order: db.processedIdempotencyKeys[body.idempotencyKey]
        });
      }

      // Input validation
      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return sendJson(400, { success: false, error: 'Order must contain at least one item' });
      }

      const cust = body.customer || {};
      if (!cust.name || !cust.name.trim()) {
        return sendJson(400, { success: false, error: 'Full customer name is required' });
      }
      const cleanPhone = (cust.phone || '').replace(/[\s-]/g, '');
      if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
        return sendJson(400, { success: false, error: 'Valid Bangladeshi phone number required (e.g. 01712345678)' });
      }
      if (!cust.address || !cust.address.trim()) {
        return sendJson(400, { success: false, error: 'Delivery address is required' });
      }

      // Canonical server calculation & stock verification
      let calculatedSubtotal = 0;
      const validatedItems = [];

      for (const reqItem of body.items) {
        const canonical = getCanonicalProduct(reqItem.id);
        if (!canonical) {
          return sendJson(400, { success: false, error: `Unrecognized product SKU: ${reqItem.id}` });
        }

        const qty = parseInt(reqItem.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          return sendJson(400, { success: false, error: `Invalid quantity for ${canonical.title}` });
        }

        // Available stock check
        const delta = db.inventoryDeltas[canonical.id] || 0;
        const availableStock = canonical.stock - delta;
        if (availableStock < qty) {
          return sendJson(400, {
            success: false,
            error: `Insufficient stock for ${canonical.title}. Available: ${Math.max(0, availableStock)}`
          });
        }

        calculatedSubtotal += canonical.price * qty;
        validatedItems.push({
          id: canonical.id,
          title: canonical.title,
          price: canonical.price,
          quantity: qty,
          variant: reqItem.variant || 'Standard'
        });
      }

      // Delivery charge calculation using shared pricing utility
      const deliveryFee = calculateDeliveryFee(calculatedSubtotal, {
        division: cust.division || 'Dhaka',
        outsideCity: Boolean(cust.outsideCity)
      });
      const total = calculatedSubtotal + deliveryFee;

      const paymentMethod = body.paymentMethod === 'cod' ? 'cod' : 'online';
      
      // If customer requested online payment but provider is not configured, reject cleanly
      if (paymentMethod === 'online' && !isPaymentConfigured()) {
        return sendJson(400, {
          success: false,
          error: 'Online payment is currently unavailable. Store payment credentials are not configured. Please use Cash on Delivery (Demo Mode).'
        });
      }

      const orderId = 'AGY-' + Math.floor(100000 + Math.random() * 900000);

      // Order status distinction: COD is marked as demo_received and unpaid; Online is pending_payment
      const initialStatus = paymentMethod === 'cod' ? ORDER_STATUS.DEMO_RECEIVED : ORDER_STATUS.PENDING_PAYMENT;
      const initialPaymentStatus = paymentMethod === 'cod' ? PAYMENT_STATUS.UNPAID : PAYMENT_STATUS.PENDING;

      const newOrder = {
        id: orderId,
        createdAt: new Date().toISOString(),
        isDemo: true,
        customer: {
          name: cust.name.trim(),
          phone: cleanPhone,
          division: cust.division || 'Dhaka',
          outsideCity: Boolean(cust.outsideCity),
          address: cust.address.trim(),
          notes: cust.notes || ''
        },
        items: validatedItems,
        subtotal: calculatedSubtotal,
        deliveryFee,
        total,
        paymentMethod,
        paymentStatus: initialPaymentStatus,
        status: initialStatus,
        timeline: [
          { 
            status: paymentMethod === 'cod' ? 'Demo Order Placed' : 'Order Placed', 
            timestamp: new Date().toISOString(), 
            note: paymentMethod === 'cod' ? 'Demo order recorded with unpaid Cash on Delivery status' : 'Order placed, awaiting payment confirmation' 
          }
        ]
      };

      if (paymentMethod === 'cod') {
        // Record demo inventory delta
        for (const it of validatedItems) {
          db.inventoryDeltas[it.id] = (db.inventoryDeltas[it.id] || 0) + it.quantity;
        }
      }

      db.orders.unshift(newOrder);
      if (body.idempotencyKey) {
        db.processedIdempotencyKeys[body.idempotencyKey] = newOrder;
      }
      saveDb(db);

      return sendJson(201, {
        success: true,
        order: newOrder
      });
    }

    // 7. Initiate Payment Session
    if (pathname === '/api/payment/initiate' && method === 'POST') {
      if (!isPaymentConfigured()) {
        return sendJson(400, {
          success: false,
          error: 'Online payment initiation refused: No live payment provider is configured on this server.'
        });
      }

      const body = await parseBody();
      const { orderId, preferredProvider } = body;

      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: 'Order not found' });
      }

      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(400, { success: false, error: 'Order is already paid' });
      }

      const provider = getPaymentProvider(preferredProvider);
      if (!provider) {
        return sendJson(400, { success: false, error: 'Payment provider not available' });
      }

      const origin = req.headers.origin || req.headers.host ? `http://${req.headers.host}` : 'http://localhost:3000';
      const sessionResult = await provider.initiatePayment(order, origin);

      return sendJson(200, {
        success: true,
        orderId: order.id,
        ...sessionResult
      });
    }

    // 8. Server-Side Payment Verification (Direct or Polled)
    if (pathname === '/api/payment/verify' && method === 'POST') {
      if (!isPaymentConfigured()) {
        return sendJson(400, {
          success: false,
          verified: false,
          error: 'Payment verification refused: No live payment provider is integrated on this server.'
        });
      }

      const body = await parseBody();
      const { orderId, sessionId, val_id, paymentId, status, signature } = body;

      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: 'Order not found' });
      }

      // Idempotency: if already verified as paid, return clean success
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(200, {
          success: true,
          verified: true,
          message: 'Order was already verified and marked as paid',
          order
        });
      }

      const provider = getPaymentProvider(body.provider);
      if (!provider) {
        return sendJson(400, {
          success: false,
          verified: false,
          error: 'Payment verification refused: No active provider found'
        });
      }

      const verificationResult = await provider.verifyPayment({
        order,
        sessionId,
        val_id,
        paymentId,
        status: status || 'success',
        signature
      });

      if (verificationResult.verified) {
        const db = getDb();
        for (const it of order.items) {
          db.inventoryDeltas[it.id] = (db.inventoryDeltas[it.id] || 0) + it.quantity;
        }

        order.paymentStatus = PAYMENT_STATUS.PAID;
        order.status = ORDER_STATUS.CONFIRMED;
        order.transactionId = verificationResult.transactionId;
        order.paymentDetails = {
          provider: provider.name || 'sslcommerz',
          transactionId: verificationResult.transactionId,
          verifiedAt: new Date().toISOString()
        };
        order.timeline.push({
          status: 'Payment Verified',
          timestamp: new Date().toISOString(),
          note: `Verified server-side: TxID ${verificationResult.transactionId}`
        });

        saveDb(db);

        return sendJson(200, {
          success: true,
          verified: true,
          order
        });
      } else {
        order.paymentStatus = verificationResult.status || PAYMENT_STATUS.FAILED;
        order.status = ORDER_STATUS.CANCELLED;
        order.timeline.push({
          status: 'Payment Failed',
          timestamp: new Date().toISOString(),
          note: verificationResult.reason || 'Payment verification failed'
        });
        const db = getDb();
        saveDb(db);

        return sendJson(400, {
          success: false,
          verified: false,
          error: verificationResult.reason || 'Payment verification failed'
        });
      }
    }

    // 9. Payment Gateway Redirect Callback Handler (e.g. from SSLCommerz / bKash / Sandbox)
    if (pathname.startsWith('/api/payment/callback/')) {
      const providerName = pathname.replace('/api/payment/callback/', '');
      const orderId = url.searchParams.get('orderId');
      const callbackStatus = url.searchParams.get('status') || 'success';
      const valId = url.searchParams.get('val_id');
      const sessionId = url.searchParams.get('sessionId');

      if (callbackStatus === 'success') {
        sendRedirect(`/?payment_result=success&orderId=${orderId}&val_id=${valId || ''}&sessionId=${sessionId || ''}`);
      } else if (callbackStatus === 'cancel') {
        sendRedirect(`/?payment_result=cancel&orderId=${orderId}`);
      } else {
        sendRedirect(`/?payment_result=fail&orderId=${orderId}`);
      }
      return;
    }

    // 10. Webhook / IPN Endpoint with Idempotency
    if (pathname.startsWith('/api/payment/ipn/')) {
      const providerName = pathname.replace('/api/payment/ipn/', '');
      const body = await parseBody();
      const orderId = body.tran_id || body.merchantInvoiceNumber || body.orderId;

      if (!orderId) {
        return sendJson(400, { error: 'Missing order reference' });
      }

      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { error: 'Order not found' });
      }

      // Idempotency: Ignore duplicate webhooks
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(200, { received: true, message: 'Already processed' });
      }

      const provider = getPaymentProvider(providerName);
      const result = await provider.verifyPayment({
        order,
        val_id: body.val_id,
        paymentId: body.paymentID,
        status: body.status || 'success'
      });

      if (result.verified) {
        const db = getDb();
        order.paymentStatus = PAYMENT_STATUS.PAID;
        order.status = ORDER_STATUS.CONFIRMED;
        order.transactionId = result.transactionId;
        order.timeline.push({
          status: 'Payment Verified (IPN Webhook)',
          timestamp: new Date().toISOString(),
          note: `Verified via IPN: ${result.transactionId}`
        });
        saveDb(db);
        return sendJson(200, { success: true });
      }

      return sendJson(400, { success: false, reason: result.reason });
    }

    // 11. Lookup Order by ID (Customer Tracking)
    if (pathname.startsWith('/api/orders/') && method === 'GET') {
      const id = pathname.replace('/api/orders/', '').trim();
      const order = findOrderById(id);
      if (!order) {
        return sendJson(404, { success: false, error: 'No order found with ID: ' + id });
      }
      return sendJson(200, { success: true, order });
    }

    // 12. Inventory deltas for client sync
    if (pathname === '/api/inventory' && method === 'GET') {
      const db = getDb();
      return sendJson(200, { deltas: db.inventoryDeltas || {} });
    }

    return sendJson(404, { error: 'API route not found' });
  } catch (error) {
    console.error('[API Error]', error);
    return sendJson(500, { error: error.message || 'Internal server error' });
  }
}
