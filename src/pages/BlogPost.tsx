import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/product/ShareButtons';
import ReadingProgress from '@/components/blog/ReadingProgress';
import AuthorBox from '@/components/blog/AuthorBox';
import BlogComments from '@/components/blog/BlogComments';
import BlogNewsletter from '@/components/blog/BlogNewsletter';
import { useBlogPost, useBlogPosts, readingTime } from '@/hooks/useBlog';
import { useTrackBlogView } from '@/hooks/useBlog';
import { BlogContent, TableOfContents, buildToc, buildFaqJsonLd, blogCover } from '@/lib/blogContent';
import { useSEOSettings } from '@/hooks/useSEOSettings';

const SITE = 'https://demo.eidlip.com';

const BlogPost = () => {
  const { slug = '' } = useParams();
  const { data: post, isLoading } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();
  const { data: seo } = useSEOSettings();
  useTrackBlogView(post?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header /><CartDrawer />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 sm:pt-44 animate-pulse space-y-4">
          <div className="h-8 bg-muted w-3/4" />
          <div className="h-4 bg-muted w-1/3" />
          <div className="aspect-[16/9] bg-muted" />
          <div className="h-3 bg-muted w-full" />
          <div className="h-3 bg-muted w-5/6" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Post not found" path={`/blog/${slug}`} noIndex />
        <Header /><CartDrawer />
        <div className="pt-36 sm:pt-44 text-center">
          <p className="text-muted-foreground mb-4">Post not found.</p>
          <Link to="/blog" className="luxury-button-outline inline-block">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const path = `/blog/${post.slug}`;
  const minutes = readingTime(post.content);
  const toc = buildToc(post.content);
  const faqJsonLd = buildFaqJsonLd(post.content);

  // Prev / next based on the published, sorted list
  const idx = (allPosts as any[]).findIndex(p => p.slug === post.slug);
  const prev = idx > 0 ? (allPosts as any[])[idx - 1] : null;
  const next = idx >= 0 && idx < allPosts.length - 1 ? (allPosts as any[])[idx + 1] : null;

  // Related: same category first, then fill with others
  const sameCat = (allPosts as any[]).filter(p => p.slug !== post.slug && p.category === post.category);
  const others = (allPosts as any[]).filter(p => p.slug !== post.slug && p.category !== post.category);
  const related = [...sameCat, ...others].slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || '',
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    articleSection: post.category,
    keywords: (post.tags || []).join(', '),
    author: {
      '@type': 'Person',
      name: post.author || 'EIDLIP',
      ...(post.author_bio ? { description: post.author_bio } : {}),
      ...(post.author_avatar ? { image: post.author_avatar } : {}),
      ...((post.author_social && Object.values(post.author_social).some(Boolean))
        ? { sameAs: Object.values(post.author_social).filter(Boolean) }
        : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'EIDLIP',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${path}` },
  };

  // Breadcrumb JSON-LD is emitted by <Breadcrumbs> (gated by the global toggle),
  // so it is intentionally not duplicated here.
  // Respect Admin Structured Data toggles for the remaining schemas.
  const ld: Record<string, any>[] = [];
  if (seo?.sd_blogposting !== 'false') ld.push(articleJsonLd);
  if (faqJsonLd && seo?.sd_faqpage !== 'false') ld.push(faqJsonLd);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={post.seo_title || post.title}
        description={(post.seo_description || post.excerpt || post.title).slice(0, 155)}
        path={path}
        image={post.cover_image || undefined}
        type="article"
        noIndex={(post as any).noindex}
        keywords={(post.tags || []).join(', ')}
        jsonLd={ld.length ? ld : undefined}
        rss={{ href: '/blog/rss.xml', title: 'EIDLIP Journal RSS' }}
      />
      <ReadingProgress />
      <Header /><CartDrawer />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-40 pb-20">
        <Breadcrumbs
          className="mb-5"
          items={[
            { name: 'Home', href: '/' },
            { name: 'Blog', href: '/blog' },
            { name: post.title },
          ]}
        />
        <Link to="/blog" className="inline-flex items-center gap-1 text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={12} /> Back to Blog
        </Link>

        <Link
          to={`/blog?category=${encodeURIComponent(post.category)}`}
          className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground"
        >
          {post.category}
        </Link>
        <h1 className="luxury-heading text-3xl sm:text-4xl tracking-[0.05em] leading-tight mt-2 mb-4">{post.title}</h1>

        {/* Meta: author · date · reading time */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-8">
          <span className="inline-flex items-center gap-1.5"><User size={12} /> {post.author || 'EIDLIP'}</span>
          <span>{new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {minutes} min read</span>
        </div>

        {post.excerpt && <p className="text-base text-muted-foreground italic mb-8">{post.excerpt}</p>}

        <div className="aspect-[16/9] overflow-hidden bg-muted mb-8">
          <img src={blogCover(post.cover_image)} alt={post.cover_alt || post.title} className="w-full h-full object-cover" loading="eager" />
        </div>

        {toc.length >= 2 && <div className="mb-8"><TableOfContents items={toc} /></div>}

        <BlogContent content={post.content} />

        {/* Tags */}
        {(post.tags || []).length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <Link
                key={t}
                to={`/blog?tag=${encodeURIComponent(t)}`}
                className="text-[11px] px-2.5 py-1 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Share */}
        <ShareButtons url={`${SITE}${path}`} title={post.title} />

        {/* Author */}
        <AuthorBox post={post} />

        {/* Prev / Next */}
        {(prev || next) && (
          <nav className="mt-12 pt-8 border-t border-border grid grid-cols-2 gap-4">
            <div>
              {prev && (
                <Link to={`/blog/${prev.slug}`} className="group block">
                  <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground"><ArrowLeft size={11} /> Previous</span>
                  <p className="text-sm font-medium mt-1 group-hover:underline line-clamp-2">{prev.title}</p>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link to={`/blog/${next.slug}`} className="group block">
                  <span className="inline-flex items-center gap-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground justify-end">Next <ArrowRight size={11} /></span>
                  <p className="text-sm font-medium mt-1 group-hover:underline line-clamp-2">{next.title}</p>
                </Link>
              )}
            </div>
          </nav>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="luxury-heading text-sm tracking-[0.2em] mb-5">RELATED ARTICLES</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((p: any) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-3">
                    <img src={blogCover(p.cover_image)} alt={p.cover_alt || p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{p.category}</span>
                  <h3 className="text-sm font-medium leading-snug group-hover:underline mt-1">{p.title}</h3>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/" className="text-xs px-3 py-2 border border-border hover:border-foreground transition-colors">Shop All Products</Link>
              <Link to="/blog" className="text-xs px-3 py-2 border border-border hover:border-foreground transition-colors">All Articles</Link>
            </div>
          </section>
        )}

        {/* Comments */}
        <BlogComments postId={post.id} />

        {/* Newsletter */}
        <BlogNewsletter />
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
