import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NotFound from '@/pages/NotFound';
import SEO from '@/components/SEO';
import LandingBlockRenderer from '@/components/landing/LandingBlockRenderer';
import { parseBlocks, type LandingPage as LP } from '@/lib/landingBlocks';

const isLive = (p: any) => {
  if (p.status !== 'published') return false;
  const now = Date.now();
  if (p.publish_at && new Date(p.publish_at).getTime() > now) return false;
  if (p.expire_at && new Date(p.expire_at).getTime() < now) return false;
  return true;
};

const LandingPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<LP | null | undefined>(undefined);

  useEffect(() => {
    let cancel = false;
    (async () => {
      const { data } = await (supabase as any)
        .from('landing_pages').select('*').eq('slug', slug || '').maybeSingle();
      if (cancel) return;
      const p = data || null;
      setPage(p ? { ...p, blocks: parseBlocks(p.blocks) } : null);
    })();
    return () => { cancel = true; };
  }, [slug]);

  if (page === undefined) return <div className="min-h-screen" />;
  if (!page || !isLive(page)) return <NotFound />;

  return (
    <div className="fab-root">
      <SEO
        title={page.seo_title || page.title}
        description={page.meta_description || undefined}
        path={`/lp/${page.slug}`}
        image={page.og_image || undefined}
        noIndex={(page as any).noindex}
        keywords={(page as any).meta_keywords || undefined}
        canonical={(page as any).canonical_url || undefined}
      />
      <Header />
      <main className="pt-24 sm:pt-32">
        <h1 className="sr-only">{page.seo_title || page.title}</h1>
        {page.blocks.map((b) => <LandingBlockRenderer key={b.id} block={b} />)}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
