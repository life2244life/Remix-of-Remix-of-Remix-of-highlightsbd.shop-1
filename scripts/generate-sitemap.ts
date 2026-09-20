// Generates split sitemaps + sitemap index + robots.txt — runs via predev/prebuild scripts.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://mllbzpcqxpwedqqfrqyu.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

let BASE_URL = "https://demo.eidlip.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const supabase = SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;
const day = (v?: string) => (v ? new Date(v).toISOString().split("T")[0] : undefined);
const dedupe = (entries: SitemapEntry[]) => {
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));
};

async function loadSettings() {
  if (!supabase) return {} as Record<string, string>;
  try {
    const { data } = await supabase.from("seo_settings").select("key, value");
    const map: Record<string, string> = {};
    (data || []).forEach((r: any) => { if (r.value) map[r.key] = r.value; });
    if (map.canonical_base_url) BASE_URL = map.canonical_base_url.replace(/\/$/, "");
    else if (map.site_url) BASE_URL = map.site_url.replace(/\/$/, "");
    return map;
  } catch {
    return {} as Record<string, string>;
  }
}

async function productEntries(): Promise<SitemapEntry[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase.from("products").select("id, slug, updated_at, noindex").eq("is_active", true);
    return (data || []).filter((p: any) => !p.noindex).map((p: any) => ({
      path: p.slug ? `/products/${p.slug}` : `/product/${p.id}`,
      lastmod: day(p.updated_at), changefreq: "weekly", priority: "0.8",
    }));
  } catch { return []; }
}

async function categoryEntries(): Promise<SitemapEntry[]> {
  if (!supabase) return [];
  const entries: SitemapEntry[] = [];
  try {
    const { data: cols } = await supabase.from("collections").select("slug, updated_at, noindex").eq("is_active", true);
    (cols || []).forEach((c: any) => { if (!c.noindex && c.slug) entries.push({ path: `/collections/${c.slug}`, lastmod: day(c.updated_at), changefreq: "weekly", priority: "0.9" }); });
  } catch {}
  try {
    const { data: cats } = await supabase.from("header_categories").select("slug, updated_at").eq("is_active", true);
    (cats || []).forEach((c: any) => { if (c.slug) entries.push({ path: `/collections/${c.slug}`, lastmod: day(c.updated_at), changefreq: "weekly", priority: "0.85" }); });
  } catch {}
  try {
    const { data: subs } = await supabase.from("subcategories").select("slug, updated_at").eq("is_active", true);
    (subs || []).forEach((s: any) => { if (s.slug) entries.push({ path: `/collections/${s.slug}`, lastmod: day(s.updated_at), changefreq: "weekly", priority: "0.75" }); });
  } catch {}
  return dedupe(entries);
}

async function blogEntries(): Promise<SitemapEntry[]> {
  if (!supabase) return [];
  try {
    const { data } = await supabase.from("blog_posts").select("slug, updated_at, noindex").eq("is_published", true);
    return (data || []).filter((p: any) => !p.noindex).map((p: any) => ({
      path: `/blog/${p.slug}`, lastmod: day(p.updated_at), changefreq: "monthly", priority: "0.7",
    }));
  } catch { return []; }
}

async function pageEntries(): Promise<SitemapEntry[]> {
  const staticPages: SitemapEntry[] = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/blog", changefreq: "weekly", priority: "0.8" },
    { path: "/about", changefreq: "monthly", priority: "0.6" },
    { path: "/contact", changefreq: "monthly", priority: "0.6" },
    { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
    { path: "/terms", changefreq: "yearly", priority: "0.3" },
    { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
    { path: "/shipping-policy", changefreq: "yearly", priority: "0.3" },
  ];
  if (supabase) {
    try {
      const { data } = await supabase.from("custom_pages").select("slug, updated_at, noindex").eq("is_active", true);
      (data || []).forEach((p: any) => { if (!p.noindex && p.slug) staticPages.push({ path: `/page/${p.slug}`, lastmod: day(p.updated_at), changefreq: "weekly", priority: "0.6" }); });
    } catch {}
  }
  return dedupe(staticPages);
}

function renderUrlset(entries: SitemapEntry[]) {
  const urls = entries.map((e) => [
    `  <url>`,
    `    <loc>${BASE_URL}${e.path}</loc>`,
    e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    `  </url>`,
  ].filter(Boolean).join("\n"));
  return [`<?xml version="1.0" encoding="UTF-8"?>`, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...urls, `</urlset>`].join("\n");
}

function renderIndex(files: string[], lastmod: string) {
  const items = files.map((f) => `  <sitemap>\n    <loc>${BASE_URL}/${f}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`);
  return [`<?xml version="1.0" encoding="UTF-8"?>`, `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`, ...items, `</sitemapindex>`].join("\n");
}

function renderRobots(s: Record<string, string>) {
  const lines: string[] = ["User-agent: *"];
  if (s.robots_allow_indexing === "false") {
    lines.push("Disallow: /");
  } else {
    lines.push("Allow: /");
    if (s.robots_disallow_admin !== "false") lines.push("Disallow: /admin");
    if (s.robots_disallow_drafts !== "false") {
      lines.push("Disallow: /checkout", "Disallow: /profile", "Disallow: /wishlist", "Disallow: /reset-password");
    }
    if (s.robots_custom_rules && s.robots_custom_rules.trim()) lines.push(s.robots_custom_rules.trim());
  }
  const aiBots: [string, string][] = [
    ["GPTBot", "ai_allow_gptbot"],
    ["Google-Extended", "ai_allow_google_extended"],
    ["CCBot", "ai_allow_ccbot"],
    ["ClaudeBot", "ai_allow_claudebot"],
    ["PerplexityBot", "ai_allow_perplexitybot"],
    ["Bingbot", "ai_allow_bingbot"],
  ];
  for (const [bot, key] of aiBots) {
    lines.push("", `User-agent: ${bot}`, s[key] === "false" ? "Disallow: /" : "Allow: /");
  }
  lines.push("", `Sitemap: ${BASE_URL}/sitemap.xml`, "");
  return lines.join("\n");
}

(async () => {
  const settings = await loadSettings();
  const [products, categories, blog, pages] = await Promise.all([
    productEntries(), categoryEntries(), blogEntries(), pageEntries(),
  ]);

  writeFileSync(resolve("public/sitemap-products.xml"), renderUrlset(products));
  writeFileSync(resolve("public/sitemap-categories.xml"), renderUrlset(categories));
  writeFileSync(resolve("public/sitemap-blog.xml"), renderUrlset(blog));
  writeFileSync(resolve("public/sitemap-pages.xml"), renderUrlset(pages));

  const lastmod = new Date().toISOString().split("T")[0];
  writeFileSync(
    resolve("public/sitemap.xml"),
    renderIndex(["sitemap-pages.xml", "sitemap-products.xml", "sitemap-categories.xml", "sitemap-blog.xml"], lastmod),
  );
  writeFileSync(resolve("public/robots.txt"), renderRobots(settings));

  console.log(`sitemaps written — pages:${pages.length} products:${products.length} categories:${categories.length} blog:${blog.length}; robots.txt updated`);
})();
