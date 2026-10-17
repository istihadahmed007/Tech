import fs from 'fs';
import { INITIAL_PRODUCTS, FEATURED_BUNDLES } from '../src/data/catalog.js';

fs.writeFileSync('docs/current_catalog.json', JSON.stringify({
  products: INITIAL_PRODUCTS,
  bundles: FEATURED_BUNDLES
}, null, 2), 'utf-8');

console.log(`Exported ${INITIAL_PRODUCTS.length} products and ${FEATURED_BUNDLES.length} bundles to docs/current_catalog.json`);
