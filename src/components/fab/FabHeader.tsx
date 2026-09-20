import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, User, ShoppingBag, Menu, X, Phone, Truck, ChevronDown,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole, useStoreSettings } from '@/hooks/useSupabase';
import { flag, text } from '@/lib/siteSettings';
import { NAV_ITEMS, type NavItem } from './data';
import FabSocialLinks from './FabSocialLinks';

type DbHeader = {
  id: string; name: string; slug: string;
  menu_type?: string | null; mega_columns?: number | null;
  banner_desktop?: string | null; banner_mobile?: string | null;
  cta_text?: string | null; cta_link?: string | null; badge?: string | null;
  show_in_header?: boolean | null; show_in_mobile?: boolean | null;
};
type DbSub = { id: string; parent_category: string; name: string; slug: string; badge?: string | null };

// Augmented nav item: DB-driven config + curated extras (popular/featured) from NAV_ITEMS.
export type FabNavItem = NavItem & {
  slug: string;
  isMega: boolean;
  megaColumns: number;
  subs: DbSub[];
  showInMobile: boolean;
  cta_link?: string | null;
};

const FabHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { items: wishlist } = useWishlist();
  const { user } = useAuth();
  const { data: role } = useUserRole(user?.uid);
  const { data: settings } = useStoreSettings();
  const navigate = useNavigate();
  const siteLogo = text(settings, 'site_logo', '');
  const topbarOn = flag(settings, 'topbar_enabled');
  const showSearch = flag(settings, 'header_icon_search');
  const showWishlist = flag(settings, 'header_icon_wishlist');
  const showAccount = flag(settings, 'header_icon_account');
  const showCart = flag(settings, 'header_icon_cart');
  const profilePath = role === 'admin' ? '/admin' : user ? '/profile' : '/admin';

  // Menubar driven by admin "Header & Sub-categories" (with on/off toggles).
  const { data: dbHeaders = [] } = useQuery({
    queryKey: ['fab-header-categories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('header_categories')
        .select('id, name, slug, menu_type, mega_columns, banner_desktop, banner_mobile, cta_text, cta_link, badge, show_in_header, show_in_mobile')
        .eq('is_active', true)
        .order('sort_order');
      return (data as DbHeader[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: dbSubs = [] } = useQuery({
    queryKey: ['fab-subcategories'],
    queryFn: async () => {
      const { data } = await supabase
        .from('subcategories')
        .select('id, parent_category, name, slug, badge')
        .eq('is_active', true)
        .order('sort_order');
      return (data as DbSub[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const navItems: FabNavItem[] = useMemo(() => {
    if (!dbHeaders.length) {
      return NAV_ITEMS.map((n) => ({ ...n, slug: n.to.split('=')[1] || '', isMega: !!n.mega, megaColumns: 3, subs: [], showInMobile: true }));
    }
    return dbHeaders.map((h) => {
      const base = NAV_ITEMS.find((n) => n.label.toLowerCase() === h.name.toLowerCase());
      const childSubs = dbSubs.filter((s) => s.parent_category === h.slug);
      const hasSubs = childSubs.length > 0;
      const isMega = hasSubs && (h.menu_type ? h.menu_type === 'mega' : !!base?.mega);
      // DB banner overrides the curated banner when provided.
      const mega = base?.mega
        ? {
            ...base.mega,
            categories: hasSubs ? childSubs.map((s) => s.name) : base.mega.categories,
            banner: h.banner_desktop
              ? { title: h.cta_text || h.name, subtitle: '', image: h.banner_desktop }
              : base.mega.banner,
          }
        : (h.banner_desktop
            ? { categories: childSubs.map((s) => s.name), popular: [], featured: [], banner: { title: h.cta_text || h.name, subtitle: '', image: h.banner_desktop } }
            : undefined);
      return {
        label: h.name,
        to: base?.to ?? `/?category=${h.slug}`,
        badge: h.badge || base?.badge,
        mega,
        slug: h.slug,
        isMega,
        megaColumns: h.mega_columns || 3,
        subs: childSubs,
        showInMobile: h.show_in_mobile !== false,
        cta_link: h.cta_link,
      } as FabNavItem;
    }).filter((h) => {
      const db = dbHeaders.find((d) => d.slug === h.slug);
      return db ? db.show_in_header !== false : true;
    });
  }, [dbHeaders, dbSubs]);

  const mobileNavItems = useMemo(() => navItems.filter((n) => n.showInMobile), [navItems]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="relative z-50 w-full">
      {/* Top bar */}
      {topbarOn && (
        <div className="h-10 bg-fab-ink text-white">
          <div className="fab-container flex h-full items-center justify-between text-[12px]">
            {flag(settings, 'topbar_announcement_enabled') && (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Truck size={13} className="text-fab-success" />
                <span className="text-white/80">{text(settings, 'topbar_announcement_text', 'Free Delivery on orders over ৳2000')}</span>
              </div>
            )}
            {flag(settings, 'topbar_offer_enabled') && (
              <div className="flex flex-1 items-center justify-center gap-2 sm:flex-none">
                <span className="rounded-full bg-fab-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  {text(settings, 'topbar_offer_badge_text', 'Offer')}
                </span>
                <span className="text-white/90">{text(settings, 'topbar_offer_text', 'Winter Sale — up to 50% off')}</span>
              </div>
            )}
            <div className="hidden items-center gap-4 text-white/80 md:flex">
              {flag(settings, 'topbar_track_enabled') && (
                <Link to={text(settings, 'topbar_track_link', '/profile')} className="hover:text-white">{text(settings, 'topbar_track_text', 'Track Order')}</Link>
              )}
              {flag(settings, 'topbar_contact_enabled') && (
                <Link to={text(settings, 'topbar_contact_link', '/contact')} className="flex items-center gap-1 hover:text-white"><Phone size={12} /> {text(settings, 'topbar_contact_text', 'Contact Us')}</Link>
              )}
              <span className="h-4 w-px bg-white/20" />
              <FabSocialLinks variant="bar" />
            </div>
          </div>
        </div>
      )}

      {/* Main header */}
      <div
        className={`sticky top-0 z-50 border-b border-fab-line bg-fab-card transition-shadow ${
          scrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : ''
        }`}
      >
        <div className="fab-container flex h-[72px] items-center justify-between gap-4 md:h-[88px]">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open menu">
            <Menu size={24} className="text-fab-ink" />
          </button>

          <Link to="/" className="flex shrink-0 items-center gap-1 text-fab-ink">
            {siteLogo ? (
              <img src={siteLogo} alt="Logo" className="h-9 max-w-[160px] object-contain md:h-12" />
            ) : (
              <>
                <span className="text-2xl font-extrabold tracking-tight md:text-[28px]">FABRI</span>
                <span className="text-2xl font-extrabold tracking-tight text-fab-accent md:text-[28px]">LIFE</span>
              </>
            )}
          </Link>

          {/* Search */}
          {showSearch ? (
          <form onSubmit={submitSearch} className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-[520px]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="h-12 w-full rounded-full border border-fab-line bg-fab-soft pl-5 pr-12 text-sm text-fab-ink outline-none transition-colors focus:border-fab-ink"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 top-1.5 grid h-9 w-9 place-items-center rounded-full bg-fab-ink text-white transition-colors hover:bg-fab-accent"
              >
                <Search size={16} />
              </button>
            </div>
          </form>
          ) : <div className="hidden flex-1 md:block" />}

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {showWishlist && (
            <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-fab-soft" aria-label="Wishlist">
              <Heart size={20} className="text-fab-ink" />
              {wishlist.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-fab-accent px-1 text-[9px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            )}
            {showAccount && (
            <Link to={profilePath} className="hidden h-10 w-10 place-items-center rounded-full hover:bg-fab-soft sm:grid" aria-label="Account">
              <User size={20} className="text-fab-ink" />
            </Link>
            )}
            {showCart && (
            <button
              data-cart-target
              onClick={() => setIsCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-fab-soft"
              aria-label="Cart"
            >
              <ShoppingBag size={20} className="text-fab-ink" />
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-fab-accent px-1 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
            )}
          </div>
        </div>

        {/* Mobile search */}
        {showSearch && (
        <form onSubmit={submitSearch} className="fab-container pb-3 md:hidden">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="h-11 w-full rounded-full border border-fab-line bg-fab-soft pl-4 pr-11 text-sm outline-none focus:border-fab-ink"
            />
            <button type="submit" aria-label="Search" className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-fab-ink text-white">
              <Search size={15} />
            </button>
          </div>
        </form>
        )}

        {/* Desktop nav + mega menu */}
        <nav className="hidden border-t border-fab-line lg:block" onMouseLeave={() => setOpenMenu(null)}>
          <div className="fab-container flex h-14 items-center gap-8">
            {navItems.map((item) => (
              <div key={item.label} className="h-full" onMouseEnter={() => setOpenMenu(item.label)}>
                <Link
                  to={item.to}
                  className={`flex h-14 items-center gap-1 text-[13px] font-semibold uppercase tracking-wide transition-colors ${
                    openMenu === item.label ? 'text-fab-accent' : 'text-fab-ink hover:text-fab-accent'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded bg-fab-accent px-1.5 py-0.5 text-[9px] font-bold text-white">{item.badge}</span>
                  )}
                  {(item.isMega || item.subs.length > 0) && <ChevronDown size={13} className="opacity-60" />}
                </Link>
              </div>
            ))}
            <Link
              to="/blog"
              className="flex h-14 items-center text-[13px] font-semibold uppercase tracking-wide text-fab-ink transition-colors hover:text-fab-accent"
            >
              Blog
            </Link>
          </div>

          <AnimatePresence>
            {openMenu && (() => {
              const active = navItems.find((n) => n.label === openMenu);
              if (!active) return null;
              if (active.isMega && active.mega) return <MegaMenu item={active} onClose={() => setOpenMenu(null)} />;
              if (active.subs.length > 0) return <CompactDropdown item={active} onClose={() => setOpenMenu(null)} />;
              return null;
            })()}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-[61] flex w-[82%] max-w-sm flex-col bg-fab-card lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-fab-line p-4">
                <span className="text-xl font-extrabold">FABRI<span className="text-fab-accent">LIFE</span></span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close"><X size={22} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {mobileNavItems.map((item) => (
                  <MobileNavRow key={item.label} item={item} onNavigate={() => setMobileOpen(false)} />
                ))}
                <Link
                  to="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-2 py-3 text-sm font-semibold text-fab-ink"
                >
                  Blog
                </Link>
              </div>
              <div className="border-t border-fab-line p-4">
                <FabSocialLinks variant="circle" surface="mobile" className="[&_a]:bg-fab-ink/5 [&_a]:text-fab-ink" />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

const subLink = (item: FabNavItem, slug: string) => `/?category=${encodeURIComponent(item.slug)}&sub=${encodeURIComponent(slug)}`;
const colSpan: Record<number, string> = { 3: 'col-span-3', 4: 'col-span-4', 6: 'col-span-6', 9: 'col-span-9', 12: 'col-span-12' };
const gridCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' };

const MegaMenu = ({ item, onClose }: { item: FabNavItem; onClose: () => void }) => {
  const mega = item.mega!;
  const hasPopular = mega.popular.length > 0;
  const hasFeatured = mega.featured.length > 0;
  const hasBanner = !!mega.banner?.image;
  const used = (hasPopular ? 3 : 0) + (hasFeatured ? 3 : 0) + (hasBanner ? 3 : 0);
  const catSpanN = Math.max(3, 12 - used);
  const innerCols = Math.min(item.megaColumns || 3, catSpanN >= 9 ? 4 : catSpanN >= 6 ? 3 : catSpanN >= 4 ? 2 : 1);
  const cats = item.subs.length > 0
    ? item.subs.map((s) => ({ name: s.name, to: subLink(item, s.slug), badge: s.badge }))
    : mega.categories.map((c) => ({ name: c, to: item.to, badge: null as string | null }));
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
      className="absolute left-0 right-0 top-full border-t border-fab-line bg-fab-card shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
    >
      <div className="fab-container grid grid-cols-12 gap-6 py-8">
        <div className={colSpan[catSpanN] || 'col-span-3'}>
          <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-fab-muted">Categories</h4>
          <ul className={`grid gap-x-6 gap-y-2.5 ${gridCols[innerCols] || 'grid-cols-1'}`}>
            {cats.map((c) => (
              <li key={c.name}>
                <Link to={c.to} onClick={onClose} className="text-sm text-fab-ink transition-colors hover:text-fab-accent">
                  {c.name}
                  {c.badge && <span className="ml-1.5 rounded bg-fab-accent/15 px-1 py-0.5 text-[8px] font-bold text-fab-accent">{c.badge}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {hasPopular && (
          <div className="col-span-3">
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-fab-muted">Popular</h4>
            <ul className="space-y-2.5">
              {mega.popular.map((c) => (
                <li key={c}>
                  <Link to={item.to} onClick={onClose} className="text-sm text-fab-ink transition-colors hover:text-fab-accent">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {hasFeatured && (
          <div className="col-span-3">
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-fab-muted">Featured</h4>
            <div className="space-y-3">
              {mega.featured.map((f) => (
                <Link key={f.name} to={item.to} onClick={onClose} className="flex items-center gap-3 group/f">
                  <img src={f.image} alt={f.name} className="h-14 w-14 rounded-lg object-cover" loading="lazy" />
                  <div>
                    <p className="text-sm font-medium text-fab-ink group-hover/f:text-fab-accent">{f.name}</p>
                    <p className="text-sm font-bold text-fab-accent">{f.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {hasBanner && (
          <div className="col-span-3">
            <Link to={item.cta_link || item.to} onClick={onClose} className="relative block h-full min-h-[180px] overflow-hidden rounded-card">
              <img src={mega.banner.image} alt={mega.banner.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                {mega.banner.subtitle && <p className="text-xs uppercase tracking-wider opacity-90">{mega.banner.subtitle}</p>}
                <p className="text-lg font-bold">{mega.banner.title}</p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CompactDropdown = ({ item, onClose }: { item: FabNavItem; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.16 }}
    className="absolute left-0 top-full border-t border-fab-line bg-fab-card shadow-[0_20px_40px_rgba(0,0,0,0.10)]"
  >
    <div className="fab-container py-5">
      <ul className="grid max-w-md grid-cols-2 gap-x-8 gap-y-2.5">
        {item.subs.map((s) => (
          <li key={s.id}>
            <Link to={subLink(item, s.slug)} onClick={onClose} className="text-sm text-fab-ink transition-colors hover:text-fab-accent">
              {s.name}
              {s.badge && <span className="ml-1.5 rounded bg-fab-accent/15 px-1 py-0.5 text-[8px] font-bold text-fab-accent">{s.badge}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const MobileNavRow = ({ item, onNavigate }: { item: FabNavItem; onNavigate: () => void }) => {
  const [open, setOpen] = useState(false);
  const hasSubs = item.subs.length > 0;
  return (
    <div>
      <div className="flex items-center justify-between rounded-lg px-2 hover:bg-fab-soft">
        <Link to={item.to} onClick={onNavigate} className="flex flex-1 items-center gap-2 px-2 py-3 text-sm font-semibold text-fab-ink">
          {item.label}
          {item.badge && <span className="rounded bg-fab-accent px-1.5 py-0.5 text-[9px] text-white">{item.badge}</span>}
        </Link>
        {hasSubs && (
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle" className="p-2 text-fab-muted">
            <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {hasSubs && open && (
        <div className="ml-4 border-l border-fab-line pl-2">
          {item.subs.map((s) => (
            <Link
              key={s.id}
              to={subLink(item, s.slug)}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-fab-ink/80 hover:bg-fab-soft hover:text-fab-accent"
            >
              {s.name}
              {s.badge && <span className="rounded bg-fab-accent/15 px-1 py-0.5 text-[8px] font-bold text-fab-accent">{s.badge}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FabHeader;
