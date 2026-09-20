import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import SEO from '@/components/SEO';
import LandingBlockRenderer from '@/components/landing/LandingBlockRenderer';
import { parseBlocks, type LandingBlock } from '@/lib/landingBlocks';
import { Product } from '@/data/products';

type Page = {
  slug: string; title: string; banner_url: string; is_active: boolean;
  product_ids: string[]; blocks: LandingBlock[];
  seo_title: string | null; seo_description: string | null; og_image: string | null; noindex: boolean;
  meta_keywords: string | null; canonical_url: string | null;
};

/**
 * Renders an admin-managed custom_pages row for `slug` when one exists and is
 * published; otherwise falls back to the original hardcoded page. Keeps every
 * existing route working while making these pages editable from the CMS.
 */
const DbOrFallbackPage = ({ slug, fallback }: { slug: string; fallback: React.ReactNode }) => {
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase.from('custom_pages').select('*').eq('slug', slug).maybeSingle();
      if (cancel) return;
      const raw = (data as any) || null;
      const p: Page | null = raw ? { ...raw, product_ids: raw.product_ids || [], blocks: parseBlocks(raw.blocks), noindex: !!raw.noindex } : null;
      setPage(p);
      if (p && p.product_ids.length > 0) {
        const { data: prods } = await supabase.from('products').select('*').in('id', p.product_ids);
        if (!cancel) setProducts(p.product_ids.map((id) => (prods as any[] || []).find((x) => x.id === id)).filter(Boolean) as Product[]);
      }
    })();
    return () => { cancel = true; };
  }, [slug]);

  if (page === undefined) return <div className="min-h-screen" />;

  // No published custom page → keep original hardcoded page.
  const hasContent = page && page.is_active && (page.blocks.some((b) => b.enabled) || page.banner_url);
  if (!hasContent) return <>{fallback}</>;

  const blocks = page!.blocks.filter((b) => b.enabled);

  return (
    <>
      <SEO
        title={page!.seo_title || page!.title || slug}
        description={page!.seo_description || undefined}
        path={`/${slug}`}
        image={page!.og_image || page!.banner_url}
        noIndex={page!.noindex}
        keywords={page!.meta_keywords || undefined}
        canonical={page!.canonical_url || undefined}
      />
      <Header />
      <CartDrawer />
      <main className="pt-24 sm:pt-32 pb-12">
        {page!.title && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <h1 className="luxury-heading text-3xl sm:text-4xl tracking-[0.15em] text-center mb-4">{page!.title}</h1>
            <div className="w-12 h-px bg-foreground mx-auto" />
          </div>
        )}
        {blocks.length > 0
          ? blocks.map((b) => <LandingBlockRenderer key={b.id} block={b} />)
          : (
            page!.banner_url && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <img src={page!.banner_url} alt={page!.title || slug} className="w-full h-auto" />
              </div>
            )
          )}
        {products.length > 0 && (
          <section className="mt-10 sm:mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DbOrFallbackPage;
