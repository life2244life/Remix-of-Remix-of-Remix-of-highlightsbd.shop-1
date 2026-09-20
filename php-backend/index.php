<?php
header('Content-Type: application/json');
echo json_encode([
    'name' => 'MyShop PHP Backend',
    'version' => '1.0.0',
    'endpoints' => [
        'POST   /api/auth.php?action=signup',
        'POST   /api/auth.php?action=login',
        'GET    /api/auth.php?action=me',
        'GET    /api/products.php',
        'GET    /api/products.php?id=xxx',
        'GET    /api/products.php?slug=xxx',
        'POST   /api/products.php  (admin)',
        'PUT    /api/products.php?id=xxx  (admin)',
        'DELETE /api/products.php?id=xxx  (admin)',
        'POST   /api/orders.php',
        'GET    /api/orders.php?id=xxx',
        'GET    /api/orders.php  (admin)',
        'PUT    /api/orders.php?id=xxx  (admin)',
        'POST   /api/upload.php  (admin, multipart file)',
        'GET    /api/settings.php?type=store|seo|tracking|zones|packaging|payment|categories|collections',
    ],
]);
