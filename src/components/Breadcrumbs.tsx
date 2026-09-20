import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSEOSettings } from '@/hooks/useSEOSettings';

export type Crumb = { name: string; href?: string };

interface Props {
  items: Crumb[];
  className?: string;
}

/**
 * SEO-friendly breadcrumb with BreadcrumbList JSON-LD.
 * Last item is treated as current page (no link).
 */
const Breadcrumbs = ({ items, className = '' }: Props) => {
  const { data: seo } = useSEOSettings();
  if (!items.length) return null;

  // Global structured-data toggle: render BreadcrumbList JSON-LD only when enabled.
  const showJsonLd = seo?.sd_breadcrumb !== 'false';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.href || undefined,
    })),
  };

  return (
    <>
      {showJsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}
      <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1 text-[11px] sm:text-xs text-muted-foreground ${className}`}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={11} className="opacity-50" />}
              {last || !c.href ? (
                <span className="text-foreground truncate max-w-[180px]" aria-current={last ? 'page' : undefined}>{c.name}</span>
              ) : (
                <Link to={c.href} className="hover:text-foreground transition-colors">{c.name}</Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
};

export default Breadcrumbs;
