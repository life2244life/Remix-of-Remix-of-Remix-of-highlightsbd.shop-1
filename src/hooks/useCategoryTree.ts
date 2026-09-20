import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type HeaderCategory = { id: string; name: string; slug: string; sort_order: number; is_active: boolean };
export type SubCategory = { id: string; name: string; slug: string; parent_category: string; sort_order: number; is_active: boolean };

/**
 * Live category tree for the admin editors.
 * - Loads active categories (header_categories) and sub-categories (subcategories) from the DB.
 * - Subscribes to realtime changes so newly created categories/sub-categories appear instantly
 *   without a page refresh, and refetches on window focus / mount.
 */
export const useCategoryTree = () => {
  const qc = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['admin-header-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('header_categories')
        .select('id, name, slug, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as HeaderCategory[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  const subcategoriesQuery = useQuery({
    queryKey: ['admin-subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('id, name, slug, parent_category, sort_order, is_active')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return (data || []) as SubCategory[];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    const channel = supabase
      .channel('admin-category-tree')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'header_categories' }, () => {
        qc.invalidateQueries({ queryKey: ['admin-header-categories'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subcategories' }, () => {
        qc.invalidateQueries({ queryKey: ['admin-subcategories'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  return {
    categories: categoriesQuery.data || [],
    subcategories: subcategoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading || subcategoriesQuery.isLoading,
    refetch: () => {
      categoriesQuery.refetch();
      subcategoriesQuery.refetch();
    },
  };
};
