import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useSEOSettings, useUpdateSEOSetting, SEO_DEFAULTS, type SEOSettings } from '@/hooks/useSEOSettings';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import ImageUpload from './ImageUpload';

type Field = { key: string; label: string; type?: 'text' | 'textarea' | 'image'; hint?: string };

const GLOBAL_FIELDS: Field[] = [
  { key: 'site_name', label: 'Default Site Title', hint: 'Brand / site name used in OG tags and title fallback' },
  { key: 'title_template', label: 'Title Template', hint: 'Use %s for the page title, e.g. "%s | EIDLIP"' },
  { key: 'default_title', label: 'Homepage / Fallback Title' },
  { key: 'default_description', label: 'Meta Description', type: 'textarea', hint: 'Max ~155 characters' },
  { key: 'keywords', label: 'Keywords', type: 'textarea', hint: 'Comma-separated' },
  { key: 'canonical_base_url', label: 'Canonical Base URL', hint: 'e.g. https://demo.eidlip.com' },
  { key: 'default_og_image', label: 'Default OG Image', type: 'image', hint: '1200x630 recommended' },
  { key: 'twitter_handle', label: 'Twitter Handle', hint: 'e.g. @eidlip' },
  { key: 'facebook_app_id', label: 'Facebook App ID' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'instagram_url', label: 'Instagram URL' },
  { key: 'gsc_verification', label: 'Google Search Console Verification', hint: 'Content value only' },
];

const FALLBACK_GROUPS: { title: string; titleKey: string; descKey: string }[] = [
  { title: 'Home', titleKey: 'fallback_home_title', descKey: 'fallback_home_description' },
  { title: 'Products', titleKey: 'fallback_products_title', descKey: 'fallback_products_description' },
  { title: 'Collections', titleKey: 'fallback_collections_title', descKey: 'fallback_collections_description' },
  { title: 'Categories', titleKey: 'fallback_categories_title', descKey: 'fallback_categories_description' },
  { title: 'Blog', titleKey: 'fallback_blog_title', descKey: 'fallback_blog_description' },
  { title: 'Pages', titleKey: 'fallback_pages_title', descKey: 'fallback_pages_description' },
];

const AI_FIELDS: Field[] = [
  { key: 'ai_summary', label: 'AI Summary Text', type: 'textarea', hint: 'One-paragraph answer AI assistants can quote' },
  { key: 'brand_description', label: 'Brand Description', type: 'textarea' },
  { key: 'business_type', label: 'Business Type', hint: 'schema.org type, e.g. ClothingStore' },
  { key: 'target_audience', label: 'Target Audience', type: 'textarea' },
  { key: 'brand_values', label: 'Brand Values', type: 'textarea' },
  { key: 'founder_story', label: 'Founder Story', type: 'textarea' },
  { key: 'product_categories', label: 'Product Categories', hint: 'Comma-separated' },
];

const SD_TOGGLES: { key: string; label: string }[] = [
  { key: 'sd_organization', label: 'Organization' },
  { key: 'sd_website', label: 'WebSite' },
  { key: 'sd_breadcrumb', label: 'Breadcrumb' },
  { key: 'sd_product', label: 'Product' },
  { key: 'sd_collection', label: 'Collection' },
  { key: 'sd_blogposting', label: 'BlogPosting' },
  { key: 'sd_faqpage', label: 'FAQPage' },
  { key: 'sd_store', label: 'Store' },
  { key: 'sd_searchaction', label: 'SearchAction' },
];

const AI_CRAWLERS: { key: string; label: string }[] = [
  { key: 'ai_allow_gptbot', label: 'GPTBot (ChatGPT)' },
  { key: 'ai_allow_google_extended', label: 'Google-Extended (Gemini / AI Mode)' },
  { key: 'ai_allow_ccbot', label: 'CCBot (Common Crawl)' },
  { key: 'ai_allow_claudebot', label: 'ClaudeBot (Claude)' },
  { key: 'ai_allow_perplexitybot', label: 'PerplexityBot (Perplexity)' },
  { key: 'ai_allow_bingbot', label: 'Bingbot (Copilot)' },
];

const TextField = ({ f, values, set }: { f: Field; values: Record<string, string>; set: (k: string, v: string) => void }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5">{f.label}</label>
    {f.type === 'textarea' ? (
      <textarea rows={3} value={values[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
    ) : f.type === 'image' ? (
      <ImageUpload value={values[f.key] || ''} onChange={(url) => set(f.key, url)} />
    ) : (
      <input value={values[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
    )}
    {f.hint && <p className="text-[11px] text-muted-foreground mt-1">{f.hint}</p>}
  </div>
);

const Toggle = ({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) => (
  <div className="flex items-center justify-between border border-border rounded-md px-3 py-2.5 bg-background">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const AdminSEOSettings = () => {
  const { data: settings } = useSEOSettings();
  const updateSetting = useUpdateSEOSetting();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setValues({ ...SEO_DEFAULTS, ...(settings as any) });
  }, [settings]);

  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const bool = (k: string) => (values[k] ?? SEO_DEFAULTS[k as keyof SEOSettings]) !== 'false';

  const faqs = useMemo<{ q: string; a: string }[]>(() => {
    try {
      const parsed = JSON.parse(values.faq_knowledge || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [values.faq_knowledge]);

  const setFaqs = (next: { q: string; a: string }[]) => set('faq_knowledge', JSON.stringify(next));

  const save = async () => {
    setSaving(true);
    try {
      const keys = Object.keys(SEO_DEFAULTS);
      for (const key of keys) {
        await updateSetting(key, values[key] ?? '');
      }
      qc.invalidateQueries({ queryKey: ['seo_settings'] });
      toast.success('SEO settings saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">SEO &amp; AI Search</h2>
        <p className="text-sm text-muted-foreground">Search engine, social sharing and AI-assistant optimization.</p>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="global">Global SEO</TabsTrigger>
          <TabsTrigger value="ai">AI Search</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
          <TabsTrigger value="robots">Robots &amp; Indexing</TabsTrigger>
          <TabsTrigger value="structured">Structured Data</TabsTrigger>
        </TabsList>

        {/* GLOBAL SEO */}
        <TabsContent value="global" className="space-y-4">
          <div className="space-y-4 border border-border rounded-lg p-5 bg-card">
            {GLOBAL_FIELDS.map((f) => <TextField key={f.key} f={f} values={values} set={set} />)}
          </div>
          <div className="space-y-4 border border-border rounded-lg p-5 bg-card">
            <p className="text-sm font-medium">Per-section fallbacks</p>
            {FALLBACK_GROUPS.map((g) => (
              <div key={g.titleKey} className="space-y-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
                <p className="text-xs font-semibold text-muted-foreground">{g.title}</p>
                <TextField f={{ key: g.titleKey, label: 'Title' }} values={values} set={set} />
                <TextField f={{ key: g.descKey, label: 'Description', type: 'textarea' }} values={values} set={set} />
              </div>
            ))}
          </div>
        </TabsContent>

        {/* AI SEARCH */}
        <TabsContent value="ai" className="space-y-4">
          <div className="space-y-4 border border-border rounded-lg p-5 bg-card">
            {AI_FIELDS.map((f) => <TextField key={f.key} f={f} values={values} set={set} />)}
          </div>
          <div className="space-y-3 border border-border rounded-lg p-5 bg-card">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">FAQ Knowledge Base</p>
              <button onClick={() => setFaqs([...faqs, { q: '', a: '' }])} className="text-xs underline">+ Add FAQ</button>
            </div>
            {faqs.length === 0 && <p className="text-xs text-muted-foreground">No FAQs yet. These power FAQ rich results and AI answers.</p>}
            {faqs.map((f, i) => (
              <div key={i} className="space-y-2 border border-border rounded-md p-3">
                <input value={f.q} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} placeholder="Question" className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
                <textarea rows={2} value={f.a} onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} placeholder="Answer" className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background" />
                <button onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-[11px] text-destructive underline">Remove</button>
              </div>
            ))}
          </div>
          <div className="border border-border rounded-lg p-5 bg-muted/30 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">AI assistant compatibility</p>
            <p>These fields and generated JSON-LD (WebSite, Organization, Store, SearchAction, FAQPage) help ChatGPT, Google AI Mode, Perplexity, Gemini, Claude and Bing Copilot understand your brand. Crawler access is controlled in the Robots tab.</p>
          </div>
        </TabsContent>

        {/* SITEMAP */}
        <TabsContent value="sitemap" className="space-y-4">
          <div className="border border-border rounded-lg p-5 bg-card text-sm space-y-3">
            <p className="font-medium">Sitemaps are generated automatically at build & dev time</p>
            <p className="text-muted-foreground text-xs">Only published / active items are included, each with <code>lastmod</code>, <code>changefreq</code> and <code>priority</code>.</p>
            <ul className="text-xs space-y-1.5">
              {['/sitemap.xml (index)', '/sitemap-products.xml', '/sitemap-categories.xml', '/sitemap-blog.xml', '/sitemap-pages.xml'].map((p) => (
                <li key={p}><code className="bg-background px-1.5 py-0.5 rounded border border-border">{p}</code></li>
              ))}
            </ul>
          </div>
        </TabsContent>

        {/* ROBOTS */}
        <TabsContent value="robots" className="space-y-4">
          <div className="space-y-3 border border-border rounded-lg p-5 bg-card">
            <Toggle label="Allow search engine indexing" hint="Master switch — turn off to noindex the whole site" checked={bool('robots_allow_indexing')} onChange={(v) => set('robots_allow_indexing', String(v))} />
            <Toggle label="Disallow admin pages" hint="Blocks /admin" checked={bool('robots_disallow_admin')} onChange={(v) => set('robots_disallow_admin', String(v))} />
            <Toggle label="Disallow drafts & private routes" hint="Blocks /checkout, /profile, /wishlist, /reset-password" checked={bool('robots_disallow_drafts')} onChange={(v) => set('robots_disallow_drafts', String(v))} />
          </div>
          <div className="space-y-3 border border-border rounded-lg p-5 bg-card">
            <p className="text-sm font-medium">AI crawler rules</p>
            {AI_CRAWLERS.map((c) => (
              <Toggle key={c.key} label={`Allow ${c.label}`} checked={bool(c.key)} onChange={(v) => set(c.key, String(v))} />
            ))}
          </div>
          <div className="border border-border rounded-lg p-5 bg-card">
            <label className="block text-xs font-medium mb-1.5">Custom robots rules</label>
            <textarea rows={4} value={values.robots_custom_rules || ''} onChange={(e) => set('robots_custom_rules', e.target.value)} placeholder={'Disallow: /tmp\nAllow: /public'} className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background font-mono" />
            <p className="text-[11px] text-muted-foreground mt-1">Appended to <code>/robots.txt</code> on next build.</p>
          </div>
        </TabsContent>

        {/* STRUCTURED DATA */}
        <TabsContent value="structured" className="space-y-4">
          <div className="space-y-3 border border-border rounded-lg p-5 bg-card">
            <p className="text-sm font-medium">Enable JSON-LD schema types</p>
            {SD_TOGGLES.map((t) => (
              <Toggle key={t.key} label={t.label} checked={bool(t.key)} onChange={(v) => set(t.key, String(v))} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <button onClick={save} disabled={saving} className="luxury-button-primary text-xs disabled:opacity-50">
        {saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
};

export default AdminSEOSettings;
