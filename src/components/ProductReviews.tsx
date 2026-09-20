import { useState, useMemo, useEffect } from 'react';
import { Star, ThumbsUp, BadgeCheck, ImagePlus, Send, X, Camera, ChevronDown } from 'lucide-react';
import { useProductReviews } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  title?: string | null;
  email?: string | null;
  photo_url?: string | null;
  photo_urls?: string[] | null;
  verified?: boolean | null;
  helpful_count?: number | null;
  created_at: string;
};

type FilterKey =
  | 'all'
  | '5'
  | '4'
  | '3'
  | '2'
  | '1'
  | 'photos'
  | 'recent'
  | 'helpful';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All Reviews' },
  { key: '5', label: '5 Star' },
  { key: '4', label: '4 Star' },
  { key: '3', label: '3 Star' },
  { key: '2', label: '2 Star' },
  { key: '1', label: '1 Star' },
  { key: 'photos', label: 'With Photos' },
  { key: 'recent', label: 'Most Recent' },
  { key: 'helpful', label: 'Most Helpful' },
];

const getPhotos = (r: Review): string[] => {
  const arr = Array.isArray(r.photo_urls) ? r.photo_urls.filter(Boolean) : [];
  if (r.photo_url && !arr.includes(r.photo_url)) return [r.photo_url, ...arr];
  return arr;
};

const Stars = ({ value, size = 14 }: { value: number; size?: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < Math.round(value) ? 'currentColor' : 'none'}
        className={i < Math.round(value) ? 'text-amber-500' : 'text-muted-foreground/30'}
      />
    ))}
  </div>
);

const HELPFUL_KEY = 'review_helpful_voted';
const getVoted = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HELPFUL_KEY) || '[]');
  } catch {
    return [];
  }
};

const ReviewCard = ({ review }: { review: Review }) => {
  const photos = getPhotos(review);
  const [helpful, setHelpful] = useState(review.helpful_count || 0);
  const [voted, setVoted] = useState(() => getVoted().includes(review.id));
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleHelpful = async () => {
    if (voted) return;
    setVoted(true);
    setHelpful((c) => c + 1);
    try {
      localStorage.setItem(HELPFUL_KEY, JSON.stringify([...getVoted(), review.id]));
    } catch {}
    const { error } = await supabase.rpc('increment_review_helpful', { _review_id: review.id });
    if (error) {
      setVoted(false);
      setHelpful((c) => Math.max(0, c - 1));
    }
  };

  return (
    <div className="border border-border rounded-lg p-4 sm:p-5 bg-card animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-medium shrink-0">
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-medium text-foreground">{review.name}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  <BadgeCheck size={11} /> Verified Purchase
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
        <Stars value={review.rating} size={13} />
      </div>

      {review.title && <p className="mt-3 text-sm font-semibold text-foreground">{review.title}</p>}
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{review.comment}</p>

      {photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(p)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border border-border hover:opacity-90 transition-opacity"
            >
              <img src={p} alt={`Review photo ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
        <button
          type="button"
          onClick={handleHelpful}
          disabled={voted}
          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-colors ${
            voted
              ? 'border-foreground bg-foreground text-background'
              : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
          }`}
        >
          <ThumbsUp size={12} fill={voted ? 'currentColor' : 'none'} />
          Helpful{helpful > 0 ? ` (${helpful})` : ''}
        </button>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white p-2" aria-label="Close">
            <X size={24} />
          </button>
          <img src={lightbox} alt="Review" className="max-w-full max-h-[90vh] object-contain" />
        </div>
      )}
    </div>
  );
};

const ReviewModal = ({
  productId,
  open,
  onClose,
}: {
  productId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.size <= 5 * 1024 * 1024);
    if (valid.length < selected.length) toast.error('Each photo must be under 5MB');
    const next = [...files, ...valid].slice(0, 5);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (i: number) => {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    if (!name.trim()) return toast.error('Please enter your name');
    if (!comment.trim()) return toast.error('Please write your review');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error('Invalid email');

    setSubmitting(true);
    try {
      const photo_urls: string[] = [];
      for (const f of files) {
        const ext = f.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from('review-photos')
          .upload(path, f, { cacheControl: '31536000', upsert: false, contentType: f.type });
        if (upErr) throw upErr;
        photo_urls.push(supabase.storage.from('review-photos').getPublicUrl(path).data.publicUrl);
      }

      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: user?.uid || null,
        name: name.trim(),
        email: email.trim() || null,
        rating,
        title: title.trim() || null,
        comment: comment.trim(),
        photo_url: photo_urls[0] || null,
        photo_urls,
      } as any);
      if (error) throw error;

      toast.success('Thank you! Your review has been submitted.');
      setRating(0); setName(''); setEmail(''); setTitle(''); setComment('');
      setFiles([]); setPreviews([]);
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="luxury-heading text-xl tracking-[0.1em]">Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Your Rating</label>
            <div className="flex gap-1 mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    fill={(hoverRating || rating) > i ? 'currentColor' : 'none'}
                    className={(hoverRating || rating) > i ? 'text-amber-500' : 'text-muted-foreground/30'}
                  />
                </button>
              ))}
            </div>
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" className="luxury-input text-sm" maxLength={100} required />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email (optional)" className="luxury-input text-sm" maxLength={255} />
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review Title" className="luxury-input text-sm" maxLength={120} />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review..." className="luxury-input text-sm min-h-[100px]" maxLength={1000} required />
          <div>
            <label className="inline-flex items-center gap-2 cursor-pointer text-[11px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              <span className="inline-flex items-center gap-1.5 border border-border px-3 py-2 rounded-md">
                <Camera size={14} /> Add Photos (up to 5)
              </span>
            </label>
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} alt="Preview" className="w-16 h-16 object-cover rounded-md border border-border" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute -top-2 -right-2 bg-foreground text-background w-5 h-5 rounded-full text-[11px] flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={submitting} className="luxury-button-primary w-full py-3 text-xs inline-flex items-center justify-center gap-2">
            <Send size={14} />
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductReviews = ({ productId }: { productId: string }) => {
  const { data: reviews = [] } = useProductReviews(productId);
  const [filter, setFilter] = useState<FilterKey>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [visible, setVisible] = useState(6);

  const stats = useMemo(() => {
    const total = reviews.length;
    const sum = reviews.reduce((s, r: Review) => s + r.rating, 0);
    const avg = total > 0 ? sum / total : 0;
    const counts = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r: Review) => r.rating === star).length,
    }));
    return { total, avg, counts };
  }, [reviews]);

  const filtered = useMemo(() => {
    let list = [...(reviews as Review[])];
    if (['5', '4', '3', '2', '1'].includes(filter)) {
      list = list.filter((r) => r.rating === Number(filter));
    } else if (filter === 'photos') {
      list = list.filter((r) => getPhotos(r).length > 0);
    } else if (filter === 'helpful') {
      list = list.sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
    } else if (filter === 'recent') {
      list = list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    return list;
  }, [reviews, filter]);

  useEffect(() => setVisible(6), [filter]);

  return (
    <section className="mt-10 sm:mt-14 pt-8 border-t border-border">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 sm:mb-8">
        <h2 className="luxury-heading text-xl sm:text-2xl tracking-[0.1em]">Reviews &amp; Ratings</h2>
        <button onClick={() => setModalOpen(true)} className="luxury-button-primary py-2.5 px-6 text-[11px] inline-flex items-center gap-2">
          <Star size={14} /> Write a Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-10">
        {/* Overall rating card */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="border border-border rounded-xl p-6 bg-card text-center">
            <div className="text-5xl font-light text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              {stats.avg.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">out of 5</div>
            <div className="flex justify-center mt-3">
              <Stars value={stats.avg} size={18} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {stats.total.toLocaleString()} Review{stats.total !== 1 ? 's' : ''}
            </p>

            <div className="mt-6 space-y-2.5">
              {stats.counts.map(({ star, count }) => {
                const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <button
                    key={star}
                    onClick={() => setFilter(String(star) as FilterKey)}
                    className="w-full flex items-center gap-2 group"
                  >
                    <span className="text-[11px] text-muted-foreground w-8 text-left shrink-0 group-hover:text-foreground">{star} ★</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-[width] duration-700 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-muted-foreground w-9 text-right shrink-0">{pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews list */}
        <div>
          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 text-[11px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
                  filter === f.key
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl py-16 text-center">
              <Star size={32} className="mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-3">No reviews yet. Be the first to share your thoughts.</p>
              <button onClick={() => setModalOpen(true)} className="luxury-button-outline mt-4 py-2.5 px-6 text-[11px] inline-flex items-center gap-2">
                <Star size={14} /> Write a Review
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.slice(0, visible).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
              {visible < filtered.length && (
                <button
                  onClick={() => setVisible((v) => v + 6)}
                  className="w-full luxury-button-outline py-3 text-[11px] inline-flex items-center justify-center gap-2"
                >
                  Load More Reviews <ChevronDown size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <ReviewModal productId={productId} open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default ProductReviews;