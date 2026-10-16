/**
 * Privacy-Conscious Umami Analytics Client
 * 
 * Complies with Umami v2 / v3 tracking specification.
 * Completely disabled and harmless when environment variables are not configured.
 * Strictly guarantees ZERO customer PII (Personal Identifiable Information) leakage.
 */

// In-memory fallback if sessionStorage is inaccessible (e.g., privacy mode or Node test)
const trackedPurchasesInMemory = new Set();

// Sensitive keys that must NEVER be transmitted to analytics
const FORBIDDEN_PII_KEYS = new Set([
  'name',
  'customer',
  'customername',
  'phone',
  'phonenumber',
  'email',
  'address',
  'deliveryaddress',
  'street',
  'guesttoken',
  'token',
  'password',
  'secret',
  'card',
  'cardnumber',
  'cvv',
  'sessionid',
  'val_id',
  'instructions',
  'notes'
]);

/**
 * Strips any potential PII keys from an event payload
 */
export function sanitizeAnalyticsPayload(data) {
  if (!data || typeof data !== 'object') return {};
  const clean = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (FORBIDDEN_PII_KEYS.has(lowerKey)) {
      continue;
    }
    // Only allow primitive types (string, number, boolean)
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * Checks whether an order purchase has already been tracked to prevent duplicate events
 * across page refreshes, back/forward navigation, or payment gateway redirects.
 */
export function isPurchaseAlreadyTracked(orderId) {
  if (!orderId) return true;
  const key = `umami_tracked_order_${orderId}`;

  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (window.sessionStorage.getItem(key)) {
        return true;
      }
    }
  } catch (e) {
    // sessionStorage error fallback
  }

  return trackedPurchasesInMemory.has(orderId);
}

/**
 * Marks an order purchase as tracked in sessionStorage and memory
 */
export function markPurchaseAsTracked(orderId) {
  if (!orderId) return;
  const key = `umami_tracked_order_${orderId}`;
  
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(key, '1');
    }
  } catch (e) {}

  trackedPurchasesInMemory.add(orderId);
}

/**
 * Resets tracked purchases (primarily for automated testing)
 */
export function resetTrackedPurchases() {
  trackedPurchasesInMemory.clear();
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const keysToRemove = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const k = window.sessionStorage.key(i);
        if (k && k.startsWith('umami_tracked_order_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => window.sessionStorage.removeItem(k));
    }
  } catch (e) {}
}

/**
 * Initializes the Umami tracking script dynamically in the browser head.
 * Safe to call multiple times (idempotent).
 */
export function initUmami(customConfig = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { enabled: false, reason: 'server_environment' };
  }

  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const scriptUrl = customConfig.scriptUrl || env.VITE_UMAMI_SCRIPT_URL || '';
  const websiteId = customConfig.websiteId || env.VITE_UMAMI_WEBSITE_ID || '';
  const domains = customConfig.domains || env.VITE_UMAMI_DOMAINS || '';
  const hostUrl = customConfig.hostUrl || env.VITE_UMAMI_HOST_URL || '';

  // If required configuration is missing, gracefully stay disabled
  if (!scriptUrl || !websiteId) {
    return { enabled: false, reason: 'unconfigured' };
  }

  // Check if script is already present
  const existingScript = document.querySelector(`script[data-website-id="${websiteId}"]`);
  if (existingScript) {
    return { enabled: true, status: 'already_loaded' };
  }

  try {
    const script = document.createElement('script');
    script.defer = true;
    script.src = scriptUrl;
    script.setAttribute('data-website-id', websiteId);

    if (domains) {
      script.setAttribute('data-domains', domains);
    }
    if (hostUrl) {
      script.setAttribute('data-host-url', hostUrl);
    }

    document.head.appendChild(script);
    return { enabled: true, status: 'script_injected' };
  } catch (err) {
    console.warn('[Analytics] Failed to initialize Umami script:', err);
    return { enabled: false, reason: 'injection_error' };
  }
}

/**
 * Core event dispatcher
 */
export function trackEvent(eventName, rawData = {}) {
  if (typeof window === 'undefined') return false;

  const sanitized = sanitizeAnalyticsPayload(rawData);

  // If Umami runtime tracker is available
  if (window.umami && typeof window.umami.track === 'function') {
    try {
      window.umami.track(eventName, sanitized);
      return true;
    } catch (err) {
      console.warn('[Analytics] Error in umami.track:', err);
      return false;
    }
  }

  // Graceful no-op when Umami is not loaded or disabled
  return false;
}

/**
 * Event 1: Product Viewed
 * Only sends product identifier, category, and catalog price
 */
export function trackProductView(product) {
  if (!product || !product.id) return false;

  return trackEvent('product_viewed', {
    productId: String(product.id),
    sku: String(product.sku || product.id),
    category: String(product.category || 'general'),
    price: Number(product.price) || 0,
    currency: 'BDT'
  });
}

/**
 * Event 2: Add to Cart
 * Only sends product identifier, quantity, and variant finish
 */
export function trackAddToCart(product, quantity = 1, variant = null) {
  if (!product || !product.id) return false;

  return trackEvent('add_to_cart', {
    productId: String(product.id),
    sku: String(product.sku || product.id),
    category: String(product.category || 'general'),
    price: Number(product.price) || 0,
    quantity: Math.max(1, Number(quantity) || 1),
    variantId: String(variant?.id || 'default'),
    currency: 'BDT'
  });
}

/**
 * Event 3: Checkout Started
 * Only sends cart totals and item count
 */
export function trackCheckoutStarted(cart = []) {
  const items = Array.isArray(cart) ? cart : [];
  const itemsCount = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);

  return trackEvent('checkout_started', {
    itemsCount,
    totalQuantity,
    subtotal,
    currency: 'BDT'
  });
}

/**
 * Event 4: Purchase Completed
 * 
 * Strict Privacy & Deduplication:
 * - Checks whether this orderId was already tracked (prevents duplicates on refresh / gateway redirects).
 * - Extracts ONLY conversion and revenue metadata: orderId, revenue, currency, paymentMethod, itemsCount.
 * - NEVER sends customer name, phone, email, address, guest token, or payment credentials.
 */
export function trackPurchaseCompleted(order) {
  if (!order || !order.id) return false;

  const orderId = String(order.id);

  // Prevent duplicate tracking
  if (isPurchaseAlreadyTracked(orderId)) {
    return false;
  }

  // Construct minimal, sanitized conversion payload
  const revenue = Number(order.total) || 0;
  const itemsCount = Array.isArray(order.items) ? order.items.length : 0;
  const paymentMethod = String(order.paymentMethod || 'cod');

  const success = trackEvent('purchase_completed', {
    orderId,
    revenue,
    currency: 'BDT',
    paymentMethod,
    itemsCount
  });

  // Mark as tracked regardless of whether tracker is currently live or in test mode
  markPurchaseAsTracked(orderId);

  return success;
}
