-- ============================================================
-- SEED DATA — Default settings, delivery zones, payment options
-- Run AFTER 01-schema.sql
-- ============================================================

SET NAMES utf8mb4;

-- ---------- Delivery Zones (default 3) ----------
INSERT INTO delivery_zones (name, fee, is_active) VALUES
  ('Inside Dhaka', 70, 1),
  ('Sub - Urban Dhaka', 90, 1),
  ('Outside Dhaka', 110, 1)
ON DUPLICATE KEY UPDATE fee = VALUES(fee), is_active = VALUES(is_active);

-- ---------- Packaging Options ----------
INSERT INTO packaging_options (name, fee, description, is_active, sort_order) VALUES
  ('Standard', 0, 'Default packaging', 1, 0),
  ('Premium Gift Box', 50, 'Premium gift box with ribbon', 1, 1);

-- ---------- Payment Settings (bKash/Nagad/Rocket placeholders) ----------
INSERT INTO checkout_payment_settings (provider, number, instructions, is_active) VALUES
  ('bkash',  '01XXXXXXXXX', 'Send Money kore Transaction ID dao', 1),
  ('nagad',  '01XXXXXXXXX', 'Send Money kore Transaction ID dao', 1),
  ('rocket', '01XXXXXXXXX0', 'Send Money kore Transaction ID dao', 1)
ON DUPLICATE KEY UPDATE number = VALUES(number);

-- ---------- Store Settings (basic) ----------
INSERT INTO store_settings (`key`, value) VALUES
  ('store_name', 'My Shop'),
  ('store_phone', '01XXXXXXXXX'),
  ('store_email', 'support@example.com'),
  ('store_address', 'Dhaka, Bangladesh'),
  ('currency', 'BDT'),
  ('currency_symbol', '৳')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ---------- SEO Settings ----------
INSERT INTO seo_settings (`key`, value) VALUES
  ('site_title', 'My Shop - Best Fashion Store'),
  ('site_description', 'Quality fashion products at affordable prices'),
  ('og_image', ''),
  ('favicon', '/favicon.ico')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ---------- Tracking Settings ----------
INSERT INTO tracking_settings (`key`, value) VALUES
  ('meta_pixel_id', ''),
  ('google_analytics_id', ''),
  ('google_tag_manager_id', '')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- ---------- Header Categories ----------
INSERT INTO header_categories (name, slug, sort_order, is_active) VALUES
  ('Men', 'men', 1, 1),
  ('Women', 'women', 2, 1),
  ('Kids', 'kids', 3, 1);

-- ============================================================
-- ADMIN USER CREATION
-- ============================================================
-- NOTE: Password hash PHP/Node backend e generate korte hobe (bcrypt).
-- Ekhane shudhu placeholder. Backend banano holey admin signup korte parba.
--
-- Example (PHP): password_hash('your_password', PASSWORD_BCRYPT)
-- ============================================================

-- Uncomment kore use koro (password hash bosao):
-- SET @admin_id = UUID();
-- INSERT INTO auth_users (id, email, password_hash, email_confirmed)
-- VALUES (@admin_id, 'admin@example.com', '$2y$10$REPLACE_WITH_BCRYPT_HASH', 1);
-- INSERT INTO profiles (user_id, display_name) VALUES (@admin_id, 'Admin');
-- INSERT INTO user_roles (user_id, role) VALUES (@admin_id, 'admin');

-- ============================================================
-- DONE
-- ============================================================
