// Generates public/blog/rss.xml from published blog posts — runs via predev/prebuild.
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://demo.eidlip.com";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";

const esc = (s: string) =>
  (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cdata = (s: string) => `<![CDATA[${(s || "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

function buildRss(posts: any[]) {
  const now = new Date().toUTCString();
  const items = posts
    .map((p) => {
      const link = `${BASE_URL}/blog/${p.slug}`;
      const pub = new Date(p.created_at).toUTCString();
      const cats = (p.tags || []).map((t: string) => `    <category>${esc(t)}</category>`).join("\n");
      const img = p.cover_image
        ? `    <enclosure url="${esc(p.cover_image)}" type="image/jpeg" />\n    <media:content url="${esc(p.cover_image)}" medium="image" />`
        : "";
      return [
        `  <item>`,
        `    <title>${cdata(p.title)}</title>`,
        `    <link>${link}</link>`,
        `    <guid isPermaLink="true">${link}</guid>`,
        `    <description>${cdata(p.excerpt || "")}</description>`,
        `    <dc:creator>${cdata(p.author || "EIDLIP")}</dc:creator>`,
        `    <pubDate>${pub}</pubDate>`,
        cats,
        img,
      ]
        .filter(Boolean)
        .join("\n") + `\n  </item>`;
    })
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">`,
    `<channel>`,
    `  <title>EIDLIP Journal</title>`,
    `  <link>${BASE_URL}/blog</link>`,
    `  <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />`,
    `  <description>Style stories, drop announcements, care guides and styling tips from EIDLIP.</description>`,
    `  <language>en-us</language>`,
    `  <lastBuildDate>${now}</lastBuildDate>`,
    items,
    `</channel>`,
    `</rss>`,
  ].join("\n");
}

(async () => {
  let posts: any[] = [];
  if (SUPABASE_KEY && SUPABASE_URL) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, cover_image, author, tags, created_at, noindex")
        .eq("is_published", true)
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false });
      posts = (data || []).filter((p: any) => !p.noindex);
    } catch (e) {
      console.warn("[blog-rss] fetch failed", e);
    }
  } else {
    console.warn("[blog-rss] No Supabase key — writing empty feed");
  }
  mkdirSync(resolve("public/blog"), { recursive: true });
  writeFileSync(resolve("public/blog/rss.xml"), buildRss(posts));
  console.log(`blog/rss.xml written (${posts.length} posts)`);
})();