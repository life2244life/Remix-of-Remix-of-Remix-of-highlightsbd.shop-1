import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronUp, Send, Phone, Mail, MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useStoreSettings } from '@/hooks/useSupabase';
import { getQuickContacts, quickContactHref, type QuickContact } from '@/lib/siteSettings';

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);

const quickIcon = (type: QuickContact['type']) => {
  switch (type) {
    case 'whatsapp': return <WhatsAppIcon />;
    case 'messenger': return <MessageCircle size={22} />;
    case 'telegram': return <Send size={20} />;
    case 'phone': return <Phone size={20} />;
    case 'email': return <Mail size={20} />;
    default: return <MessageCircle size={22} />;
  }
};

const deviceClass = (device: QuickContact['device']) =>
  device === 'mobile' ? 'md:hidden' : device === 'desktop' ? 'hidden md:grid' : '';

const FloatingActions = () => {
  const location = useLocation();
  const { setIsCartOpen, itemCount } = useCart();
  const { data: s } = useStoreSettings();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  const quickContacts = getQuickContacts(s);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed right-4 bottom-36 sm:bottom-24 md:right-6 z-40 flex flex-col gap-3">
      {/* Scroll to top — appears after scrolling, sits on top of the stack */}
      {showTop && (
        <button
          onClick={scrollToTop}
          className="grid h-12 w-12 place-items-center rounded-full bg-fab-ink text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp size={22} />
        </button>
      )}

      {/* Quick message links — fully DB-driven */}
      {quickContacts.map((c) => {
        const href = quickContactHref(c);
        const linkTarget = c.newTab && /^https?:/i.test(href) ? '_blank' : undefined;
        return (
          <a
            key={c.key}
            href={href}
            target={linkTarget}
            rel={linkTarget ? 'noopener noreferrer' : undefined}
            className={`grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-fab-ink shadow-lg transition-transform hover:scale-105 active:scale-95 ${deviceClass(c.device)}`}
            aria-label={c.label || c.type}
          >
            {quickIcon(c.type)}
          </a>
        );
      })}

      {/* Cart — desktop only (mobile has bottom nav) */}
      <button
        data-cart-target
        onClick={() => setIsCartOpen(true)}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background shadow-lg transition-colors hover:bg-accent"
        aria-label="Open cart"
      >
        <ShoppingBag size={20} className="text-foreground" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default FloatingActions;
