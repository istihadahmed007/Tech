import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS, FEATURED_BUNDLES } from '../src/data/catalog.js';

test('Catalog Bundles: all bundled SKUs exist in catalog and have stock', () => {
  assert.ok(FEATURED_BUNDLES.length > 0, 'Featured bundles must not be empty');

  for (const bundle of FEATURED_BUNDLES) {
    assert.ok(bundle.itemIds.length > 0, `Bundle ${bundle.id} must have itemIds`);
    
    // Check that bundle total is at or above free delivery threshold
    assert.ok(bundle.price >= 2000, `Bundle ${bundle.id} price (${bundle.price}) must qualify for free shipping (>= 2000)`);
    assert.ok(bundle.savings > 0, `Bundle ${bundle.id} must offer positive savings`);

    for (const itemId of bundle.itemIds) {
      const product = INITIAL_PRODUCTS.find(p => p.id === itemId);
      assert.ok(product, `Bundle item SKU ${itemId} must exist in INITIAL_PRODUCTS`);
      assert.ok(product.stock > 0, `Bundle item ${itemId} must have positive inventory stock`);
    }
  }
});

test('Catalog Inventory: includes real-world inventory products (Smartwatches, Cables, ANC Earbuds)', () => {
  const smartwatch = INITIAL_PRODUCTS.find(p => p.id === 'y80-ultra-smartwatch');
  assert.ok(smartwatch, 'Y80 Ultra smartwatch must exist in catalog');
  assert.equal(smartwatch.category, 'wearables');
  assert.equal(smartwatch.price, 890);

  const cable = INITIAL_PRODUCTS.find(p => p.id === 'recrsi-4in1-65w-cable');
  assert.ok(cable, 'RECRSI 4-in-1 65W cable must exist in catalog');
  assert.equal(cable.category, 'charging');
  assert.equal(cable.price, 420);

  const tws = INITIAL_PRODUCTS.find(p => p.id === 'h2-anc-pro-tws');
  assert.ok(tws, 'Pro 2 ANC TWS earbuds must exist in catalog');
  assert.equal(tws.category, 'audio');
  assert.equal(tws.price, 1190);
});
