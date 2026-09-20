import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import NotFound from '@/pages/NotFound';
import SEO from '@/components/SEO';
import LandingBlockRenderer from '@/components/landing/LandingBlockRenderer';
import { parseBlocks, type LandingBlock } from '@/lib/landingBlocks';
import { Product } from '@/data/products';

type Page = {
  id: string; slug: string; title: string; banner_url: string; is_active: boolean;
  product_ids: string[]; blocks: LandingBlock[];
  seo_title: string | null; seo_description: string | null; og_image: string | null; noindex: boolean;
  meta_keywords: string | null; canonical_url: string | null;
};

const CustomPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await supabase.from('custom_pages').select('*').eq('slug', slug || '').maybeSingle();
      if (cancel) return;
      const raw = (data as any) || null;
      const p: Page | null = raw ? {
        ...raw,
        product_ids: raw.product_ids || [],
        blocks: parseBlocks(raw.blocks),
        noindex: !!raw.noindex,
      } : null;
      setPage(p);
      if (p && p.product_ids.length > 0) {
        const { data: prods } = await supabase.from('products').select('*').in('id', p.product_ids);
        if (!cancel) {
          const ordered = p.product_ids
            .map((id) => (prods as any[] || []).find((x) => x.id === id))
            .filter(Boolean) as Product[];
          setProducts(ordered);
        }
      }
    })();
    return () => { cancel = true; };
  }, [slug]);

  if (page === undefined) return <div className="min-h-screen" />;
  if (!page || !page.is_active) return <NotFound />;

  const blocks = page.blocks.filter((b) => b.enabled);
  const hasBlocks = blocks.length > 0;

  return (
    <>
      <SEO
        title={page.seo_title || page.title || page.slug}
        description={page.seo_description || `${page.title || page.slug} — EIDLIP.`}
        path={`/page/${page.slug}`}
        image={page.og_image || page.banner_url}
        noIndex={page.noindex}
        keywords={page.meta_keywords || undefined}
        canonical={page.canonical_url || undefined}
      />
      <Header />
      <main className="pt-24 sm:pt-32 pb-12">
        {hasBlocks ? (
          blocks.map((b) => <LandingBlockRenderer key={b.id} block={b} />)
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {page.title && <h1 className="luxury-heading text-2xl sm:text-3xl text-center mb-6">{page.title}</h1>}
            {page.banner_url && <img src={page.banner_url} alt={page.title || page.slug} className="w-full h-auto" />}
          </div>
        )}

        {products.length > 0 && (
          <section className="mt-10 sm:mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default CustomPage;
