-- ============================================================
-- SAMPLE PRODUCTS (Optional — for testing)
-- Run AFTER 01-schema.sql and 02-seed-data.sql
-- ============================================================

SET NAMES utf8mb4;

INSERT INTO products
  (name, price, original_price, image_url, category, description, sizes, colors, stock, featured, brand, sku, is_active, slug)
VALUES
  ('Classic Black T-Shirt', 550, 750, 'https://via.placeholder.com/600x800', 'men', 'Premium cotton t-shirt',
   JSON_ARRAY('S','M','L','XL'), JSON_ARRAY(), 100, 1, 'MyShop', 'TSH-001', 1, 'classic-black-t-shirt'),

  ('Denim Jacket', 1850, 2200, 'https://via.placeholder.com/600x800', 'men', 'Classic blue denim jacket',
   JSON_ARRAY('M','L','XL'), JSON_ARRAY(), 50, 1, 'MyShop', 'JKT-001', 1, 'denim-jacket'),

  ('Floral Summer Dress', 1200, 1500, 'https://via.placeholder.com/600x800', 'women', 'Lightweight summer dress',
   JSON_ARRAY('S','M','L'), JSON_ARRAY(), 75, 1, 'MyShop', 'DRS-001', 1, 'floral-summer-dress');

-- Size-wise stock for each
INSERT INTO product_size_stock (product_id, size, total_stock)
SELECT id, 'S',  30 FROM products WHERE sku = 'TSH-001'
UNION ALL SELECT id, 'M', 30 FROM products WHERE sku = 'TSH-001'
UNION ALL SELECT id, 'L', 25 FROM products WHERE sku = 'TSH-001'
UNION ALL SELECT id, 'XL',15 FROM products WHERE sku = 'TSH-001';

-- ============================================================
-- DONE
-- ============================================================
