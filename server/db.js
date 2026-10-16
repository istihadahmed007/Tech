import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { INITIAL_PRODUCTS, CATEGORIES, BRANDS_AND_MODELS } from '../src/data/catalog.js';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = process.env.SQLITE_DB_PATH || path.join(DB_DIR, 'store.db');
const LEGACY_JSON_FILE = path.resolve(process.cwd(), 'data-store.json');

let dbInstance = null;

export function getDbPath() {
  return process.env.SQLITE_DB_PATH || path.join(DB_DIR, 'store.db');
}

export function closeDatabase() {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch (e) {}
    dbInstance = null;
  }
}

export function resetDatabaseForTesting(customDbPath = null) {
  closeDatabase();
  if (customDbPath) {
    process.env.SQLITE_DB_PATH = customDbPath;
  }
  return getDatabase();
}

export function getDatabase() {
  if (dbInstance) return dbInstance;

  const dbPath = getDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dbInstance = new DatabaseSync(dbPath);

  // Set busy timeout FIRST so any concurrent lock waits rather than throwing ERR_SQLITE_ERROR
  dbInstance.exec('PRAGMA busy_timeout = 5000;');
  dbInstance.exec('PRAGMA journal_mode = WAL;');
  dbInstance.exec('PRAGMA foreign_keys = ON;');
  dbInstance.exec('PRAGMA synchronous = NORMAL;');

  initSchema(dbInstance);
  migrateLegacyJson(dbInstance);
  seedInitialCatalog(dbInstance);

  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_bn TEXT,
      description TEXT,
      badge TEXT,
      icon TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      models_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE,
      title TEXT NOT NULL,
      title_bn TEXT,
      category_id TEXT NOT NULL,
      brand TEXT,
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'published',
      badge TEXT,
      warranty TEXT,
      description TEXT,
      specs_json TEXT DEFAULT '{}',
      image TEXT,
      gallery_json TEXT DEFAULT '[]',
      compatible_with_json TEXT DEFAULT '[]',
      is_development_seed INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT,
      name TEXT NOT NULL,
      hex TEXT,
      stock INTEGER NOT NULL DEFAULT 0,
      in_stock INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory_adjustments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      quantity_change INTEGER NOT NULL,
      previous_stock INTEGER NOT NULL,
      new_stock INTEGER NOT NULL,
      reason TEXT NOT NULL,
      adjusted_by TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      addresses_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS wishlists (
      user_id TEXT PRIMARY KEY,
      product_ids_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      guest_token TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_division TEXT NOT NULL,
      customer_outside_city INTEGER NOT NULL DEFAULT 0,
      customer_address TEXT NOT NULL,
      customer_notes TEXT,
      subtotal REAL NOT NULL,
      discount REAL NOT NULL DEFAULT 0,
      delivery_fee REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      transaction_id TEXT,
      payment_details_json TEXT,
      status TEXT NOT NULL DEFAULT 'confirmed',
      is_demo INTEGER NOT NULL DEFAULT 0,
      timeline_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      sku TEXT,
      title TEXT NOT NULL,
      title_bn TEXT,
      variant_name TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      product_snapshot_json TEXT NOT NULL DEFAULT '{}',
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS inventory_reservations (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT,
      quantity INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      comment TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'approved',
      created_at TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (product_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_amount REAL NOT NULL DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      product_id TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_bn TEXT,
      description TEXT,
      price_type TEXT NOT NULL DEFAULT 'fixed',
      base_price REAL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS service_requests (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      guest_token TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      service_id TEXT,
      service_name TEXT NOT NULL,
      device_model TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'received',
      quoted_price REAL,
      timeline_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment_sessions (
      session_id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'BDT',
      provider TEXT NOT NULL,
      status TEXT NOT NULL,
      meta_json TEXT DEFAULT '{}',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS idempotency_keys (
      key TEXT PRIMARY KEY,
      requester_id TEXT,
      request_hash TEXT,
      response_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT NOT NULL,
      identifier TEXT NOT NULL,
      attempt_time INTEGER NOT NULL
    );
  `);

  // Ensure migrations for existing idempotency_keys tables
  try { db.exec('ALTER TABLE idempotency_keys ADD COLUMN requester_id TEXT;'); } catch (e) {}
  try { db.exec('ALTER TABLE idempotency_keys ADD COLUMN request_hash TEXT;'); } catch (e) {}
}

function migrateLegacyJson(db) {
  if (!fs.existsSync(LEGACY_JSON_FILE)) return;

  try {
    const raw = fs.readFileSync(LEGACY_JSON_FILE, 'utf-8');
    const legacy = JSON.parse(raw);
    if (!legacy || !Array.isArray(legacy.orders)) return;

    const checkOrder = db.prepare('SELECT id FROM orders WHERE id = ?');
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, customer_name, customer_phone, customer_division, customer_outside_city,
        customer_address, customer_notes, subtotal, discount, delivery_fee, total,
        payment_method, payment_status, transaction_id, status, is_demo,
        timeline_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?
      )
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, variant_id, sku, title,
        title_bn, variant_name, price, quantity, subtotal, product_snapshot_json
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `);

    for (const ord of legacy.orders) {
      if (!ord || !ord.id) continue;
      const existing = checkOrder.get(ord.id);
      if (!existing) {
        const cust = ord.customer || {};
        const createdAt = ord.createdAt || new Date().toISOString();
        const updatedAt = ord.updatedAt || createdAt;
        const timeline = ord.timeline || [];

        insertOrder.run(
          ord.id,
          cust.name || 'Legacy Customer',
          cust.phone || '',
          cust.division || 'Dhaka',
          cust.outsideCity ? 1 : 0,
          cust.address || '',
          cust.notes || '',
          ord.subtotal || ord.total || 0,
          0,
          ord.deliveryFee || 0,
          ord.total || 0,
          ord.paymentMethod || 'cod',
          ord.paymentStatus || 'verified',
          ord.transactionId || null,
          ord.status || 'confirmed',
          ord.isDemo ? 1 : 0,
          JSON.stringify(timeline),
          createdAt,
          updatedAt
        );

        if (Array.isArray(ord.items)) {
          for (const item of ord.items) {
            insertItem.run(
              ord.id,
              item.id || 'legacy-item',
              item.variantId || null,
              item.id || '',
              item.title || 'Product',
              item.titleBn || null,
              item.variant || 'Standard',
              item.price || 0,
              item.quantity || 1,
              (item.price || 0) * (item.quantity || 1),
              JSON.stringify(item)
            );
          }
        }
      }
    }

    // Migrate payment sessions from legacy
    if (legacy.paymentSessions && typeof legacy.paymentSessions === 'object') {
      const checkSession = db.prepare('SELECT session_id FROM payment_sessions WHERE session_id = ?');
      const insertSession = db.prepare(`
        INSERT INTO payment_sessions (
          session_id, order_id, amount, currency, provider, status, meta_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const [sId, sData] of Object.entries(legacy.paymentSessions)) {
        if (!checkSession.get(sId)) {
          insertSession.run(
            sId,
            sData.orderId || 'UNKNOWN',
            sData.amount || 0,
            sData.currency || 'BDT',
            'sandbox',
            sData.status || 'pending',
            JSON.stringify(sData),
            sData.createdAt || new Date().toISOString(),
            sData.updatedAt || new Date().toISOString()
          );
        }
      }
    }
  } catch (err) {
    console.error('[DB Migration Error]', err.message);
  }
}

function seedInitialCatalog(db) {
  const now = new Date().toISOString();

  // Seed Categories
  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO categories (id, name, name_bn, description, badge, icon, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const cat of CATEGORIES) {
    insertCategory.run(cat.id, cat.name, cat.nameBn || null, cat.description || '', cat.badge || null, cat.icon || null, now);
  }

  // Seed Brands
  const insertBrand = db.prepare(`
    INSERT OR IGNORE INTO brands (id, name, models_json, created_at)
    VALUES (?, ?, ?, ?)
  `);
  for (const b of BRANDS_AND_MODELS) {
    insertBrand.run(b.brand.toLowerCase(), b.brand, JSON.stringify(b.models || []), now);
  }

  // Seed Products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, sku, title, title_bn, category_id, brand, price, original_price,
      stock, status, badge, warranty, description, specs_json, image,
      gallery_json, compatible_with_json, is_development_seed, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      title_bn = excluded.title_bn,
      category_id = excluded.category_id,
      price = excluded.price,
      original_price = excluded.original_price,
      badge = excluded.badge,
      warranty = excluded.warranty,
      description = excluded.description,
      specs_json = excluded.specs_json,
      image = excluded.image,
      gallery_json = excluded.gallery_json,
      compatible_with_json = excluded.compatible_with_json,
      updated_at = excluded.updated_at
  `);

  const insertVariant = db.prepare(`
    INSERT OR IGNORE INTO product_variants (id, product_id, sku, name, hex, stock, in_stock, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Remove any legacy/mock products that are not in the authentic inventory catalog
  const validIds = INITIAL_PRODUCTS.map(p => p.id);
  const placeholders = validIds.map(() => '?').join(',');
  db.prepare(`DELETE FROM product_variants WHERE product_id NOT IN (${placeholders})`).run(...validIds);
  db.prepare(`DELETE FROM products WHERE id NOT IN (${placeholders})`).run(...validIds);

  for (const p of INITIAL_PRODUCTS) {
    const sku = p.id;
    insertProduct.run(
      p.id,
      sku,
      p.title,
      p.titleBn || null,
      p.category,
      p.brand || 'Glacial',
      p.price,
      p.originalPrice || null,
      p.stock || 0,
      'published',
      p.badge || null,
      p.warranty || null,
      p.description || '',
      JSON.stringify(p.specs || {}),
      p.image || null,
      JSON.stringify(p.gallery || []),
      JSON.stringify(p.compatibleWith || []),
      p.isDevelopmentSeed ? 1 : 0,
      now,
      now
    );

    if (Array.isArray(p.variants)) {
      for (const v of p.variants) {
        insertVariant.run(
          `${p.id}_${v.id}`,
          p.id,
          `${sku}-${v.id}`,
          v.name,
          v.hex || '#000000',
          Math.floor((p.stock || 10) / Math.max(1, p.variants.length)),
          v.inStock !== false ? 1 : 0,
          now
        );
      }
    }
  }

  // Seed default admin account safely (idempotent with conflict handling)
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync('admin123', salt, 64).toString('hex');
  const passwordHash = `scrypt:${salt}:${derivedKey}`;

  db.prepare(`
    INSERT INTO users (id, email, phone, name, password_hash, role, addresses_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      role = 'admin',
      updated_at = excluded.updated_at
  `).run(
    'usr_admin_default',
    'admin@techtrove.local',
    '01700000000',
    'Store Administrator',
    passwordHash,
    'admin',
    '[]',
    now,
    now
  );
}

// -----------------------------------------------------------------------------
// Catalog Queries
// -----------------------------------------------------------------------------

export function getAllProducts({
  category = null,
  phone = null,
  query = '',
  inStockOnly = false,
  lowStockOnly = false,
  includeArchived = false
} = {}) {
  const db = getDatabase();
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (!includeArchived) {
    sql += " AND status = 'published'";
  }

  if (category) {
    sql += ' AND category_id = ?';
    params.push(category);
  }

  if (inStockOnly) {
    sql += ' AND stock > 0';
  }

  if (lowStockOnly) {
    sql += ' AND stock > 0 AND stock <= 5';
  }

  sql += ' ORDER BY created_at DESC';

  const rows = db.prepare(sql).all(...params);

  // Parse JSON columns & filter compatibility/query in JS for accuracy
  const cleanQuery = query ? query.toLowerCase().trim() : '';
  const cleanPhone = phone ? phone.toLowerCase().trim() : '';

  const getVariants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?');
  const getReviews = db.prepare("SELECT rating FROM reviews WHERE product_id = ? AND status = 'approved'");

  const results = [];

  for (const row of rows) {
    let specs = {};
    let gallery = [];
    let compatibleWith = [];

    try { specs = JSON.parse(row.specs_json || '{}'); } catch (e) {}
    try { gallery = JSON.parse(row.gallery_json || '[]'); } catch (e) {}
    try { compatibleWith = JSON.parse(row.compatible_with_json || '[]'); } catch (e) {}

    // Check phone match
    if (cleanPhone) {
      const match = compatibleWith.some(c => c.toLowerCase().includes(cleanPhone));
      if (!match) continue;
    }

    // Check text search
    if (cleanQuery) {
      const matchTitle = (row.title || '').toLowerCase().includes(cleanQuery) ||
                         (row.title_bn || '').toLowerCase().includes(cleanQuery);
      const matchCategory = (row.category_id || '').toLowerCase().includes(cleanQuery);
      const matchDesc = (row.description || '').toLowerCase().includes(cleanQuery);
      const matchPhone = compatibleWith.some(c => c.toLowerCase().includes(cleanQuery));

      if (!matchTitle && !matchCategory && !matchDesc && !matchPhone) {
        continue;
      }
    }

    // Load variants
    const variantRows = getVariants.all(row.id);
    const variants = variantRows.map(v => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      hex: v.hex,
      stock: v.stock,
      inStock: Boolean(v.in_stock)
    }));

    // Dynamic rating average and count calculated from real reviews
    const reviews = getReviews.all(row.id);
    let rating = 0;
    const reviewCount = reviews.length;
    if (reviewCount > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      rating = Number((sum / reviewCount).toFixed(1));
    }

    results.push({
      id: row.id,
      sku: row.sku,
      title: row.title,
      titleBn: row.title_bn,
      category: row.category_id,
      brand: row.brand,
      price: row.price,
      originalPrice: row.original_price,
      stock: row.stock,
      status: row.status,
      badge: row.badge,
      warranty: row.warranty,
      description: row.description,
      specs,
      image: row.image,
      gallery,
      compatibleWith,
      variants,
      rating,
      reviewCount,
      isDevelopmentSeed: Boolean(row.is_development_seed),
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  return results;
}

export function getProductById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!row) return null;

  let specs = {};
  let gallery = [];
  let compatibleWith = [];

  try { specs = JSON.parse(row.specs_json || '{}'); } catch (e) {}
  try { gallery = JSON.parse(row.gallery_json || '[]'); } catch (e) {}
  try { compatibleWith = JSON.parse(row.compatible_with_json || '[]'); } catch (e) {}

  const variantRows = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(row.id);
  const variants = variantRows.map(v => ({
    id: v.id,
    sku: v.sku,
    name: v.name,
    hex: v.hex,
    stock: v.stock,
    inStock: Boolean(v.in_stock)
  }));

  const reviews = db.prepare("SELECT rating FROM reviews WHERE product_id = ? AND status = 'approved'").all(row.id);
  let rating = 0;
  const reviewCount = reviews.length;
  if (reviewCount > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    rating = Number((sum / reviewCount).toFixed(1));
  }

  return {
    id: row.id,
    sku: row.sku,
    title: row.title,
    titleBn: row.title_bn,
    category: row.category_id,
    brand: row.brand,
    price: row.price,
    originalPrice: row.original_price,
    stock: row.stock,
    status: row.status,
    badge: row.badge,
    warranty: row.warranty,
    description: row.description,
    specs,
    image: row.image,
    gallery,
    compatibleWith,
    variants,
    rating,
    reviewCount,
    isDevelopmentSeed: Boolean(row.is_development_seed),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createProduct(data) {
  const db = getDatabase();
  const id = data.id || `prod_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE;');
  try {
    db.prepare(`
      INSERT INTO products (
        id, sku, title, title_bn, category_id, brand, price, original_price,
        stock, status, badge, warranty, description, specs_json, image,
        gallery_json, compatible_with_json, is_development_seed, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `).run(
      id,
      data.sku || id,
      data.title,
      data.titleBn || null,
      data.category || data.categoryId || 'cases',
      data.brand || 'Glacial',
      Number(data.price) || 0,
      data.originalPrice ? Number(data.originalPrice) : null,
      parseInt(data.stock, 10) || 0,
      data.status || 'published',
      data.badge || null,
      data.warranty || null,
      data.description || '',
      JSON.stringify(data.specs || {}),
      data.image || null,
      JSON.stringify(data.gallery || []),
      JSON.stringify(data.compatibleWith || []),
      data.isDevelopmentSeed ? 1 : 0,
      now,
      now
    );

    if (Array.isArray(data.variants)) {
      const insVariant = db.prepare(`
        INSERT INTO product_variants (id, product_id, sku, name, hex, stock, in_stock, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const v of data.variants) {
        insVariant.run(
          v.id || `${id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          id,
          v.sku || `${data.sku || id}-${v.name}`,
          v.name,
          v.hex || '#000000',
          parseInt(v.stock, 10) || 0,
          v.inStock !== false ? 1 : 0,
          now
        );
      }
    }

    db.exec('COMMIT;');
    return getProductById(id);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function updateProduct(id, data) {
  const db = getDatabase();
  const existing = getProductById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE;');
  try {
    db.prepare(`
      UPDATE products SET
        title = ?,
        title_bn = ?,
        category_id = ?,
        brand = ?,
        price = ?,
        original_price = ?,
        stock = ?,
        status = ?,
        badge = ?,
        warranty = ?,
        description = ?,
        specs_json = ?,
        image = ?,
        gallery_json = ?,
        compatible_with_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      data.title !== undefined ? data.title : existing.title,
      data.titleBn !== undefined ? data.titleBn : existing.titleBn,
      data.category !== undefined ? data.category : existing.category,
      data.brand !== undefined ? data.brand : existing.brand,
      data.price !== undefined ? Number(data.price) : existing.price,
      data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : null) : existing.originalPrice,
      data.stock !== undefined ? parseInt(data.stock, 10) : existing.stock,
      data.status !== undefined ? data.status : existing.status,
      data.badge !== undefined ? data.badge : existing.badge,
      data.warranty !== undefined ? data.warranty : existing.warranty,
      data.description !== undefined ? data.description : existing.description,
      data.specs !== undefined ? JSON.stringify(data.specs) : JSON.stringify(existing.specs),
      data.image !== undefined ? data.image : existing.image,
      data.gallery !== undefined ? JSON.stringify(data.gallery) : JSON.stringify(existing.gallery),
      data.compatibleWith !== undefined ? JSON.stringify(data.compatibleWith) : JSON.stringify(existing.compatibleWith),
      now,
      id
    );

    if (Array.isArray(data.variants)) {
      db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(id);
      const insVariant = db.prepare(`
        INSERT INTO product_variants (id, product_id, sku, name, hex, stock, in_stock, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const v of data.variants) {
        insVariant.run(
          v.id || `${id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          id,
          v.sku || `${existing.sku}-${v.name}`,
          v.name,
          v.hex || '#000000',
          parseInt(v.stock, 10) || 0,
          v.inStock !== false ? 1 : 0,
          now
        );
      }
    }

    db.exec('COMMIT;');
    return getProductById(id);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function updateProductStatus(id, status) {
  const db = getDatabase();
  const valid = ['published', 'draft', 'archived'];
  if (!valid.includes(status)) throw new Error('Invalid product status');

  db.prepare('UPDATE products SET status = ?, updated_at = ? WHERE id = ?').run(status, new Date().toISOString(), id);
  return getProductById(id);
}

// -----------------------------------------------------------------------------
// Inventory Management & Stock Adjustments
// -----------------------------------------------------------------------------

export function adjustProductStock(productId, variantId, quantityChange, reason, adjustedBy = 'admin') {
  const db = getDatabase();
  db.exec('BEGIN IMMEDIATE;');

  try {
    const product = db.prepare('SELECT stock FROM products WHERE id = ?').get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    const previousStock = product.stock;
    const newStock = Math.max(0, previousStock + quantityChange);

    db.prepare('UPDATE products SET stock = ?, updated_at = ? WHERE id = ?').run(
      newStock,
      new Date().toISOString(),
      productId
    );

    // If variant is specified, update variant stock as well
    if (variantId) {
      const v = db.prepare('SELECT stock FROM product_variants WHERE id = ?').get(variantId);
      if (v) {
        const newVStock = Math.max(0, v.stock + quantityChange);
        db.prepare('UPDATE product_variants SET stock = ?, in_stock = ? WHERE id = ?').run(
          newVStock,
          newVStock > 0 ? 1 : 0,
          variantId
        );
      }
    }

    // Record permanent audit entry
    db.prepare(`
      INSERT INTO inventory_adjustments (
        product_id, variant_id, quantity_change, previous_stock, new_stock, reason, adjusted_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      productId,
      variantId || null,
      quantityChange,
      previousStock,
      newStock,
      reason || 'Manual adjustment',
      adjustedBy,
      new Date().toISOString()
    );

    db.exec('COMMIT;');
    return { success: true, productId, previousStock, newStock, quantityChange };
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function getInventoryAdjustments(productId = null, limit = 50) {
  const db = getDatabase();
  let sql = 'SELECT * FROM inventory_adjustments';
  const params = [];
  if (productId) {
    sql += ' WHERE product_id = ?';
    params.push(productId);
  }
  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  return db.prepare(sql).all(...params);
}

// -----------------------------------------------------------------------------
// Orders & Payment Transactions
// -----------------------------------------------------------------------------

export function createOrderWithReservation({
  userId = null,
  customer,
  items,
  subtotal,
  discount = 0,
  deliveryFee,
  total,
  paymentMethod,
  isDemo = false
}) {
  const db = getDatabase();
  const orderId = 'AGY-' + Math.floor(100000 + Math.random() * 900000);
  const guestToken = crypto.randomBytes(24).toString('hex');
  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE;');

  try {
    // 1. Verify availability for each item
    const reservationExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes reservation for online checkout

    for (const item of items) {
      const p = db.prepare('SELECT stock, title FROM products WHERE id = ?').get(item.id);
      if (!p) {
        throw new Error(`Product not found: ${item.id}`);
      }

      // Check active reservations
      const activeRes = db.prepare(`
        SELECT COALESCE(SUM(quantity), 0) as reserved
        FROM inventory_reservations
        WHERE product_id = ? AND status = 'active' AND expires_at > ?
      `).get(item.id, Date.now());

      const available = p.stock - (activeRes ? activeRes.reserved : 0);
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for ${p.title}. Only ${Math.max(0, available)} available.`);
      }
    }

    // 2. Insert Order Record
    const initialStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';
    const initialPaymentStatus = paymentMethod === 'cod' ? 'unpaid' : 'pending';
    const initialTimeline = [
      {
        status: paymentMethod === 'cod' ? 'Order Placed (COD)' : 'Order Placed (Awaiting Payment)',
        timestamp: now,
        note: paymentMethod === 'cod' ? 'Cash on Delivery order confirmed and stock allocated' : 'Payment session initiated'
      }
    ];

    db.prepare(`
      INSERT INTO orders (
        id, user_id, guest_token, customer_name, customer_phone, customer_division,
        customer_outside_city, customer_address, customer_notes, subtotal, discount,
        delivery_fee, total, payment_method, payment_status, transaction_id,
        payment_details_json, status, is_demo, timeline_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?
      )
    `).run(
      orderId,
      userId || null,
      guestToken,
      customer.name.trim(),
      customer.phone.trim(),
      customer.division || 'Dhaka',
      customer.outsideCity ? 1 : 0,
      customer.address.trim(),
      customer.notes || '',
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod,
      initialPaymentStatus,
      null,
      null,
      initialStatus,
      isDemo ? 1 : 0,
      JSON.stringify(initialTimeline),
      now,
      now
    );

    // 3. Allocate inventory or reserve stock
    for (const item of items) {
      const p = db.prepare('SELECT stock FROM products WHERE id = ?').get(item.id);
      if (paymentMethod === 'cod') {
        const newStock = p.stock - item.quantity;
        db.prepare('UPDATE products SET stock = ?, updated_at = ? WHERE id = ?').run(newStock, now, item.id);
        db.prepare(`
          INSERT INTO inventory_adjustments (
            product_id, variant_id, quantity_change, previous_stock, new_stock, reason, adjusted_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(item.id, item.variantId || null, -item.quantity, p.stock, newStock, `Order allocation: ${orderId}`, 'system_checkout', now);
      } else {
        // Online payment: create inventory reservation
        const resId = `res_${crypto.randomBytes(12).toString('hex')}`;
        db.prepare(`
          INSERT INTO inventory_reservations (id, order_id, product_id, variant_id, quantity, expires_at, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 'active', ?)
        `).run(resId, orderId, item.id, item.variantId || null, item.quantity, reservationExpiry, now);
      }
    }

    // 3. Insert Order Items with snapshot
    const insItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, variant_id, sku, title,
        title_bn, variant_name, price, quantity, subtotal, product_snapshot_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      insItem.run(
        orderId,
        item.id,
        item.variantId || null,
        item.sku || item.id,
        item.title,
        item.titleBn || null,
        item.variant || 'Standard',
        item.price,
        item.quantity,
        item.price * item.quantity,
        JSON.stringify(item)
      );
    }

    db.exec('COMMIT;');

    const createdOrder = findOrderById(orderId);
    return {
      success: true,
      order: createdOrder,
      guestToken
    };
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function finalizeOrderPayment({ orderId, provider, transactionId, paymentDetails = {} }) {
  const db = getDatabase();
  db.exec('BEGIN IMMEDIATE;');

  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Idempotency: if already paid, commit and return clean result
    if (order.payment_status === 'paid') {
      db.exec('COMMIT;');
      return findOrderById(orderId);
    }

    const now = new Date().toISOString();

    // 1. Commit active inventory reservations into actual stock reduction
    const reservations = db.prepare(`
      SELECT * FROM inventory_reservations
      WHERE order_id = ? AND status = 'active'
    `).all(orderId);

    for (const res of reservations) {
      const p = db.prepare('SELECT stock FROM products WHERE id = ?').get(res.product_id);
      if (p) {
        const newStock = Math.max(0, p.stock - res.quantity);
        db.prepare('UPDATE products SET stock = ?, updated_at = ? WHERE id = ?').run(newStock, now, res.product_id);
        db.prepare(`
          INSERT INTO inventory_adjustments (
            product_id, variant_id, quantity_change, previous_stock, new_stock, reason, adjusted_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(res.product_id, res.variant_id, -res.quantity, p.stock, newStock, `Payment captured: ${orderId}`, provider || 'payment_gateway', now);
      }
      db.prepare("UPDATE inventory_reservations SET status = 'committed' WHERE id = ?").run(res.id);
    }

    // 2. Update Order
    let timeline = [];
    try { timeline = JSON.parse(order.timeline_json || '[]'); } catch (e) {}
    timeline.push({
      status: 'Payment Verified & Captured',
      timestamp: now,
      note: `Verified by ${provider} (TxID: ${transactionId})`
    });

    db.prepare(`
      UPDATE orders SET
        payment_status = 'paid',
        status = 'confirmed',
        transaction_id = ?,
        payment_details_json = ?,
        timeline_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(
      transactionId,
      JSON.stringify({ provider, transactionId, ...paymentDetails, verifiedAt: now }),
      JSON.stringify(timeline),
      now,
      orderId
    );

    db.exec('COMMIT;');
    return findOrderById(orderId);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function cancelOrderAndReleaseReservation(orderId, reason = 'Payment cancelled') {
  const db = getDatabase();
  db.exec('BEGIN IMMEDIATE;');

  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) return null;

    if (order.status === 'cancelled') {
      db.exec('COMMIT;');
      return findOrderById(orderId);
    }

    const now = new Date().toISOString();

    // If order was already paid or COD was allocated, return stock to product
    if (order.payment_method === 'cod' || order.payment_status === 'paid') {
      const items = db.prepare('SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = ?').all(orderId);
      for (const item of items) {
        const p = db.prepare('SELECT stock FROM products WHERE id = ?').get(item.product_id);
        if (p) {
          const newStock = p.stock + item.quantity;
          db.prepare('UPDATE products SET stock = ?, updated_at = ? WHERE id = ?').run(newStock, now, item.product_id);
          db.prepare(`
            INSERT INTO inventory_adjustments (
              product_id, variant_id, quantity_change, previous_stock, new_stock, reason, adjusted_by, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(item.product_id, item.variant_id, item.quantity, p.stock, newStock, `Order cancelled refund: ${orderId}`, 'system_cancel', now);
        }
      }
    } else {
      // Release any active reservations
      db.prepare("UPDATE inventory_reservations SET status = 'released' WHERE order_id = ? AND status = 'active'").run(orderId);
    }

    let timeline = [];
    try { timeline = JSON.parse(order.timeline_json || '[]'); } catch (e) {}
    timeline.push({
      status: 'Order Cancelled',
      timestamp: now,
      note: reason
    });

    db.prepare(`
      UPDATE orders SET
        status = 'cancelled',
        timeline_json = ?,
        updated_at = ?
      WHERE id = ?
    `).run(JSON.stringify(timeline), now, orderId);

    db.exec('COMMIT;');
    return findOrderById(orderId);
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

export function releaseExpiredReservations() {
  const db = getDatabase();
  db.prepare(`
    UPDATE inventory_reservations
    SET status = 'released'
    WHERE status = 'active' AND expires_at < ?
  `).run(Date.now());
}

export function findOrderById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM orders WHERE LOWER(id) = LOWER(?)').get(id.trim());
  if (!row) return null;

  const itemRows = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(row.id);
  const items = itemRows.map(i => {
    let snapshot = {};
    try { snapshot = JSON.parse(i.product_snapshot_json || '{}'); } catch (e) {}
    return {
      id: i.product_id,
      variantId: i.variant_id,
      sku: i.sku,
      title: i.title,
      titleBn: i.title_bn,
      variant: i.variant_name,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.subtotal,
      snapshot
    };
  });

  let timeline = [];
  let paymentDetails = null;
  try { timeline = JSON.parse(row.timeline_json || '[]'); } catch (e) {}
  try { paymentDetails = JSON.parse(row.payment_details_json || 'null'); } catch (e) {}

  return {
    id: row.id,
    userId: row.user_id,
    guestToken: row.guest_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isDemo: Boolean(row.is_demo),
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      division: row.customer_division,
      outsideCity: Boolean(row.customer_outside_city),
      address: row.customer_address,
      notes: row.customer_notes
    },
    items,
    subtotal: row.subtotal,
    discount: row.discount,
    deliveryFee: row.delivery_fee,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    transactionId: row.transaction_id,
    paymentDetails,
    status: row.status,
    timeline
  };
}

export function getOrdersForUser(userId) {
  if (!userId) return [];
  const db = getDatabase();
  const rows = db.prepare('SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  return rows.map(r => findOrderById(r.id)).filter(Boolean);
}

export function getAllOrdersAdmin({ status = null, paymentStatus = null, search = '', limit = 100 } = {}) {
  const db = getDatabase();
  let sql = 'SELECT id FROM orders WHERE 1=1';
  const params = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (paymentStatus) {
    sql += ' AND payment_status = ?';
    params.push(paymentStatus);
  }
  if (search) {
    sql += ' AND (LOWER(id) LIKE ? OR LOWER(customer_name) LIKE ? OR customer_phone LIKE ?)';
    const term = `%${search.toLowerCase().trim()}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  const rows = db.prepare(sql).all(...params);
  return rows.map(r => findOrderById(r.id)).filter(Boolean);
}

export function updateOrderStatus(orderId, newStatus, note = '') {
  const db = getDatabase();
  const order = findOrderById(orderId);
  if (!order) return null;

  const valid = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(newStatus)) throw new Error('Invalid order status');

  const now = new Date().toISOString();
  const timeline = [...(order.timeline || [])];
  timeline.push({
    status: `Status changed to ${newStatus}`,
    timestamp: now,
    note: note || `Order updated to ${newStatus}`
  });

  // If status is changed to delivered and payment is COD unpaid, allow updating payment status
  db.prepare(`
    UPDATE orders SET
      status = ?,
      timeline_json = ?,
      updated_at = ?
    WHERE id = ?
  `).run(newStatus, JSON.stringify(timeline), now, orderId);

  return findOrderById(orderId);
}

export function markCodPaymentCollected(orderId, note = 'Collected by delivery courier') {
  const db = getDatabase();
  const order = findOrderById(orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  const timeline = [...(order.timeline || [])];
  timeline.push({
    status: 'Payment Collected (COD)',
    timestamp: now,
    note
  });

  db.prepare(`
    UPDATE orders SET
      payment_status = 'paid',
      timeline_json = ?,
      updated_at = ?
    WHERE id = ?
  `).run(JSON.stringify(timeline), now, orderId);

  return findOrderById(orderId);
}

// -----------------------------------------------------------------------------
// Verified Reviews
// -----------------------------------------------------------------------------

export function createReview({ productId, userId, orderId, rating, comment, userName }) {
  const db = getDatabase();
  const id = `rev_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  // Validate rating
  const numericRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));

  // Server verification: Check that user actually purchased product in a delivered order
  const checkPurchase = db.prepare(`
    SELECT o.id, o.status FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'
  `).get(userId, productId);

  if (!checkPurchase) {
    throw new Error('Only customers who purchased and received this product can write a verified review.');
  }

  // Prevent duplicates
  const existing = db.prepare('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?').get(productId, userId);
  if (existing) {
    throw new Error('You have already submitted a review for this product.');
  }

  db.prepare(`
    INSERT INTO reviews (id, product_id, user_id, order_id, rating, user_name, comment, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', ?)
  `).run(id, productId, userId, orderId || checkPurchase.id, numericRating, userName || 'Verified Buyer', comment.trim(), now);

  return { id, productId, rating: numericRating, comment, userName, createdAt: now };
}

export function getProductReviews(productId) {
  const db = getDatabase();
  return db.prepare("SELECT * FROM reviews WHERE product_id = ? AND status = 'approved' ORDER BY created_at DESC").all(productId);
}

export function getAllReviewsAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all();
}

export function updateReviewStatus(reviewId, status) {
  const db = getDatabase();
  db.prepare('UPDATE reviews SET status = ? WHERE id = ?').run(status, reviewId);
  return db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
}

// -----------------------------------------------------------------------------
// Promotions
// -----------------------------------------------------------------------------

export function getActivePromotions() {
  const db = getDatabase();
  const now = new Date().toISOString();
  return db.prepare(`
    SELECT * FROM promotions
    WHERE is_active = 1 AND start_date <= ? AND end_date >= ?
  `).all(now, now);
}

export function getAllPromotionsAdmin() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM promotions ORDER BY created_at DESC').all();
}

export function createPromotion(data) {
  const db = getDatabase();
  const id = `promo_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO promotions (
      id, code, title, discount_type, discount_value, min_order_amount,
      start_date, end_date, is_active, product_id, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.code.toUpperCase().trim(),
    data.title.trim(),
    data.discountType || 'percentage',
    Number(data.discountValue) || 0,
    Number(data.minOrderAmount) || 0,
    data.startDate || now,
    data.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
    data.isActive !== false ? 1 : 0,
    data.productId || null,
    now
  );

  return db.prepare('SELECT * FROM promotions WHERE id = ?').get(id);
}

export function deletePromotion(id) {
  const db = getDatabase();
  db.prepare('DELETE FROM promotions WHERE id = ?').run(id);
}

// -----------------------------------------------------------------------------
// Service Requests (Feature Flag)
// -----------------------------------------------------------------------------

export function getServiceCatalog() {
  const db = getDatabase();
  return db.prepare('SELECT * FROM services_catalog WHERE is_active = 1').all();
}

export function createServiceRequest(data) {
  const db = getDatabase();
  const id = `SRV-${Math.floor(100000 + Math.random() * 900000)}`;
  const guestToken = crypto.randomBytes(24).toString('hex');
  const now = new Date().toISOString();

  const timeline = [{
    status: 'Request Received',
    timestamp: now,
    note: 'Service request registered with support team'
  }];

  db.prepare(`
    INSERT INTO service_requests (
      id, user_id, guest_token, customer_name, customer_phone,
      service_id, service_name, device_model, description, status,
      quoted_price, timeline_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?, ?, ?)
  `).run(
    id,
    data.userId || null,
    guestToken,
    data.customerName.trim(),
    data.customerPhone.trim(),
    data.serviceId || null,
    data.serviceName || 'Custom Service',
    data.deviceModel || 'General Device',
    data.description || '',
    data.quotedPrice || null,
    JSON.stringify(timeline),
    now,
    now
  );

  return { id, guestToken, ...data };
}

export function getServiceRequestsAdmin() {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM service_requests ORDER BY created_at DESC').all();
  return rows.map(r => {
    let timeline = [];
    try { timeline = JSON.parse(r.timeline_json || '[]'); } catch (e) {}
    return { ...r, timeline };
  });
}

export function updateServiceRequestStatus(id, status, quotedPrice = null, note = '') {
  const db = getDatabase();
  const req = db.prepare('SELECT * FROM service_requests WHERE id = ?').get(id);
  if (!req) return null;

  const now = new Date().toISOString();
  let timeline = [];
  try { timeline = JSON.parse(req.timeline_json || '[]'); } catch (e) {}
  timeline.push({
    status: `Status: ${status}`,
    timestamp: now,
    note: note || `Updated to ${status}`
  });

  db.prepare(`
    UPDATE service_requests SET
      status = ?,
      quoted_price = COALESCE(?, quoted_price),
      timeline_json = ?,
      updated_at = ?
    WHERE id = ?
  `).run(status, quotedPrice, JSON.stringify(timeline), now, id);

  return db.prepare('SELECT * FROM service_requests WHERE id = ?').get(id);
}

// -----------------------------------------------------------------------------
// Customer Accounts & Authentication Storage
// -----------------------------------------------------------------------------

export function findUserByEmail(email) {
  if (!email) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email.trim());
  if (!row) return null;
  let addresses = [];
  try { addresses = JSON.parse(row.addresses_json || '[]'); } catch (e) {}
  return { ...row, addresses };
}

export function findUserById(id) {
  if (!id) return null;
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!row) return null;
  let addresses = [];
  try { addresses = JSON.parse(row.addresses_json || '[]'); } catch (e) {}
  return { ...row, addresses };
}

export function createUser({ email, phone, name, passwordHash, role = 'customer' }) {
  const db = getDatabase();
  const id = `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO users (id, email, phone, name, password_hash, role, addresses_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, '[]', ?, ?)
  `).run(id, email.toLowerCase().trim(), phone || '', name.trim(), passwordHash || '', role, now, now);

  return findUserById(id);
}

export function updateUserProfile(id, { name, phone, addresses }) {
  const db = getDatabase();
  const user = findUserById(id);
  if (!user) return null;

  const now = new Date().toISOString();
  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      phone = COALESCE(?, phone),
      addresses_json = COALESCE(?, addresses_json),
      updated_at = ?
    WHERE id = ?
  `).run(
    name !== undefined ? name : null,
    phone !== undefined ? phone : null,
    addresses !== undefined ? JSON.stringify(addresses) : null,
    now,
    id
  );

  return findUserById(id);
}

export function createSession(token, userId, role, ttlMs = 7 * 86400000) {
  const db = getDatabase();
  const expiresAt = Date.now() + ttlMs;
  db.prepare(`
    INSERT INTO user_sessions (token, user_id, role, expires_at, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(token, userId, role, expiresAt, new Date().toISOString());
  return { token, userId, role, expiresAt };
}

export function findSession(token) {
  if (!token) return null;
  const db = getDatabase();
  const session = db.prepare('SELECT * FROM user_sessions WHERE token = ?').get(token);
  if (!session) return null;
  if (Date.now() > session.expires_at) {
    db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
    return null;
  }
  return session;
}

export function deleteSession(token) {
  if (!token) return;
  const db = getDatabase();
  db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
}

export function getUserWishlist(userId) {
  if (!userId) return [];
  const db = getDatabase();
  const row = db.prepare('SELECT product_ids_json FROM wishlists WHERE user_id = ?').get(userId);
  if (!row) return [];
  try { return JSON.parse(row.product_ids_json || '[]'); } catch (e) { return []; }
}

export function setUserWishlist(userId, productIds) {
  if (!userId) return;
  const db = getDatabase();
  const json = JSON.stringify(Array.isArray(productIds) ? productIds : []);
  db.prepare(`
    INSERT INTO wishlists (user_id, product_ids_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      product_ids_json = excluded.product_ids_json,
      updated_at = excluded.updated_at
  `).run(userId, json, new Date().toISOString());
}

// Rate Limiting helper
export function checkRateLimit(ip, identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const db = getDatabase();
  const cutoff = Date.now() - windowMs;
  db.prepare('DELETE FROM login_attempts WHERE attempt_time < ?').run(cutoff);

  const count = db.prepare(`
    SELECT count(*) as total FROM login_attempts
    WHERE (ip = ? OR identifier = ?) AND attempt_time >= ?
  `).get(ip, identifier, cutoff);

  return (count ? count.total : 0) < maxAttempts;
}

export function recordFailedAttempt(ip, identifier) {
  const db = getDatabase();
  db.prepare('INSERT INTO login_attempts (ip, identifier, attempt_time) VALUES (?, ?, ?)').run(
    ip,
    identifier,
    Date.now()
  );
}

export function clearFailedAttempts(ip, identifier) {
  const db = getDatabase();
  db.prepare('DELETE FROM login_attempts WHERE ip = ? OR identifier = ?').run(ip, identifier);
}

// -----------------------------------------------------------------------------
// Legacy & Backward Compatibility Adapters (Keeps existing tests 100% green)
// -----------------------------------------------------------------------------

export function savePaymentSession(sessionId, sessionData) {
  const db = getDatabase();
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO payment_sessions (session_id, order_id, amount, currency, provider, status, meta_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(session_id) DO UPDATE SET
      order_id = excluded.order_id,
      amount = excluded.amount,
      status = excluded.status,
      meta_json = excluded.meta_json,
      updated_at = excluded.updated_at
  `).run(
    sessionId,
    sessionData.orderId || 'UNKNOWN',
    sessionData.amount || 0,
    sessionData.currency || 'BDT',
    sessionData.provider || 'sandbox',
    sessionData.status || 'pending',
    JSON.stringify(sessionData),
    sessionData.createdAt || now,
    now
  );
}

export function getPaymentSession(sessionId) {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM payment_sessions WHERE session_id = ?').get(sessionId);
  if (!row) return null;
  let meta = {};
  try { meta = JSON.parse(row.meta_json || '{}'); } catch (e) {}
  return {
    sessionId: row.session_id,
    orderId: row.order_id,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    ...meta,
    updatedAt: row.updated_at
  };
}

export function updateOrder(orderId, updates) {
  const db = getDatabase();
  const order = findOrderById(orderId);
  if (!order) return null;

  const now = new Date().toISOString();
  let timeline = [...(order.timeline || [])];
  if (updates.timelineNote) {
    timeline.push({
      status: updates.status || order.status,
      timestamp: now,
      note: updates.timelineNote
    });
  }

  db.prepare(`
    UPDATE orders SET
      status = COALESCE(?, status),
      payment_status = COALESCE(?, payment_status),
      timeline_json = ?,
      updated_at = ?
    WHERE id = ?
  `).run(
    updates.status !== undefined ? updates.status : null,
    updates.paymentStatus !== undefined ? updates.paymentStatus : null,
    JSON.stringify(timeline),
    now,
    orderId
  );

  return findOrderById(orderId);
}

export function adjustInventory(productId, quantity) {
  // Negative delta increases stock (from legacy api), positive decreases
  const stockChange = -quantity;
  adjustProductStock(productId, null, stockChange, 'Inventory delta sync', 'system');
}

export function getDb() {
  const db = getDatabase();
  const orders = getAllOrdersAdmin();
  const inventoryDeltas = {};
  const paymentSessions = {};

  const psRows = db.prepare('SELECT * FROM payment_sessions').all();
  for (const r of psRows) {
    paymentSessions[r.session_id] = getPaymentSession(r.session_id);
  }

  const idempRows = db.prepare('SELECT * FROM idempotency_keys').all();
  const processedIdempotencyKeys = {};
  for (const r of idempRows) {
    try { processedIdempotencyKeys[r.key] = JSON.parse(r.response_json); } catch (e) {}
  }

  return {
    orders,
    inventoryDeltas,
    processedIdempotencyKeys,
    paymentSessions
  };
}

export function saveDb(data) {
  // Compatibility no-op or sync for tests
}
