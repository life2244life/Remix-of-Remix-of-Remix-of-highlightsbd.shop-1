<?php
/**
 * Dynamic rendering for social crawlers on Apache / Hostinger.
 *
 * Mirror of api/og.ts for the Vercel deployment. Invoked ONLY for crawler
 * user-agents (see the crawler-scoped RewriteRule in .htaccess). Reads the
 * deployed static index.html, swaps the title/description/og/twitter/canonical
 * tags with the correct per-route values pulled from the existing database, and
 * echoes the result. Human visitors never reach this file, so the SPA + Helmet
 * behaviour is unchanged. No DB writes, no UI, no new settings.
 */

$SUPABASE_URL = getenv('VITE_SUPABASE_URL') ?: 'https://mllbzpcqxpwedqqfrqyu.supabase.co';
$SUPABASE_KEY = getenv('VITE_SUPABASE_PUBLISHABLE_KEY')
  ?: (getenv('VITE_SUPABASE_ANON_KEY') ?: 'sb_publishable_0gcWEJO0ZKpGXVFrNUCO5Q_ccJQsPAx');

$DEFAULT_ORIGIN = 'https://demo.eidlip.com';
$DEFAULT_DESC = 'EIDLIP (eidlip) — Bangladeshi unisex clothing brand. Shop shirts, t-shirts, pants & everyday wear with cash on delivery across BD.';
$DEFAULT_IMAGE = '/logo.png';

function eidlip_esc($s) { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function eidlip_clip($s, $n = 155) { return mb_substr(trim((string)$s), 0, $n, 'UTF-8'); }

function eidlip_pgrest($path) {
  global $SUPABASE_URL, $SUPABASE_KEY;
  $url = $SUPABASE_URL . '/rest/v1/' . $path;
  $ctx = stream_context_create(['http' => [
    'method' => 'GET',
    'header' => "apikey: $SUPABASE_KEY\r\nAuthorization: Bearer $SUPABASE_KEY\r\n",
    'timeout' => 5,
    'ignore_errors' => true,
  ]]);
  $raw = @file_get_contents($url, false, $ctx);
  if ($raw === false) return [];
  $json = json_decode($raw, true);
  return is_array($json) ? $json : [];
}

function eidlip_origin() {
  global $DEFAULT_ORIGIN;
  $rows = eidlip_pgrest('seo_settings?select=key,value');
  $map = [];
  foreach ($rows as $r) { if (!empty($r['value'])) $map[$r['key']] = $r['value']; }
  $base = $map['canonical_base_url'] ?? ($map['site_url'] ?? $DEFAULT_ORIGIN);
  return rtrim($base, '/');
}

function eidlip_meta($path) {
  global $DEFAULT_DESC, $DEFAULT_IMAGE;
  $base = ['title' => 'EIDLIP', 'description' => $DEFAULT_DESC, 'image' => $DEFAULT_IMAGE, 'path' => $path, 'type' => 'website', 'noindex' => false];

  if (preg_match('#^/products/([^/?\#]+)#', $path, $m)) {
    $rows = eidlip_pgrest('products?slug=eq.' . rawurlencode($m[1]) . '&select=id,slug,name,description,image_url,og_image,seo_title,seo_description,noindex,is_active&limit=1');
    $p = $rows[0] ?? null;
    if ($p && ($p['is_active'] ?? true) !== false) {
      return [
        'title' => $p['seo_title'] ?: ($p['name'] ?: 'EIDLIP'),
        'description' => eidlip_clip($p['seo_description'] ?: ($p['description'] ?: ('Shop ' . $p['name'] . ' from EIDLIP — premium clothing in Bangladesh.'))),
        'image' => $p['og_image'] ?: ($p['image_url'] ?: $DEFAULT_IMAGE),
        'path' => $p['slug'] ? ('/products/' . $p['slug']) : ('/product/' . $p['id']),
        'type' => 'product',
        'noindex' => !empty($p['noindex']),
      ];
    }
    return $base;
  }

  if (preg_match('#^/product/([^/?\#]+)#', $path, $m)) {
    $rows = eidlip_pgrest('products?id=eq.' . rawurlencode($m[1]) . '&select=id,slug,name,description,image_url,og_image,seo_title,seo_description,noindex,is_active&limit=1');
    $p = $rows[0] ?? null;
    if ($p && ($p['is_active'] ?? true) !== false) {
      return [
        'title' => $p['seo_title'] ?: ($p['name'] ?: 'EIDLIP'),
        'description' => eidlip_clip($p['seo_description'] ?: ($p['description'] ?: ('Shop ' . $p['name'] . ' from EIDLIP — premium clothing in Bangladesh.'))),
        'image' => $p['og_image'] ?: ($p['image_url'] ?: $DEFAULT_IMAGE),
        'path' => $p['slug'] ? ('/products/' . $p['slug']) : ('/product/' . $p['id']),
        'type' => 'product',
        'noindex' => !empty($p['noindex']),
      ];
    }
    return $base;
  }

  if (preg_match('#^/collections/([^/?\#]+)#', $path, $m)) {
    $rows = eidlip_pgrest('collections?slug=eq.' . rawurlencode($m[1]) . '&select=slug,title,description,seo_title,seo_description,og_image,hero_image,noindex,is_active&limit=1');
    $c = $rows[0] ?? null;
    if ($c && ($c['is_active'] ?? true) !== false) {
      return [
        'title' => $c['seo_title'] ?: ($c['title'] . ' | EIDLIP'),
        'description' => eidlip_clip($c['seo_description'] ?: ($c['description'] ?: $DEFAULT_DESC)),
        'image' => $c['og_image'] ?: ($c['hero_image'] ?: $DEFAULT_IMAGE),
        'path' => '/collections/' . $c['slug'],
        'type' => 'website',
        'noindex' => !empty($c['noindex']),
      ];
    }
    return $base;
  }

  if (preg_match('#^/blog/([^/?\#]+)#', $path, $m)) {
    $rows = eidlip_pgrest('blog_posts?slug=eq.' . rawurlencode($m[1]) . '&select=slug,title,excerpt,cover_image,seo_title,seo_description,noindex&limit=1');
    $b = $rows[0] ?? null;
    if ($b) {
      return [
        'title' => $b['seo_title'] ?: ($b['title'] ?: 'EIDLIP'),
        'description' => eidlip_clip($b['seo_description'] ?: ($b['excerpt'] ?: ($b['title'] ?: $DEFAULT_DESC))),
        'image' => $b['cover_image'] ?: $DEFAULT_IMAGE,
        'path' => '/blog/' . $b['slug'],
        'type' => 'article',
        'noindex' => !empty($b['noindex']),
      ];
    }
    return $base;
  }

  return $base;
}

function eidlip_abs($u, $origin) {
  if (!$u) return $origin . '/';
  if (strpos($u, 'http') === 0) return $u;
  return $origin . ($u[0] === '/' ? $u : '/' . $u);
}

function eidlip_head($meta, $origin) {
  $full = strpos($meta['title'], 'EIDLIP') !== false ? $meta['title'] : ($meta['title'] . ' | EIDLIP');
  $url = eidlip_abs($meta['path'], $origin);
  $img = eidlip_abs($meta['image'], $origin);
  $robots = $meta['noindex'] ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  $t = eidlip_esc($full); $d = eidlip_esc($meta['description']); $u = eidlip_esc($url); $i = eidlip_esc($img);
  return implode("\n    ", [
    "<title>$t</title>",
    "<meta name=\"description\" content=\"$d\" />",
    "<meta name=\"robots\" content=\"$robots\" />",
    "<link rel=\"canonical\" href=\"$u\" />",
    "<meta property=\"og:type\" content=\"" . eidlip_esc($meta['type']) . "\" />",
    "<meta property=\"og:site_name\" content=\"EIDLIP\" />",
    "<meta property=\"og:title\" content=\"$t\" />",
    "<meta property=\"og:description\" content=\"$d\" />",
    "<meta property=\"og:url\" content=\"$u\" />",
    "<meta property=\"og:image\" content=\"$i\" />",
    "<meta property=\"og:image:width\" content=\"1200\" />",
    "<meta property=\"og:image:height\" content=\"630\" />",
    "<meta name=\"twitter:card\" content=\"summary_large_image\" />",
    "<meta name=\"twitter:site\" content=\"@eidlip\" />",
    "<meta name=\"twitter:title\" content=\"$t\" />",
    "<meta name=\"twitter:description\" content=\"$d\" />",
    "<meta name=\"twitter:image\" content=\"$i\" />",
  ]);
}

$shell = @file_get_contents(__DIR__ . '/index.html');
if ($shell === false) { http_response_code(200); echo '<!doctype html><meta charset="utf-8"><title>EIDLIP</title>'; exit; }

$path = isset($_GET['path']) ? (string)$_GET['path'] : '/';
if ($path === '' || $path[0] !== '/') $path = '/' . $path;

$origin = eidlip_origin();
$meta = eidlip_meta($path);

$patterns = [
  '#<title>[\s\S]*?</title>#i',
  '#<meta\s+name=["\']description["\'][^>]*>#i',
  '#<meta\s+name=["\']robots["\'][^>]*>#i',
  '#<link\s+rel=["\']canonical["\'][^>]*>#i',
  '#<meta\s+property=["\']og:(?:type|site_name|title|description|url|image|image:width|image:height)["\'][^>]*>#i',
  '#<meta\s+name=["\']twitter:(?:card|site|title|description|image)["\'][^>]*>#i',
];
$shell = preg_replace($patterns, '', $shell);
$block = '    ' . eidlip_head($meta, $origin) . "\n  </head>";
$shell = preg_replace('#</head>#i', addcslashes($block, '\\$'), $shell, 1);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo $shell;
