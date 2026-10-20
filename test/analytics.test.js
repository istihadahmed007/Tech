import test from 'node:test';
import assert from 'node:assert/strict';

import {
  initUmami,
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackCheckoutStarted,
  trackPurchaseCompleted,
  sanitizeAnalyticsPayload,
  isPurchaseAlreadyTracked,
  markPurchaseAsTracked,
  resetTrackedPurchases
} from '../src/utils/analytics.js';

// Setup Mock Window and Document for Browser Simulation in Node
function setupMockBrowser() {
  const scripts = [];
  const eventsTracked = [];
  const sessionStorageStore = new Map();

  global.window = {
    sessionStorage: {
      getItem(k) { return sessionStorageStore.get(k) || null; },
      setItem(k, v) { sessionStorageStore.set(k, String(v)); },
      removeItem(k) { sessionStorageStore.delete(k); },
      clear() { sessionStorageStore.clear(); },
      get length() { return sessionStorageStore.size; },
      key(i) { return Array.from(sessionStorageStore.keys())[i] || null; }
    },
    umami: {
      track(eventName, data) {
        eventsTracked.push({ eventName, data });
      }
    }
  };

  global.document = {
    head: {
      appendChild(node) {
        scripts.push(node);
      }
    },
    querySelector(selector) {
      return scripts.find(s => {
        if (selector.includes('data-website-id')) {
          const match = selector.match(/data-website-id="([^"]+)"/);
          return match && s.attributes['data-website-id'] === match[1];
        }
        return false;
      }) || null;
    },
    createElement(tag) {
      const attrs = {};
      return {
        tagName: tag.toUpperCase(),
        attributes: attrs,
        setAttribute(k, v) { attrs[k] = String(v); },
        getAttribute(k) { return attrs[k]; },
        set src(v) { attrs.src = v; },
        get src() { return attrs.src; },
        set defer(v) { attrs.defer = v; },
        get defer() { return attrs.defer; }
      };
    }
  };

  return { scripts, eventsTracked, sessionStorageStore };
}

function teardownMockBrowser() {
  delete global.window;
  delete global.document;
  resetTrackedPurchases();
}

test('Analytics: remains harmless and disabled when unconfigured', () => {
  const { scripts } = setupMockBrowser();
  try {
    const res = initUmami({ scriptUrl: '', websiteId: '' });
    assert.equal(res.enabled, false);
    assert.equal(res.reason, 'unconfigured');
    assert.equal(scripts.length, 0, 'No script should be injected if unconfigured');
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: injects script tag correctly when configuration is provided', () => {
  const { scripts } = setupMockBrowser();
  try {
    const res = initUmami({
      scriptUrl: 'https://cloud.umami.is/script.js',
      websiteId: 'test-website-uuid-1234',
      domains: 'technest.com.bd'
    });

    assert.equal(res.enabled, true);
    assert.equal(res.status, 'script_injected');
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].src, 'https://cloud.umami.is/script.js');
    assert.equal(scripts[0].attributes['data-website-id'], 'test-website-uuid-1234');
    assert.equal(scripts[0].attributes['data-domains'], 'technest.com.bd');

    // Idempotent secondary call should not duplicate script tag
    const secondCall = initUmami({
      scriptUrl: 'https://cloud.umami.is/script.js',
      websiteId: 'test-website-uuid-1234'
    });
    assert.equal(secondCall.status, 'already_loaded');
    assert.equal(scripts.length, 1);
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: sanitizeAnalyticsPayload strictly removes all customer PII and credential keys', () => {
  const dirtyData = {
    productId: 'P01',
    price: 3200,
    currency: 'BDT',
    // Forbidden PII fields
    name: 'Tamim Iqbal',
    customer: 'Tamim',
    customerName: 'Tamim Iqbal',
    phone: '01711223344',
    phoneNumber: '01711223344',
    email: 'customer@example.com',
    address: 'House 12, Road 5, Banani, Dhaka',
    deliveryAddress: 'Banani',
    street: 'Road 5',
    guestToken: 'gt_secret_token_123',
    token: 'jwt_or_bearer_token',
    password: 'secret_password_here',
    secret: 'api_secret_key',
    card: 'visa',
    cardNumber: '424242424242',
    cvv: '123',
    sessionId: 'sess_12345',
    val_id: 'val_abcde',
    instructions: 'Ring doorbell twice',
    notes: 'Fragile delivery parcel'
  };

  const clean = sanitizeAnalyticsPayload(dirtyData);

  assert.equal(clean.productId, 'P01');
  assert.equal(clean.price, 3200);
  assert.equal(clean.currency, 'BDT');

  // Verify none of the PII fields survived
  assert.equal(clean.name, undefined);
  assert.equal(clean.customer, undefined);
  assert.equal(clean.phone, undefined);
  assert.equal(clean.email, undefined);
  assert.equal(clean.address, undefined);
  assert.equal(clean.guestToken, undefined);
  assert.equal(clean.token, undefined);
  assert.equal(clean.password, undefined);
  assert.equal(clean.cardNumber, undefined);
  assert.equal(clean.cvv, undefined);
  assert.equal(clean.instructions, undefined);
  assert.equal(clean.notes, undefined);
});

test('Analytics: trackProductView emits clean, privacy-conscious event', () => {
  const { eventsTracked } = setupMockBrowser();
  try {
    const product = {
      id: 'prod-watch-01',
      sku: 'SKU-WATCH-01',
      category: 'wearables',
      price: 4500,
      title: 'Tech Vartual Tutor Smartwatch Ultra'
    };

    const res = trackProductView(product);
    assert.equal(res, true);
    assert.equal(eventsTracked.length, 1);
    assert.equal(eventsTracked[0].eventName, 'product_viewed');
    assert.deepEqual(eventsTracked[0].data, {
      productId: 'prod-watch-01',
      sku: 'SKU-WATCH-01',
      category: 'wearables',
      price: 4500,
      currency: 'BDT'
    });
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: trackAddToCart emits event with product and quantity', () => {
  const { eventsTracked } = setupMockBrowser();
  try {
    const product = {
      id: 'prod-cable-01',
      sku: 'SKU-CABLE-01',
      category: 'charging',
      price: 650
    };

    const res = trackAddToCart(product, 2, { id: 'finish-black', name: 'Braided Black' });
    assert.equal(res, true);
    assert.equal(eventsTracked.length, 1);
    assert.equal(eventsTracked[0].eventName, 'add_to_cart');
    assert.deepEqual(eventsTracked[0].data, {
      productId: 'prod-cable-01',
      sku: 'SKU-CABLE-01',
      category: 'charging',
      price: 650,
      quantity: 2,
      variantId: 'finish-black',
      currency: 'BDT'
    });
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: trackCheckoutStarted emits subtotal and itemsCount without PII', () => {
  const { eventsTracked } = setupMockBrowser();
  try {
    const cart = [
      { id: 'item1', price: 1200, quantity: 1 },
      { id: 'item2', price: 800, quantity: 2 }
    ];

    const res = trackCheckoutStarted(cart);
    assert.equal(res, true);
    assert.equal(eventsTracked.length, 1);
    assert.equal(eventsTracked[0].eventName, 'checkout_started');
    assert.deepEqual(eventsTracked[0].data, {
      itemsCount: 2,
      totalQuantity: 3,
      subtotal: 2800,
      currency: 'BDT'
    });
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: trackPurchaseCompleted sends minimal revenue metadata and strictly avoids customer details', () => {
  const { eventsTracked } = setupMockBrowser();
  try {
    resetTrackedPurchases();

    const orderWithPii = {
      id: 'ORD-TEST-999',
      total: 3500,
      paymentMethod: 'online',
      items: [{ id: 'item1', quantity: 1 }, { id: 'item2', quantity: 1 }],
      // Customer details that must NEVER be leaked
      customer: {
        name: 'Sakib Al Hasan',
        phone: '01811223344',
        address: 'Mirpur DOHS, Dhaka',
        notes: 'Call before delivery'
      },
      guestToken: 'gt_secret_777',
      deliveryAddress: { address: 'Mirpur DOHS' }
    };

    const res = trackPurchaseCompleted(orderWithPii);
    assert.equal(res, true);
    assert.equal(eventsTracked.length, 1);
    assert.equal(eventsTracked[0].eventName, 'purchase_completed');

    // Revenue tracking properties for Umami's native Revenue Report
    assert.deepEqual(eventsTracked[0].data, {
      orderId: 'ORD-TEST-999',
      revenue: 3500,
      currency: 'BDT',
      paymentMethod: 'online',
      itemsCount: 2
    });

    // Explicit confirmation that no customer details or tokens are present
    assert.equal(eventsTracked[0].data.customer, undefined);
    assert.equal(eventsTracked[0].data.name, undefined);
    assert.equal(eventsTracked[0].data.phone, undefined);
    assert.equal(eventsTracked[0].data.address, undefined);
    assert.equal(eventsTracked[0].data.guestToken, undefined);
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: Duplicate Purchase Prevention blocks repeat tracking on refresh or gateway returns', () => {
  const { eventsTracked } = setupMockBrowser();
  try {
    resetTrackedPurchases();

    const order = {
      id: 'ORD-DEDUP-888',
      total: 2200,
      paymentMethod: 'cod',
      items: [{ id: 'p1', quantity: 1 }]
    };

    // 1. Initial purchase tracking succeeds
    const firstCall = trackPurchaseCompleted(order);
    assert.equal(firstCall, true, 'First purchase event must succeed');
    assert.equal(eventsTracked.length, 1);

    // 2. User refreshes confirmation page or re-mounts modal
    const refreshCall = trackPurchaseCompleted(order);
    assert.equal(refreshCall, false, 'Duplicate purchase on page refresh must be rejected');
    assert.equal(eventsTracked.length, 1, 'Event count must remain 1');

    // 3. User returns from payment gateway for the same order
    const gatewayReturnCall = trackPurchaseCompleted(order);
    assert.equal(gatewayReturnCall, false, 'Duplicate purchase on gateway return must be rejected');
    assert.equal(eventsTracked.length, 1, 'Event count must still remain 1');

    // 4. A distinct new order is allowed
    const newOrder = {
      id: 'ORD-DEDUP-889',
      total: 4100,
      paymentMethod: 'online',
      items: [{ id: 'p2', quantity: 2 }]
    };
    const newOrderCall = trackPurchaseCompleted(newOrder);
    assert.equal(newOrderCall, true, 'New distinct order must be tracked');
    assert.equal(eventsTracked.length, 2);
  } finally {
    teardownMockBrowser();
  }
});

test('Analytics: gracefully no-ops without throwing when window.umami is undefined or offline', () => {
  setupMockBrowser();
  try {
    // Simulate window.umami being absent (e.g. adblocker or tracker unconfigured)
    delete global.window.umami;

    assert.doesNotThrow(() => {
      const res1 = trackProductView({ id: 'P01', price: 1000 });
      assert.equal(res1, false);

      const res2 = trackAddToCart({ id: 'P01', price: 1000 });
      assert.equal(res2, false);

      const res3 = trackCheckoutStarted([{ id: 'P01', price: 1000 }]);
      assert.equal(res3, false);

      const res4 = trackPurchaseCompleted({ id: 'ORD-OFFLINE', total: 1000 });
      assert.equal(res4, false);
    });
  } finally {
    teardownMockBrowser();
  }
});
