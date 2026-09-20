import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { HeaderCat, Sub, slugify, statusToActive, NavStatus } from './navTypes';

const FIELDS = [
  'type', 'parent_slug', 'name', 'slug', 'sort_order', 'status', 'badge', 'menu_type', 'mega_columns',
  'show_in_header', 'show_in_mobile', 'show_in_footer', 'is_featured', 'show_on_homepage',
  'seo_title', 'meta_description', 'meta_keywords', 'short_description', 'long_description',
  'banner_desktop', 'banner_mobile', 'cta_text', 'cta_link', 'icon_url', 'thumbnail_url',
];

export function buildRows(headers: HeaderCat[], subs: Sub[]) {
  const rows: Record<string, any>[] = [];
  headers.forEach(h => {
    rows.push({
      type: 'parent', parent_slug: '', name: h.name, slug: h.slug, sort_order: h.sort_order,
      status: h.status || 'published', badge: h.badge || '', menu_type: h.menu_type || 'dropdown', mega_columns: h.mega_columns || 3,
      show_in_header: h.show_in_header ?? true, show_in_mobile: h.show_in_mobile ?? true, show_in_footer: h.show_in_footer ?? false,
      is_featured: h.is_featured ?? false, show_on_homepage: h.show_on_homepage ?? false,
      seo_title: h.seo_title || '', meta_description: h.meta_description || '', meta_keywords: h.meta_keywords || '',
      short_description: h.short_description || '', long_description: h.long_description || '',
      banner_desktop: h.banner_desktop || '', banner_mobile: h.banner_mobile || '', cta_text: h.cta_text || '', cta_link: h.cta_link || '',
      icon_url: h.icon_url || '', thumbnail_url: h.thumbnail_url || '',
    });
    subs.filter(s => s.parent_category === h.slug).forEach(s => {
      rows.push({
        type: 'sub', parent_slug: h.slug, name: s.name, slug: s.slug, sort_order: s.sort_order,
        status: s.status || 'published', badge: s.badge || '', menu_type: '', mega_columns: '',
        show_in_header: '', show_in_mobile: '', show_in_footer: '', is_featured: '', show_on_homepage: '',
        seo_title: s.seo_title || '', meta_description: s.meta_description || '', meta_keywords: s.meta_keywords || '',
        short_description: s.short_description || '', long_description: s.long_description || '',
        banner_desktop: '', banner_mobile: '', cta_text: '', cta_link: '', icon_url: s.icon_url || '', thumbnail_url: s.thumbnail_url || '',
      });
    });
  });
  return rows;
}

export function exportCSV(headers: HeaderCat[], subs: Sub[]) {
  const csv = Papa.unparse({ fields: FIELDS, data: buildRows(headers, subs) });
  download(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'eidlip-navigation.csv');
}

export function exportXLSX(headers: HeaderCat[], subs: Sub[]) {
  const ws = XLSX.utils.json_to_sheet(buildRows(headers, subs), { header: FIELDS });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Navigation');
  XLSX.writeFile(wb, 'eidlip-navigation.xlsx');
}

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

const truthy = (v: any) => v === true || v === 'true' || v === 1 || v === '1' || v === 'TRUE';

async function importRows(rows: Record<string, any>[]) {
  let parents = 0, subsN = 0;
  for (const r of rows) {
    if (!r.name) continue;
    const status = (['published', 'draft', 'hidden'].includes(r.status) ? r.status : 'published') as NavStatus;
    const slug = slugify(r.slug || r.name);
    const base = {
      name: String(r.name).trim(), slug, status, is_active: statusToActive(status),
      sort_order: Number(r.sort_order) || 0, badge: r.badge || null,
      seo_title: r.seo_title || null, meta_description: r.meta_description || null, meta_keywords: r.meta_keywords || null,
      short_description: r.short_description || null, long_description: r.long_description || null,
      icon_url: r.icon_url || null, thumbnail_url: r.thumbnail_url || null,
    };
    if (r.type === 'sub') {
      await supabase.from('subcategories').upsert({ ...base, parent_category: r.parent_slug || '' }, { onConflict: 'slug' });
      subsN++;
    } else {
      await supabase.from('header_categories').upsert({
        ...base, menu_type: r.menu_type || 'dropdown', mega_columns: Number(r.mega_columns) || 3,
        show_in_header: r.show_in_header === '' ? true : truthy(r.show_in_header),
        show_in_mobile: r.show_in_mobile === '' ? true : truthy(r.show_in_mobile),
        show_in_footer: truthy(r.show_in_footer),
        is_featured: truthy(r.is_featured), show_on_homepage: truthy(r.show_on_homepage),
        banner_desktop: r.banner_desktop || null, banner_mobile: r.banner_mobile || null,
        cta_text: r.cta_text || null, cta_link: r.cta_link || null,
      }, { onConflict: 'slug' });
      parents++;
    }
  }
  return { parents, subs: subsN };
}

export function importCSV(file: File): Promise<{ parents: number; subs: number }> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: async (res) => { try { resolve(await importRows(res.data as any[])); } catch (e) { reject(e); } },
      error: reject,
    });
  });
}

export async function importXLSX(file: File) {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws);
  return importRows(rows);
}