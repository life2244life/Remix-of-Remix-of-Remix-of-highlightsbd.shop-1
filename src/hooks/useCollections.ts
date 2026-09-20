import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Collection = {
  id: string;
  slug: string;
  title: string;
  heading: string;
  subheading: string;
  description: string;
  hero_image: string;
  seo_title: string;
  seo_description: string;
  og_image: string;
  filter_categories: string[];
  filter_subcategories: string[];
  filter_product_ids: string[];
  filter_featured: boolean | null;
  filter_new_drop: boolean | null;
  sort_order: number;
  is_active: boolean;
  noindex: boolean;
  show_in_nav: boolean;
  created_at: string;
  updated_at: string;
};

export const useCollections = (includeInactive = false) => {
  return useQuery({
    queryKey: ['collections', includeInactive],
    queryFn: async (): Promise<Collection[]> => {
      let q = supabase.from('collections').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as Collection[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCollectionBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ['collection', slug],
    enabled: !!slug,
    queryFn: async (): Promise<Collection | null> => {
      // 1) Real collection
      const { data } = await supabase.from('collections').select('*').eq('slug', slug!).maybeSingle();
      if (data) return data as Collection;

      // 2) Auto-fallback: header_categories — every category you add becomes an SEO landing page
      const { data: cat } = await supabase
        .from('header_categories').select('*').eq('slug', slug!).eq('is_active', true).maybeSingle();
      if (cat) {
        return {
          id: `cat-${cat.id}`, slug: cat.slug, title: cat.name, heading: cat.name, subheading: '',
          description: `Shop ${cat.name} from EIDLIP — premium Bangladeshi unisex clothing with cash on delivery.`,
          hero_image: '',
          seo_title: `${cat.name} — Buy Online in Bangladesh | EIDLIP`,
          seo_description: `Shop the latest ${cat.name} collection from EIDLIP. Cash on delivery across Bangladesh.`,
          og_image: '', filter_categories: [cat.name], filter_subcategories: [], filter_product_ids: [],
          filter_featured: null, filter_new_drop: null, sort_order: 0, is_active: true, noindex: false,
          show_in_nav: false, created_at: cat.created_at, updated_at: cat.updated_at,
        } as Collection;
      }

      // 3) Sub-category fallback
      const { data: sub } = await supabase
        .from('subcategories').select('*').eq('slug', slug!).eq('is_active', true).maybeSingle();
      if (sub) {
        return {
          id: `sub-${sub.id}`, slug: sub.slug, title: sub.name, heading: sub.name, subheading: sub.parent_category,
          description: `Shop ${sub.name} from EIDLIP — premium Bangladeshi unisex clothing.`,
          hero_image: '',
          seo_title: `${sub.name} — ${sub.parent_category} | EIDLIP`,
          seo_description: `Shop the latest ${sub.name} in ${sub.parent_category} from EIDLIP. Cash on delivery across Bangladesh.`,
          og_image: '', filter_categories: [], filter_subcategories: [sub.name], filter_product_ids: [],
          filter_featured: null, filter_new_drop: null, sort_order: 0, is_active: true, noindex: false,
          show_in_nav: false, created_at: sub.created_at, updated_at: sub.updated_at,
        } as Collection;
      }

      return null;
    },
  });
};

/** Fetch products matching collection filters. */
export const useCollectionProducts = (collection?: Collection | null) => {
  return useQuery({
    queryKey: ['collection-products', collection?.id, collection?.updated_at],
    enabled: !!collection,
    queryFn: async () => {
      let q = supabase.from('products').select('*').eq('is_active', true);
      if (collection!.filter_categories?.length) q = q.in('category', collection!.filter_categories);
      if (collection!.filter_subcategories?.length) q = q.in('subcategory', collection!.filter_subcategories);
      if (collection!.filter_featured) q = q.eq('featured', true);
      if (collection!.filter_new_drop) q = q.eq('is_new_drop', true);
      if (collection!.filter_product_ids?.length) q = q.in('id', collection!.filter_product_ids);
      const { data, error } = await q.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useSaveCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: Partial<Collection> & { id?: string }) => {
      const payload = { ...c, updated_at: new Date().toISOString() };
      if (c.id) {
        const { error } = await supabase.from('collections').update(payload).eq('id', c.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('collections').insert(payload as any);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};

export const useDeleteCollection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['collections'] }),
  });
};
