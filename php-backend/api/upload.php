<?php
require_once __DIR__ . '/../includes/helpers.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') error_response('POST only', 405);
if (empty($_FILES['file'])) error_response('No file');

$f = $_FILES['file'];
if ($f['size'] > MAX_UPLOAD_SIZE) error_response('File too large');

$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
$mime = mime_content_type($f['tmp_name']);
if (!isset($allowed[$mime])) error_response('Invalid file type');

if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

$name = uuid_v4() . '.' . $allowed[$mime];
$path = UPLOAD_DIR . $name;
if (!move_uploaded_file($f['tmp_name'], $path)) error_response('Upload failed', 500);

respond(['url' => UPLOAD_URL . $name, 'filename' => $name]);
