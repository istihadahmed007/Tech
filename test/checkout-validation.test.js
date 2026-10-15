import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';

function validateCheckoutCustomer(customer) {
  if (!customer || typeof customer !== 'object') {
    return { valid: false, error: 'Customer information required' };
  }

  if (!customer.name || !customer.name.trim()) {
    return { valid: false, error: 'Full customer name is required' };
  }

  const cleanPhone = (customer.phone || '').replace(/[\s-]/g, '');
  if (!cleanPhone.match(/^(?:\+88|88)?01[3-9]\d{8}$/)) {
    return { valid: false, error: 'Valid Bangladeshi phone number required (e.g. 01712345678)' };
  }

  if (!customer.address || !customer.address.trim()) {
    return { valid: false, error: 'Delivery address is required' };
  }

  return { valid: true, cleanPhone };
}

function validateOrderItems(items, catalog = INITIAL_PRODUCTS, inventoryDeltas = {}) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { valid: false, error: 'Order must contain at least one item' };
  }

  let subtotal = 0;
  const validated = [];

  for (const item of items) {
    const product = catalog.find(p => p.id === item.id);
    if (!product) {
      return { valid: false, error: `Unrecognized product SKU: ${item.id}` };
    }

    const qty = parseInt(item.quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return { valid: false, error: `Invalid quantity for ${product.title}` };
    }

    const currentDelta = inventoryDeltas[product.id] || 0;
    const availableStock = product.stock - currentDelta;
    if (availableStock < qty) {
      return { 
        valid: false, 
        error: `Insufficient stock for ${product.title}. Available: ${Math.max(0, availableStock)}` 
      };
    }

    subtotal += product.price * qty;
    validated.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: qty
    });
  }

  return { valid: true, subtotal, validated };
}

test('Phone validation: accepts valid Bangladesh mobile numbers in diverse formats', () => {
  const validNumbers = [
    '01712345678',
    '01812345678',
    '01912345678',
    '01312345678',
    '01412345678',
    '01512345678',
    '01612345678',
    '+8801712345678',
    '8801712345678',
    '017 1234 5678',
    '017-1234-5678'
  ];

  for (const phone of validNumbers) {
    const res = validateCheckoutCustomer({
      name: 'Rahim Khan',
      phone,
      address: 'House 12, Road 4, Banani'
    });
    assert.equal(res.valid, true, `Expected ${phone} to be valid`);
  }
});

test('Phone validation: rejects invalid numbers', () => {
  const invalidNumbers = [
    '',
    '01212345678', // Invalid operator code (012)
    '0171234567',  // Too short (10 digits)
    '017123456789',// Too long (12 digits)
    'abcdefghijk',
    '12345678901',
    '+12025550199'
  ];

  for (const phone of invalidNumbers) {
    const res = validateCheckoutCustomer({
      name: 'Rahim Khan',
      phone,
      address: 'House 12, Road 4, Banani'
    });
    assert.equal(res.valid, false, `Expected ${phone} to be invalid`);
  }
});

test('Customer validation: rejects missing name or address', () => {
  const noName = validateCheckoutCustomer({
    name: '   ',
    phone: '01712345678',
    address: 'Dhanmondi, Dhaka'
  });
  assert.equal(noName.valid, false);
  assert.match(noName.error, /name is required/i);

  const noAddress = validateCheckoutCustomer({
    name: 'Karim',
    phone: '01712345678',
    address: ''
  });
  assert.equal(noAddress.valid, false);
  assert.match(noAddress.error, /address is required/i);
});

test('Items validation: validates SKUs against catalog and computes canonical subtotal', () => {
  const result = validateOrderItems([
    { id: 'h2-anc-pro-tws', quantity: 2 },
    { id: 'p04-ultrapods-pro-tws', quantity: 1 }
  ]);

  assert.equal(result.valid, true);
  assert.equal(result.validated.length, 2);
  assert.equal(result.subtotal, (1190 * 2) + 350);
});

test('Items validation: rejects invalid or out-of-stock items', () => {
  const invalidSku = validateOrderItems([
    { id: 'non-existent-product-sku', quantity: 1 }
  ]);
  assert.equal(invalidSku.valid, false);
  assert.match(invalidSku.error, /Unrecognized product SKU/i);

  // Insufficient stock test
  const exceedStock = validateOrderItems(
    [{ id: 'h2-anc-pro-tws', quantity: 9999 }]
  );
  assert.equal(exceedStock.valid, false);
  assert.match(exceedStock.error, /Insufficient stock/i);
});
