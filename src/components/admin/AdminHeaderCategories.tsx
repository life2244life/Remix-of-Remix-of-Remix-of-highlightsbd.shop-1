import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Pencil, Trash2, Menu, ChevronDown, ChevronRight, Copy, Search,
  ChevronsDownUp, ChevronsUpDown, Download, Upload, Package, Layers,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Sortable from './navigation/Sortable';
import CategoryEditor from './navigation/CategoryEditor';
import { HeaderCat, Sub, NavStatus, badgeClasses, statusClasses, slugify, statusToActive } from './navigation/navTypes';
import { exportCSV, exportXLSX, importCSV, importXLSX } from './navigation/navIO';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const EXPAND_KEY = 'nav_expanded_v2';

const AdminHeaderCategories = () => {
  const [headers, setHeaders] = useState<HeaderCat[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [counts, setCounts] = useState<{ prod: Record<string, number>; sub: Record<string, number> }>({ prod: {}, sub: {} });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(EXPAND_KEY) || '{}'); } catch { return {}; }
  });
  const fileRef = useRef<HTMLInputElement>(null);

  // editor state
  const [editor, setEditor] = useState<{ open: boolean; kind: 'parent' | 'sub'; record: any; parentSlug?: string }>({ open: false, kind: 'parent', record: null });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const persistExpanded = (next: Record<string, boolean>) => {
    setExpanded(next);
    try { localStorage.setItem(EXPAND_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const load = async () => {
    setLoading(true);
    const [{ data: h }, { data: s }, { data: p }] = await Promise.all([
      supabase.from('header_categories').select('*').order('sort_order'),
      supabase.from('subcategories').select('*').order('sort_order'),
      supabase.from('products').select('category, subcategory').eq('is_active', true),
    ]);
    setHeaders((h as HeaderCat[]) || []);
    setSubs((s as Sub[]) || []);
    const prod: Record<string, number> = {}; const sub: Record<string, number> = {};
    (p as Array<{ category: string; subcategory: string }> || []).forEach(row => {
      if (row.category) prod[row.category.toLowerCase()] = (prod[row.category.toLowerCase()] || 0) + 1;
      if (row.subcategory) sub[row.subcategory.toLowerCase()] = (sub[row.subcategory.toLowerCase()] || 0) + 1;
    });
    setCounts({ prod, sub });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const allSlugs = useMemo(() => [...headers.map(h => h.slug), ...subs.map(s => s.slug)], [headers, subs]);

  const productCount = (h: HeaderCat) => counts.prod[h.name.toLowerCase()] ?? counts.prod[h.slug.toLowerCase()] ?? 0;
  const subProductCount = (s: Sub) => counts.sub[s.name.toLowerCase()] ?? counts.sub[s.slug.toLowerCase()] ?? 0;

  const matches = (text: string) => text.toLowerCase().includes(search.toLowerCase());
  const filteredHeaders = useMemo(() => {
    if (!search.trim()) return headers;
    return headers.filter(h =>
      matches(h.name) || matches(h.slug) || matches(h.status || '') || matches(h.badge || '') ||
      subs.some(s => s.parent_category === h.slug && (matches(s.name) || matches(s.slug)))
    );
  }, [headers, subs, search]);

  const toggleExpand = (slug: string) => persistExpanded({ ...expanded, [slug]: !(expanded[slug] ?? true) });
  const expandAll = () => persistExpanded(Object.fromEntries(headers.map(h => [h.slug, true])));
  const collapseAll = () => persistExpanded(Object.fromEntries(headers.map(h => [h.slug, false])));

  // ---------- drag & drop ----------
  const onDragParents = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldI = headers.findIndex(h => h.id === active.id);
    const newI = headers.findIndex(h => h.id === over.id);
    const next = arrayMove(headers, oldI, newI);
    setHeaders(next);
    await Promise.all(next.map((h, i) => h.sort_order === i ? null : supabase.from('header_categories').update({ sort_order: i }).eq('id', h.id)));
    toast.success('Order saved');
  };

  const onDragSubs = (parentSlug: string) => async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const group = subs.filter(s => s.parent_category === parentSlug);
    const oldI = group.findIndex(s => s.id === active.id);
    const newI = group.findIndex(s => s.id === over.id);
    const reordered = arrayMove(group, oldI, newI);
    setSubs(prev => [...prev.filter(s => s.parent_category !== parentSlug), ...reordered]);
    await Promise.all(reordered.map((s, i) => s.sort_order === i ? null : supabase.from('subcategories').update({ sort_order: i }).eq('id', s.id)));
    toast.success('Order saved');
  };

  // ---------- quick actions ----------
  const setStatus = async (h: HeaderCat, status: NavStatus) => {
    setHeaders(prev => prev.map(x => x.id === h.id ? { ...x, status, is_active: statusToActive(status) } : x));
    const { error } = await supabase.from('header_categories').update({ status, is_active: statusToActive(status) }).eq('id', h.id);
    if (error) { toast.error(error.message); load(); } else toast.success(`Set to ${status}`);
  };

  const deleteHeader = async (h: HeaderCat) => {
    const n = subs.filter(s => s.parent_category === h.slug).length;
    if (!confirm(`Delete "${h.name}"?${n ? ` ${n} sub-categories will be removed.` : ''}`)) return;
    await supabase.from('subcategories').delete().eq('parent_category', h.slug);
    const { error } = await supabase.from('header_categories').delete().eq('id', h.id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); load(); }
  };

  const deleteSub = async (s: Sub) => {
    if (!confirm('Delete sub-category?')) return;
    const { error } = await supabase.from('subcategories').delete().eq('id', s.id);
    if (error) toast.error(error.message); else { toast.success('Deleted'); load(); }
  };

  const uniqueSlug = (base: string) => {
    let slug = slugify(base) + '-copy'; let i = 1;
    while (allSlugs.includes(slug)) { slug = `${slugify(base)}-copy-${i++}`; }
    return slug;
  };

  const duplicateHeader = async (h: HeaderCat) => {
    const newSlug = uniqueSlug(h.slug);
    const { id, ...rest } = h as any;
    const { data, error } = await supabase.from('header_categories')
      .insert({ ...rest, name: `${h.name} (Copy)`, slug: newSlug, sort_order: headers.length, status: 'draft', is_active: false })
      .select().single();
    if (error) { toast.error(error.message); return; }
    const childSubs = subs.filter(s => s.parent_category === h.slug);
    if (childSubs.length && data) {
      await supabase.from('subcategories').insert(childSubs.map(s => {
        const { id: _i, ...sr } = s as any;
        return { ...sr, parent_category: newSlug, parent_id: (data as any).id, slug: uniqueSlug(s.slug) };
      }));
    }
    toast.success('Duplicated (saved as Draft)');
    load();
  };

  // ---------- bulk ----------
  const toggleSelect = (id: string) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSelect = () => setSelected(new Set());
  const bulkStatus = async (status: NavStatus) => {
    const ids = [...selected];
    await supabase.from('header_categories').update({ status, is_active: statusToActive(status) }).in('id', ids);
    toast.success(`${ids.length} updated`); clearSelect(); load();
  };
  const bulkBadge = async (badge: string) => {
    await supabase.from('header_categories').update({ badge: badge || null }).in('id', [...selected]);
    toast.success('Badge updated'); clearSelect(); load();
  };
  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} categories and their sub-categories?`)) return;
    const slugs = headers.filter(h => selected.has(h.id)).map(h => h.slug);
    await supabase.from('subcategories').delete().in('parent_category', slugs);
    await supabase.from('header_categories').delete().in('id', [...selected]);
    toast.success('Deleted'); clearSelect(); load();
  };

  // ---------- import ----------
  const handleImport = async (file?: File) => {
    if (!file) return;
    try {
      const res = file.name.endsWith('.csv') ? await importCSV(file) : await importXLSX(file);
      toast.success(`Imported ${res.parents} categories, ${res.subs} sub-categories`);
      load();
    } catch (e: any) { toast.error(e.message || 'Import failed'); }
    if (fileRef.current) fileRef.current.value = '';
  };

  const StatusPill = ({ status }: { status?: NavStatus | null }) => (
    <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${statusClasses[(status || 'published') as NavStatus]}`}>{status || 'published'}</span>
  );
  const BadgePill = ({ badge }: { badge?: string | null }) => badge ? (
    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${badgeClasses[badge] || 'bg-muted'}`}>{badge}</span>
  ) : null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-medium flex items-center gap-2"><Menu className="h-5 w-5" /> Navigation Manager</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={expandAll} className="luxury-button-outline text-[11px] flex items-center gap-1"><ChevronsUpDown className="h-3 w-3" /> Expand</button>
          <button onClick={collapseAll} className="luxury-button-outline text-[11px] flex items-center gap-1"><ChevronsDownUp className="h-3 w-3" /> Collapse</button>
          <DropdownMenu>
            <DropdownMenuTrigger className="luxury-button-outline text-[11px] flex items-center gap-1"><Download className="h-3 w-3" /> Export</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportCSV(headers, subs)}>Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportXLSX(headers, subs)}>Export Excel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => fileRef.current?.click()} className="luxury-button-outline text-[11px] flex items-center gap-1"><Upload className="h-3 w-3" /> Import</button>
          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e => handleImport(e.target.files?.[0])} />
          <button onClick={() => setEditor({ open: true, kind: 'parent', record: null })} className="luxury-button-primary text-xs flex items-center gap-1"><Plus className="h-3 w-3" /> Add Category</button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, slug, status or badge…" className="luxury-input pl-8" />
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border border-border rounded p-2 bg-secondary/30 text-xs">
          <span className="font-medium">{selected.size} selected</span>
          <button onClick={() => bulkStatus('published')} className="luxury-button-outline text-[11px]">Publish</button>
          <button onClick={() => bulkStatus('hidden')} className="luxury-button-outline text-[11px]">Hide</button>
          <DropdownMenu>
            <DropdownMenuTrigger className="luxury-button-outline text-[11px]">Assign Badge</DropdownMenuTrigger>
            <DropdownMenuContent>
              {['NEW', 'HOT', 'SALE', 'LIMITED', 'BEST SELLER', ''].map(b => (
                <DropdownMenuItem key={b || 'none'} onClick={() => bulkBadge(b)}>{b || 'Remove Badge'}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={bulkDelete} className="text-destructive text-[11px] hover:underline">Delete</button>
          <button onClick={clearSelect} className="ml-auto text-muted-foreground text-[11px] hover:underline">Clear</button>
        </div>
      )}

      {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragParents}>
          <SortableContext items={filteredHeaders.map(h => h.id)} strategy={verticalListSortingStrategy}>
            <div className="border border-border rounded divide-y divide-border">
              {filteredHeaders.length === 0 && <p className="p-4 text-sm text-muted-foreground">No categories found.</p>}
              {filteredHeaders.map(h => {
                const childSubs = subs.filter(s => s.parent_category === h.slug);
                const isOpen = expanded[h.slug] ?? true;
                return (
                  <Sortable key={h.id} id={h.id}>
                    {({ handle }) => (
                      <div className="bg-background">
                        <div className="flex items-center gap-2 p-3">
                          {handle}
                          <input type="checkbox" checked={selected.has(h.id)} onChange={() => toggleSelect(h.id)} className="shrink-0" />
                          <button onClick={() => toggleExpand(h.slug)} className="shrink-0 text-muted-foreground">
                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                          {h.thumbnail_url || h.icon_url ? (
                            <img src={h.thumbnail_url || h.icon_url || ''} alt="" className="h-7 w-7 rounded object-cover border border-border shrink-0" />
                          ) : null}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-sm font-medium">{h.name}</span>
                              <BadgePill badge={h.badge} />
                              <StatusPill status={h.status} />
                              {h.menu_type === 'mega' && <span className="text-[9px] px-1.5 py-0.5 rounded border border-primary/30 text-primary">Mega · {h.mega_columns}col</span>}
                              {h.is_featured && <span className="text-[9px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-600">Featured</span>}
                            </div>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                              <span>slug: {h.slug}</span>
                              <span className="flex items-center gap-0.5"><Package className="h-3 w-3" /> {productCount(h)} Products</span>
                              <span className="flex items-center gap-0.5"><Layers className="h-3 w-3" /> {childSubs.length} Subcategories</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button onClick={() => setEditor({ open: true, kind: 'sub', record: null, parentSlug: h.slug })} className="px-2 py-1 text-[11px] hover:bg-muted rounded flex items-center gap-1"><Plus className="h-3 w-3" /> Sub</button>
                            <button title="Duplicate" onClick={() => duplicateHeader(h)} className="p-1.5 hover:bg-muted rounded"><Copy className="h-3.5 w-3.5" /></button>
                            <button title="Edit" onClick={() => setEditor({ open: true, kind: 'parent', record: h })} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3.5 w-3.5" /></button>
                            <button title="Delete" onClick={() => deleteHeader(h)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>

                        {isOpen && (
                          <div className="bg-secondary/20 pl-10 pr-3 pb-2">
                            {childSubs.length === 0 && <p className="py-2 text-[11px] text-muted-foreground">No sub-categories.</p>}
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragSubs(h.slug)}>
                              <SortableContext items={childSubs.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-1 py-1">
                                  {childSubs.map(s => (
                                    <Sortable key={s.id} id={s.id}>
                                      {({ handle }) => (
                                        <div className="flex items-center gap-2 px-2 py-1.5 bg-background/60 border border-border rounded">
                                          {handle}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="text-xs font-medium">{s.name}</span>
                                              <BadgePill badge={s.badge} />
                                              <StatusPill status={s.status} />
                                            </div>
                                            <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                              <span>slug: {s.slug}</span>
                                              <span className="flex items-center gap-0.5"><Package className="h-2.5 w-2.5" /> {subProductCount(s)}</span>
                                            </p>
                                          </div>
                                          <button title="Edit" onClick={() => setEditor({ open: true, kind: 'sub', record: s, parentSlug: h.slug })} className="p-1.5 hover:bg-muted rounded"><Pencil className="h-3 w-3" /></button>
                                          <button title="Delete" onClick={() => deleteSub(s)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-3 w-3" /></button>
                                        </div>
                                      )}
                                    </Sortable>
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          </div>
                        )}
                      </div>
                    )}
                  </Sortable>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <CategoryEditor
        open={editor.open}
        kind={editor.kind}
        record={editor.record}
        parentSlug={editor.parentSlug}
        existingSlugs={allSlugs}
        previewSubs={editor.kind === 'parent' && editor.record ? subs.filter(s => s.parent_category === editor.record.slug) : []}
        onClose={() => setEditor(e => ({ ...e, open: false }))}
        onSaved={load}
      />
    </div>
  );
};

export default AdminHeaderCategories;