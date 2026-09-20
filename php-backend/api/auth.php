<?php
require_once __DIR__ . '/../includes/helpers.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$db = db();

// ---------- SIGNUP ----------
if ($action === 'signup' && $method === 'POST') {
    $in = json_input();
    $email = trim(strtolower($in['email'] ?? ''));
    $password = $in['password'] ?? '';
    $display_name = trim($in['display_name'] ?? $in['full_name'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) error_response('Invalid email');
    if (strlen($password) < 6) error_response('Password must be at least 6 characters');

    $stmt = $db->prepare("SELECT id FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) error_response('Email already registered', 409);

    $id = uuid_v4();
    $hash = password_hash($password, PASSWORD_BCRYPT);

    $db->beginTransaction();
    try {
        $db->prepare("INSERT INTO auth_users (id, email, password_hash, email_confirmed) VALUES (?, ?, ?, 1)")
           ->execute([$id, $email, $hash]);
        $db->prepare("INSERT INTO profiles (id, user_id, display_name) VALUES (?, ?, ?)")
           ->execute([uuid_v4(), $id, $display_name ?: $email]);
        $db->prepare("INSERT INTO user_roles (id, user_id, role) VALUES (?, ?, 'user')")
           ->execute([uuid_v4(), $id]);
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        error_response('Signup failed: ' . $e->getMessage(), 500);
    }

    $token = jwt_encode(['sub' => $id, 'email' => $email]);
    respond([
        'token' => $token,
        'user' => ['id' => $id, 'email' => $email, 'display_name' => $display_name]
    ]);
}

// ---------- LOGIN ----------
if ($action === 'login' && $method === 'POST') {
    $in = json_input();
    $email = trim(strtolower($in['email'] ?? ''));
    $password = $in['password'] ?? '';

    $stmt = $db->prepare("SELECT id, password_hash FROM auth_users WHERE email = ?");
    $stmt->execute([$email]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($password, $row['password_hash'])) {
        error_response('Invalid credentials', 401);
    }

    $token = jwt_encode(['sub' => $row['id'], 'email' => $email]);

    // Get profile + role
    $prof = $db->prepare("SELECT display_name, phone, address, city FROM profiles WHERE user_id = ?");
    $prof->execute([$row['id']]);
    $p = $prof->fetch() ?: [];

    $rstmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $rstmt->execute([$row['id']]);
    $roles = array_column($rstmt->fetchAll(), 'role');

    respond([
        'token' => $token,
        'user' => array_merge(['id' => $row['id'], 'email' => $email, 'roles' => $roles], $p)
    ]);
}

// ---------- ME ----------
if ($action === 'me' && $method === 'GET') {
    $user = require_auth();
    $stmt = $db->prepare("
        SELECT u.id, u.email, p.display_name, p.phone, p.address, p.city
        FROM auth_users u
        LEFT JOIN profiles p ON p.user_id = u.id
        WHERE u.id = ?
    ");
    $stmt->execute([$user['sub']]);
    $u = $stmt->fetch();
    if (!$u) error_response('User not found', 404);

    $rstmt = $db->prepare("SELECT role FROM user_roles WHERE user_id = ?");
    $rstmt->execute([$user['sub']]);
    $u['roles'] = array_column($rstmt->fetchAll(), 'role');

    respond(['user' => $u]);
}

// ---------- UPDATE PROFILE ----------
if ($action === 'update_profile' && $method === 'POST') {
    $user = require_auth();
    $in = json_input();
    $db->prepare("
        UPDATE profiles
        SET display_name = COALESCE(?, display_name),
            phone        = COALESCE(?, phone),
            address      = COALESCE(?, address),
            city         = COALESCE(?, city)
        WHERE user_id = ?
    ")->execute([
        $in['display_name'] ?? null,
        $in['phone'] ?? null,
        $in['address'] ?? null,
        $in['city'] ?? null,
        $user['sub']
    ]);
    respond(['ok' => true]);
}

// ---------- LOGOUT (client-side discards token; server stateless) ----------
if ($action === 'logout' && $method === 'POST') {
    respond(['ok' => true]);
}

error_response('Unknown action', 404);
