<?php
require_once __DIR__ . '/../includes/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = db();
$id = $_GET['id'] ?? null;

if ($method === 'POST') {
    $in = json_input();
    $oid = uuid_v4();
    $order_number = 'ORD-' . strtoupper(substr(uuid_v4(), 0, 8));
    $user = get_auth_user();

    $db->prepare("INSERT INTO orders (id, order_number, user_id, customer_name, customer_phone, customer_address, customer_email, items, subtotal, delivery_charge, discount, total, payment_method, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())")
       ->execute([
           $oid, $order_number, $user['sub'] ?? null,
           $in['customer_name'], $in['customer_phone'], $in['customer_address'], $in['customer_email'] ?? null,
           json_encode($in['items']),
           $in['subtotal'], $in['delivery_charge'] ?? 0, $in['discount'] ?? 0, $in['total'],
           $in['payment_method'] ?? 'cod'
       ]);

    // deduct stock
    foreach ($in['items'] as $it) {
        if (!empty($it['size']) && !empty($it['product_id'])) {
            $db->prepare("UPDATE product_size_stock SET stock = GREATEST(0, stock - ?) WHERE product_id = ? AND size = ?")
               ->execute([$it['quantity'], $it['product_id'], $it['size']]);
        }
    }
    respond(['id' => $oid, 'order_number' => $order_number], 201);
}

if ($method === 'GET') {
    if ($id) {
        $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?");
        $stmt->execute([$id, $id]);
        $o = $stmt->fetch();
        if (!$o) error_response('Not found', 404);
        $o['items'] = json_decode($o['items'], true);
        respond($o);
    }
    require_admin();
    $status = $_GET['status'] ?? null;
    $sql = "SELECT * FROM orders";
    $params = [];
    if ($status) { $sql .= " WHERE status = ?"; $params[] = $status; }
    $sql .= " ORDER BY created_at DESC LIMIT 200";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    respond($stmt->fetchAll());
}

if ($method === 'PUT' && $id) {
    require_admin();
    $in = json_input();
    $db->prepare("UPDATE orders SET status = ?, tracking_number = ?, notes = ? WHERE id = ?")
       ->execute([$in['status'] ?? 'pending', $in['tracking_number'] ?? null, $in['notes'] ?? null, $id]);
    respond(['ok' => true]);
}

error_response('Not found', 404);
