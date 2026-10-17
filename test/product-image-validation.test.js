import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';
import { getProducts, getProductById, updateProduct, createProduct } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.resolve(projectRoot, 'public');
const productsDir = path.resolve(publicDir, 'assets/products');

test('Product Catalog Validation: All published products have valid brand, model and main image', () => {
  assert.ok(INITIAL_PRODUCTS.length >= 26, `Catalog should have at least 26 product items, found ${INITIAL_PRODUCTS.length}`);

  for (const product of INITIAL_PRODUCTS) {
    // 1. Valid brand (Never generic Glacial)
    assert.ok(product.brand, `Product ${product.id} must have an explicit brand`);
    assert.notEqual(product.brand.toLowerCase(), 'glacial', `Product ${product.id} cannot have 'Glacial' as brand`);

    // 2. Main image exists
    assert.ok(product.image, `Product ${product.id} must have a main image defined`);
    assert.match(product.image, /^\/assets\//, `Product ${product.id} image path must start with /assets/`);

    // 3. Verification notes present for authenticity/origin
    assert.ok(product.verificationNotes, `Product ${product.id} must have verification notes`);
  }
});

test('Product Image Validation: Every referenced image path points to an existing file in public/', () => {
  const missingFiles = [];

  for (const product of INITIAL_PRODUCTS) {
    // Check main image
    const mainRelative = product.image.replace(/^\//, '');
    const mainFullPath = path.resolve(publicDir, mainRelative);
    if (!fs.existsSync(mainFullPath)) {
      missingFiles.push({ product: product.id, role: 'main', path: product.image, fullPath: mainFullPath });
    }

    // Check gallery images
    if (Array.isArray(product.gallery)) {
      for (const imgPath of product.gallery) {
        const galRelative = imgPath.replace(/^\//, '');
        const galFullPath = path.resolve(publicDir, galRelative);
        if (!fs.existsSync(galFullPath)) {
          missingFiles.push({ product: product.id, role: 'gallery', path: imgPath, fullPath: galFullPath });
        }
      }
    }
  }

  assert.equal(missingFiles.length, 0, `All product image paths must resolve to existing files. Missing: ${JSON.stringify(missingFiles, null, 2)}`);
});

test('Product Gallery Validation: Every gallery has multiple images, no duplicates, includes main image', () => {
  for (const product of INITIAL_PRODUCTS) {
    assert.ok(Array.isArray(product.gallery), `Product ${product.id} gallery must be an array`);
    assert.ok(product.gallery.length >= 2, `Product ${product.id} gallery should have at least 2 pictures, found ${product.gallery.length}`);

    // No duplicate paths within the same gallery
    const uniqueImages = new Set(product.gallery);
    assert.equal(uniqueImages.size, product.gallery.length, `Product ${product.id} gallery has duplicate image paths: ${product.gallery}`);

    // Main image should be present in the gallery
    assert.ok(product.gallery.includes(product.image), `Product ${product.id} gallery must include its main image (${product.image})`);
  }
});

test('Product Gallery Validation: Mixed shelf stock and assortment box sets are NOT in individual product galleries', () => {
  const forbiddenImages = [
    '/assets/products/p06-assorted-tws-set.jpg',
    '/assets/products/p26-mixed-shelf-stock.jpg'
  ];

  for (const product of INITIAL_PRODUCTS) {
    for (const forbidden of forbiddenImages) {
      assert.notEqual(product.image, forbidden, `Product ${product.id} cannot use assorted/mixed image ${forbidden} as main image`);
      assert.ok(!product.gallery?.includes(forbidden), `Product ${product.id} cannot contain assorted/mixed image ${forbidden} in its gallery`);
    }
  }
});

test('Product Identity Validation: Specific model numbers, brand spellings and connector types are preserved', () => {
  // 1. ANKEER preserved exactly (not Anker)
  const ankeer = INITIAL_PRODUCTS.find(p => p.id === 'p16-ankeer-nk-ny200-headphones' || p.photoRef === 'P16');
  assert.ok(ankeer, 'ANKEER product must exist');
  assert.equal(ankeer.brand, 'ANKEER', 'ANKEER must be preserved exactly as printed');
  assert.equal(ankeer.model, 'NK-NY200');

  // 2. D50L (Lightning) and D50T (Type-C) remain distinct products
  const d50l = INITIAL_PRODUCTS.find(p => p.id === 'p23-vdenmenv-d50l-lightning' || p.model === 'D50L');
  const d50t = INITIAL_PRODUCTS.find(p => p.id === 'p23-vdenmenv-d50t-typec' || p.model === 'D50T');
  assert.ok(d50l, 'D50L Lightning product must exist');
  assert.ok(d50t, 'D50T Type-C product must exist');
  assert.notEqual(d50l.id, d50t.id);
  assert.ok((d50l.specs['Connector Type'] || d50l.specs['Connectors']).includes('Lightning'));
  assert.ok((d50t.specs['Connector Type'] || d50t.specs['Connectors']).includes('Type-C'));
  assert.notEqual(d50l.image, d50t.image);

  // 3. TUCCI A5 Fighter and TUCCI Q8 USB remain distinct models
  const tucciA5 = INITIAL_PRODUCTS.find(p => p.id === 'fighter-superbass-headset' || p.model === 'A5 Fighter');
  const tucciQ8 = INITIAL_PRODUCTS.find(p => p.id === 'tucci-q8-gaming-headset' || p.model === 'Q8');
  assert.ok(tucciA5, 'TUCCI A5 must exist');
  assert.ok(tucciQ8, 'TUCCI Q8 must exist');
  assert.notEqual(tucciA5.id, tucciQ8.id);
  assert.equal(tucciA5.model, 'A5 Fighter');
  assert.equal(tucciQ8.model, 'Q8');

  // 4. P14 and P19 are merged into one listing with duplicate noted
  const or08Listings = INITIAL_PRODUCTS.filter(p => p.model === 'OR-08');
  assert.equal(or08Listings.length, 1, 'OR-08 should have exactly 1 consolidated product listing');
  assert.ok(or08Listings[0].verificationNotes.includes('P19') || or08Listings[0].photoRef.includes('P14'), 'OR-08 should reference P14/P19 duplicate');

  // 5. REMAX RC-155a model preserved
  const rc155a = INITIAL_PRODUCTS.find(p => p.model === 'RC-155a');
  assert.ok(rc155a, 'RC-155a product must exist');
  assert.equal(rc155a.brand, 'REMAX');

  // 6. VDENMENV DR06 earphones preserved
  const dr06 = INITIAL_PRODUCTS.find(p => p.model === 'DR06');
  assert.ok(dr06, 'DR06 product must exist');
  assert.equal(dr06.brand, 'VDENMENV');

  // 7. DON-X20 preserved separately from mixed shelf models
  const donX20 = INITIAL_PRODUCTS.find(p => p.model === 'DON-X20');
  assert.ok(donX20, 'DON-X20 product must exist');
  assert.equal(donX20.brand, 'DON');
});

test('Unlinked Image Audit: reports all files in public/assets/products/ and categorizes them', () => {
  const allFilesInDir = fs.readdirSync(productsDir);
  const referencedImages = new Set();

  for (const p of INITIAL_PRODUCTS) {
    if (p.image) referencedImages.add(path.basename(p.image));
    if (Array.isArray(p.gallery)) {
      p.gallery.forEach(img => referencedImages.add(path.basename(img)));
    }
  }

  const unlinked = [];
  const referencePhotos = [];

  for (const file of allFilesInDir) {
    if (!file.match(/\.(jpg|jpeg|png|webp|svg)$/i)) continue;
    if (referencedImages.has(file)) continue;

    // Is it a master reference photo or assorted/shelf asset?
    if (file.includes('assorted') || file.includes('mixed-shelf') || file.includes('original')) {
      referencePhotos.push(file);
    } else {
      unlinked.push(file);
    }
  }

  // Verification that assorted and shelf stock are recognized as reference photos, not deleted
  assert.ok(referencePhotos.length >= 2, 'Assorted and shelf reference assets should be present as reference files');
  // Unlinked files are reported in test output
  console.log(`[Unlinked Image Audit] Total files in products dir: ${allFilesInDir.length}`);
  console.log(`[Unlinked Image Audit] Referenced in catalog galleries: ${referencedImages.size}`);
  console.log(`[Unlinked Image Audit] Master reference/shelf assets preserved: ${referencePhotos.length} (${referencePhotos.join(', ')})`);
  console.log(`[Unlinked Image Audit] Standalone/unmapped assets: ${unlinked.length} (${unlinked.join(', ')})`);
});

test('Database and API Integrity: getProducts and getProductById return brand, model, gallery', () => {
  const products = getProducts();
  assert.ok(products.length >= 26);

  const sample = products.find(p => p.model === 'RC-155a');
  assert.ok(sample, 'RC-155a should be present in database');
  assert.equal(sample.brand, 'REMAX');
  assert.equal(sample.model, 'RC-155a');
  assert.ok(Array.isArray(sample.gallery));
  assert.ok(sample.gallery.length >= 2);

  const fetched = getProductById(sample.id);
  assert.ok(fetched);
  assert.equal(fetched.brand, 'REMAX');
  assert.equal(fetched.model, 'RC-155a');
  assert.deepEqual(fetched.gallery, sample.gallery);
});
