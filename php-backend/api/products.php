<?php
require_once __DIR__ . '/../includes/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id']   ?? null;
$slug   = $_GET['slug'] ?? null;
$db     = db();

// ---------- helper: decode JSON fields ----------
function hydrate_product(&$p) {
    foreach (['sizes', 'colors', 'size_chart'] as $f) {
        if (isset($p[$f]) && is_string($p[$f])) {
            $p[$f] = json_decode($p[$f], true);
        }
    }
}

// ============= GET =============
if ($method === 'GET') {
    if ($id || $slug) {
        $where = $id ? 'id = ?' : 'slug = ?';
        $stmt = $db->prepare("SELECT * FROM products WHERE $where");
        $stmt->execute([$id ?: $slug]);
        $p = $stmt->fetch();
        if (!$p) error_response('Product not found', 404);
        hydrate_product($p);

        // gallery images
        $imgs = $db->prepare("SELECT id, image_url, sort_order, alt_text FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
        $imgs->execute([$p['id']]);
        $p['gallery'] = $imgs->fetchAll();

        // size-wise stock
        $stk = $db->prepare("SELECT size, total_stock, sold_count, cancelled_count, returned_count FROM product_size_stock WHERE product_id = ?");
        $stk->execute([$p['id']]);
        $p['size_stock'] = $stk->fetchAll();

        respond($p);
    }

    // ---- list ----
    $limit    = min(200, (int)($_GET['limit']    ?? 100));
    $offset   = max(0, (int)($_GET['offset']   ?? 0));
    $category = $_GET['category'] ?? null;
    $featured = $_GET['featured'] ?? null;

    $where = ['is_active = 1'];
    $args  = [];
    if ($category) { $where[] = 'category = ?'; $args[] = $category; }
    if ($featured !== null) { $where[] = 'featured = ?'; $args[] = (int)$featured; }

    $sql = "SELECT * FROM products WHERE " . implode(' AND ', $where)
         . " ORDER BY created_at DESC LIMIT $limit OFFSET $offset";
    $stmt = $db->prepare($sql);
    $stmt->execute($args);
    $products = $stmt->fetchAll();

    foreach ($products as &$p) {
        hydrate_product($p);
        $i = $db->prepare("SELECT image_url FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 2");
        $i->execute([$p['id']]);
        $p['gallery'] = $i->fetchAll();
    }
    respond($products);
}

// ============= POST (create) =============
if ($method === 'POST') {
    require_admin();
    $in = json_input();

    $required = ['name', 'price', 'image_url', 'category', 'description'];
    foreach ($required as $f) {
        if (!isset($in[$f]) || $in[$f] === '') error_response("Missing field: $f");
    }

    $pid  = uuid_v4();
    $slug = !empty($in['slug']) ? $in['slug'] : strtolower(preg_replace('/[^a-z0-9]+/i', '-', $in['name']));

    $db->beginTransaction();
    try {
        $db->prepare("
            INSERT INTO products
              (id, name, price, original_price, image_url, category, description,
               sizes, colors, stock, featured, brand, sku, size_chart, subcategory,
               is_new_drop, is_active, slug, alt_text, seo_title, seo_description, og_image, noindex)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ")->execute([
            $pid,
            $in['name'],
            (int)$in['price'],
            isset($in['original_price']) ? (int)$in['original_price'] : null,
            $in['image_url'],
            $in['category'],
            $in['description'],
            json_encode($in['sizes']  ?? []),
            json_encode($in['colors'] ?? []),
            (int)($in['stock'] ?? 0),
            !empty($in['featured']) ? 1 : 0,
            $in['brand'] ?? '',
            $in['sku']   ?? '',
            isset($in['size_chart']) ? json_encode($in['size_chart']) : null,
            $in['subcategory'] ?? null,
            !empty($in['is_new_drop']) ? 1 : 0,
            isset($in['is_active']) ? (int)$in['is_active'] : 1,
            $slug,
            $in['alt_text']        ?? null,
            $in['seo_title']       ?? null,
            $in['seo_description'] ?? null,
            $in['og_image']        ?? null,
            !empty($in['noindex']) ? 1 : 0,
        ]);

        // gallery images
        if (!empty($in['gallery']) && is_array($in['gallery'])) {
            $g = $db->prepare("INSERT INTO product_images (id, product_id, image_url, sort_order, alt_text) VALUES (?,?,?,?,?)");
            foreach ($in['gallery'] as $i => $img) {
                $url = is_array($img) ? ($img['image_url'] ?? '') : $img;
                $alt = is_array($img) ? ($img['alt_text']  ?? null) : null;
                if ($url) $g->execute([uuid_v4(), $pid, $url, $i, $alt]);
            }
        }

        // size-wise stock
        if (!empty($in['size_stock']) && is_array($in['size_stock'])) {
            $s = $db->prepare("INSERT INTO product_size_stock (id, product_id, size, total_stock) VALUES (?,?,?,?)");
            foreach ($in['size_stock'] as $ss) {
                $s->execute([uuid_v4(), $pid, $ss['size'], (int)($ss['total_stock'] ?? 0)]);
            }
        }

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        error_response('Create failed: ' . $e->getMessage(), 500);
    }

    respond(['id' => $pid, 'slug' => $slug], 201);
}

// ============= PUT (update) =============
if ($method === 'PUT' && $id) {
    require_admin();
    $in = json_input();

    $fields = [];
    $args   = [];
    $map = [
        'name','price','original_price','image_url','category','description',
        'brand','sku','subcategory','slug','alt_text','seo_title','seo_description','og_image',
        'featured','is_new_drop','is_active','noindex','stock'
    ];
    foreach ($map as $f) {
        if (array_key_exists($f, $in)) { $fields[] = "$f = ?"; $args[] = $in[$f]; }
    }
    foreach (['sizes','colors','size_chart'] as $jf) {
        if (array_key_exists($jf, $in)) { $fields[] = "$jf = ?"; $args[] = json_encode($in[$jf]); }
    }
    if ($fields) {
        $args[] = $id;
        $db->prepare("UPDATE products SET " . implode(',', $fields) . " WHERE id = ?")->execute($args);
    }

    // replace gallery if provided
    if (isset($in['gallery']) && is_array($in['gallery'])) {
        $db->prepare("DELETE FROM product_images WHERE product_id = ?")->execute([$id]);
        $g = $db->prepare("INSERT INTO product_images (id, product_id, image_url, sort_order, alt_text) VALUES (?,?,?,?,?)");
        foreach ($in['gallery'] as $i => $img) {
            $url = is_array($img) ? ($img['image_url'] ?? '') : $img;
            $alt = is_array($img) ? ($img['alt_text']  ?? null) : null;
            if ($url) $g->execute([uuid_v4(), $id, $url, $i, $alt]);
        }
    }

    // replace size stock if provided
    if (isset($in['size_stock']) && is_array($in['size_stock'])) {
        $db->prepare("DELETE FROM product_size_stock WHERE product_id = ?")->execute([$id]);
        $s = $db->prepare("INSERT INTO product_size_stock (id, product_id, size, total_stock) VALUES (?,?,?,?)");
        foreach ($in['size_stock'] as $ss) {
            $s->execute([uuid_v4(), $id, $ss['size'], (int)($ss['total_stock'] ?? 0)]);
        }
    }

    respond(['ok' => true]);
}

// ============= DELETE =============
if ($method === 'DELETE' && $id) {
    require_admin();
    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    respond(['ok' => true]);
}

error_response('Not found', 404);
