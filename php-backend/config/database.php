<?php
// MySQL Database Configuration
// Hostinger e cPanel theke ei value gula nibe

define('DB_HOST', 'localhost');
define('DB_NAME', 'eidlipsh_database');     // Hostinger database name
define('DB_USER', 'eidlipsh_database');     // Hostinger database user
define('DB_PASS', 'Rajon1234**@');          // Hostinger database password
define('DB_CHARSET', 'utf8mb4');

define('JWT_SECRET', 'change-this-to-a-long-random-string-min-32-chars');
define('JWT_EXPIRY', 60 * 60 * 24 * 7); // 7 days

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', '/php-backend/uploads/');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB

define('CORS_ORIGIN', '*'); // production e tomar domain dao

function db() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}
