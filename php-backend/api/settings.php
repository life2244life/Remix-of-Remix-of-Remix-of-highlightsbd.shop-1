<?php
require_once __DIR__ . '/../includes/helpers.php';
$db = db();
$type = $_GET['type'] ?? 'store';

$tables = [
    'store' => 'store_settings',
    'seo' => 'seo_settings',
    'tracking' => 'tracking_settings',
    'zones' => 'delivery_zones',
    'packaging' => 'packaging_options',
    'payment' => 'checkout_payment_settings',
    'categories' => 'header_categories',
    'collections' => 'collections',
];
if (!isset($tables[$type])) error_response('Invalid type');
$table = $tables[$type];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    respond($db->query("SELECT * FROM $table")->fetchAll());
}

error_response('Not allowed', 405);
