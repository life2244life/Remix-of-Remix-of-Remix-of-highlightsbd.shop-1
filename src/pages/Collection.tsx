import { useParams, Link } from 'react-router-dom';
import FabHeader from '@/components/fab/FabHeader';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { useCollectionBySlug, useCollectionProducts } from '@/hooks/useCollections';
import { useSEOSettings } from '@/hooks/useSEOSettings';

const Collection = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: collection, isLoading } = useCollectionBySlug(slug);
  const { data: products = [] } = useCollectionProducts(collection);
  const { data: seo } = useSEOSettings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!collection || !collection.is_active) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Collection not found" path={`/collections/${slug}`} noIndex />
        <FabHeader /><CartDrawer />
        <main className="max-w-3xl mx-auto px-4 pt-16 pb-20 text-center">
          <h1 className="luxury-heading text-3xl mb-4">Collection not found</h1>
          <Link to="/" className="luxury-button-outline text-xs">Back to store</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/collections/${collection.slug}`;
  const title = collection.seo_title || `${collection.title} | EIDLIP`;
  const description = collection.seo_description || (collection.description || '').slice(0, 155);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description,
    url: path,
    hasPart: products.slice(0, 30).map((p: any) => ({
      '@type': 'Product',
      name: p.name,
      url: p.slug ? `/products/${p.slug}` : `/product/${p.id}`,
      image: p.image_url,
      offers: { '@type': 'Offer', price: p.price, priceCurrency: 'BDT', availability: 'https://schema.org/InStock' },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={title}
        description={description}
        path={path}
        image={collection.og_image || collection.hero_image || '/logo.png'}
        type="website"
        noIndex={collection.noindex}
        jsonLd={seo?.sd_collection !== 'false' ? itemListJsonLd : undefined}
      />
      <FabHeader /><CartDrawer />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        <Breadcrumbs
          className="mb-4"
          items={[
            { name: 'Home', href: '/' },
            { name: 'Collections', href: '/#collections' },
            { name: collection.title },
          ]}
        />

        {/* Hero */}
        <header className="mb-8 sm:mb-12">
          {collection.hero_image && (
            <div className="relative aspect-[21/9] sm:aspect-[3/1] overflow-hidden mb-6 border border-border">
              <img src={collection.hero_image} alt={collection.heading || collection.title} className="w-full h-full object-cover" loading="eager" />
            </div>
          )}
          <h1 className="luxury-heading text-3xl sm:text-5xl tracking-[0.1em] mb-2">{collection.heading || collection.title}</h1>
          {collection.subheading && <p className="text-sm sm:text-base text-muted-foreground mb-3">{collection.subheading}</p>}
          {collection.description && (
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed whitespace-pre-line">{collection.description}</p>
          )}
        </header>

        {/* Products */}
        {products.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-20">No products in this collection yet.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Internal linking — other collections */}
        <section className="mt-16 pt-10 border-t border-border">
          <h2 className="luxury-heading text-sm tracking-[0.2em] mb-4">EXPLORE MORE</h2>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className="text-xs px-3 py-2 border border-border hover:border-foreground transition-colors">All Products</Link>
            <Link to="/blog" className="text-xs px-3 py-2 border border-border hover:border-foreground transition-colors">Blog</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Collection;
