import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, Clock, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SEO from '@/components/SEO';
import BlogNewsletter from '@/components/blog/BlogNewsletter';
import { useBlogPosts, useBlogCommentCounts, readingTime, BlogPost } from '@/hooks/useBlog';
import { blogCover } from '@/lib/blogContent';
import { useSEOSettings } from '@/hooks/useSEOSettings';

const PER_PAGE = 6;

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();
  const { data: commentCounts = {} } = useBlogCommentCounts();
  const { data: seo } = useSEOSettings();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') || params.get('q') || '');

  const activeCategory = params.get('category') || '';
  const activeTag = params.get('tag') || '';
  const query = (params.get('search') || params.get('q') || '').toLowerCase();
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const categories = useMemo(() => {
    const set = new Map<string, number>();
    posts.forEach(p => set.set(p.category || 'General', (set.get(p.category || 'General') || 0) + 1));
    return Array.from(set.entries());
  }, [posts]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => (p.tags || []).forEach(t => set.add(t)));
    return Array.from(set).slice(0, 20);
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (activeCategory && (p.category || 'General') !== activeCategory) return false;
      if (activeTag && !(p.tags || []).includes(activeTag)) return false;
      if (query) {
        const hay = `${p.title} ${p.excerpt} ${p.content} ${(p.tags || []).join(' ')} ${p.category}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [posts, activeCategory, activeTag, query]);

  const isFilteredView = !!(activeCategory || activeTag || query);
  const featured = !isFilteredView && filtered.length > 0
    ? (filtered.find(p => p.is_featured) || filtered[0])
    : null;
  const listSource = featured ? filtered.filter(p => p.id !== featured.id) : filtered;

  const totalPages = Math.max(1, Math.ceil(listSource.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = listSource.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    const v = search.trim();
    next.delete('q');
    if (v) next.set('search', v); else next.delete('search');
    next.delete('page');
    setParams(next);
  };

  const clearFilters = () => {
    setSearch('');
    setParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Blog"
        description="Style stories, drop announcements, care guides, and styling tips from EIDLIP — premium unisex clothing in Bangladesh."
        path="/blog"
        keywords="EIDLIP blog, fashion blog bangladesh, style guide, clothing care, unisex fashion"
        rss={{ href: '/blog/rss.xml', title: 'EIDLIP Journal RSS' }}
        jsonLd={
          seo?.sd_blogposting === 'false'
            ? undefined
            : {
                '@context': 'https://schema.org',
                '@type': 'Blog',
                name: 'EIDLIP Blog',
                url: 'https://demo.eidlip.com/blog',
                publisher: { '@type': 'Organization', name: 'EIDLIP' },
              }
        }
      />
      <Header />
      <CartDrawer />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-40 pb-20">
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="luxury-heading text-3xl sm:text-4xl tracking-[0.2em]">Blog</h1>
          <div className="w-12 h-px bg-foreground mx-auto mt-3 sm:mt-4" />
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-3 tracking-wider uppercase">Style notes & stories</p>
        </div>

        {/* Search */}
        <form onSubmit={submitSearch} className="max-w-md mx-auto mb-8 flex items-center border border-border focus-within:border-foreground transition-colors">
          <Search size={15} className="ml-3 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles…"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
            aria-label="Search articles"
          />
          {(search || query) && (
            <button type="button" onClick={clearFilters} className="px-3 text-muted-foreground hover:text-foreground" aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </form>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => updateParam('category', '')}
              className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${!activeCategory ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            {categories.map(([cat, count]) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-colors ${activeCategory === cat ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
              >
                {cat} <span className="opacity-60">({count})</span>
              </button>
            ))}
          </div>
        )}

        {(activeTag) && (
          <p className="text-center text-xs text-muted-foreground mb-6">
            Showing posts tagged <span className="text-foreground">#{activeTag}</span> ·{' '}
            <button onClick={() => updateParam('tag', '')} className="underline">clear</button>
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No articles found{query ? ` for “${params.get('search') || params.get('q')}”` : ''}.</p>
            {isFilteredView && <button onClick={clearFilters} className="luxury-button-outline inline-block">View all articles</button>}
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-9">
              {/* Featured */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="group block mb-12">
                  <div className="grid sm:grid-cols-2 gap-6 items-center">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={blogCover(featured.cover_image)}
                        alt={featured.cover_alt || featured.title}
                        loading="eager"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{featured.category} · Featured</span>
                      <h2 className="luxury-heading text-2xl sm:text-3xl mt-2 leading-tight group-hover:underline underline-offset-4">{featured.title}</h2>
                      {featured.excerpt && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{featured.excerpt}</p>}
                      <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                        {formatDate(featured.created_at)} <span>·</span> <Clock size={11} /> {readingTime(featured.content)} min read
                        {commentCounts[featured.id] ? (
                          <><span>·</span> <MessageCircle size={11} /> {commentCounts[featured.id]}</>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {paged.map((p: BlogPost) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={blogCover(p.cover_image)}
                        alt={p.cover_alt || p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="pt-4">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{p.category}</span>
                      <h3 className="text-base sm:text-lg font-medium tracking-wide mt-1 group-hover:underline underline-offset-4">{p.title}</h3>
                      {p.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>}
                      <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-muted-foreground flex items-center gap-2">
                        {formatDate(p.created_at)} <span>·</span> <Clock size={11} /> {readingTime(p.content)} min
                        {commentCounts[p.id] ? (
                          <><span>·</span> <MessageCircle size={11} /> {commentCounts[p.id]}</>
                        ) : null}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    disabled={safePage <= 1}
                    onClick={() => updateParam('page', String(safePage - 1))}
                    className="p-2 border border-border disabled:opacity-30 hover:bg-muted transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button
                      key={n}
                      onClick={() => updateParam('page', String(n))}
                      className={`w-9 h-9 text-xs border transition-colors ${n === safePage ? 'bg-foreground text-background border-foreground' : 'border-border hover:bg-muted'}`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    disabled={safePage >= totalPages}
                    onClick={() => updateParam('page', String(safePage + 1))}
                    className="p-2 border border-border disabled:opacity-30 hover:bg-muted transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-3 space-y-10">
              <div>
                <h2 className="luxury-heading text-sm tracking-[0.2em] mb-4">CATEGORIES</h2>
                <ul className="space-y-2">
                  {categories.map(([cat, count]) => (
                    <li key={cat}>
                      <button
                        onClick={() => updateParam('category', cat)}
                        className={`text-sm transition-colors ${activeCategory === cat ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {cat} <span className="text-muted-foreground">({count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {tags.length > 0 && (
                <div>
                  <h2 className="luxury-heading text-sm tracking-[0.2em] mb-4">TAGS</h2>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <button
                        key={t}
                        onClick={() => updateParam('tag', t)}
                        className={`text-[11px] px-2.5 py-1 border transition-colors ${activeTag === t ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}

        <BlogNewsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
