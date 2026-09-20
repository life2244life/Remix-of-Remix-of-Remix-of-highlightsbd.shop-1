import { useState, useRef, useEffect } from 'react';
import {
  useStoreSettings, useUpdateStoreSetting, useCreateHomepageSection,
} from '@/hooks/useSupabase';
import { uploadImage } from '@/lib/upload';
import { Upload, Save, Loader2, Trash2, Info, ArrowRightLeft, CheckCircle2, LayoutGrid, Megaphone, Sparkles, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminHeroSlider from './AdminHeroSlider';
import AdminHomepageBuilder from './AdminHomepageBuilder';
import AdminHomepageSections from './AdminHomepageSections';
import AdminProductSections from './AdminProductSections';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import { uid, makePosterItem, makeBannerItem } from '@/lib/homepageBlocks';

type LegacyPoster = { image: string; link: string; subtitle: string; title: string };
type LegacyBanner = { image: string; label: string; link: string };

const safeParse = <T,>(raw: string | undefined): T[] => {
  if (!raw) return [];
  try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch { return []; }
};

const CONTENT_SUBS = [
  { key: 'hero', label: 'Hero Slider' },
  { key: 'products', label: 'Product Sections' },
] as const;

const MARKETING_SUBS = [
  { key: 'banners', label: 'Banners', filter: { banner: true } },
  { key: 'posters', label: 'Posters', filter: { poster: true } },
  { key: 'custom', label: 'Custom Blocks', filter: { customTypes: ['image_text', 'text_only', 'video', 'benefits', 'trust_icons', 'button', 'custom'] as any } },
] as const;

const BRAND_SUBS = [
  { key: 'brands', label: 'Brands', filter: { customTypes: ['featured_brands', 'brand_story'] as any } },
  { key: 'testimonials', label: 'Testimonials', filter: { customTypes: ['testimonials'] as any } },
  { key: 'faq', label: 'FAQ', filter: { customTypes: ['faq'] as any } },
] as const;

const SubTabs = ({ tabs, active, onChange }: { tabs: readonly { key: string; label: string }[]; active: string; onChange: (k: string) => void }) => (
  <div className="flex flex-wrap gap-1 border border-border p-1 bg-secondary/20 w-fit">
    {tabs.map((t) => (
      <button key={t.key} onClick={() => onChange(t.key)}
        className={`text-[11px] px-3 py-1.5 transition-colors ${active === t.key ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}>
        {t.label}
      </button>
    ))}
  </div>
);

type GroupKey = 'content' | 'marketing' | 'brand' | 'general';
const GROUPS: { key: GroupKey; label: string; desc: string; icon: typeof LayoutGrid }[] = [
  { key: 'content', label: 'Content', desc: 'Hero slider & product sections', icon: LayoutGrid },
  { key: 'marketing', label: 'Marketing', desc: 'Banners, posters & custom blocks', icon: Megaphone },
  { key: 'brand', label: 'Brand Content', desc: 'Brands, testimonials & FAQ', icon: Sparkles },
  { key: 'general', label: 'General', desc: 'Logo, sections & legacy migration', icon: Settings2 },
];

const GROUP_STORAGE_KEY = 'admin:homepage:group';

const usePersistentState = (key: string, fallback: string): [string, (v: string) => void] => {
  const [value, setValue] = useState<string>(() => {
    try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
  });
  const set = (v: string) => {
    setValue(v);
    try { localStorage.setItem(key, v); } catch { /* ignore */ }
  };
  return [value, set];
};

const AdminHomepage = () => {
  const { data: settings = {}, isLoading } = useStoreSettings();
  const updateSetting = useUpdateStoreSetting();

  const siteLogo = settings['site_logo'] || '';

  // Remember the last opened group across reloads.
  const [openGroup, setOpenGroup] = usePersistentState(GROUP_STORAGE_KEY, 'content');
  const [contentSub, setContentSub] = useState<string>('hero');
  const [marketingSub, setMarketingSub] = useState<string>('banners');
  const [brandSub, setBrandSub] = useState<string>('brands');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const activeContent = CONTENT_SUBS.find((s) => s.key === contentSub) || CONTENT_SUBS[0];
  const activeMarketing = MARKETING_SUBS.find((s) => s.key === marketingSub) || MARKETING_SUBS[0];
  const activeBrand = BRAND_SUBS.find((s) => s.key === brandSub) || BRAND_SUBS[0];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Homepage</h2>
        <p className="text-xs text-muted-foreground">Organize your storefront homepage. Open a group to manage its sections.</p>
      </div>

      <Accordion
        type="single"
        collapsible
        value={openGroup}
        onValueChange={setOpenGroup}
        className="space-y-3"
      >
        {GROUPS.map(({ key, label, desc, icon: Icon }) => {
          const isOpen = openGroup === key;
          return (
            <AccordionItem
              key={key}
              value={key}
              className="border border-border bg-card rounded-md overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-secondary/30 data-[state=open]:bg-secondary/30 data-[state=open]:border-b data-[state=open]:border-border">
                <span className="flex items-center gap-3 text-left">
                  <span className="flex h-8 w-8 items-center justify-center bg-secondary/60 text-foreground rounded">
                    <Icon size={16} />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-[11px] font-normal text-muted-foreground">{desc}</span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-4">
                {/* Lazy render: only mount a group's panels while it is open. */}
                {isOpen && key === 'content' && (
                  <div className="space-y-5">
                    <SubTabs tabs={CONTENT_SUBS} active={contentSub} onChange={setContentSub} />
                    {activeContent.key === 'hero' && (
                      <div className="space-y-4">
                        <div className="border border-border p-4 bg-secondary/20 flex items-start gap-3 rounded">
                          <Info size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p><strong>Image Guidelines:</strong></p>
                            <p>• Hero Slider PC: <strong>1920×1080px</strong> (16:9), Mobile: <strong>1080×1920px</strong> (9:16), Max <strong>100MB</strong></p>
                          </div>
                        </div>
                        <AdminHeroSlider />
                      </div>
                    )}
                    {activeContent.key === 'products' && <AdminProductSections />}
                  </div>
                )}

                {isOpen && key === 'marketing' && (
                  <div className="space-y-5">
                    <SubTabs tabs={MARKETING_SUBS} active={marketingSub} onChange={setMarketingSub} />
                    <AdminHomepageBuilder filter={activeMarketing.filter as any} hideInfo />
                  </div>
                )}

                {isOpen && key === 'brand' && (
                  <div className="space-y-5">
                    <SubTabs tabs={BRAND_SUBS} active={brandSub} onChange={setBrandSub} />
                    <AdminHomepageBuilder filter={activeBrand.filter as any} hideInfo />
                  </div>
                )}

                {isOpen && key === 'general' && (
                  <div className="space-y-6">
                    <LegacyContentMigration settings={settings} />
                    <LogoManager logo={siteLogo} onSave={async (url) => {
                      await updateSetting.mutateAsync({ key: 'site_logo', value: url });
                      toast.success('Logo updated!');
                    }} />
                    <AdminHomepageSections />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default AdminHomepage;

/* ---------------- Legacy content migration ----------------
 * Converts the old store_settings-based posters / vertical posters / category
 * banners into Homepage Builder blocks (homepage_sections rows). Originals are
 * preserved as *_backup keys, then a flag hides this panel. */
const LegacyContentMigration = ({ settings }: { settings: Record<string, string> }) => {
  const createSection = useCreateHomepageSection();
  const updateSetting = useUpdateStoreSetting();
  const [migrating, setMigrating] = useState(false);

  const migrated = settings['homepage_legacy_migrated'] === 'true';
  const posters = safeParse<LegacyPoster>(settings['homepage_posters']);
  const verticalPosters = safeParse<LegacyPoster>(settings['homepage_vertical_posters']);
  const banners = safeParse<LegacyBanner>(settings['homepage_category_banners']);
  const total = posters.length + verticalPosters.length + banners.length;

  if (migrated || total === 0) return null;

  const posterConfig = (items: LegacyPoster[]) => ({
    columns: Math.min(4, Math.max(2, items.length || 3)),
    publishAt: '', expireAt: '',
    items: items.map((p) => ({
      ...makePosterItem(),
      image: p.image || '', title: p.title || '', subtitle: p.subtitle || '',
      buttonUrl: p.link || '',
    })),
  });

  const bannerConfig = (items: LegacyBanner[]) => ({
    layout: 'collection' as const,
    publishAt: '', expireAt: '',
    items: items.map((b) => ({
      ...makeBannerItem(),
      desktopImage: b.image || '', mobileImage: b.image || '',
      title: b.label || '', buttonUrl: b.link || '',
    })),
  });

  const handleMigrate = async () => {
    setMigrating(true);
    try {
      let order = 900;
      if (posters.length) {
        await createSection.mutateAsync({ section_key: `poster-${uid()}`, title: 'Homepage Posters', type: 'poster', config: posterConfig(posters), sort_order: order++ });
      }
      if (verticalPosters.length) {
        await createSection.mutateAsync({ section_key: `poster-${uid()}`, title: 'Vertical Posters', type: 'poster', config: posterConfig(verticalPosters), sort_order: order++ });
      }
      if (banners.length) {
        await createSection.mutateAsync({ section_key: `banner-${uid()}`, title: 'Category Banners', type: 'banner', config: bannerConfig(banners), sort_order: order++ });
      }

      // Backup originals (do not destroy source data).
      if (posters.length) await updateSetting.mutateAsync({ key: 'homepage_posters_backup', value: settings['homepage_posters'] });
      if (verticalPosters.length) await updateSetting.mutateAsync({ key: 'homepage_vertical_posters_backup', value: settings['homepage_vertical_posters'] });
      if (banners.length) await updateSetting.mutateAsync({ key: 'homepage_category_banners_backup', value: settings['homepage_category_banners'] });

      await updateSetting.mutateAsync({ key: 'homepage_legacy_migrated', value: 'true' });
      toast.success('Legacy content migrated into Homepage Builder ✓');
    } catch (e: any) {
      toast.error(e?.message || 'Migration failed');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="border border-message/40 bg-message/5 p-5 space-y-3">
      <div className="flex items-start gap-3">
        <ArrowRightLeft size={18} className="text-message shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold tracking-wide">Migrate Legacy Homepage Content</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Found <strong>{posters.length}</strong> posters, <strong>{verticalPosters.length}</strong> vertical posters and <strong>{banners.length}</strong> category banners from the old system.
            Click below to convert them into Homepage Builder blocks. Originals are kept as a backup.
          </p>
        </div>
      </div>
      <button onClick={handleMigrate} disabled={migrating} className="luxury-button-primary text-[11px] inline-flex items-center gap-1.5">
        {migrating ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
        Migrate {total} item{total > 1 ? 's' : ''} to Homepage Builder
      </button>
    </div>
  );
};

const LogoManager = ({ logo, onSave }: { logo: string; onSave: (url: string) => Promise<void> }) => {
  const [current, setCurrent] = useState(logo);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCurrent(logo); }, [logo]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImage(file, 'site');
      setCurrent(url);
      await onSave(url);
    } catch (err: any) {
      toast.error(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    setCurrent('');
    await onSave('');
  };

  return (
    <div className="border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase">Site Logo (Header)</h3>
      </div>
      <p className="text-xs text-muted-foreground">Recommended: PNG/SVG, transparent background, height ~80px. Leave empty to show the brand text.</p>

      <div className="flex items-center gap-4">
        <div className="w-40 h-16 border border-border bg-secondary/30 flex items-center justify-center overflow-hidden">
          {current ? (
            <img src={current} alt="Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">No logo</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs border border-border hover:bg-secondary transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading…' : 'Upload Logo'}
          </button>
          {current && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs border border-border text-destructive hover:bg-destructive/10 transition"
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
