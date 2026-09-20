import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCollections, useSaveCollection, useDeleteCollection, type Collection } from '@/hooks/useCollections';
import { useProducts } from '@/hooks/useSupabase';
import ImageUpload from './ImageUpload';
import { slugify } from '@/data/products';

const empty: Partial<Collection> = {
  slug: '',
  title: '',
  heading: '',
  subheading: '',
  description: '',
  hero_image: '',
  seo_title: '',
  seo_description: '',
  og_image: '',
  filter_categories: [],
  filter_subcategories: [],
  filter_product_ids: [],
  filter_featured: null,
  filter_new_drop: null,
  sort_order: 0,
  is_active: true,
  noindex: false,
  show_in_nav: false,
};

const AdminCollections = () => {
  const { data: collections = [], refetch } = useCollections(true);
  const { data: products = [] } = useProducts(undefined, undefined, undefined, true);
  const save = useSaveCollection();
  const del = useDeleteCollection();

  const [editing, setEditing] = useState<Partial<Collection> | null>(null);

  const categories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))).sort();

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) return toast.error('Title required');
    if (!editing.slug?.trim()) editing.slug = slugify(editing.title);
    try {
      await save.mutateAsync(editing);
      toast.success('Saved');
      setEditing(null);
      refetch();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Collections (SEO Landing Pages)</h2>
          <p className="text-sm text-muted-foreground">Live at <code>/collections/[slug]</code></p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="luxury-button-primary text-xs flex items-center gap-1.5">
          <Plus size={14} /> New Collection
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs">
            <tr>
              <th className="text-left px-4 py-2 font-medium">Title</th>
              <th className="text-left px-4 py-2 font-medium">Slug</th>
              <th className="text-left px-4 py-2 font-medium">Filter</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-right px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map(c => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-2.5">{c.title}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">/collections/{c.slug}</td>
                <td className="px-4 py-2.5 text-xs">{[
                  ...(c.filter_categories?.length ? [`cat: ${c.filter_categories.join(', ')}`] : []),
                  ...(c.filter_featured ? ['featured'] : []),
                  ...(c.filter_new_drop ? ['new drop'] : []),
                  ...(c.filter_product_ids?.length ? [`${c.filter_product_ids.length} products`] : []),
                ].join(' · ') || 'all'}</td>
                <td className="px-4 py-2.5 text-xs">
                  {c.is_active ? <span className="text-green-600">Active</span> : <span className="text-muted-foreground">Inactive</span>}
                  {c.noindex && <span className="ml-2 text-amber-600">noindex</span>}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => setEditing(c)} className="p-1.5 hover:bg-muted rounded"><Edit size={14} /></button>
                  <button onClick={async () => {
                    if (confirm(`Delete "${c.title}"?`)) {
                      await del.mutateAsync(c.id);
                      toast.success('Deleted');
                    }
                  }} className="p-1.5 hover:bg-destructive/10 text-destructive rounded ml-1"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted-foreground py-10 text-sm">No collections yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-background border border-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Edit' : 'New'} Collection</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-muted rounded"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Title *</label>
                  <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Slug</label>
                  <input value={editing.slug || ''} onChange={e => setEditing({ ...editing, slug: e.target.value })} placeholder="auto from title" className="w-full px-3 py-2 text-sm border border-border rounded bg-background font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Page Heading (H1)</label>
                  <input value={editing.heading || ''} onChange={e => setEditing({ ...editing, heading: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Subheading</label>
                  <input value={editing.subheading || ''} onChange={e => setEditing({ ...editing, subheading: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">Description</label>
                <textarea rows={3} value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">Hero Image</label>
                <ImageUpload value={editing.hero_image || ''} onChange={url => setEditing({ ...editing, hero_image: url })} />
              </div>

              {/* Filters */}
              <fieldset className="border border-border rounded p-3">
                <legend className="text-xs font-semibold px-1">Product Filters (AND)</legend>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Categories</label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map(cat => {
                        const sel = (editing.filter_categories || []).includes(cat);
                        return (
                          <button key={cat} onClick={() => setEditing({
                            ...editing,
                            filter_categories: sel
                              ? (editing.filter_categories || []).filter(c => c !== cat)
                              : [...(editing.filter_categories || []), cat],
                          })} className={`text-xs px-2.5 py-1 border rounded ${sel ? 'bg-foreground text-background border-foreground' : 'border-border'}`}>{cat}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editing.filter_featured} onChange={e => setEditing({ ...editing, filter_featured: e.target.checked || null })} /> Only Featured</label>
                    <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editing.filter_new_drop} onChange={e => setEditing({ ...editing, filter_new_drop: e.target.checked || null })} /> Only New Drop</label>
                  </div>
                </div>
              </fieldset>

              {/* SEO */}
              <fieldset className="border border-border rounded p-3">
                <legend className="text-xs font-semibold px-1">SEO</legend>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">SEO Title</label>
                    <input value={editing.seo_title || ''} onChange={e => setEditing({ ...editing, seo_title: e.target.value })} placeholder={editing.title || 'Defaults to title'} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">SEO Description (max 155)</label>
                    <textarea rows={2} maxLength={200} value={editing.seo_description || ''} onChange={e => setEditing({ ...editing, seo_description: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded bg-background" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">OG Image (social share)</label>
                    <ImageUpload value={editing.og_image || ''} onChange={url => setEditing({ ...editing, og_image: url })} />
                  </div>
                </div>
              </fieldset>

              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} /> Active</label>
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editing.show_in_nav} onChange={e => setEditing({ ...editing, show_in_nav: e.target.checked })} /> Show in nav</label>
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={!!editing.noindex} onChange={e => setEditing({ ...editing, noindex: e.target.checked })} /> noindex (hide from Google)</label>
                <label className="flex items-center gap-1.5">Sort:
                  <input type="number" value={editing.sort_order || 0} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} className="w-16 px-2 py-1 border border-border rounded bg-background" />
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background border-t border-border p-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="luxury-button-outline text-xs">Cancel</button>
              <button onClick={handleSave} className="luxury-button-primary text-xs">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
