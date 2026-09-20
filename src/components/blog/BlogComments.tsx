import { useState } from 'react';
import { MessageCircle, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useBlogComments, useSubmitComment } from '@/hooks/useBlog';

const schema = z.object({
  guest_name: z.string().trim().min(1, 'Name is required').max(80, 'Name is too long'),
  guest_email: z.string().trim().email('Please enter a valid email').max(160),
  content: z.string().trim().min(2, 'Comment is too short').max(2000, 'Comment is too long'),
});

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const initials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || '?';

const BlogComments = ({ postId }: { postId: string }) => {
  const { data: comments = [], isLoading } = useBlogComments(postId);
  const submit = useSubmitComment();
  const [form, setForm] = useState({ guest_name: '', guest_email: '', content: '' });
  const [hp, setHp] = useState(''); // honeypot — bots fill this, humans don't

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return; // silently drop spam bots
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    try {
      await submit.mutateAsync({
        post_id: postId,
        guest_name: parsed.data.guest_name,
        guest_email: parsed.data.guest_email,
        content: parsed.data.content,
      });
      toast.success('Thanks! Your comment is awaiting moderation.');
      setForm({ guest_name: '', guest_email: '', content: '' });
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit comment');
    }
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="luxury-heading text-sm tracking-[0.2em] mb-6 flex items-center gap-2">
        <MessageCircle size={15} /> COMMENTS
        <span className="text-muted-foreground font-normal">({comments.length})</span>
      </h2>

      {/* Existing comments */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-8">Be the first to share your thoughts.</p>
      ) : (
        <ul className="space-y-6 mb-10">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3.5">
              <div className="shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-[11px] font-medium text-muted-foreground">
                {initials(c.guest_name)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{c.guest_name}</span>
                  <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line break-words">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Comment form */}
      <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
        <h3 className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Leave a comment</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            value={form.guest_name}
            onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
            placeholder="Your name"
            aria-label="Your name"
            className="border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
          />
          <input
            type="email"
            value={form.guest_email}
            onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
            placeholder="Your email (not published)"
            aria-label="Your email"
            className="border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors"
          />
        </div>
        {/* Honeypot field — visually hidden, ignored by humans */}
        <input
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Share your thoughts…"
          aria-label="Your comment"
          className="w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground transition-colors min-h-[110px]"
        />
        <p className="text-[11px] text-muted-foreground">Comments are reviewed before they appear.</p>
        <button
          type="submit"
          disabled={submit.isPending}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] bg-foreground text-background hover:opacity-90 disabled:opacity-60 transition-opacity"
        >
          {submit.isPending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          Post Comment
        </button>
      </form>
    </section>
  );
};

export default BlogComments;