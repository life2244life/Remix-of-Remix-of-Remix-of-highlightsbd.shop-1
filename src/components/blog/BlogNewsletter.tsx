import { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useStoreSettings } from '@/hooks/useSupabase';
import { getNewsletterSettings, subscribeToNewsletter, type NewsletterSource } from '@/lib/newsletter';

// Premium "Join the EIDLIP Journal" newsletter section for blog pages.
const BlogNewsletter = ({ source = 'blog' }: { source?: NewsletterSource }) => {
  const { data: s } = useStoreSettings();
  const cfg = getNewsletterSettings(s);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await subscribeToNewsletter(cfg, email, source);
    if (res.status === 'subscribed') { toast.success(res.message); setDone(true); setEmail(''); }
    else if (res.status === 'duplicate') { toast.info(res.message); setDone(true); setEmail(''); }
    else toast.error(res.message);
    setLoading(false);
  };

  if (!cfg.enabled || !cfg.showBlog) return null;

  return (
    <section className="mt-16 sm:mt-20 border border-border bg-muted/30">
      <div className="max-w-2xl mx-auto text-center px-6 py-12 sm:py-16">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-border mb-5">
          <Mail size={18} className="text-foreground" />
        </span>
        <h2 className="luxury-heading text-2xl sm:text-3xl tracking-[0.08em]">Join the EIDLIP Journal</h2>
        <div className="w-12 h-px bg-foreground mx-auto my-4" />
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Style stories, new drops and exclusive offers — delivered to your inbox. No spam, ever.
        </p>

        {done ? (
          <p className="mt-7 inline-flex items-center gap-2 text-sm text-foreground">
            <Check size={16} /> {cfg.thankYouTitle}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-7 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={cfg.placeholder}
              aria-label="Email address"
              className="flex-1 border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-[11px] uppercase tracking-[0.2em] bg-foreground text-background hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {loading ? 'Joining…' : cfg.ctaText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default BlogNewsletter;