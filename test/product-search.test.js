import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';

function filterProducts(products, { category = null, phone = null, query = '', inStockOnly = false } = {}) {
  const cleanQuery = query.toLowerCase().trim();

  return products.filter((item) => {
    if (category && item.category !== category) {
      return false;
    }
    if (phone && !item.compatibleWith?.includes(phone)) {
      return false;
    }
    if (cleanQuery) {
      const matchTitle = item.title?.toLowerCase().includes(cleanQuery) || 
                         (item.titleBn && item.titleBn.toLowerCase().includes(cleanQuery));
      const matchCategory = item.category?.toLowerCase().includes(cleanQuery);
      const matchDesc = item.description?.toLowerCase().includes(cleanQuery) ||
                        (item.descriptionBn && item.descriptionBn.toLowerCase().includes(cleanQuery));
      const matchRef = item.photoRef && item.photoRef.toLowerCase().includes(cleanQuery);
      const matchCompatibility = item.compatibleWith?.some(c => c.toLowerCase().includes(cleanQuery));
      if (!matchTitle && !matchCategory && !matchDesc && !matchRef && !matchCompatibility) {
        return false;
      }
    }
    if (inStockOnly && item.stock <= 0) {
      return false;
    }
    return true;
  });
}

test('Product Search: searches by English title', () => {
  const results = filterProducts(INITIAL_PRODUCTS, { query: 'Ultrapods Pro' });
  assert.ok(results.length > 0);
  assert.ok(results.every(p => p.title.includes('Ultrapods Pro')));
});

test('Product Search: searches by Bengali title', () => {
  const results = filterProducts(INITIAL_PRODUCTS, { query: 'আল্ট্রাপডস' });
  assert.ok(results.length > 0);
  assert.ok(results.every(p => p.titleBn?.includes('আল্ট্রাপডস')));
});

test('Product Search: searches by photo reference ID (P01, P04, P11)', () => {
  const p01 = filterProducts(INITIAL_PRODUCTS, { query: 'P01' });
  assert.ok(p01.length > 0);
  assert.ok(p01.some(p => p.photoRef === 'P01'));

  const p04 = filterProducts(INITIAL_PRODUCTS, { query: 'P04' });
  assert.ok(p04.length > 0);
  assert.ok(p04.some(p => p.photoRef === 'P04'));
});

test('Product Search: searches by device compatibility', () => {
  const results = filterProducts(INITIAL_PRODUCTS, { query: 'Galaxy S24 Ultra' });
  assert.ok(results.length > 0);
  assert.ok(results.every(p => p.compatibleWith?.some(c => c.includes('Galaxy S24 Ultra'))));
});

test('Product Filtering: filters by category ID', () => {
  const charging = filterProducts(INITIAL_PRODUCTS, { category: 'charging' });
  assert.ok(charging.length > 0);
  assert.ok(charging.every(p => p.category === 'charging'));

  const audio = filterProducts(INITIAL_PRODUCTS, { category: 'audio' });
  assert.ok(audio.length > 0);
  assert.ok(audio.every(p => p.category === 'audio'));
});

test('Product Filtering: filters by exact phone model', () => {
  const iphone15Pro = filterProducts(INITIAL_PRODUCTS, { phone: 'iPhone 15 Pro' });
  assert.ok(iphone15Pro.length > 0);
  assert.ok(iphone15Pro.every(p => p.compatibleWith?.includes('iPhone 15 Pro')));
});

test('Product Filtering: in-stock only filter excludes sold-out items', () => {
  const mockCatalog = [
    { id: 'item-1', category: 'cases', stock: 5 },
    { id: 'item-2', category: 'cases', stock: 0 }
  ];

  const inStockResults = filterProducts(mockCatalog, { inStockOnly: true });
  assert.equal(inStockResults.length, 1);
  assert.equal(inStockResults[0].id, 'item-1');
});
