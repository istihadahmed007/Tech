// scripts/migrate_product_catalog.js
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { INITIAL_PRODUCTS } from '../src/data/catalog.js';

const DB_PATH = path.resolve('data/store.db');

if (!fs.existsSync(DB_PATH)) {
  console.error('Database file not found at:', DB_PATH);
  process.exit(1);
}

// 1. Create a safe backup before migrating
const backupPath = path.resolve('data/store.db.pre_migration_' + Date.now());
fs.copyFileSync(DB_PATH, backupPath);
console.log(`[migration] Safe pre-migration backup created at: ${backupPath}`);

const db = new DatabaseSync(DB_PATH);

// Ensure model and photo_ref columns exist
try { db.exec('ALTER TABLE products ADD COLUMN model TEXT;'); } catch (e) {}
try { db.exec('ALTER TABLE products ADD COLUMN photo_ref TEXT;'); } catch (e) {}

// 2. Safe Migration: Update brand, model, photo_ref, image, gallery, and specs without wiping stock or orders
db.exec('BEGIN IMMEDIATE;');

try {
  const checkProduct = db.prepare('SELECT id, stock, price FROM products WHERE id = ?');
  const updateProduct = db.prepare(`
    UPDATE products SET
      title = ?,
      title_bn = ?,
      category_id = ?,
      brand = ?,
      model = ?,
      photo_ref = ?,
      badge = ?,
      warranty = ?,
      description = ?,
      specs_json = ?,
      image = ?,
      gallery_json = ?,
      compatible_with_json = ?,
      updated_at = ?
    WHERE id = ?
  `);

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, sku, title, title_bn, category_id, brand, model, photo_ref, price, original_price,
      stock, status, badge, warranty, description, specs_json, image,
      gallery_json, compatible_with_json, is_development_seed, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `);

  const insertVariant = db.prepare(`
    INSERT OR IGNORE INTO product_variants (id, product_id, sku, name, hex, stock, in_stock, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const now = new Date().toISOString();
  let updatedCount = 0;
  let insertedCount = 0;

  for (const p of INITIAL_PRODUCTS) {
    const existing = checkProduct.get(p.id);

    if (existing) {
      updateProduct.run(
        p.title,
        p.titleBn || null,
        p.category,
        p.brand,
        p.model || null,
        p.photoRef || null,
        p.badge || null,
        p.warranty || null,
        p.description || '',
        JSON.stringify(p.specs || {}),
        p.image,
        JSON.stringify(p.gallery || []),
        JSON.stringify(p.compatibleWith || []),
        now,
        p.id
      );
      updatedCount++;
    } else {
      insertProduct.run(
        p.id,
        p.sku || p.id,
        p.title,
        p.titleBn || null,
        p.category,
        p.brand,
        p.model || null,
        p.photoRef || null,
        p.price,
        p.originalPrice || null,
        p.stock || 20,
        'published',
        p.badge || null,
        p.warranty || null,
        p.description || '',
        JSON.stringify(p.specs || {}),
        p.image,
        JSON.stringify(p.gallery || []),
        JSON.stringify(p.compatibleWith || []),
        p.isDevelopmentSeed ? 1 : 0,
        now,
        now
      );
      insertedCount++;
    }

    // Ensure variants exist without deleting existing variants
    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        insertVariant.run(
          `${p.id}_${v.id}`,
          p.id,
          `${p.sku || p.id}-${v.id}`,
          v.name,
          v.hex || '#000000',
          Math.floor((p.stock || 10) / Math.max(1, p.variants.length)),
          v.inStock !== false ? 1 : 0,
          now
        );
      }
    }
  }

  db.exec('COMMIT;');
  console.log(`[migration] Success! Updated ${updatedCount} products, inserted ${insertedCount} new products.`);
  console.log(`[migration] Stock, orders, customers, and payment configurations were 100% preserved.`);
} catch (err) {
  db.exec('ROLLBACK;');
  console.error('[migration] Migration failed, rolled back changes:', err);
  process.exit(1);
} finally {
  db.close();
}
