-- ============================================================
-- FULL MySQL SCHEMA (Converted from PostgreSQL/Supabase)
-- Target: MySQL 8.0+ (utf8mb4)
-- Import: phpMyAdmin -> Import -> Choose this file -> Go
-- ============================================================
-- NOTE for User:
-- 1. Eta SHUDHU database schema. Tomar website ekhono Supabase er sathe kotha bole.
--    MySQL pura kaaj korte hole, pore ekta PHP/Node backend banate hobe
--    je ei MySQL er sathe kotha bolbe.
-- 2. MySQL e RLS (Row Level Security) nai. Access control backend code e korte hobe.
-- 3. UUID guli CHAR(36). MySQL e UUID() function diye generate hoy.
-- 4. PostgreSQL `text[]` arrays -> MySQL JSON (array akare store hobe).
-- 5. PostgreSQL `jsonb` -> MySQL JSON.
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';

-- ============================================================
-- TABLES
-- ============================================================

-- ---------- auth_users (Supabase auth.users er bodole) ----------
CREATE TABLE IF NOT EXISTS auth_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email_confirmed TINYINT(1) NOT NULL DEFAULT 0,
  raw_user_meta_data JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY auth_users_email_key (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- profiles ----------
CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  display_name TEXT,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY profiles_user_id_key (user_id),
  CONSTRAINT fk_profiles_user FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- user_roles ----------
CREATE TABLE IF NOT EXISTS user_roles (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  role ENUM('admin','moderator','user') NOT NULL DEFAULT 'user',
  PRIMARY KEY (id),
  UNIQUE KEY user_roles_user_role (user_id, role),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- products ----------
CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(500) NOT NULL,
  price INT NOT NULL,
  original_price INT DEFAULT NULL,
  image_url TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sizes JSON NOT NULL,
  colors JSON NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  brand VARCHAR(255) NOT NULL DEFAULT '',
  sku VARCHAR(255) NOT NULL DEFAULT '',
  size_chart JSON DEFAULT NULL,
  subcategory VARCHAR(255) DEFAULT NULL,
  is_new_drop TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  slug VARCHAR(500) DEFAULT NULL,
  alt_text TEXT,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  noindex TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY products_slug_key (slug),
  KEY idx_products_category (category),
  KEY idx_products_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- product_images ----------
CREATE TABLE IF NOT EXISTS product_images (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  product_id CHAR(36) NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_product_images_product (product_id),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- product_size_stock ----------
CREATE TABLE IF NOT EXISTS product_size_stock (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  product_id CHAR(36) NOT NULL,
  size VARCHAR(50) NOT NULL,
  total_stock INT NOT NULL DEFAULT 0,
  sold_count INT NOT NULL DEFAULT 0,
  cancelled_count INT NOT NULL DEFAULT 0,
  returned_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY product_size_stock_product_size (product_id, size),
  CONSTRAINT fk_pss_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- orders ----------
CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) DEFAULT NULL,
  items JSON NOT NULL,
  total INT NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) DEFAULT NULL,
  customer_note TEXT,
  delivery_method VARCHAR(100) NOT NULL DEFAULT 'standard',
  payment_method VARCHAR(50) NOT NULL DEFAULT 'cod',
  status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  consignment_id VARCHAR(255) DEFAULT NULL,
  tracking_code VARCHAR(255) DEFAULT NULL,
  courier_provider VARCHAR(100) DEFAULT NULL,
  transaction_id VARCHAR(255) DEFAULT NULL,
  payment_sender_number VARCHAR(50) DEFAULT NULL,
  order_token VARCHAR(128) DEFAULT NULL,
  discount INT NOT NULL DEFAULT 0,
  delivery_charge INT NOT NULL DEFAULT 0,
  courier_fee INT NOT NULL DEFAULT 0,
  source VARCHAR(50) NOT NULL DEFAULT 'website',
  advance_payment INT NOT NULL DEFAULT 0,
  call_attempts INT NOT NULL DEFAULT 0,
  admin_notes TEXT,
  return_received TINYINT(1) NOT NULL DEFAULT 0,
  coupon_code VARCHAR(100) DEFAULT NULL,
  deleted_at DATETIME DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY orders_order_token_key (order_token),
  KEY idx_orders_user (user_id),
  KEY idx_orders_status (status),
  KEY idx_orders_phone (customer_phone),
  KEY idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- coupons ----------
CREATE TABLE IF NOT EXISTS coupons (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL DEFAULT '',
  code VARCHAR(100) NOT NULL,
  discount_type ENUM('fixed','percentage','free_shipping') NOT NULL DEFAULT 'fixed',
  discount_value INT NOT NULL DEFAULT 0,
  min_order_amount INT NOT NULL DEFAULT 0,
  max_uses INT DEFAULT NULL,
  used_count INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY coupons_code_key (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- delivery_zones ----------
CREATE TABLE IF NOT EXISTS delivery_zones (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fee INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY delivery_zones_name_key (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- packaging_options ----------
CREATE TABLE IF NOT EXISTS packaging_options (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- checkout_payment_settings ----------
CREATE TABLE IF NOT EXISTS checkout_payment_settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  provider VARCHAR(100) NOT NULL,
  number VARCHAR(100) NOT NULL DEFAULT '',
  instructions TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY checkout_payment_provider_key (provider)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- collections ----------
CREATE TABLE IF NOT EXISTS collections (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  heading TEXT NOT NULL,
  subheading TEXT NOT NULL,
  description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  og_image TEXT NOT NULL,
  filter_categories JSON NOT NULL,
  filter_subcategories JSON NOT NULL,
  filter_product_ids JSON NOT NULL,
  filter_featured TINYINT(1) DEFAULT NULL,
  filter_new_drop TINYINT(1) DEFAULT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  noindex TINYINT(1) NOT NULL DEFAULT 0,
  show_in_nav TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY collections_slug_key (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- custom_pages ----------
CREATE TABLE IF NOT EXISTS custom_pages (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL DEFAULT '',
  banner_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  product_ids JSON NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  noindex TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY custom_pages_slug_key (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- header_categories ----------
CREATE TABLE IF NOT EXISTS header_categories (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY header_categories_slug_key (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- subcategories ----------
CREATE TABLE IF NOT EXISTS subcategories (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  parent_category VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_subcategories_parent (parent_category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- blog_posts ----------
CREATE TABLE IF NOT EXISTS blog_posts (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  cover_image TEXT NOT NULL,
  cover_alt TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  noindex TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY blog_posts_slug_key (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- reviews ----------
CREATE TABLE IF NOT EXISTS reviews (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  product_id CHAR(36) NOT NULL,
  user_id CHAR(36) DEFAULT NULL,
  name VARCHAR(255) NOT NULL,
  rating TINYINT NOT NULL,
  comment TEXT NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  photo_url TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reviews_product (product_id),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- wishlist_items ----------
CREATE TABLE IF NOT EXISTS wishlist_items (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  product_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY wishlist_user_product (user_id, product_id),
  CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- newsletter_subscribers ----------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY newsletter_email_key (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- fraud_checks ----------
CREATE TABLE IF NOT EXISTS fraud_checks (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Unknown',
  score INT NOT NULL DEFAULT 0,
  total_parcel INT NOT NULL DEFAULT 0,
  success_parcel INT NOT NULL DEFAULT 0,
  cancel_parcel INT NOT NULL DEFAULT 0,
  response JSON NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'LIVE',
  checked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY fraud_checks_phone_key (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- stock_logs ----------
CREATE TABLE IF NOT EXISTS stock_logs (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  product_id CHAR(36) NOT NULL,
  size VARCHAR(50) NOT NULL,
  change_type VARCHAR(50) NOT NULL DEFAULT 'manual',
  quantity INT NOT NULL DEFAULT 0,
  order_id CHAR(36) DEFAULT NULL,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stock_logs_product (product_id),
  KEY idx_stock_logs_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- seo_settings ----------
CREATE TABLE IF NOT EXISTS seo_settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  `key` VARCHAR(255) NOT NULL,
  value LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY seo_settings_key_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- store_settings ----------
CREATE TABLE IF NOT EXISTS store_settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  `key` VARCHAR(255) NOT NULL,
  value LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY store_settings_key_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- tracking_settings ----------
CREATE TABLE IF NOT EXISTS tracking_settings (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  `key` VARCHAR(255) NOT NULL,
  value LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY tracking_settings_key_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- trash_users ----------
CREATE TABLE IF NOT EXISTS trash_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  original_user_id CHAR(36) NOT NULL,
  email VARCHAR(255),
  display_name TEXT,
  phone VARCHAR(50),
  city VARCHAR(100),
  address TEXT,
  role VARCHAR(50) DEFAULT 'user',
  deleted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA (default delivery zones)
-- ============================================================
INSERT INTO delivery_zones (name, fee, is_active) VALUES
  ('Inside Dhaka', 70, 1),
  ('Sub - Urban Dhaka', 90, 1),
  ('Outside Dhaka', 110, 1)
ON DUPLICATE KEY UPDATE fee = VALUES(fee);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DONE.
-- 24 tables created. Auth + Access Control backend code e korte hobe.
-- ============================================================
