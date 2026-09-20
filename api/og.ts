/**
 * Dynamic rendering for social crawlers (Facebook / LinkedIn / Twitter / Slack ...).
 *
 * WHY THIS EXISTS
 * --------------
 * The storefront is a Vite SPA. Per-page <og:*>/<twitter:*> tags are written at
 * runtime by react-helmet-async, which only works for JS-executing crawlers
 * (Googlebot). Social-preview crawlers do NOT run JS, so they previously saw only
 * the generic tags baked into the static index.html and every shared link showed
 * the same EIDLIP preview.
 *
 * This serverless function is invoked ONLY for crawler user-agents (see the
 * crawler-scoped rewrite in vercel.json). It:
 *   1. fetches the unmodified static index.html shell from this same origin,
 *   2. resolves the correct per-route metadata from the existing database
 *      (products / collections / blog posts) — the same fields the React pages use,
 *   3. swaps only the title/description/og/twitter/canonical tags,
 *   4. returns the patched HTML.
 *
 * Human visitors are never routed here, so the SPA + Helmet behaviour is unchanged.
 * No DB writes, no UI, no new settings.
 */

type Req = { headers: Record<string, string | string[] | undefined>; query: Record<string, string | string[] | undefined>; url?: string };
type Res = {
  setHeader: (k: string, v: string) => void;
  status: (code: number) => Res;
  send: (body: string) => void;
};

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://mllbzpcqxpwedqqfrqyu.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "sb_publishable_0gcWEJO0ZKpGXVFrNUCO5Q_ccJQsPAx";

const DEFAULT_ORIGIN = "https://demo.eidlip.com";
const DEFAULT_DESC =
  "EIDLIP (eidlip) — Bangladeshi unisex clothing brand. Shop shirts, t-shirts, pants & everyday wear with cash on delivery across BD.";
const DEFAULT_IMAGE = "/logo.png";

type Meta = {
  title: string;
  description: string;
  image: string;
  path: string;
  type: "website" | "article" | "product";
  noindex?: boolean;
};

const esc = (s: string) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const clip = (s: string, n = 155) => (s || "").trim().slice(0, n);

async function pgrest(path: string): Promise<any[]> {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!r.ok) return [];
    return (await r.json()) as any[];
  } catch {
    return [];
  }
}

async function resolveOrigin(): Promise<string> {
  const rows = await pgrest("seo_settings?select=key,value");
  const map: Record<string, string> = {};
  for (const row of rows) if (row?.value) map[row.key] = row.value;
  const base = map.canonical_base_url || map.site_url || DEFAULT_ORIGIN;
  return base.replace(/\/$/, "");
}

async function resolveMeta(path: string): Promise<Meta> {
  const base: Meta = { title: "EIDLIP", description: DEFAULT_DESC, image: DEFAULT_IMAGE, path, type: "website" };

  // Product: /products/:slug  or  /product/:id
  const prodSlug = path.match(/^\/products\/([^/?#]+)/);
  const prodId = path.match(/^\/product\/([^/?#]+)/);
  if (prodSlug || prodId) {
    const filter = prodSlug
      ? `slug=eq.${encodeURIComponent(prodSlug[1])}`
      : `id=eq.${encodeURIComponent(prodId![1])}`;
    const [p] = await pgrest(
      `products?${filter}&select=id,slug,name,description,image_url,og_image,seo_title,seo_description,noindex,is_active&limit=1`,
    );
    if (p && p.is_active !== false) {
      return {
        title: p.seo_title || p.name || "EIDLIP",
        description: clip(p.seo_description || p.description || `Shop ${p.name} from EIDLIP — premium clothing in Bangladesh.`),
        image: p.og_image || p.image_url || DEFAULT_IMAGE,
        path: p.slug ? `/products/${p.slug}` : `/product/${p.id}`,
        type: "product",
        noindex: !!p.noindex,
      };
    }
    return base;
  }

  // Collection: /collections/:slug
  const colSlug = path.match(/^\/collections\/([^/?#]+)/);
  if (colSlug) {
    const [c] = await pgrest(
      `collections?slug=eq.${encodeURIComponent(colSlug[1])}&select=slug,title,description,seo_title,seo_description,og_image,hero_image,noindex,is_active&limit=1`,
    );
    if (c && c.is_active !== false) {
      return {
        title: c.seo_title || `${c.title} | EIDLIP`,
        description: clip(c.seo_description || c.description || DEFAULT_DESC),
        image: c.og_image || c.hero_image || DEFAULT_IMAGE,
        path: `/collections/${c.slug}`,
        type: "website",
        noindex: !!c.noindex,
      };
    }
    return base;
  }

  // Blog post: /blog/:slug  (not the /blog index)
  const blogSlug = path.match(/^\/blog\/([^/?#]+)/);
  if (blogSlug) {
    const [b] = await pgrest(
      `blog_posts?slug=eq.${encodeURIComponent(blogSlug[1])}&select=slug,title,excerpt,cover_image,seo_title,seo_description,noindex&limit=1`,
    );
    if (b) {
      return {
        title: b.seo_title || b.title || "EIDLIP",
        description: clip(b.seo_description || b.excerpt || b.title || DEFAULT_DESC),
        image: b.cover_image || DEFAULT_IMAGE,
        path: `/blog/${b.slug}`,
        type: "article",
        noindex: !!b.noindex,
      };
    }
    return base;
  }

  return base;
}

function buildHead(meta: Meta, origin: string): string {
  const abs = (u: string) => (!u ? `${origin}/` : u.startsWith("http") ? u : origin + (u.startsWith("/") ? u : `/${u}`));
  const fullTitle = meta.title.includes("EIDLIP") ? meta.title : `${meta.title} | EIDLIP`;
  const url = abs(meta.path);
  const img = abs(meta.image);
  const robots = meta.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  return [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="EIDLIP" />`,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="@eidlip" />`,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
  ].join("\n    ");
}

/** Remove the meta tags we manage, then inject the freshly-resolved ones. */
export function patchHtml(html: string, meta: Meta, origin: string): string {
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']robots["'][^>]*>/gi, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta\s+property=["']og:(?:type|site_name|title|description|url|image|image:width|image:height)["'][^>]*>/gi, "")
    .replace(/<meta\s+name=["']twitter:(?:card|site|title|description|image)["'][^>]*>/gi, "");
  const block = `    ${buildHead(meta, origin)}\n  </head>`;
  return out.replace(/<\/head>/i, block);
}

export default async function handler(req: Req, res: Res) {
  try {
    const host = (Array.isArray(req.headers.host) ? req.headers.host[0] : req.headers.host) || "";
    const proto =
      (Array.isArray(req.headers["x-forwarded-proto"])
        ? req.headers["x-forwarded-proto"][0]
        : req.headers["x-forwarded-proto"]) || "https";
    const selfOrigin = host ? `${proto}://${host}` : DEFAULT_ORIGIN;

    let path = (Array.isArray(req.query.path) ? req.query.path[0] : req.query.path) || "/";
    if (!path.startsWith("/")) path = `/${path}`;

    // Fetch the static SPA shell from our own origin with a non-crawler UA so the
    // crawler rewrite does not re-trigger (no recursion).
    const shellRes = await fetch(`${selfOrigin}/`, {
      headers: { "user-agent": "Mozilla/5.0 EIDLIP-OG-Prerender" },
    });
    const shell = await shellRes.text();

    const [origin, meta] = await Promise.all([resolveOrigin(), resolveMeta(path)]);
    const html = patchHtml(shell, meta, origin);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=600");
    res.status(200).send(html);
  } catch {
    // On any failure, fall back to a redirect to the same path so the crawler
    // still resolves something rather than erroring.
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send("<!doctype html><meta charset=utf-8><title>EIDLIP</title>");
  }
}