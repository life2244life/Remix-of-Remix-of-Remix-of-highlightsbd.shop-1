import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import ImageUploadField from './ImageUploadField';
import MegaMenuPreview from './MegaMenuPreview';
import { HeaderCat, Sub, BADGES, STATUSES, MENU_TYPES, NavStatus, slugify, statusToActive } from './navTypes';

interface Props {
  open: boolean;
  kind: 'parent' | 'sub';
  record: (HeaderCat & Sub) | null;
  parentSlug?: string;
  existingSlugs: string[];
  previewSubs?: Sub[];
  onClose: () => void;
  onSaved: () => void;
}

const blank = {
  name: '', slug: '', sort_order: 0, status: 'published' as NavStatus,
  menu_type: 'dropdown' as const, mega_columns: 3,
  banner_desktop: '', banner_mobile: '', cta_text: '', cta_link: '',
  icon_url: '', thumbnail_url: '',
  show_in_header: true, show_in_mobile: true, show_in_footer: false,
  badge: '', seo_title: '', meta_description: '', meta_keywords: '', og_image: '', canonical_url: '',
  short_description: '', long_description: '', is_featured: false, show_on_homepage: false,
};

const CategoryEditor = ({ open, kind, record, parentSlug, existingSlugs, previewSubs = [], onClose, onSaved }: Props) => {
  const [form, setForm] = useState<any>(blank);
  const [saving, setSaving] = useState(false);
  const isParent = kind === 'parent';

  useEffect(() => {
    if (record) {
      setForm({ ...blank, ...Object.fromEntries(Object.entries(record).map(([k, v]) => [k, v ?? blank[k as keyof typeof blank] ?? ''])) });
    } else {
      setForm({ ...blank });
    }
  }, [record, open]);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name required'); return; }
    const slug = slugify(form.slug || form.name);
    if (!slug) { toast.error('Invalid slug'); return; }
    if (existingSlugs.filter(s => s !== record?.slug).includes(slug)) {
      toast.error(`Slug "${slug}" already exists`); return;
    }
    setSaving(true);
    try {
      const common = {
        name: form.name.trim(), slug, status: form.status, is_active: statusToActive(form.status),
        badge: form.badge || null, icon_url: form.icon_url || null, thumbnail_url: form.thumbnail_url || null,
        seo_title: form.seo_title || null, meta_description: form.meta_description || null,
        meta_keywords: form.meta_keywords || null, og_image: form.og_image || null, canonical_url: form.canonical_url || null,
        short_description: form.short_description || null, long_description: form.long_description || null,
      };
      if (isParent) {
        const payload = {
          ...common,
          menu_type: form.menu_type, mega_columns: Number(form.mega_columns) || 3,
          banner_desktop: form.banner_desktop || null, banner_mobile: form.banner_mobile || null,
          cta_text: form.cta_text || null, cta_link: form.cta_link || null,
          show_in_header: form.show_in_header, show_in_mobile: form.show_in_mobile, show_in_footer: form.show_in_footer,
          is_featured: form.is_featured, show_on_homepage: form.show_on_homepage,
        };
        const q = record
          ? supabase.from('header_categories').update(payload).eq('id', record.id)
          : supabase.from('header_categories').insert(payload);
        const { error } = await q;
        if (error) throw error;
      } else {
        const payload = { ...common, parent_category: record?.parent_category || parentSlug } as any;
        const q = record
          ? supabase.from('subcategories').update(payload).eq('id', record.id)
          : supabase.from('subcategories').insert(payload);
        const { error } = await q;
        if (error) throw error;
      }
      toast.success(record ? 'Updated' : 'Created');
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message?.includes('duplicate') ? 'Slug already exists' : (e.message || 'Failed'));
    } finally {
      setSaving(false);
    }
  };

  const previewCat: HeaderCat = { id: 'preview', name: form.name || 'Category', slug: 'preview', sort_order: 0, is_active: true, menu_type: form.menu_type, mega_columns: Number(form.mega_columns) || 3, banner_desktop: form.banner_desktop, banner_mobile: form.banner_mobile, cta_text: form.cta_text, badge: form.badge };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{record ? 'Edit' : 'New'} {isParent ? 'Category' : 'Sub-category'}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            {isParent && <TabsTrigger value="menu" className="text-xs">Mega Menu</TabsTrigger>}
            {isParent && <TabsTrigger value="banner" className="text-xs">Banner</TabsTrigger>}
            <TabsTrigger value="media" className="text-xs">Media</TabsTrigger>
            {isParent && <TabsTrigger value="visibility" className="text-xs">Visibility</TabsTrigger>}
            <TabsTrigger value="seo" className="text-xs">SEO</TabsTrigger>
            <TabsTrigger value="desc" className="text-xs">Description</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-3 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Display Name *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} className="luxury-input" placeholder="e.g. Men" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Slug</label>
                <div className="flex gap-1">
                  <input value={form.slug} onChange={e => set('slug', e.target.value)} className="luxury-input flex-1" placeholder="auto from name" />
                  <button type="button" onClick={() => set('slug', slugify(form.name))} className="luxury-button-outline text-[11px] whitespace-nowrap">Auto</button>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} className="luxury-input capitalize">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Badge</label>
                <select value={form.badge} onChange={e => set('badge', e.target.value)} className="luxury-input">
                  {BADGES.map(b => <option key={b} value={b}>{b || 'No Badge'}</option>)}
                </select>
              </div>
            </div>
            {isParent && (
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs"><Switch checked={!!form.is_featured} onCheckedChange={v => set('is_featured', v)} /> Featured Category</label>
                <label className="flex items-center gap-2 text-xs"><Switch checked={!!form.show_on_homepage} onCheckedChange={v => set('show_on_homepage', v)} /> Show on Homepage</label>
              </div>
            )}
          </TabsContent>

          {isParent && (
            <TabsContent value="menu" className="space-y-3 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Menu Type</label>
                  <select value={form.menu_type} onChange={e => set('menu_type', e.target.value)} className="luxury-input capitalize">
                    {MENU_TYPES.map(m => <option key={m} value={m}>{m === 'mega' ? 'Mega Menu' : 'Standard Dropdown'}</option>)}
                  </select>
                </div>
                {form.menu_type === 'mega' && (
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Columns</label>
                    <select value={form.mega_columns} onChange={e => set('mega_columns', Number(e.target.value))} className="luxury-input">
                      {[2, 3, 4].map(c => <option key={c} value={c}>{c} Columns</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="border border-border rounded p-3 bg-secondary/20">
                <p className="text-xs font-medium mb-2">Live Preview</p>
                <MegaMenuPreview cat={previewCat} subs={previewSubs} />
              </div>
            </TabsContent>
          )}

          {isParent && (
            <TabsContent value="banner" className="space-y-3 pt-3">
              <ImageUploadField label="Desktop Banner" value={form.banner_desktop} onChange={v => set('banner_desktop', v)} hint="Shown in mega menu / category page" />
              <ImageUploadField label="Mobile Banner" value={form.banner_mobile} onChange={v => set('banner_mobile', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">CTA Text</label>
                  <input value={form.cta_text} onChange={e => set('cta_text', e.target.value)} className="luxury-input" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">CTA Link</label>
                  <input value={form.cta_link} onChange={e => set('cta_link', e.target.value)} className="luxury-input" placeholder="/?category=men" />
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="media" className="space-y-3 pt-3">
            <ImageUploadField label="Category Icon" value={form.icon_url} onChange={v => set('icon_url', v)} hint="Small icon for menus" />
            <ImageUploadField label="Category Thumbnail" value={form.thumbnail_url} onChange={v => set('thumbnail_url', v)} hint="Used on homepage & mobile menu" />
          </TabsContent>

          {isParent && (
            <TabsContent value="visibility" className="space-y-3 pt-3">
              <label className="flex items-center justify-between text-xs border border-border rounded px-3 py-2"><span>Show in Header</span><Switch checked={!!form.show_in_header} onCheckedChange={v => set('show_in_header', v)} /></label>
              <label className="flex items-center justify-between text-xs border border-border rounded px-3 py-2"><span>Show in Mobile Menu</span><Switch checked={!!form.show_in_mobile} onCheckedChange={v => set('show_in_mobile', v)} /></label>
              <p className="text-[10px] text-muted-foreground">Set Status to "Hidden" to remove the category everywhere while keeping its data.</p>
            </TabsContent>
          )}

          <TabsContent value="seo" className="space-y-3 pt-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">SEO Title</label>
              <input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} className="luxury-input" maxLength={70} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Meta Description</label>
              <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} className="luxury-input" rows={2} maxLength={170} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Meta Keywords</label>
              <input value={form.meta_keywords} onChange={e => set('meta_keywords', e.target.value)} className="luxury-input" placeholder="comma, separated" />
            </div>
            <ImageUploadField label="OG Image" value={form.og_image} onChange={v => set('og_image', v)} />
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Canonical URL (optional)</label>
              <input value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} className="luxury-input" placeholder="https://demo.eidlip.com/..." />
            </div>
          </TabsContent>

          <TabsContent value="desc" className="space-y-3 pt-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Short Description</label>
              <textarea value={form.short_description} onChange={e => set('short_description', e.target.value)} className="luxury-input" rows={2} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">Long Description</label>
              <textarea value={form.long_description} onChange={e => set('long_description', e.target.value)} className="luxury-input" rows={5} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-3 border-t border-border">
          <button onClick={save} disabled={saving} className="luxury-button-primary text-xs">{saving ? 'Saving…' : 'Save'}</button>
          <button onClick={onClose} className="luxury-button-outline text-xs">Cancel</button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryEditor;