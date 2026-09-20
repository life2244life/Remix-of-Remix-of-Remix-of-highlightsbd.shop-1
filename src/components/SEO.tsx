import { Helmet } from "react-helmet-async";

type Props = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
  siteName?: string;
  twitterHandle?: string;
  keywords?: string;
  canonical?: string;
  rss?: { href: string; title?: string };
};

const SITE_ORIGIN = "https://demo.eidlip.com";

const absUrl = (path: string) => {
  if (!path) return SITE_ORIGIN + "/";
  if (path.startsWith("http")) return path;
  return SITE_ORIGIN + (path.startsWith("/") ? path : `/${path}`);
};

const SEO = ({
  title,
  description,
  path = "/",
  image = "/logo.png",
  type = "website",
  noIndex,
  jsonLd,
  siteName = "EIDLIP",
  twitterHandle = "@eidlip",
  keywords,
  canonical: canonicalOverride,
  rss,
}: Props) => {
  const fullTitle = title.includes("EIDLIP") ? title : `${title} | EIDLIP`;
  const desc =
    description ||
    "EIDLIP (eidlip) — Bangladeshi unisex clothing brand. Shop shirts, t-shirts, pants & everyday wear with cash on delivery across BD.";
  const metaKeywords =
    keywords && keywords.trim()
      ? keywords
      : "EIDLIP, eidlip, bangladeshi clothing brand, unisex clothing, shirts, t-shirts, pants, bd fashion";
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const canonical = absUrl(canonicalOverride && canonicalOverride.trim() ? canonicalOverride.trim() : path);
  const ogImage = absUrl(image);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={canonical} />
      {rss && <link rel="alternate" type="application/rss+xml" title={rss.title || `${siteName} RSS Feed`} href={absUrl(rss.href)} />}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
