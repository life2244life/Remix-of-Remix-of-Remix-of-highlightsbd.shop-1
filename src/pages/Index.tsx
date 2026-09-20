import { useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FabHeader from '@/components/fab/FabHeader';
import FabProductCard from '@/components/fab/FabProductCard';
import {
  useProducts, useAllReviewStats, useAllProductImages, useAllSizeStock, useStoreSettings,
} from '@/hooks/useSupabase';
import { resolveTemplate } from '@/lib/activeTemplate';
import type { HomeLayout } from '@/lib/templates';
import type { HomeProps } from '@/components/templates/home/types';

const HOME_LAYOUTS: Record<HomeLayout, React.LazyExoticComponent<React.ComponentType<HomeProps>>> = {
  classic: lazy(() => import('@/components/templates/home/HomeClassic')),
  modern: lazy(() => import('@/components/templates/home/HomeModern')),
  noir: lazy(() => import('@/components/templates/home/HomeNoir')),
  boutique: lazy(() => import('@/components/templates/home/HomeBoutique')),
  street: lazy(() => import('@/components/templates/home/HomeStreet')),
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const activeSub = searchParams.get('sub') || '';
  const searchQuery = searchParams.get('search') || '';
  const isListing = !!(searchQuery || (activeCategory && activeCategory !== 'All') || activeSub);

  const { data: allProducts = [], isLoading } = useProducts();
  const { data: filtered = [] } = useProducts(
    activeCategory || undefined,
    searchQuery || undefined,
    activeSub || undefined,
  );
  const { data: reviewStats = {} } = useAllReviewStats();
  const { data: allProductImages = [] } = useAllProductImages();
  const { data: allSizeStock = [] } = useAllSizeStock();
  const { data: storeSettings } = useStoreSettings();
  const activeTemplate = resolveTemplate(storeSettings);
  const HomeLayoutComponent = HOME_LAYOUTS[activeTemplate.homeLayout] ?? HOME_LAYOUTS.classic;

  const hoverImageMap = useMemo(() => {
    const grouped: Record<string, { sort_order: number; image_url: string }[]> = {};
    for (const img of allProductImages) {
      (grouped[img.product_id] ||= []).push(img);
    }
    const map: Record<string, string> = {};
    for (const [pid, imgs] of Object.entries(grouped)) {
      const sorted = imgs.sort((a, b) => a.sort_order - b.sort_order);
      if (sorted.length) map[pid] = sorted[0].image_url;
    }
    return map;
  }, [allProductImages]);

  const soldOutMap = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const s of allSizeStock) {
      grouped[s.product_id] = (grouped[s.product_id] ?? 0) +
        (s.total_stock - s.sold_count + s.cancelled_count + s.returned_count);
    }
    const map: Record<string, boolean> = {};
    for (const [pid, avail] of Object.entries(grouped)) map[pid] = avail <= 0;
    return map;
  }, [allSizeStock]);

  const newArrivals = useMemo(() => allProducts.slice(0, 12), [allProducts]);
  const topSelling = useMemo(() => {
    const withCounts = [...allProducts].sort(
      (a, b) => (reviewStats[b.id]?.count || 0) - (reviewStats[a.id]?.count || 0),
    );
    const hasReviews = withCounts.filter((p) => reviewStats[p.id]?.count);
    const base = hasReviews.length >= 4 ? hasReviews
      : [...allProducts].sort((a, b) => Number(b.featured) - Number(a.featured));
    return base.slice(0, 8);
  }, [allProducts, reviewStats]);

  const shared = { reviewStats, hoverImageMap, soldOutMap };

  return (
    <div className="fab-root min-h-screen bg-fab-bg">
      <SEO
        title="EIDLIP — Premium Fashion & Lifestyle in Bangladesh"
        description="Shop premium t-shirts, polos, hoodies, panjabi, women's & kids fashion and sports wear. Free delivery, cash on delivery across Bangladesh."
        path="/"
      />
      <FabHeader />
      <CartDrawer />

      {isListing ? (
        <main className="fab-container py-10">
          <h1 className="mb-2 text-2xl font-extrabold text-fab-ink sm:text-3xl">
            {searchQuery ? `Search: "${searchQuery}"`
              : activeSub ? activeSub.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
              : activeCategory.replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>
          <div className="mb-8 h-1 w-14 rounded-full bg-fab-accent" />
          {filtered.length === 0 ? (
            <p className="py-24 text-center text-fab-muted">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {filtered.map((p, i) => (
                <FabProductCard key={p.id} product={p} {...shared}
                  hoverImageUrl={hoverImageMap[p.id]} isSoldOut={soldOutMap[p.id]} priority={i < 4} />
              ))}
            </div>
          )}
        </main>
      ) : (
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <HomeLayoutComponent
            allProducts={allProducts}
            newArrivals={newArrivals}
            topSelling={topSelling}
            isLoading={isLoading}
            shared={shared}
          />
        </Suspense>
      )}

      <Footer />
    </div>
  );
};

export default Index;
