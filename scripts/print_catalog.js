import { INITIAL_PRODUCTS, FEATURED_BUNDLES } from '../src/data/catalog.js';

console.log(`=== CATALOG OVERVIEW (${INITIAL_PRODUCTS.length} Products, ${FEATURED_BUNDLES.length} Bundles) ===`);
INITIAL_PRODUCTS.forEach((p, i) => {
  console.log(`${(i + 1).toString().padStart(2, ' ')}. [${p.photoRef || 'N/A'}] ${p.id}`);
  console.log(`    Title: ${p.title}`);
  console.log(`    Brand: ${p.brand} | Model: ${p.model} | Category: ${p.category}`);
  console.log(`    Price: ৳${p.price} (Orig: ৳${p.originalPrice}) | Stock: ${p.stock}`);
  console.log(`    Main:  ${p.image}`);
  console.log(`    Gallery (${p.gallery ? p.gallery.length : 0}): ${p.gallery ? p.gallery.join(', ') : 'none'}`);
  console.log('---');
});
