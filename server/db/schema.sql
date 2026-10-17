-- ==============================================================================
-- Glacial Tech Accessories - PostgreSQL Migration Schema
-- Compatible with PostgreSQL 14+
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  name_bn VARCHAR(128),
  description TEXT,
  badge VARCHAR(64),
  icon VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Brands and phone models
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  models_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(128) PRIMARY KEY,
  sku VARCHAR(64) UNIQUE,
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  category_id VARCHAR(64) NOT NULL REFERENCES categories(id) ON UPDATE CASCADE,
  brand VARCHAR(64),
  model VARCHAR(128),
  photo_ref VARCHAR(32),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  original_price NUMERIC(10, 2) CHECK (original_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status VARCHAR(32) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  badge VARCHAR(64),
  warranty VARCHAR(128),
  description TEXT,
  specs_json JSONB DEFAULT '{}'::jsonb,
  image TEXT,
  gallery_json JSONB DEFAULT '[]'::jsonb,
  compatible_with_json JSONB DEFAULT '[]'::jsonb,
  is_development_seed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- 4. Product Variants
CREATE TABLE IF NOT EXISTS product_variants (
  id VARCHAR(128) PRIMARY KEY,
  product_id VARCHAR(128) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(64),
  name VARCHAR(128) NOT NULL,
  hex VARCHAR(32),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  in_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- 5. Inventory Adjustments (Audit Log)
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id BIGSERIAL PRIMARY KEY,
  product_id VARCHAR(128) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id VARCHAR(128),
  quantity_change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason VARCHAR(255) NOT NULL,
  adjusted_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_product ON inventory_adjustments(product_id);

-- 6. Customer & Admin Users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  name VARCHAR(128) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  addresses_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 7. User Sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  token VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(32) NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

-- 8. Customer Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  product_ids_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Orders
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  guest_token VARCHAR(128),
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_division VARCHAR(64) NOT NULL,
  customer_outside_city BOOLEAN NOT NULL DEFAULT FALSE,
  customer_address TEXT NOT NULL,
  customer_notes TEXT,
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'unpaid',
  transaction_id VARCHAR(128),
  payment_details_json JSONB,
  status VARCHAR(32) NOT NULL DEFAULT 'confirmed',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  timeline_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_guest_token ON orders(guest_token);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 10. Order Items (Preserving Snapshots)
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL,
  variant_id VARCHAR(128),
  sku VARCHAR(64),
  title VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  variant_name VARCHAR(128),
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL,
  product_snapshot_json JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- 11. Inventory Reservations
CREATE TABLE IF NOT EXISTS inventory_reservations (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL,
  variant_id VARCHAR(128),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  expires_at BIGINT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'committed', 'released')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reservations_status_expires ON inventory_reservations(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_order ON inventory_reservations(order_id);

-- 12. Verified Customer Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(64) PRIMARY KEY,
  product_id VARCHAR(128) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  user_name VARCHAR(128) NOT NULL,
  comment TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_status ON reviews(product_id, status);

-- 13. Promotions
CREATE TABLE IF NOT EXISTS promotions (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(128) NOT NULL,
  discount_type VARCHAR(32) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  product_id VARCHAR(128) REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(is_active, start_date, end_date);

-- 14. Service Offerings
CREATE TABLE IF NOT EXISTS services_catalog (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  name_bn VARCHAR(128),
  description TEXT,
  price_type VARCHAR(32) NOT NULL DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'quotation')),
  base_price NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 15. Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
  guest_token VARCHAR(128),
  customer_name VARCHAR(128) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  service_id VARCHAR(64) REFERENCES services_catalog(id) ON DELETE SET NULL,
  service_name VARCHAR(128) NOT NULL,
  device_model VARCHAR(128) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'in_review', 'quoted', 'in_progress', 'completed', 'cancelled')),
  quoted_price NUMERIC(10, 2),
  timeline_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. Payment Sessions
CREATE TABLE IF NOT EXISTS payment_sessions (
  session_id VARCHAR(128) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(16) NOT NULL DEFAULT 'BDT',
  provider VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  meta_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. Idempotency Keys
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key VARCHAR(128) PRIMARY KEY,
  response_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Login Rate Limiting
CREATE TABLE IF NOT EXISTS login_attempts (
  ip VARCHAR(64) NOT NULL,
  identifier VARCHAR(255) NOT NULL,
  attempt_time BIGINT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_lookup ON login_attempts(ip, identifier, attempt_time);
