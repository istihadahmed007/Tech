import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS, FEATURED_BUNDLES } from '../src/data/catalog.js';

test('Catalog Bundles: all bundled SKUs exist in catalog and have stock', () => {
  assert.ok(FEATURED_BUNDLES.length > 0, 'Featured bundles must not be empty');

  for (const bundle of FEATURED_BUNDLES) {
    assert.ok(bundle.itemIds.length > 0, `Bundle ${bundle.id} must have itemIds`);
    
    // Check that bundle total is at or above free delivery threshold (>= 2000)
    assert.ok(bundle.price >= 2000, `Bundle ${bundle.id} price (${bundle.price}) must qualify for free shipping (>= 2000)`);
    assert.ok(bundle.savings > 0, `Bundle ${bundle.id} must offer positive savings`);

    for (const itemId of bundle.itemIds) {
      const product = INITIAL_PRODUCTS.find(p => p.id === itemId);
      assert.ok(product, `Bundle item SKU ${itemId} must exist in INITIAL_PRODUCTS`);
      assert.ok(product.stock > 0, `Bundle item ${itemId} must have positive inventory stock`);
    }
  }
});

test('Catalog Bundles: authentic pricing, no fake data, and distinct price tiers', () => {
  const prices = FEATURED_BUNDLES.map(b => b.price);
  
  // Verify all bundles have unique, differentiated prices
  const uniquePrices = new Set(prices);
  assert.equal(uniquePrices.size, prices.length, 'Every bundle must have a distinct, differentiated price point');
  
  // Verify span between lowest and highest price tier is substantial (> ৳1,000)
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  assert.ok(maxPrice - minPrice >= 1000, `Price tiers must span multiple customer segments (difference: ৳${maxPrice - minPrice})`);

  for (const bundle of FEATURED_BUNDLES) {
    // Calculate exact sum of product catalog prices
    const catalogItemSum = bundle.itemIds.reduce((sum, id) => {
      const product = INITIAL_PRODUCTS.find(p => p.id === id);
      assert.ok(product, `Item ${id} in bundle ${bundle.id} must exist in catalog`);
      return sum + product.price;
    }, 0);

    // Calculate exact sum of original retail prices
    const catalogOrigSum = bundle.itemIds.reduce((sum, id) => {
      const product = INITIAL_PRODUCTS.find(p => p.id === id);
      return sum + (product.originalPrice || product.price);
    }, 0);

    // Bundle price must match authentic catalog item prices exactly (no fake additions or ghost items)
    assert.equal(bundle.price, catalogItemSum, `Bundle ${bundle.id} price (৳${bundle.price}) must match sum of catalog items (৳${catalogItemSum})`);
    assert.equal(bundle.originalPrice, catalogOrigSum, `Bundle ${bundle.id} originalPrice (৳${bundle.originalPrice}) must match sum of original prices (৳${catalogOrigSum})`);
    assert.equal(bundle.savings, bundle.originalPrice - bundle.price, `Bundle ${bundle.id} savings must be exactly originalPrice - price`);

    // Verify itemsSummary does not contain fake placeholder text
    assert.doesNotMatch(bundle.itemsSummary, /top-up|bonus otg|placeholder/i, `Bundle ${bundle.id} itemsSummary must not contain placeholder text`);
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
