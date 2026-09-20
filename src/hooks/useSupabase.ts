import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, Review } from '@/data/products';
import { sanitizeSearchTerm } from '@/lib/searchUtils';

const safeString = (value: any, fallback = '') => (typeof value === 'string' ? value : value == null ? fallback : String(value));
const safeNumber = (value: any) => Number.isFinite(Number(value)) ? Number(value) : 0;
const safeArray = <T = any>(value: any): T[] => Array.isArray(value) ? value.filter(v => v !== null && v !== undefined) : [];
const safeSizeChart = (value: any): any[] => {
  const parsed = typeof value === 'string' ? (() => { try { return JSON.parse(value); } catch { return []; } })() : value;
  return Array.isArray(parsed) ? parsed.filter(row => row && typeof row === 'object' && !Array.isArray(row)) : [];
};

const normalizeProduct = (product: any): Product => ({
  ...product,
  id: safeString(product?.id),
  name: safeString(product?.name, 'Untitled Product'),
  slug: product?.slug ? safeString(product.slug) : null,
  alt_text: product?.alt_text ? safeString(product.alt_text) : null,
  image_url: safeString(product?.image_url),
  category: safeString(product?.category, 'Uncategorized'),
  subcategory: product?.subcategory ? safeString(product.subcategory) : null,
  description: safeString(product?.description),
  brand: safeString(product?.brand),
  sku: safeString(product?.sku),
  sizes: safeArray<string>(product?.sizes).map(size => safeString(size)).filter(Boolean),
  colors: safeArray(product?.colors).filter(color => color && typeof color === 'object'),
  size_chart: safeSizeChart(product?.size_chart),
  stock: safeNumber(product?.stock),
  price: safeNumber(product?.price),
  original_price: product?.original_price === null || product?.original_price === undefined ? null : safeNumber(product.original_price),
  featured: !!product?.featured,
  is_new_drop: !!product?.is_new_drop,
  created_at: safeString(product?.created_at),
  updated_at: safeString(product?.updated_at),
});

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['product-slug', slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('products').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      return data ? normalizeProduct(data) : null;
    },
    enabled: !!slug,
  });
};


export const useProducts = (category?: string, search?: string, subcategory?: string, includeInactive: boolean = false) => {
  return useQuery({
    queryKey: ['products', category, search, subcategory, includeInactive],
    queryFn: async () => {
      let q = supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!includeInactive) {
        q = q.eq('is_active', true);
      }
      if (category === 'New Dropped') {
        q = q.limit(10);
      } else if (category && category !== 'All') {
        // Case-insensitive exact match so "Shirts"/"shirts" both work
        q = q.ilike('category', category);
      }
      if (subcategory) {
        q = q.ilike('subcategory', subcategory);
      }
      const { data, error } = await q;
      if (error) throw error;
      let results = (data || []).map(normalizeProduct);
      if (search) {
        // Case-insensitive, multi-field match (name, brand, category, subcategory).
        // Works for both English and Bangla; special chars are neutralised.
        const s = sanitizeSearchTerm(search).toLowerCase();
        if (s) {
          results = results.filter(p =>
            [p.name, p.brand, p.category, p.subcategory]
              .some(f => typeof f === 'string' && f.toLowerCase().includes(s)),
          );
        }
      }
      return results;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) throw error;
      return normalizeProduct(data);
    },
    enabled: !!id,
  });
};

export const useProductImages = (productId: string) => {
  return useQuery({
    queryKey: ['product-images', productId],
    queryFn: async () => {
      const { data, error } = await supabase.from('product_images').select('*').eq('product_id', productId).order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!productId,
  });
};

export const useAllProductImages = () => {
  return useQuery({
    queryKey: ['all-product-images'],
    queryFn: async () => {
      const { data, error } = await supabase.from('product_images').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ product_id, image_url, sort_order }: { product_id: string; image_url: string; sort_order: number }) => {
      const { error } = await supabase.from('product_images').insert({ product_id, image_url, sort_order });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-images'] }),
  });
};

export const useDeleteProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_images').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['product-images'] }),
  });
};

export const useRelatedProducts = (category: string, excludeId: string) => {
  return useQuery({
    queryKey: ['related-products', category, excludeId],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').eq('category', category).limit(5);
      if (error) throw error;
      return (data || []).map(normalizeProduct).filter(p => p.id !== excludeId).slice(0, 4);
    },
    enabled: !!category && !!excludeId,
  });
};

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('reviews_public').select('*').eq('product_id', productId).order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as Review[];
    },
    enabled: !!productId,
  });
};

export const useAllReviewStats = () => {
  return useQuery({
    queryKey: ['review-stats'],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('reviews_public').select('product_id, rating');
      if (error) throw error;
      const stats: Record<string, { avg: number; count: number }> = {};
      for (const r of data || []) {
        if (!stats[r.product_id]) stats[r.product_id] = { avg: 0, count: 0 };
        stats[r.product_id].count++;
        stats[r.product_id].avg += r.rating;
      }
      for (const id in stats) {
        stats[id].avg = stats[id].avg / stats[id].count;
      }
      return stats;
    },
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase.from('products').insert(product as any).select().single();
      if (error) throw error;
      return data as unknown as Product;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      const { error } = await supabase.from('products').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
};

export const useCreateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: {
      user_id: string | null;
      items: any;
      total: number;
      customer_name: string;
      customer_phone: string;
      customer_address: string;
      customer_city: string;
      delivery_method: string;
      payment_method: string;
      payment_sender_number?: string | null;
      transaction_id?: string | null;
      customer_note?: string | null;
      customer_email?: string | null;
      discount?: number;
      delivery_charge?: number;
    }) => {
      const { data, error } = await supabase.rpc('create_order', { _order: order as any });
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, ...updates }: { userId: string; display_name?: string; phone?: string; address?: string; city?: string }) => {
      const { error } = await supabase.from('profiles').update(updates).eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  });
};

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').is('deleted_at', null).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { error } = await supabase.from('orders').update(updates as never).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
};

export const useWishlistItems = (userId?: string) => {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase.from('wishlist_items').select('*, products(*)').eq('user_id', userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useAddWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      const { error } = await supabase.from('wishlist_items').insert({ user_id: userId, product_id: productId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
};

export const useRemoveWishlistItem = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, productId }: { userId: string; productId: string }) => {
      const { error } = await supabase.from('wishlist_items').delete().eq('user_id', userId).eq('product_id', productId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  });
};

export const useUserRole = (userId?: string) => {
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
      if (error) throw error;
      return data?.role || null;
    },
    enabled: !!userId,
  });
};

// Delivery Zones
export type DeliveryZoneRow = {
  id: string; name: string; fee: number; description: string | null;
  is_active: boolean; created_at: string; updated_at: string;
};

export const useDeliveryZones = (includeInactive = false) => {
  return useQuery({
    queryKey: ['delivery-zones', includeInactive],
    queryFn: async () => {
      let q = supabase.from('delivery_zones').select('*').order('created_at', { ascending: true });
      if (!includeInactive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      const zoneOrder = ['Inside Dhaka', 'Sub - Urban Dhaka', 'Outside Dhaka'];
      return ((data || []) as DeliveryZoneRow[]).sort((a, b) => {
        const aIndex = zoneOrder.indexOf(a.name);
        const bIndex = zoneOrder.indexOf(b.name);
        if (aIndex !== -1 || bIndex !== -1) return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
        return a.name.localeCompare(b.name);
      });
    },
  });
};

export const useUpdateDeliveryZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DeliveryZoneRow> & { id: string }) => {
      const { error } = await supabase.from('delivery_zones').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['delivery-zones'] }),
  });
};

// Packaging Options
export type PackagingOptionRow = {
  id: string; name: string; fee: number; description: string | null;
  is_active: boolean; sort_order: number; created_at: string; updated_at: string;
};

export const usePackagingOptions = (includeInactive = false) => {
  return useQuery({
    queryKey: ['packaging-options', includeInactive],
    queryFn: async () => {
      let q = (supabase as any).from('packaging_options').select('*').order('sort_order', { ascending: true });
      if (!includeInactive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as PackagingOptionRow[];
    },
  });
};

export const useUpdatePackagingOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PackagingOptionRow> & { id: string }) => {
      const { error } = await (supabase as any).from('packaging_options').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packaging-options'] }),
  });
};

export const useCreatePackagingOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: { name: string; fee: number; description?: string; is_active?: boolean; sort_order?: number }) => {
      const { error } = await (supabase as any).from('packaging_options').insert(row);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packaging-options'] }),
  });
};

export const useDeletePackagingOption = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('packaging_options').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['packaging-options'] }),
  });
};

// Checkout Payment Settings
export type CheckoutPaymentSettingRow = {
  id: string; provider: string; number: string; instructions: string;
  is_active: boolean; created_at: string; updated_at: string;
};

export const useCheckoutPaymentSettings = () => {
  return useQuery({
    queryKey: ['checkout-payment-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('checkout_payment_settings').select('*');
      if (error) throw error;
      return ((data || []) as CheckoutPaymentSettingRow[]).sort((a, b) => a.provider.localeCompare(b.provider));
    },
  });
};

export const useUpsertCheckoutPaymentSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (setting: Pick<CheckoutPaymentSettingRow, 'provider' | 'number' | 'instructions' | 'is_active'>) => {
      const { error } = await (supabase.from('checkout_payment_settings') as any).upsert(setting, { onConflict: 'provider' });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['checkout-payment-settings'] }),
  });
};

// Coupons
export type CouponRow = {
  id: string; name: string; code: string; discount_type: 'fixed' | 'percentage' | 'free_shipping';
  discount_value: number; min_order_amount: number; max_uses: number | null;
  used_count: number; is_active: boolean; created_at: string; updated_at: string;
};

export const useCoupons = () => {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as CouponRow[];
    },
  });
};

export const useCreateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coupon: Pick<CouponRow, 'name' | 'code' | 'discount_type' | 'discount_value' | 'min_order_amount' | 'max_uses' | 'is_active'>) => {
      const { error } = await supabase.from('coupons').insert(coupon as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useUpdateCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CouponRow> & { id: string }) => {
      const { error } = await supabase.from('coupons').update(updates as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useDeleteCoupon = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      const { data, error } = await (supabase as any).rpc('validate_coupon', { _code: code.toUpperCase().trim() });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) throw new Error('Invalid coupon code');
      const coupon = row as CouponRow;
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) throw new Error('Coupon usage limit reached');
      if (orderTotal < coupon.min_order_amount) throw new Error(`Minimum order ৳${coupon.min_order_amount} required`);
      return coupon;
    },
  });
};

export const useIncrementCouponUsage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: coupon } = await supabase.from('coupons').select('used_count').eq('id', id).single();
      if (!coupon) return;
      await supabase.from('coupons').update({ used_count: (coupon.used_count || 0) + 1 } as any).eq('id', id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['coupons'] }),
  });
};

// Store settings (key-value)
export const useStoreSettings = () => {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('store_settings').select('key, value');
      if (error) throw error;
      const map: Record<string, string> = {};
      (data || []).forEach(s => { map[s.key] = s.value; });
      return map;
    },
  });
};

export const useUpdateStoreSetting = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const { error } = await (supabase.from('store_settings') as any).upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      qc.setQueryData<Record<string, string>>(['store-settings'], current => ({
        ...(current || {}),
        [variables.key]: variables.value,
      }));
      qc.invalidateQueries({ queryKey: ['store-settings'] });
    },
  });
};

// Size stock for sold-out checks
export const useAllSizeStock = () => {
  return useQuery({
    queryKey: ['all-size-stock'],
    queryFn: async () => {
      const { data, error } = await supabase.from('product_size_stock').select('*');
      if (error) throw error;
      return (data || []) as Array<{
        id: string; product_id: string; size: string;
        total_stock: number; sold_count: number;
        cancelled_count: number; returned_count: number;
      }>;
    },
  });
};

// ============ Homepage Sections (Homepage Builder Foundation) ============
export type HomepageSection = {
  id: string;
  section_key: string;
  title: string;
  type: string;
  enabled: boolean;
  sort_order: number;
  config: Record<string, any>;
};

export const useHomepageSections = (includeDisabled = false) => {
  return useQuery({
    queryKey: ['homepage-sections', includeDisabled],
    queryFn: async () => {
      let query = (supabase.from('homepage_sections') as any).select('*').order('sort_order', { ascending: true });
      if (!includeDisabled) query = query.eq('enabled', true);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as HomepageSection[];
    },
  });
};

export const useSaveHomepageSections = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sections: Array<Pick<HomepageSection, 'id' | 'enabled' | 'sort_order'>>) => {
      // Update each section's order + enabled state.
      for (const s of sections) {
        const { error } = await (supabase.from('homepage_sections') as any)
          .update({ enabled: s.enabled, sort_order: s.sort_order, updated_at: new Date().toISOString() })
          .eq('id', s.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['homepage-sections'] });
    },
  });
};

export const useUpdateHomepageSectionConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ section_key, config }: { section_key: string; config: Record<string, any> }) => {
      const { error } = await (supabase.from('homepage_sections') as any)
        .update({ config, updated_at: new Date().toISOString() })
        .eq('section_key', section_key);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['homepage-sections'] });
    },
  });
};

export const useCreateHomepageSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (section: Pick<HomepageSection, 'section_key' | 'title' | 'type'> & { config?: Record<string, any>; sort_order?: number }) => {
      const { error } = await (supabase.from('homepage_sections') as any).insert({
        section_key: section.section_key,
        title: section.title,
        type: section.type,
        enabled: true,
        sort_order: section.sort_order ?? 999,
        config: section.config ?? {},
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage-sections'] }),
  });
};

export const useDeleteHomepageSection = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from('homepage_sections') as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['homepage-sections'] }),
  });
};
