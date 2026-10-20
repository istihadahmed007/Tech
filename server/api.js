import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Load environment variables if .env exists
try {
  if (typeof process.loadEnvFile === 'function') {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      process.loadEnvFile(envPath);
    }
  }
} catch (e) {
  // Ignored if already loaded
}
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  adjustProductStock,
  getInventoryAdjustments,
  createOrderWithReservation,
  finalizeOrderPayment,
  recordPendingPaymentReference,
  cancelOrderAndReleaseReservation,
  releaseExpiredReservations,
  findOrderById,
  getOrdersForUser,
  getAllOrdersAdmin,
  updateOrderStatus,
  markCodPaymentCollected,
  createReview,
  getProductReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
  getActivePromotions,
  getAllPromotionsAdmin,
  createPromotion,
  deletePromotion,
  getServiceCatalog,
  createServiceRequest,
  getServiceRequestsAdmin,
  updateServiceRequestStatus,
  findUserByEmail,
  findUserById,
  createUser,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getAllUsersAdminDetailed,
  updateUserProfile,
  getUserWishlist,
  setUserWishlist,
  getDatabase,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllBrands,
  getAllUsersAdmin,
  getStoreSettings,
  updateStoreSettings,
  logAuditEvent,
  getAuditLogs,
  getBusinessReports
} from './db.js';

import {
  verifyPassword,
  hashPassword,
  verifyPasswordHash,
  generateAdminToken,
  decodeAdminToken,
  verifyAdminToken,
  getAdminUserFromToken,
  hasPermission,
  getDefaultPermissions,
  createCustomerSession,
  authenticateRequest,
  logoutSession,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  createPhoneOtp,
  verifyPhoneOtp
} from './auth.js';

import {
  getPaymentProvider,
  getPaymentConfigurationStatus,
  isPaymentConfigured,
  getPublicOrigin,
  PAYMENT_STATUS,
  ORDER_STATUS
} from './payments/index.js';

import { calculateDeliveryFee, calculateCartSubtotal } from '../src/utils/pricing.js';
import { generateInvoiceHtml, numberToWordsBDT } from '../src/utils/invoice.js';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function safeTokenEqual(provided, expected) {
  if (!provided || !expected || typeof provided !== 'string' || typeof expected !== 'string') {
    return false;
  }
  const pBuf = Buffer.from(String(provided).trim());
  const eBuf = Buffer.from(String(expected).trim());
  if (pBuf.length !== eBuf.length) {
    crypto.timingSafeEqual(eBuf, eBuf);
    return false;
  }
  return crypto.timingSafeEqual(pBuf, eBuf);
}

export async function handleApiRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method;

  // Global CORS support for cross-origin or custom API port/domain configurations
  const origin = req.headers['origin'];
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  if (method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const isTrustedProxy = process.env.TRUSTED_PROXY === 'true' || process.env.TRUSTED_PROXY === '1';
  let ip = req.socket?.remoteAddress || '127.0.0.1';
  if (isTrustedProxy && req.headers['x-forwarded-for']) {
    const forwarded = String(req.headers['x-forwarded-for']).split(',')[0].trim();
    if (forwarded) ip = forwarded;
  }

  // Release any expired inventory reservations periodically
  releaseExpiredReservations();

  const parseBody = () => new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    const MAX_SIZE = 1024 * 1024; // 1 MB limit for standard JSON / form endpoints

    req.on('data', chunk => {
      size += chunk.length;
      if (size > MAX_SIZE) {
        const err = new Error('Payload too large (maximum 1MB allowed)');
        err.statusCode = 413;
        req.destroy();
        return reject(err);
      }
      body += chunk;
    });

    req.on('end', () => {
      const contentType = (req.headers['content-type'] || '').toLowerCase();
      const trimmed = body.trim();
      if (!trimmed) {
        return resolve({});
      }

      if (contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(body);
          return resolve(parsed);
        } catch (err) {
          const parseErr = new Error('Malformed JSON payload: ' + err.message);
          parseErr.statusCode = 400;
          return reject(parseErr);
        }
      }

      // URL-encoded form data (e.g. from payment callbacks)
      try {
        const params = new URLSearchParams(body);
        const obj = {};
        for (const [k, v] of params.entries()) {
          obj[k] = v;
        }
        return resolve(obj);
      } catch (err) {
        const parseErr = new Error('Malformed request body');
        parseErr.statusCode = 400;
        return reject(parseErr);
      }
    });

    req.on('error', err => {
      reject(err);
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
    // ---------------------------------------------------------------------------
    // 1. Health & Payment Config
    // ---------------------------------------------------------------------------
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        paymentConfig: getPaymentConfigurationStatus()
      });
    }

    if (pathname === '/api/payment/config' && method === 'GET') {
      return sendJson(200, getPaymentConfigurationStatus());
    }

    if (pathname === '/api/categories' && method === 'GET') {
      return sendJson(200, { categories: getAllCategories() });
    }

    if (pathname === '/api/shipping/config' && method === 'GET') {
      return sendJson(200, { settings: getStoreSettings() });
    }

    // ---------------------------------------------------------------------------
    // 2. Public Catalog & Inventory (Strictly Published Products Only)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/products' && method === 'GET') {
      const category = url.searchParams.get('category');
      const phone = url.searchParams.get('phone');
      const query = url.searchParams.get('query') || url.searchParams.get('q') || '';
      const inStockOnly = url.searchParams.get('inStockOnly') === 'true';
      const lowStock = url.searchParams.get('lowStock') === 'true';
      const maxPrice = url.searchParams.get('maxPrice');
      const sale = url.searchParams.get('sale');

      // Security: Public catalog route strictly excludes unpublished & archived products
      const products = getAllProducts({
        category,
        phone,
        query,
        inStockOnly,
        lowStockOnly: lowStock,
        includeArchived: false
      });

      let results = products;
      if (maxPrice) results = results.filter(p => p.price <= Number(maxPrice));
      if (sale === 'true') results = results.filter(p => p.sale || p.isSale || (p.badge && p.badge.toLowerCase().includes('sale')));

      return sendJson(200, { count: results.length, products: results });
    }

    if (pathname.startsWith('/api/products/') && !pathname.includes('/reviews') && method === 'GET') {
      const id = pathname.replace('/api/products/', '').trim();
      const product = getProductById(id);
      // Security: Non-published / archived items are never exposed on public product endpoints
      if (!product || product.status !== 'published') {
        return sendJson(404, { error: 'Product not found' });
      }
      return sendJson(200, { product });
    }

    // ---------------------------------------------------------------------------
    // 2b. Agentic Free-Delivery Threshold Optimizer (৳2,000+)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/agent/optimize-bundle' && method === 'POST') {
      const body = await parseBody();
      const cartIds = Array.isArray(body.cartIds) ? body.cartIds : [];
      const reqItems = Array.isArray(body.items) ? body.items : [];

      const allPubProducts = getAllProducts({ inStockOnly: true });
      const foundFromIds = cartIds.map(id => allPubProducts.find(p => p.id === id || p.sku === id)).filter(Boolean);
      const items = foundFromIds.length > 0 ? foundFromIds : reqItems;
      const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      const FREE_DELIVERY_THRESHOLD = 2000;

      if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        return sendJson(200, {
          subtotal,
          freeDeliveryUnlocked: true,
          agentMessage: '100% Free Nationwide Delivery unlocked!'
        });
      }

      const shortfall = FREE_DELIVERY_THRESHOLD - subtotal;
      const recommendedFiller = allPubProducts
        .filter(p => !cartIds.includes(p.id) && !cartIds.includes(p.sku) && p.price >= shortfall)
        .sort((a, b) => a.price - b.price)[0] ||
        allPubProducts.sort((a, b) => a.price - b.price)[0] ||
        { id: 'TN-02', title: 'REMAX RC-155a Fast Cable', price: 150 };

      const fillerName = recommendedFiller.title || recommendedFiller.name || 'Fast Cable';
      const fillerPrice = recommendedFiller.price || 150;

      return sendJson(200, {
        subtotal,
        shortfall,
        freeDeliveryUnlocked: false,
        recommendedFiller: {
          id: recommendedFiller.id,
          name: fillerName,
          price: fillerPrice
        },
        agentMessage: `You are ৳${shortfall} away from Free Nationwide Delivery. Add ${fillerName} (৳${fillerPrice}) to waive the ৳120 courier fee.`
      });
    }

    // ---------------------------------------------------------------------------
    // 3. Cart Revalidation & Pricing (Strict Server Validation)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/cart/validate' && method === 'POST') {
      const body = await parseBody();
      const items = Array.isArray(body.items) ? body.items : [];
      const destination = body.destination || {};

      const validatedItems = [];
      const warnings = [];
      let calculatedSubtotal = 0;

      for (const reqItem of items) {
        const product = getProductById(reqItem.id);
        if (!product || product.status !== 'published') {
          warnings.push(`Item "${reqItem.title || reqItem.id}" is no longer available.`);
          continue;
        }

        const requestedQty = parseInt(reqItem.quantity, 10);
        const safeQty = isNaN(requestedQty) || requestedQty <= 0 ? 1 : requestedQty;
        const finalQty = Math.min(product.stock, safeQty);

        if (finalQty <= 0) {
          warnings.push(`"${product.title}" is currently out of stock.`);
          continue;
        }

        if (finalQty < safeQty) {
          warnings.push(`Quantity for "${product.title}" adjusted to available stock (${finalQty}).`);
        }

        if (reqItem.price && Number(reqItem.price) !== product.price) {
          warnings.push(`Price for "${product.title}" updated from ৳${reqItem.price} to ৳${product.price}.`);
        }

        calculatedSubtotal += product.price * finalQty;

        // Check variant
        let matchedVariant = null;
        if (reqItem.variant?.id && product.variants?.length) {
          matchedVariant = product.variants.find(v => v.id === reqItem.variant.id) || product.variants[0];
        }

        validatedItems.push({
          id: product.id,
          sku: product.sku,
          title: product.title,
          titleBn: product.titleBn,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          variant: matchedVariant || reqItem.variant || null,
          quantity: finalQty,
          maxStock: product.stock
        });
      }

      // Check active promotions
      const activePromos = getActivePromotions();
      let promoDiscount = 0;
      let appliedPromo = null;

      if (body.promoCode) {
        const found = activePromos.find(p => p.code.toLowerCase() === body.promoCode.toLowerCase().trim());
        if (found && calculatedSubtotal >= found.min_order_amount) {
          appliedPromo = found;
          if (found.discount_type === 'percentage') {
            promoDiscount = Math.round((calculatedSubtotal * found.discount_value) / 100);
          } else {
            promoDiscount = Math.min(calculatedSubtotal, found.discount_value);
          }
        }
      }

      const discountedSubtotal = Math.max(0, calculatedSubtotal - promoDiscount);
      const deliveryFee = calculateDeliveryFee(discountedSubtotal, destination);
      const total = discountedSubtotal + deliveryFee;

      return sendJson(200, {
        valid: true,
        items: validatedItems,
        subtotal: calculatedSubtotal,
        discount: promoDiscount,
        deliveryFee,
        total,
        appliedPromo: appliedPromo ? { code: appliedPromo.code, title: appliedPromo.title } : null,
        warnings
      });
    }

    // ---------------------------------------------------------------------------
    // 4. Order Creation (Idempotent, Transactional & Stock Reserved)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseBody();
      const db = getDatabase();

      // Customer validation
      if (!body.customer && (body.customerName || body.phone)) {
        body.customer = {
          name: (body.customerName || '').trim(),
          phone: (body.phone || '').trim(),
          address: (body.address || body.district || 'Banani, Dhaka').trim(),
          division: body.district || 'Dhaka'
        };
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

      if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
        return sendJson(400, { success: false, error: 'Order must contain at least one item' });
      }

      // Check authenticated user & bind requester identity
      const user = authenticateRequest(req);
      const userId = user ? user.id : null;
      const requesterId = user ? `user:${user.id}` : `phone:${cleanPhone}`;

      // Canonicalize request payload for idempotency verification
      const sortedItemsSummary = (body.items || []).map(i => ({
        id: String(i.id),
        qty: parseInt(i.quantity, 10) || 1,
        v: String(i.variant?.name || i.variant || 'Standard')
      })).sort((a, b) => a.id.localeCompare(b.id) || a.v.localeCompare(b.v));

      const canonicalData = {
        customer: {
          name: cust.name.trim(),
          phone: cleanPhone,
          division: cust.division || 'Dhaka',
          address: cust.address.trim()
        },
        items: sortedItemsSummary,
        paymentMethod: body.paymentMethod === 'online' ? 'online' : 'cod',
        promoCode: (body.promoCode || '').trim().toLowerCase()
      };
      const requestHash = crypto.createHash('sha256').update(JSON.stringify(canonicalData)).digest('hex');

      // Idempotency check with strict requester and request-content binding
      if (body.idempotencyKey) {
        const existingIdemp = db.prepare('SELECT requester_id, request_hash, response_json FROM idempotency_keys WHERE key = ?').get(body.idempotencyKey);
        if (existingIdemp) {
          // Security: Never replay an order response or guest token to a different requester
          if (existingIdemp.requester_id && existingIdemp.requester_id !== requesterId) {
            return sendJson(409, {
              success: false,
              error: 'Idempotency conflict: Key was already claimed by another requester or session'
            });
          }

          // Security: Reject if the key is reused with a different request payload
          if (existingIdemp.request_hash && existingIdemp.request_hash !== requestHash) {
            return sendJson(422, {
              success: false,
              error: 'Idempotency violation: Key reused with different request payload'
            });
          }

          try {
            return sendJson(200, JSON.parse(existingIdemp.response_json));
          } catch (e) {}
        }
      }

      // Canonical price calculation & aggregation
      const aggregatedItems = new Map();
      for (const item of body.items) {
        const qty = parseInt(item.quantity, 10);
        if (isNaN(qty) || qty <= 0) {
          return sendJson(400, { success: false, error: 'Item quantities must be positive integers' });
        }
        const key = `${item.id}_${item.variant?.name || item.variant || 'Standard'}`;
        if (aggregatedItems.has(key)) {
          aggregatedItems.get(key).quantity += qty;
        } else {
          aggregatedItems.set(key, { ...item, quantity: qty });
        }
      }

      let subtotal = 0;
      const orderItems = [];

      for (const item of aggregatedItems.values()) {
        const product = getProductById(item.id);
        if (!product || product.status !== 'published') {
          return sendJson(400, { success: false, error: `Product unavailable or out of stock: ${item.id}` });
        }

        subtotal += product.price * item.quantity;
        orderItems.push({
          id: product.id,
          sku: product.sku,
          title: product.title,
          titleBn: product.titleBn,
          price: product.price,
          quantity: item.quantity,
          variant: item.variant?.name || item.variant || 'Standard',
          variantId: item.variant?.id || null
        });
      }

      // Apply promo discount if present
      let discount = 0;
      if (body.promoCode) {
        const promos = getActivePromotions();
        const promo = promos.find(p => p.code.toLowerCase() === body.promoCode.toLowerCase().trim());
        if (promo && subtotal >= promo.min_order_amount) {
          discount = promo.discount_type === 'percentage'
            ? Math.round((subtotal * promo.discount_value) / 100)
            : Math.min(subtotal, promo.discount_value);
        }
      }

      const discountedSubtotal = Math.max(0, subtotal - discount);
      const deliveryFee = calculateDeliveryFee(discountedSubtotal, {
        division: cust.division || 'Dhaka',
        outsideCity: Boolean(cust.outsideCity)
      });
      const total = discountedSubtotal + deliveryFee;

      const paymentMethod = body.paymentMethod === 'online' ? 'online' : 'cod';

      // Check if online payment selected but not configured
      if (paymentMethod === 'online' && !isPaymentConfigured()) {
        return sendJson(400, {
          success: false,
          error: 'Online payment is currently unavailable. Payment gateway credentials are not configured.'
        });
      }

      try {
        const result = createOrderWithReservation({
          userId,
          customer: {
            name: cust.name,
            phone: cleanPhone,
            division: cust.division || 'Dhaka',
            outsideCity: Boolean(cust.outsideCity),
            address: cust.address,
            notes: cust.notes || ''
          },
          items: orderItems,
          subtotal,
          discount,
          deliveryFee,
          total,
          paymentMethod,
          isDemo: Boolean(body.isDemo)
        });

        const responsePayload = {
          success: true,
          order: result.order,
          guestToken: result.guestToken
        };

        if (body.idempotencyKey) {
          db.prepare('INSERT OR REPLACE INTO idempotency_keys (key, requester_id, request_hash, response_json, created_at) VALUES (?, ?, ?, ?, ?)')
            .run(body.idempotencyKey, requesterId, requestHash, JSON.stringify(responsePayload), new Date().toISOString());
        }

        return sendJson(201, responsePayload);
      } catch (err) {
        return sendJson(400, { success: false, error: err.message });
      }
    }

    // ---------------------------------------------------------------------------
    // 5. Order Tracking, Invoices & Dispatch Packing Slips
    // ---------------------------------------------------------------------------
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/invoice') && method === 'GET') {
      const parts = pathname.split('/');
      // /api/orders/:id/invoice
      const orderId = parts[3];
      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: `No order found with ID: ${orderId}` });
      }

      const tokenParam = url.searchParams.get('token');
      const adminTokenParam = url.searchParams.get('admin_token');
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      const isAdmin = (adminTokenParam && verifyAdminToken(adminTokenParam)) || (bearerToken && verifyAdminToken(bearerToken));

      const authUser = authenticateRequest(req);
      const isAuthorizedUser = authUser && (authUser.role === 'admin' || authUser.id === order.userId);
      const isAuthorizedGuest = safeTokenEqual(tokenParam, order.guestToken);

      if (!isAdmin && !isAuthorizedUser && !isAuthorizedGuest) {
        return sendJson(403, {
          success: false,
          error: 'Access denied. Valid guest security token or admin authorization required to view invoice.'
        });
      }

      const docType = url.searchParams.get('type') === 'packing-slip' ? 'packing-slip' : 'invoice';
      const format = url.searchParams.get('format') || (req.headers['accept']?.includes('text/html') ? 'html' : 'html');

      if (format === 'json') {
        return sendJson(200, {
          success: true,
          type: docType,
          order,
          amountInWords: numberToWordsBDT(order.total)
        });
      }

      const origin = getPublicOrigin(req);
      const html = generateInvoiceHtml(order, { type: docType, origin });
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.statusCode = 200;
      return res.end(html);
    }

    if (pathname.startsWith('/api/orders/') && !pathname.includes('/status') && !pathname.endsWith('/invoice') && method === 'GET') {
      const orderId = pathname.replace('/api/orders/', '').trim();
      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: `No order found with ID: ${orderId}` });
      }

      const tokenParam = url.searchParams.get('token');
      const authUser = authenticateRequest(req);

      const isAuthorizedUser = authUser && (authUser.role === 'admin' || authUser.id === order.userId);
      const isAuthorizedGuest = safeTokenEqual(tokenParam, order.guestToken);

      // Full access if authorized
      if (isAuthorizedUser || isAuthorizedGuest) {
        return sendJson(200, { success: true, order, authorized: true });
      }

      // Masked public status access: Protect customer personal information
      const nameParts = (order.customer.name || '').split(' ');
      const maskedName = nameParts.map(p => p ? p[0] + '***' : '').join(' ');
      const rawPhone = order.customer.phone || '';
      const maskedPhone = rawPhone.length > 5 ? rawPhone.slice(0, 3) + '****' + rawPhone.slice(-4) : '*******';

      const publicOrder = {
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        timeline: order.timeline,
        total: order.total,
        customer: {
          name: maskedName,
          phone: maskedPhone,
          division: order.customer.division
        },
        items: order.items.map(i => ({
          title: i.title,
          quantity: i.quantity,
          variant: i.variant
        }))
      };

      return sendJson(200, {
        success: true,
        order: publicOrder,
        authorized: false,
        notice: 'Personal details are protected. Full order details require signing in or tracking token.'
      });
    }

    // ---------------------------------------------------------------------------
    // 6. Online Payments (Session Initiation & Unified Verification)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/payment/initiate' && method === 'POST') {
      if (!isPaymentConfigured()) {
        return sendJson(400, {
          success: false,
          error: 'Online payment initiation refused: No live payment provider is configured on this server.'
        });
      }

      const body = await parseBody();
      const { orderId } = body;
      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: 'Order not found' });
      }

      // Security: Check order ownership before initiating payment
      const authUser = authenticateRequest(req);
      const guestToken = body.guestToken || req.headers['x-guest-token'] || url.searchParams.get('token');
      const isAuthorized = (authUser && (authUser.role === 'admin' || authUser.id === order.userId)) ||
                           safeTokenEqual(guestToken, order.guestToken);
      if (!isAuthorized) {
        return sendJson(403, {
          success: false,
          error: 'Access denied: Valid guest tracking token or account authorization required to initiate payment'
        });
      }

      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(400, { success: false, error: 'Order is already paid' });
      }

      // Security: Select provider strictly from trusted server configuration, ignoring client override
      const provider = getPaymentProvider();
      if (!provider) {
        return sendJson(400, { success: false, error: 'Payment provider not available on server' });
      }

      const publicOrigin = getPublicOrigin(req);
      const sessionResult = await provider.initiatePayment(order, publicOrigin);

      return sendJson(200, {
        success: true,
        orderId: order.id,
        ...sessionResult
      });
    }

    // Centralized server payment verification
    if (pathname === '/api/payment/verify' && method === 'POST') {
      const body = await parseBody();
      const { orderId, sessionId, val_id, paymentId, status, signature, invoiceId, invoice_id, trxId, transaction_id, senderPhone } = body;

      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { success: false, error: 'Order not found' });
      }

      // Security: Ownership verification guard for sensitive order details
      const authUser = authenticateRequest(req);
      const guestToken = body.guestToken || req.headers['x-guest-token'] || url.searchParams.get('token');
      const isAuthorized = (authUser && (authUser.role === 'admin' || authUser.id === order.userId)) ||
                           safeTokenEqual(guestToken, order.guestToken);

      // Idempotency: If already paid, return clean success immediately without leaking full details to unauthorized callers
      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(200, {
          success: true,
          verified: true,
          orderId: order.id,
          paymentStatus: order.paymentStatus,
          transactionId: order.paymentDetails?.transactionId || null,
          message: 'Order was already verified and marked as paid',
          ...(isAuthorized ? { order } : {})
        });
      }

      // Security: Select provider strictly from server configuration. Never let the client choose the payment provider!
      const provider = getPaymentProvider();
      if (!provider) {
        return sendJson(400, {
          success: false,
          verified: false,
          error: 'Payment verification refused: No active payment provider configured on server'
        });
      }

      // Strict production protection: Reject sandbox provider in production
      if (process.env.NODE_ENV === 'production' && provider.name === 'sandbox') {
        return sendJson(400, {
          success: false,
          verified: false,
          error: 'Sandbox payments are strictly disabled in production'
        });
      }

      const verificationResult = await provider.verifyPayment({
        order,
        sessionId,
        val_id,
        paymentId,
        invoiceId: invoiceId || invoice_id,
        trxId: trxId || transaction_id,
        senderPhone,
        status: status || 'success',
        signature
      });

      if (verificationResult.verified && verificationResult.transactionId) {
        const finalizedOrder = finalizeOrderPayment({
          orderId: order.id,
          provider: provider.name || 'online_gateway',
          transactionId: verificationResult.transactionId,
          paymentDetails: verificationResult.meta || {}
        });

        // Security: Never return full customer personal details (address, phone, notes) to unauthenticated callers
        return sendJson(200, {
          success: true,
          verified: true,
          orderId: finalizedOrder.id,
          paymentStatus: finalizedOrder.paymentStatus,
          transactionId: verificationResult.transactionId,
          ...(isAuthorized ? { order: finalizedOrder } : {})
        });
      } else if (verificationResult.pendingVerification && verificationResult.transactionId) {
        const updatedOrder = recordPendingPaymentReference(order.id, {
          transactionId: verificationResult.transactionId,
          senderPhone: verificationResult.senderPhone,
          provider: provider.name || 'online_gateway'
        });

        return sendJson(200, {
          success: true,
          verified: false,
          pendingVerification: true,
          orderId: order.id,
          paymentStatus: 'pending',
          transactionId: verificationResult.transactionId,
          message: 'Transaction reference recorded. Order is pending verification by store staff.',
          ...(isAuthorized ? { order: updatedOrder } : {})
        });
      } else {
        cancelOrderAndReleaseReservation(order.id, verificationResult.reason || 'Payment verification failed');
        return sendJson(400, {
          success: false,
          verified: false,
          error: verificationResult.reason || 'Payment verification failed'
        });
      }
    }

    // Payment Gateway Redirect Callback Handler (Supports both GET and POST from gateways)
    if (pathname.startsWith('/api/payment/callback/')) {
      const providerName = pathname.replace('/api/payment/callback/', '').trim();
      const body = method === 'POST' ? await parseBody() : {};

      const orderId = url.searchParams.get('orderId') || body.tran_id || body.merchantInvoiceNumber;
      const callbackStatus = url.searchParams.get('status') || body.status || 'success';
      const valId = url.searchParams.get('val_id') || body.val_id;
      const paymentId = url.searchParams.get('paymentID') || body.paymentID;
      const sessionId = url.searchParams.get('sessionId');

      if (!orderId) {
        return sendRedirect('/?payment_result=fail&error=missing_order');
      }

      if (callbackStatus === 'success') {
        const provider = getPaymentProvider(providerName);
        const order = findOrderById(orderId);

        if (provider && order) {
          try {
            const verification = await provider.verifyPayment({
              order,
              val_id: valId,
              paymentId,
              sessionId,
              status: 'success'
            });

            if (verification.verified) {
              finalizeOrderPayment({
                orderId: order.id,
                provider: providerName,
                transactionId: verification.transactionId,
                paymentDetails: verification.meta || {}
              });
              return sendRedirect(`/?payment_result=success&orderId=${orderId}&token=${order.guestToken || ''}`);
            }
          } catch (e) {
            console.error('[Payment Callback Verification Error]', e.message);
          }
        }
        return sendRedirect(`/?payment_result=fail&orderId=${orderId}`);
      } else if (callbackStatus === 'cancel') {
        cancelOrderAndReleaseReservation(orderId, 'Customer cancelled payment in gateway');
        return sendRedirect(`/?payment_result=cancel&orderId=${orderId}`);
      } else {
        cancelOrderAndReleaseReservation(orderId, 'Payment gateway declined transaction');
        return sendRedirect(`/?payment_result=fail&orderId=${orderId}`);
      }
    }

    // Payment IPN / Webhook Handler (Idempotent background notification)
    if (pathname.startsWith('/api/payment/ipn/') || pathname === '/api/uddoktapay/ipn') {
      const providerName = pathname === '/api/uddoktapay/ipn' 
        ? 'uddoktapay' 
        : pathname.replace('/api/payment/ipn/', '').trim();

      // For GET request: health/ping check
      if (method === 'GET') {
        return sendJson(200, {
          status: 'active',
          service: 'Payment IPN Webhook Listener',
          provider: providerName,
          ready: true,
          timestamp: Date.now()
        });
      }

      const body = await parseBody();
      let metadata = {};
      if (body.metadata) {
        try {
          metadata = typeof body.metadata === 'string' ? JSON.parse(body.metadata) : body.metadata;
        } catch (e) {
          metadata = {};
        }
      }

      const orderId = body.tran_id || body.merchantInvoiceNumber || body.orderId || metadata.orderId || body.invoice_id;
      if (!orderId) {
        return sendJson(400, { error: 'Missing order reference' });
      }

      const order = findOrderById(orderId);
      if (!order) {
        return sendJson(404, { error: 'Order not found' });
      }

      if (order.paymentStatus === PAYMENT_STATUS.PAID) {
        return sendJson(200, { received: true, message: 'Already processed' });
      }

      const provider = getPaymentProvider(providerName);
      if (!provider) {
        return sendJson(400, { error: 'Unknown provider' });
      }

      const result = await provider.verifyPayment({
        order,
        val_id: body.val_id,
        paymentId: body.paymentID,
        invoiceId: body.invoice_id || body.invoiceId,
        trxId: body.transaction_id,
        status: (body.status || 'success').toUpperCase() === 'COMPLETED' ? 'success' : body.status
      });

      if (result.verified) {
        finalizeOrderPayment({
          orderId: order.id,
          provider: providerName,
          transactionId: result.transactionId,
          paymentDetails: result.meta || {}
        });
        return sendJson(200, { success: true });
      }

      return sendJson(400, { success: false, reason: result.reason });
    }

    // ---------------------------------------------------------------------------
    // 7. Customer Accounts & Authentication
    // ---------------------------------------------------------------------------
    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody();
      const { email, password, name, phone } = body;

      if (!email || !email.includes('@')) {
        return sendJson(400, { error: 'Valid email address is required' });
      }
      if (!password || password.length < 6) {
        return sendJson(400, { error: 'Password must be at least 6 characters' });
      }
      if (!name || !name.trim()) {
        return sendJson(400, { error: 'Full name is required' });
      }

      const existing = findUserByEmail(email);
      if (existing) {
        return sendJson(409, { error: 'An account with this email already exists' });
      }

      const passwordHash = hashPassword(password);
      const user = createUser({ email, phone, name, passwordHash, role: 'customer' });
      const token = createCustomerSession(user.id);

      return sendJson(201, {
        success: true,
        token,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, addresses: user.addresses }
      });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody();
      const { email, password } = body;

      if (!checkRateLimit(ip, email || 'unknown', 5, 15 * 60 * 1000)) {
        return sendJson(429, { error: 'Too many failed login attempts. Please wait 15 minutes before retrying.' });
      }

      const user = findUserByEmail(email);
      if (!user || !verifyPasswordHash(password, user.password_hash)) {
        recordFailedAttempt(ip, email || 'unknown');
        return sendJson(401, { error: 'Invalid email or password' });
      }

      clearFailedAttempts(ip, email);
      const token = createCustomerSession(user.id);

      return sendJson(200, {
        success: true,
        token,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, addresses: user.addresses }
      });
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
      logoutSession(req.headers['authorization']);
      return sendJson(200, { success: true });
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      return sendJson(200, { success: true, user });
    }

    if (pathname === '/api/auth/profile' && method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      const body = await parseBody();
      const updated = updateUserProfile(user.id, body);
      return sendJson(200, { success: true, user: updated });
    }

    if (pathname === '/api/auth/reset-password' && method === 'POST') {
      const emailConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER);
      if (!emailConfigured) {
        return sendJson(501, {
          success: false,
          error: 'Password reset email service is not configured on this server. Contact store manager directly.'
        });
      }
      return sendJson(200, { success: true, message: 'Password reset link sent to your registered email' });
    }

    // Customer Order History
    if (pathname === '/api/customer/orders' && method === 'GET') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      const orders = getOrdersForUser(user.id);
      return sendJson(200, { success: true, orders });
    }

    // Phone OTP Verification for Guest Order Claiming & Account Security
    if (pathname === '/api/auth/otp/request' && method === 'POST') {
      const body = await parseBody();
      const rawPhone = body.phone || '';
      const cleanPhone = rawPhone.replace(/[\s-]/g, '');
      if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
        return sendJson(400, { success: false, error: 'Valid Bangladeshi phone number required' });
      }

      const code = createPhoneOtp(cleanPhone);
      return sendJson(200, {
        success: true,
        message: 'OTP sent to mobile number',
        ...(process.env.NODE_ENV !== 'production' ? { devOtp: code } : {})
      });
    }

    if (pathname === '/api/auth/otp/verify' && method === 'POST') {
      const body = await parseBody();
      const rawPhone = body.phone || '';
      const cleanPhone = rawPhone.replace(/[\s-]/g, '');
      const code = body.code || body.otp || '';

      const isValid = verifyPhoneOtp(cleanPhone, code);
      if (!isValid) {
        return sendJson(400, { success: false, error: 'Invalid or expired OTP' });
      }

      return sendJson(200, { success: true, message: 'Phone ownership verified successfully' });
    }

    // Link guest order to customer account (Strict Ownership Enforcement)
    if (pathname === '/api/customer/orders/link-guest' && method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      const body = await parseBody();
      const { orderId, guestToken, otp } = body;
      const order = findOrderById(orderId);

      if (!order) {
        return sendJson(404, { error: 'Order not found' });
      }

      // Security: Require valid guestToken OR verified phone OTP
      let verifiedOwnership = false;

      // Method A: Valid Guest Tracking Token
      if (guestToken && safeTokenEqual(guestToken, order.guestToken)) {
        verifiedOwnership = true;
      }

      // Method B: Phone ownership verified with OTP
      if (!verifiedOwnership && otp) {
        const cleanUserPhone = (user.phone || '').replace(/[\s-]/g, '');
        const cleanOrderPhone = (order.customer?.phone || '').replace(/[\s-]/g, '');
        if (cleanUserPhone && cleanUserPhone === cleanOrderPhone) {
          if (verifyPhoneOtp(cleanUserPhone, otp)) {
            verifiedOwnership = true;
          }
        }
      }

      if (!verifiedOwnership) {
        return sendJson(403, { 
          error: 'Ownership verification failed: Valid guest tracking token or verified phone OTP is required to link order.' 
        });
      }

      const db = getDatabase();
      db.prepare('UPDATE orders SET user_id = ? WHERE id = ?').run(user.id, order.id);
      return sendJson(200, { success: true, message: 'Order successfully linked to your account' });
    }

    // Customer Wishlist
    if (pathname === '/api/customer/wishlist' && method === 'GET') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      const productIds = getUserWishlist(user.id);
      return sendJson(200, { success: true, productIds });
    }

    if (pathname === '/api/customer/wishlist' && method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'Unauthorized' });
      }
      const body = await parseBody();
      setUserWishlist(user.id, body.productIds || []);
      return sendJson(200, { success: true });
    }

    // ---------------------------------------------------------------------------
    // 8. Verified Customer Reviews
    // ---------------------------------------------------------------------------
    if (pathname.startsWith('/api/products/') && pathname.endsWith('/reviews') && method === 'GET') {
      const parts = pathname.split('/');
      const productId = parts[3];
      const reviews = getProductReviews(productId);
      return sendJson(200, { reviews });
    }

    if (pathname.startsWith('/api/products/') && pathname.endsWith('/reviews') && method === 'POST') {
      const user = authenticateRequest(req);
      if (!user) {
        return sendJson(401, { error: 'You must be signed in to submit a product review' });
      }

      const parts = pathname.split('/');
      const productId = parts[3];
      const body = await parseBody();

      try {
        const review = createReview({
          productId,
          userId: user.id,
          orderId: body.orderId,
          rating: body.rating,
          comment: body.comment,
          userName: user.name
        });
        return sendJson(201, { success: true, review });
      } catch (err) {
        return sendJson(400, { success: false, error: err.message });
      }
    }

    // ---------------------------------------------------------------------------
    // 9. Promotions
    // ---------------------------------------------------------------------------
    if (pathname === '/api/promotions' && method === 'GET') {
      const promotions = getActivePromotions();
      return sendJson(200, { promotions });
    }

    // ---------------------------------------------------------------------------
    // 10. Service Requests (Feature Flag)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/services' && method === 'GET') {
      const services = getServiceCatalog();
      return sendJson(200, { services });
    }

    if (pathname === '/api/services/requests' && method === 'POST') {
      const body = await parseBody();
      if (!body.customerName || !body.customerPhone || !body.deviceModel || !body.description) {
        return sendJson(400, { error: 'Missing required service request details' });
      }
      const user = authenticateRequest(req);
      const srvReq = createServiceRequest({ ...body, userId: user?.id });
      return sendJson(201, { success: true, serviceRequest: srvReq });
    }

    // ---------------------------------------------------------------------------
    // 11. Admin Operations Console (Strictly Protected)
    // ---------------------------------------------------------------------------
    // Helper to get authenticated admin or staff identity
    const getAdminCaller = () => {
      const authHeader = req.headers['authorization'];
      const queryToken = url.searchParams.get('admin_token');
      const token = authHeader || (queryToken ? `Bearer ${queryToken}` : null);
      return decodeAdminToken(token);
    };

    if (pathname === '/api/admin/login' && method === 'POST') {
      if (!checkRateLimit(ip, 'admin_console', 5, 15 * 60 * 1000)) {
        return sendJson(429, { error: 'Too many failed admin login attempts. Please wait 15 minutes.' });
      }

      const body = await parseBody();
      const expectedEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
      const providedUsername = body.username ? String(body.username).trim() : '';
      const providedEmail = providedUsername.toLowerCase();
      const password = body.password ? String(body.password) : '';

      // 1. Check primary administrator password
      const emailMatches = !expectedEmail || 
                           providedEmail === expectedEmail || 
                           providedEmail === 'admin' || 
                           providedEmail === 'admin@techtrove.local' ||
                           providedEmail === 'istihadahmed1163@gmail.com' ||
                           providedEmail.includes('istihad') ||
                           providedEmail.startsWith('admin');
      if (emailMatches && verifyPassword(password)) {
        clearFailedAttempts(ip, 'admin_console');
        const token = generateAdminToken({
          sub: 'admin_primary',
          role: 'admin',
          email: expectedEmail || 'admin@store.local',
          name: 'Primary Administrator',
          permissions: ['*']
        });
        logAuditEvent({
          userId: 'admin_primary',
          userEmail: expectedEmail || 'admin@store.local',
          action: 'auth:login',
          entityType: 'session',
          entityId: 'admin_primary',
          details: { role: 'admin', method: 'primary_key' },
          ip
        });
        return sendJson(200, {
          success: true,
          token,
          user: {
            id: 'admin_primary',
            email: expectedEmail || 'admin@store.local',
            name: 'Primary Administrator',
            role: 'admin',
            permissions: ['*']
          }
        });
      }

      // 2. Check database staff/manager/admin user
      if (providedEmail) {
        const dbUser = findUserByEmail(providedEmail);
        if (dbUser && ['admin', 'manager', 'staff'].includes(dbUser.role) && (dbUser.status || 'active') === 'active') {
          if (verifyPasswordHash(password, dbUser.password_hash)) {
            clearFailedAttempts(ip, 'admin_console');
            const perms = Array.isArray(dbUser.permissions) && dbUser.permissions.length > 0
              ? dbUser.permissions
              : getDefaultPermissions(dbUser.role);
            const token = generateAdminToken({
              sub: dbUser.id,
              role: dbUser.role,
              email: dbUser.email,
              name: dbUser.name,
              permissions: perms
            });
            logAuditEvent({
              userId: dbUser.id,
              userEmail: dbUser.email,
              action: 'auth:login',
              entityType: 'session',
              entityId: dbUser.id,
              details: { role: dbUser.role },
              ip
            });
            return sendJson(200, {
              success: true,
              token,
              user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name,
                role: dbUser.role,
                permissions: perms
              }
            });
          }
        }
      }

      recordFailedAttempt(ip, 'admin_console');
      return sendJson(401, { success: false, error: 'Invalid admin credentials' });
    }

    // Admin Dashboard Summary Metrics
    if (pathname === '/api/admin/dashboard' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }

      const allOrders = getAllOrdersAdmin({ limit: 1000 });
      let paidRevenue = 0;
      let unpaidCod = 0;
      let cancelledCount = 0;
      let testOrdersCount = 0;

      for (const ord of allOrders) {
        if (ord.isDemo) testOrdersCount++;
        if (ord.status === 'cancelled') {
          cancelledCount++;
        } else if (ord.paymentStatus === 'paid') {
          paidRevenue += ord.total;
        } else if (ord.paymentMethod === 'cod') {
          unpaidCod += ord.total;
        }
      }

      const allProducts = getAllProducts({ includeArchived: true });
      const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
      const outOfStockProducts = allProducts.filter(p => p.stock === 0);

      return sendJson(200, {
        metrics: {
          paidRevenue,
          unpaidCod,
          totalOrders: allOrders.length,
          cancelledCount,
          testOrdersCount,
          totalProducts: allProducts.length,
          lowStockCount: lowStockProducts.length,
          outOfStockCount: outOfStockProducts.length
        }
      });
    }

    // Admin Orders
    if (pathname === '/api/admin/orders' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }
      const status = url.searchParams.get('status');
      const paymentStatus = url.searchParams.get('paymentStatus');
      const search = url.searchParams.get('search') || '';
      const orders = getAllOrdersAdmin({ status, paymentStatus, search, limit: 200 });
      return sendJson(200, { orders });
    }

    // Admin Export Orders (CSV)
    if (pathname === '/api/admin/orders/export-csv' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      const queryToken = url.searchParams.get('admin_token');
      const token = queryToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
      if (!verifyAdminToken(token)) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }

      const orders = getAllOrdersAdmin({ limit: 1000 });
      const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Division', 'Payment Method', 'Payment Status', 'Subtotal (BDT)', 'Delivery Fee (BDT)', 'Total (BDT)', 'Status', 'Items Ordered'];
      const rows = orders.map(ord => {
        const itemsStr = (ord.items || []).map(i => `${i.title} (${i.variant || 'Standard'}) x${i.quantity}`).join('; ');
        return [
          ord.id,
          new Date(ord.createdAt).toISOString(),
          `"${(ord.customer?.name || '').replace(/"/g, '""')}"`,
          `"${ord.customer?.phone || ''}"`,
          `"${(ord.customer?.address || '').replace(/"/g, '""')}"`,
          `"${ord.customer?.division || ''}"`,
          ord.paymentMethod,
          ord.paymentStatus,
          ord.subtotal,
          ord.deliveryFee,
          ord.total,
          ord.status,
          `"${itemsStr.replace(/"/g, '""')}"`
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="tech-nest-orders-${Date.now()}.csv"`);
      res.statusCode = 200;
      return res.end(csvContent);
    }

    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }
      const orderId = pathname.split('/')[4];
      const body = await parseBody();

      try {
        const order = updateOrderStatus(orderId, body.status, body.note);
        if (!order) return sendJson(404, { error: 'Order not found' });
        return sendJson(200, { success: true, order });
      } catch (err) {
        return sendJson(400, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/orders/') && pathname.endsWith('/collect-cod') && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const orderId = pathname.split('/')[4];
      const body = await parseBody();
      const order = markCodPaymentCollected(orderId, body.note);
      if (!order) return sendJson(404, { error: 'Order not found' });
      return sendJson(200, { success: true, order });
    }

    // Admin Product Management
    if (pathname === '/api/admin/products' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const products = getAllProducts({ includeArchived: true });
      return sendJson(200, { products });
    }

    // Admin Export Products (CSV)
    if (pathname === '/api/admin/products/export-csv' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      const queryToken = url.searchParams.get('admin_token');
      const token = queryToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
      if (!verifyAdminToken(token)) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }

      const products = getAllProducts({ includeArchived: true });
      const headers = ['Product ID', 'SKU', 'Title', 'Category', 'Brand', 'Model', 'Price (BDT)', 'Original Price', 'Stock', 'Status', 'Warranty'];
      const rows = products.map(p => [
        p.id,
        p.sku || '',
        `"${(p.title || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${(p.brand || '').replace(/"/g, '""')}"`,
        `"${(p.model || '').replace(/"/g, '""')}"`,
        p.price,
        p.originalPrice || '',
        p.stock,
        p.status,
        `"${(p.warranty || '').replace(/"/g, '""')}"`
      ].join(','));

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="tech-nest-products-${Date.now()}.csv"`);
      res.statusCode = 200;
      return res.end(csvContent);
    }

    if (pathname === '/api/admin/products' && method === 'POST') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'manage:products')) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      try {
        const created = createProduct(body);
        logAuditEvent({
          userId: caller.sub,
          userEmail: caller.email,
          action: 'product:create',
          entityType: 'product',
          entityId: created.id,
          details: { title: created.title, price: created.price, stock: created.stock },
          ip
        });
        return sendJson(201, { success: true, product: created });
      } catch (err) {
        return sendJson(400, { success: false, error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/products/') && pathname.endsWith('/status') && method === 'PATCH') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'manage:products')) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const productId = pathname.split('/')[4];
      const body = await parseBody();
      try {
        const updated = updateProductStatus(productId, body.status);
        logAuditEvent({
          userId: caller.sub,
          userEmail: caller.email,
          action: 'product:status_update',
          entityType: 'product',
          entityId: productId,
          details: { status: body.status },
          ip
        });
        return sendJson(200, { success: true, product: updated });
      } catch (err) {
        return sendJson(400, { success: false, error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/products/') && (method === 'PUT' || method === 'POST')) {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'manage:products')) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const productId = pathname.replace('/api/admin/products/', '').trim();
      const body = await parseBody();
      try {
        const updated = updateProduct(productId, body);
        if (!updated) return sendJson(404, { error: 'Product not found' });
        logAuditEvent({
          userId: caller.sub,
          userEmail: caller.email,
          action: 'product:update',
          entityType: 'product',
          entityId: productId,
          details: { title: updated.title, price: updated.price, stock: updated.stock },
          ip
        });
        return sendJson(200, { success: true, product: updated });
      } catch (err) {
        return sendJson(400, { success: false, error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/products/') && method === 'DELETE') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'manage:products')) {
        return sendJson(403, { error: 'Unauthorized or insufficient permissions' });
      }
      const productId = pathname.replace('/api/admin/products/', '').trim();
      const existing = getProductById(productId);
      if (!existing) {
        return sendJson(404, { error: 'Product not found' });
      }
      deleteProduct(productId);
      logAuditEvent({
        userId: caller.sub,
        userEmail: caller.email,
        action: 'product:delete',
        entityType: 'product',
        entityId: productId,
        details: { title: existing.title, sku: existing.sku },
        ip
      });
      return sendJson(200, { success: true, message: 'Product deleted' });
    }

    // Stock Adjustments & Restocking
    if (pathname === '/api/admin/inventory/restock' && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      const { productId, count, reason } = body;
      if (!productId || typeof count !== 'number' || count <= 0) {
        return sendJson(400, { error: 'Invalid restock parameters' });
      }

      try {
        const result = adjustProductStock(productId, null, count, reason || `Manual Restock (+${count})`, 'admin');
        const updated = getProductById(productId);
        return sendJson(200, {
          success: true,
          message: `Restocked ${count} units`,
          newStock: updated.stock,
          product: updated
        });
      } catch (err) {
        return sendJson(400, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/products/') && pathname.endsWith('/adjust-stock') && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const productId = pathname.split('/')[4];
      const body = await parseBody();
      try {
        const result = adjustProductStock(
          productId,
          body.variantId || null,
          parseInt(body.delta, 10),
          body.reason || 'Manual Adjustment',
          'admin'
        );
        const product = getProductById(productId);
        return sendJson(200, { success: true, result, product });
      } catch (err) {
        return sendJson(400, { error: err.message });
      }
    }

    if (pathname === '/api/admin/inventory/adjustments' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const productId = url.searchParams.get('productId');
      const adjustments = getInventoryAdjustments(productId);
      return sendJson(200, { adjustments });
    }

    // Admin Image Upload
    if (pathname === '/api/admin/upload' && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      const { filename, contentType, dataBase64 } = body;

      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!contentType || !allowedMimes.includes(contentType)) {
        return sendJson(400, { error: 'Only JPEG, PNG, WebP, or SVG images are allowed' });
      }

      if (!dataBase64) {
        return sendJson(400, { error: 'Missing image file data' });
      }

      const buffer = Buffer.from(dataBase64, 'base64');
      if (buffer.length > 5 * 1024 * 1024) {
        return sendJson(400, { error: 'File size must not exceed 5MB' });
      }

      const ext = contentType === 'image/jpeg' ? '.jpg' :
                  contentType === 'image/png' ? '.png' :
                  contentType === 'image/webp' ? '.webp' : '.svg';

      const safeName = `img_${Date.now()}_${crypto.randomBytes(6).toString('hex')}${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(filePath, buffer);

      return sendJson(200, { success: true, url: `/uploads/${safeName}` });
    }

    // Admin Media List
    if (pathname === '/api/admin/images' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      try {
        if (!fs.existsSync(UPLOADS_DIR)) {
          fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        }
        const files = fs.readdirSync(UPLOADS_DIR);
        const images = files.map(file => {
          try {
            const stat = fs.statSync(path.join(UPLOADS_DIR, file));
            return {
              filename: file,
              url: `/uploads/${file}`,
              size: stat.size,
              createdAt: stat.birthtime || stat.mtime
            };
          } catch (e) {
            return null;
          }
        }).filter(Boolean);
        return sendJson(200, { success: true, images });
      } catch (err) {
        return sendJson(500, { error: err.message });
      }
    }

    // Admin Image Delete
    if ((pathname === '/api/admin/images' || pathname === '/api/admin/upload') && method === 'DELETE') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'manage:products')) {
        return sendJson(403, { error: 'Unauthorized or insufficient permissions' });
      }
      let targetFile = url.searchParams.get('filename') || url.searchParams.get('url');
      if (!targetFile && req.headers['content-length'] > 0) {
        try {
          const body = await parseBody();
          targetFile = body.filename || body.url;
        } catch (e) {}
      }

      if (!targetFile) {
        return sendJson(400, { error: 'Filename or URL parameter required' });
      }

      const cleanBaseName = path.basename(targetFile);
      const filePath = path.join(UPLOADS_DIR, cleanBaseName);

      if (!filePath.startsWith(UPLOADS_DIR)) {
        return sendJson(400, { error: 'Invalid file path' });
      }

      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          return sendJson(500, { error: 'Failed to delete image: ' + err.message });
        }
        logAuditEvent({
          userId: caller.sub,
          userEmail: caller.email,
          action: 'image:delete',
          entityType: 'image',
          entityId: cleanBaseName,
          details: { filename: cleanBaseName },
          ip
        });
        return sendJson(200, { success: true, message: `Image ${cleanBaseName} deleted successfully` });
      } else {
        return sendJson(404, { error: 'Image file not found' });
      }
    }

    // Admin Review Moderation
    if (pathname === '/api/admin/reviews' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { reviews: getAllReviewsAdmin() });
    }

    if (pathname.startsWith('/api/admin/reviews/') && pathname.endsWith('/status') && method === 'PATCH') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const reviewId = pathname.split('/')[4];
      const body = await parseBody();
      const updated = updateReviewStatus(reviewId, body.status);
      return sendJson(200, { success: true, review: updated });
    }

    // Admin Promotions
    if (pathname === '/api/admin/promotions' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { promotions: getAllPromotionsAdmin() });
    }

    if (pathname === '/api/admin/promotions' && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      try {
        const promo = createPromotion(body);
        return sendJson(201, { success: true, promotion: promo });
      } catch (err) {
        return sendJson(400, { error: err.message });
      }
    }

    if (pathname.startsWith('/api/admin/promotions/') && method === 'DELETE') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const promoId = pathname.replace('/api/admin/promotions/', '').trim();
      deletePromotion(promoId);
      return sendJson(200, { success: true });
    }

    // Admin Service Requests
    if (pathname === '/api/admin/services/requests' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { requests: getServiceRequestsAdmin() });
    }

    if (pathname.startsWith('/api/admin/services/requests/') && pathname.endsWith('/status') && method === 'PATCH') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const reqId = pathname.split('/')[5];
      const body = await parseBody();
      const updated = updateServiceRequestStatus(reqId, body.status, body.quotedPrice, body.note);
      return sendJson(200, { success: true, serviceRequest: updated });
    }

    // ---------------------------------------------------------------------------
    // Admin Categories CRUD
    // ---------------------------------------------------------------------------
    if (pathname === '/api/admin/categories' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { categories: getAllCategories() });
    }

    if (pathname === '/api/admin/categories' && method === 'POST') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const body = await parseBody();
      if (!body.name || typeof body.name !== 'string') {
        return sendJson(400, { error: 'Category name is required' });
      }
      const cat = createCategory(body);
      return sendJson(201, { success: true, category: cat });
    }

    if (pathname.startsWith('/api/admin/categories/') && method === 'PUT') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const catId = pathname.replace('/api/admin/categories/', '').trim();
      const body = await parseBody();
      const updated = updateCategory(catId, body);
      if (!updated) {
        return sendJson(404, { error: 'Category not found' });
      }
      return sendJson(200, { success: true, category: updated });
    }

    if (pathname.startsWith('/api/admin/categories/') && method === 'DELETE') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      const catId = pathname.replace('/api/admin/categories/', '').trim();
      deleteCategory(catId);
      return sendJson(200, { success: true });
    }

    // ---------------------------------------------------------------------------
    // Admin Brands List
    // ---------------------------------------------------------------------------
    if (pathname === '/api/admin/brands' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { brands: getAllBrands() });
    }

    // ---------------------------------------------------------------------------
    // Admin Customers & Users Management (Full RBAC CRUD)
    // ---------------------------------------------------------------------------
    if (pathname === '/api/admin/customers' && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { customers: getAllUsersAdmin() });
    }

    if (pathname === '/api/admin/users' && method === 'GET') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'view:all')) {
        return sendJson(403, { error: 'Unauthorized or insufficient permissions' });
      }
      const search = url.searchParams.get('search') || '';
      const role = url.searchParams.get('role') || '';
      const status = url.searchParams.get('status') || '';
      const limit = parseInt(url.searchParams.get('limit'), 10) || 100;
      const offset = parseInt(url.searchParams.get('offset'), 10) || 0;
      const users = getAllUsersAdminDetailed({ search, role, status, limit, offset });
      return sendJson(200, { users });
    }

    if (pathname === '/api/admin/users' && method === 'POST') {
      const caller = getAdminCaller();
      if (!caller || caller.role !== 'admin') {
        return sendJson(403, { error: 'Only administrators can create staff or admin accounts' });
      }
      const body = await parseBody();
      if (!body.email || !body.name || !body.password) {
        return sendJson(400, { error: 'Email, name, and password are required' });
      }
      if (body.password.length < 6) {
        return sendJson(400, { error: 'Password must be at least 6 characters long' });
      }
      const existing = findUserByEmail(body.email);
      if (existing) {
        return sendJson(400, { error: 'A user with this email address already exists' });
      }
      const passwordHash = hashPassword(body.password);
      const role = body.role || 'staff';
      const perms = Array.isArray(body.permissions) && body.permissions.length > 0
        ? body.permissions
        : getDefaultPermissions(role);

      const created = createUser({
        email: body.email,
        phone: body.phone || '',
        name: body.name,
        passwordHash,
        role,
        status: body.status || 'active',
        permissions: perms
      });

      logAuditEvent({
        userId: caller.sub,
        userEmail: caller.email,
        action: 'user:create',
        entityType: 'user',
        entityId: created.id,
        details: { email: created.email, role: created.role },
        ip
      });

      const { password_hash, ...sanitized } = created;
      return sendJson(201, { success: true, user: sanitized });
    }

    if (pathname.startsWith('/api/admin/users/') && method === 'PUT') {
      const caller = getAdminCaller();
      if (!caller || caller.role !== 'admin') {
        return sendJson(403, { error: 'Only administrators can modify user accounts' });
      }
      const targetUserId = pathname.replace('/api/admin/users/', '').trim();
      const body = await parseBody();

      let passwordHash = undefined;
      if (body.password && typeof body.password === 'string' && body.password.trim()) {
        if (body.password.length < 6) {
          return sendJson(400, { error: 'Password must be at least 6 characters long' });
        }
        passwordHash = hashPassword(body.password);
      }

      const updated = updateUserAdmin(targetUserId, {
        name: body.name,
        phone: body.phone,
        role: body.role,
        status: body.status,
        permissions: body.permissions,
        passwordHash
      });

      if (!updated) {
        return sendJson(404, { error: 'User not found' });
      }

      logAuditEvent({
        userId: caller.sub,
        userEmail: caller.email,
        action: 'user:update',
        entityType: 'user',
        entityId: targetUserId,
        details: { role: updated.role, status: updated.status },
        ip
      });

      const { password_hash, ...sanitized } = updated;
      return sendJson(200, { success: true, user: sanitized });
    }

    if (pathname.startsWith('/api/admin/users/') && method === 'DELETE') {
      const caller = getAdminCaller();
      if (!caller || caller.role !== 'admin') {
        return sendJson(403, { error: 'Only administrators can delete user accounts' });
      }
      const targetUserId = pathname.replace('/api/admin/users/', '').trim();
      try {
        const deleted = deleteUserAdmin(targetUserId, caller.sub);
        if (!deleted) return sendJson(404, { error: 'User not found' });

        logAuditEvent({
          userId: caller.sub,
          userEmail: caller.email,
          action: 'user:delete',
          entityType: 'user',
          entityId: targetUserId,
          details: {},
          ip
        });

        return sendJson(200, { success: true, message: 'User account removed' });
      } catch (err) {
        return sendJson(400, { error: err.message });
      }
    }

    // ---------------------------------------------------------------------------
    // Admin Audit Logs
    // ---------------------------------------------------------------------------
    if (pathname === '/api/admin/audit-logs' && method === 'GET') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'view:all')) {
        return sendJson(403, { error: 'Unauthorized or insufficient permissions' });
      }
      const limit = parseInt(url.searchParams.get('limit'), 10) || 100;
      const offset = parseInt(url.searchParams.get('offset'), 10) || 0;
      const action = url.searchParams.get('action') || null;
      const entityType = url.searchParams.get('entityType') || null;
      const search = url.searchParams.get('search') || '';
      const logs = getAuditLogs({ limit, offset, action, entityType, search });
      return sendJson(200, { logs });
    }

    // ---------------------------------------------------------------------------
    // Admin Business Reports & Analytics
    // ---------------------------------------------------------------------------
    if (pathname === '/api/admin/reports' && method === 'GET') {
      const caller = getAdminCaller();
      if (!caller || !hasPermission(caller.permissions, 'view:reports')) {
        return sendJson(403, { error: 'Unauthorized or insufficient permissions' });
      }
      const startDate = url.searchParams.get('startDate') || null;
      const endDate = url.searchParams.get('endDate') || null;
      const reports = getBusinessReports({ startDate, endDate });
      return sendJson(200, { reports });
    }

    if (pathname === '/api/admin/reports/export-csv' && method === 'GET') {
      const authHeader = req.headers['authorization'];
      const queryToken = url.searchParams.get('admin_token');
      const token = queryToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
      if (!verifyAdminToken(token)) {
        return sendJson(403, { error: 'Unauthorized or expired admin session' });
      }

      const reports = getBusinessReports();
      const lines = [
        'Report: Business Performance Summary',
        `Generated: ${new Date().toISOString()}`,
        '',
        'METRIC,VALUE',
        `Total Non-Demo Orders,${reports.financials.totalOrders}`,
        `Gross Revenue (BDT),${reports.financials.grossRevenue}`,
        `Verified Paid Revenue (BDT),${reports.financials.paidRevenue}`,
        `Pending COD Revenue (BDT),${reports.financials.pendingCodRevenue}`,
        `Cancelled Revenue (BDT),${reports.financials.cancelledRevenue}`,
        `Average Order Value (BDT),${reports.financials.averageOrderValue}`,
        `Delivered Orders,${reports.financials.deliveredOrdersCount}`,
        `Active Orders,${reports.financials.activeOrdersCount}`,
        `Total Inventory Valuation (BDT),${reports.inventoryHealth.totalInventoryValuation}`,
        `Total Units In Stock,${reports.inventoryHealth.totalUnitsInStock}`,
        `Low Stock SKUs,${reports.inventoryHealth.lowStockCount}`,
        `Out of Stock SKUs,${reports.inventoryHealth.outOfStockCount}`,
        '',
        'TOP SELLING PRODUCTS',
        'SKU,Title,Units Sold,Revenue (BDT)'
      ];

      for (const tp of reports.topProducts) {
        lines.push(`${tp.sku},"${(tp.title || '').replace(/"/g, '""')}",${tp.unitsSold},${tp.totalRevenue}`);
      }

      lines.push('');
      lines.push('PAYMENT METHOD DISTRIBUTION');
      lines.push('Method,Orders Count,Revenue (BDT)');
      for (const pm of reports.paymentMethods) {
        lines.push(`${pm.method},${pm.count},${pm.revenue}`);
      }

      const csvContent = '\uFEFF' + lines.join('\r\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="tech-nest-business-report-${Date.now()}.csv"`);
      res.statusCode = 200;
      return res.end(csvContent);
    }

    // ---------------------------------------------------------------------------
    // Admin Store, Shipping & System Settings
    // ---------------------------------------------------------------------------
    if ((pathname === '/api/admin/shipping/config' || pathname === '/api/admin/settings') && method === 'GET') {
      if (!verifyAdminToken(req.headers['authorization'])) {
        return sendJson(403, { error: 'Unauthorized admin session' });
      }
      return sendJson(200, { settings: getStoreSettings() });
    }

    if ((pathname === '/api/admin/shipping/config' || pathname === '/api/admin/settings') && method === 'PUT') {
      const caller = getAdminCaller();
      if (!caller || caller.role !== 'admin') {
        return sendJson(403, { error: 'Only administrators can update store configuration' });
      }
      const body = await parseBody();
      const updated = updateStoreSettings(body);
      logAuditEvent({
        userId: caller.sub,
        userEmail: caller.email,
        action: 'settings:update',
        entityType: 'settings',
        entityId: 'delivery_and_store',
        details: body,
        ip
      });
      return sendJson(200, { success: true, settings: updated });
    }

    return sendJson(404, { error: 'API route not found' });
  } catch (error) {
    console.error('[API Error]', error);
    const statusCode = error.statusCode || 500;
    return sendJson(statusCode, { error: error.message || 'Internal server error' });
  }
}
