<?php
require_once __DIR__ . '/../config/database.php';

// CORS headers
header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function json_input() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function error_response($message, $code = 400) {
    respond(['error' => $message], $code);
}

function uuid_v4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Simple JWT (HS256)
function jwt_encode($payload) {
    $header = ['typ' => 'JWT', 'alg' => 'HS256'];
    $payload['exp'] = time() + JWT_EXPIRY;
    $payload['iat'] = time();
    $h = base64url(json_encode($header));
    $p = base64url(json_encode($payload));
    $sig = base64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$sig";
}

function jwt_decode($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = base64url(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(base64url_decode($p), true);
    if (!$payload || ($payload['exp'] ?? 0) < time()) return null;
    return $payload;
}

function base64url($d) {
    return rtrim(strtr(base64_encode($d), '+/', '-_'), '=');
}
function base64url_decode($d) {
    return base64_decode(strtr($d, '-_', '+/'));
}

function get_auth_user() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s+(.*)/', $auth, $m)) return null;
    return jwt_decode($m[1]);
}

function require_auth() {
    $user = get_auth_user();
    if (!$user) error_response('Unauthorized', 401);
    return $user;
}

function require_admin() {
    $user = require_auth();
    $stmt = db()->prepare("SELECT 1 FROM user_roles WHERE user_id = ? AND role = 'admin'");
    $stmt->execute([$user['sub']]);
    if (!$stmt->fetchColumn()) error_response('Admin only', 403);
    return $user;
}
