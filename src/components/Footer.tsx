import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreSettings } from '@/hooks/useSupabase';
import FabSocialLinks from '@/components/fab/FabSocialLinks';
import { getNewsletterSettings, subscribeToNewsletter } from '@/lib/newsletter';
import {
  flag, text, parseList, getBusinessInfo,
  DEFAULT_FOOTER_MENUS, DEFAULT_TRUST_FEATURES, DEFAULT_PAYMENT_METHODS,
  type FooterMenu, type TrustFeature, type PaymentMethod,
} from '@/lib/siteSettings';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { data: s } = useStoreSettings();
  const biz = getBusinessInfo(s);
  const brandName = biz.storeName;
  const footerLogo = text(s, 'footer_logo', '');
  const description = biz.tagline;
  const address = biz.address;
  const phone = biz.phone;
  const footerEmail = biz.email;
  const copyright = biz.copyright;
  const menus = parseList<FooterMenu>(s, 'footer_menus', DEFAULT_FOOTER_MENUS);
  const trustFeatures = parseList<TrustFeature>(s, 'footer_trust_features', DEFAULT_TRUST_FEATURES).filter((f) => f.enabled);
  const payments = parseList<PaymentMethod>(s, 'footer_payment_methods', DEFAULT_PAYMENT_METHODS).filter((p) => p.enabled);
  const nl = getNewsletterSettings(s);
  const newsletterOn = nl.enabled && nl.showFooter;
  const nlTitle = nl.title;
  const nlSubtitle = nl.subtitle;
  const nlPlaceholder = nl.placeholder;
  const nlButton = nl.ctaText;

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    const res = await subscribeToNewsletter(nl, email, 'footer');
    if (res.status === 'subscribed') { toast.success(res.message); setEmail(''); }
    else if (res.status === 'duplicate') { toast.info(res.message); setEmail(''); }
    else toast.error(res.message);
    setSubscribing(false);
  };

  return (
    <footer className="fab-root bg-fab-ink text-white/80 mt-16 pb-[120px] sm:pb-0">
      {/* Newsletter strip */}
      {newsletterOn && (
      <div className="border-b border-white/10">
        <div className="fab-container py-8 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h3 className="text-white text-lg sm:text-xl font-bold tracking-tight">{nlTitle}</h3>
            <p className="text-sm text-white/60 mt-1">{nlSubtitle}</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full md:w-auto md:min-w-[420px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={nlPlaceholder}
              className="flex-1 h-12 px-4 rounded-l-btn bg-white/10 text-white placeholder:text-white/40 text-sm outline-none focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              disabled={subscribing}
              className="h-12 px-6 rounded-r-btn bg-fab-accent text-white text-sm font-semibold hover:brightness-110 transition disabled:opacity-60"
            >
              {subscribing ? '...' : nlButton}
            </button>
          </form>
        </div>
      </div>
      )}

      {/* Main columns */}
      <div className="fab-container py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand + contact */}
        <div className="col-span-2 md:col-span-1">
          {footerLogo ? (
            <img src={footerLogo} alt={brandName} className="h-10 max-w-[160px] object-contain mb-4" />
          ) : (
            <h3 className="text-white text-xl font-bold tracking-tight mb-4">{brandName}</h3>
          )}
          {description && <p className="text-sm text-white/60 mb-4">{description}</p>}
          <ul className="space-y-2.5 text-sm text-white/60">
            {address && (
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="shrink-0 mt-0.5 text-fab-accent" />
                <span>{address}</span>
              </li>
            )}
            {phone && (
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-fab-accent" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
              </li>
            )}
            {footerEmail && (
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-fab-accent" />
                <a href={`mailto:${footerEmail}`} className="hover:text-white transition-colors">{footerEmail}</a>
              </li>
            )}
          </ul>
          <FabSocialLinks variant="circle" className="mt-5" />
        </div>

        {/* Dynamic menus */}
        {menus.map((menu, mi) => (
          <div key={mi}>
            <h4 className="text-white text-sm font-bold mb-4">{menu.title}</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {menu.links.map((link, li) => (
                <li key={li}>
                  {/^https?:\/\//.test(link.url) ? (
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{link.label}</a>
                  ) : (
                    <Link to={link.url || '/'} className="hover:text-white transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Why shop with us */}
        {trustFeatures.length > 0 && (
          <div>
            <h4 className="text-white text-sm font-bold mb-4">Why shop with us</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {trustFeatures.map((f, i) => <li key={i}>✓ {f.text}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Payment methods */}
      {payments.length > 0 && (
        <div className="border-t border-white/10">
          <div className="fab-container py-5 flex flex-wrap items-center justify-center gap-2.5">
            {payments.map((p) => (
              <span key={p.key} className="rounded bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80">{p.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="fab-container py-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
          <p className="text-center text-xs text-white/50">
            {(() => {
              const re = /md\.?\s*nazmul\s+hasan\s+limon/i;
              const match = copyright.match(re);
              if (!match) return copyright;
              const idx = match.index!;
              return (
                <>
                  {copyright.slice(0, idx)}
                  <a
                    href="https://www.facebook.com/nazmul.hasan.limon.432704"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-fab-accent hover:text-white transition-colors underline-offset-4 hover:underline"
                  >
                    {copyright.slice(idx, idx + match[0].length)}
                  </a>
                  {copyright.slice(idx + match[0].length)}
                </>
              );
            })()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
