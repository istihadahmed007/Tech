import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateOrderTotals } from '../src/utils/pricing.js';

test('Cart totals: calculates subtotal accurately', () => {
  const items = [
    { id: 'frost-case', price: 1850, quantity: 2 },
    { id: 'mag-wallet', price: 1450, quantity: 1 }
  ];

  const result = calculateOrderTotals(items, { division: 'Dhaka', outsideCity: false });
  assert.equal(result.subtotal, 5150);
});

test('Cart delivery: grants free delivery for orders ৳2,000 or above', () => {
  const items = [
    { id: 'frost-case', price: 2000, quantity: 1 }
  ];

  const dhakaResult = calculateOrderTotals(items, { division: 'Dhaka', outsideCity: false });
  assert.equal(dhakaResult.isFreeDelivery, true);
  assert.equal(dhakaResult.deliveryFee, 0);
  assert.equal(dhakaResult.total, 2000);

  const outsideResult = calculateOrderTotals(items, { division: 'Chittagong', outsideCity: false });
  assert.equal(outsideResult.isFreeDelivery, true);
  assert.equal(outsideResult.deliveryFee, 0);
  assert.equal(outsideResult.total, 2000);
});

test('Cart delivery: applies ৳60 fee inside Dhaka for orders under ৳2,000', () => {
  const items = [
    { id: 'cable', price: 1250, quantity: 1 }
  ];

  const result = calculateOrderTotals(items, { division: 'Dhaka', outsideCity: false });
  assert.equal(result.isFreeDelivery, false);
  assert.equal(result.deliveryFee, 60);
  assert.equal(result.total, 1310);
});

test('Cart delivery: applies ৳120 fee outside Dhaka for orders under ৳2,000', () => {
  const items = [
    { id: 'cable', price: 1250, quantity: 1 }
  ];

  const resultOutside = calculateOrderTotals(items, { division: 'Sylhet', outsideCity: false });
  assert.equal(resultOutside.isFreeDelivery, false);
  assert.equal(resultOutside.deliveryFee, 120);
  assert.equal(resultOutside.total, 1370);

  const resultDhakaSuburbs = calculateOrderTotals(items, { division: 'Dhaka', outsideCity: true });
  assert.equal(resultDhakaSuburbs.deliveryFee, 120);
});

test('Cart boundaries: quantity limits and validation', () => {
  const sanitizeQuantity = (qty, stock) => {
    const parsed = parseInt(qty, 10);
    if (isNaN(parsed) || parsed < 1) return 1;
    if (parsed > stock) return stock;
    return parsed;
  };

  assert.equal(sanitizeQuantity(0, 10), 1);
  assert.equal(sanitizeQuantity(-5, 10), 1);
  assert.equal(sanitizeQuantity('invalid', 10), 1);
  assert.equal(sanitizeQuantity(5, 10), 5);
  assert.equal(sanitizeQuantity(15, 10), 10);
});

test('Amazon Cart Selection: computes subtotal and items count only for active selected items', () => {
  const cart = [
    { id: 'item-1', price: 1500, quantity: 1, variant: { id: 'v1' } },
    { id: 'item-2', price: 800, quantity: 2, variant: { id: 'v2' } },
    { id: 'item-3', price: 2200, quantity: 1, variant: { id: 'default' } }
  ];

  const selectedKeys = new Set(['item-1_v1', 'item-3_default']); // item-2 is deselected
  const getItemKey = (item) => `${item.id}_${item.variant?.id || 'default'}`;
  const selectedCart = cart.filter(item => selectedKeys.has(getItemKey(item)));

  const result = calculateOrderTotals(selectedCart, { division: 'Dhaka', outsideCity: false });
  // item-1 (1500) + item-3 (2200) = 3700. item-2 (1600) is excluded.
  assert.equal(result.subtotal, 3700);
  assert.equal(result.isFreeDelivery, true);
  assert.equal(selectedCart.reduce((sum, i) => sum + i.quantity, 0), 2);
});

test('Amazon Free Delivery Progress: accurately calculates remaining amount to ৳2,000 threshold', () => {
  const cartUnder = [{ id: 'cable', price: 1450, quantity: 1 }];
  const result = calculateOrderTotals(cartUnder);
  assert.equal(result.subtotal, 1450);
  assert.equal(result.isFreeDelivery, false);
  assert.equal(result.remainingForFreeShipping, 550);
  assert.equal(Math.round(result.progressPercent), 73);
});
