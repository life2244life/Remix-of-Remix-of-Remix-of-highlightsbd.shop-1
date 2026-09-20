import { useState, useRef, useMemo } from 'react';
import {
  Plus, Edit, Trash2, X, Save, Upload, Loader2, Eye, EyeOff, Check, MessageSquare, Clock,
  Star, Bold, Italic, List, Quote, Heading2, Heading3, Youtube, Link2, Table as TableIcon,
  ExternalLink,
  HelpCircle, BarChart3, Image as ImageIcon, Users, Mail, TrendingUp, Tags, AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useBlogPosts, useUpsertBlogPost, useDeleteBlogPost, BlogPost,
  useAllComments, useModerateComment, useDeleteComment,
  useBlogAnalytics,
  useBlogCategories, useAddBlogCategory, useRenameBlogCategory, useDeleteBlogCategory,
} from '@/hooks/useBlog';
import { uploadImage } from '@/lib/upload';
import { slugify } from '@/data/products';
import SeoSidebar from '@/components/admin/SeoSidebar';
import { analyzeBlogSEO } from '@/lib/seoAnalyzer';
import { createPortal } from 'react-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFormDraft } from '@/hooks/useFormDraft';
import { DraftRecoveryBanner, ClearAllDialog } from '@/components/admin/EditorDraftUI';
import TextFieldWithGuidance from '@/components/admin/TextFieldWithGuidance';

const emptyPost: Partial<BlogPost> = {
  slug: '', title: '', excerpt: '', content: '', cover_image: '', cover_alt: '',
  seo_title: '', seo_description: '', is_published: true, sort_order: 0,
  status: 'published', scheduled_at: null, is_featured: false,
  category: '', tags: [], author: 'EIDLIP Editorial',
  author_bio: '', author_avatar: '', author_social: {},
};

const AdminBlog = () => {
  const { data: posts = [], isLoading } = useBlogPosts(true);
  const upsert = useUpsertBlogPost();
  const del = useDeleteBlogPost();
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [view, setView] = useState<'posts' | 'comments' | 'analytics'>('posts');
  const [manageCats, setManageCats] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim()) { toast.error('Title required'); return; }
    const slug = (editing.slug || slugify(editing.title)).trim();
    if (!slug) { toast.error('Slug required'); return; }
    try {
      await upsert.mutateAsync({ ...editing, slug });
      // Clear any saved auto-draft for this post now that it is persisted.
      try {
        const uid = user?.uid || 'anon';
        const key = editing.id ? `blog_draft_${uid}_edit_${editing.id}` : `blog_draft_${uid}`;
        localStorage.removeItem(key);
      } catch { /* ignore */ }
      toast.success(editing.id ? 'Post updated' : 'Post created');
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light tracking-wide">Blog</h2>
          <p className="text-xs text-muted-foreground mt-1">{posts.length} posts</p>
        </div>
        {view === 'posts' && (
          <div className="flex gap-2">
            <button onClick={() => setManageCats(true)} className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-widest border border-border hover:bg-muted transition-colors">
              <Tags size={13} /> Manage Categories
            </button>
            <button onClick={() => setEditing({ ...emptyPost })} className="inline-flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 transition-opacity">
              <Plus size={13} /> New Post
            </button>
          </div>
        )}
      </div>

      {/* View switch */}
      <div className="flex gap-2 border-b border-border">
        <button onClick={() => setView('posts')} className={`px-3 py-2 text-[10px] uppercase tracking-widest border-b-2 -mb-px transition-colors ${view === 'posts' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Posts</button>
        <button onClick={() => setView('comments')} className={`px-3 py-2 text-[10px] uppercase tracking-widest border-b-2 -mb-px transition-colors inline-flex items-center gap-1.5 ${view === 'comments' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}><MessageSquare size={12} /> Comments</button>
        <button onClick={() => setView('analytics')} className={`px-3 py-2 text-[10px] uppercase tracking-widest border-b-2 -mb-px transition-colors inline-flex items-center gap-1.5 ${view === 'analytics' ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}><BarChart3 size={12} /> Analytics</button>
      </div>

      {view === 'analytics' ? (
        <BlogAnalyticsPanel />
      ) : view === 'comments' ? (
        <CommentsModeration />
      ) : (
      <>
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={20} /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No posts yet. Click "New Post" to start.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border bg-card">
          {posts.map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 hover:bg-muted/30 transition-colors">
              {p.cover_image ? (
                <img src={p.cover_image} alt="" className="w-16 h-12 object-cover shrink-0" />
              ) : (
                <div className="w-16 h-12 bg-muted shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  <StatusBadge post={p} />
                  {p.category && (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-muted text-muted-foreground border border-border shrink-0">
                      {p.category}
                    </span>
                  )}
                  {p.is_featured && <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground/10 text-foreground inline-flex items-center gap-1"><Star size={9} className="fill-current" /> Featured</span>}
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">/blog/{p.slug}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => upsert.mutate({ id: p.id, is_featured: !p.is_featured })} className="p-2 hover:bg-muted transition-colors" title={p.is_featured ? 'Unfeature' : 'Feature'}>
                  <Star size={14} className={p.is_featured ? 'fill-current text-foreground' : ''} />
                </button>
                <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="View on website">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => setEditing(p)} className="p-2 hover:bg-muted transition-colors"><Edit size={14} /></button>
                <button onClick={async () => { if (confirm('Delete this post?')) { await del.mutateAsync(p.id); toast.success('Deleted'); } }} className="p-2 text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {editing && (
        <PostEditor
          post={editing}
          onChange={setEditing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={upsert.isPending}
        />
      )}

      {manageCats && <CategoryManagerModal posts={posts} onClose={() => setManageCats(false)} />}
    </div>
  );
};

const CommentsModeration = () => {
  const { data: comments = [], isLoading } = useAllComments();
  const moderate = useModerateComment();
  const del = useDeleteComment();
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  const shown = comments.filter((c) =>
    filter === 'all' ? true : filter === 'pending' ? !c.is_approved : c.is_approved
  );
  const pendingCount = comments.filter((c) => !c.is_approved).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['pending', 'approved', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${filter === f ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            {f}{f === 'pending' && pendingCount ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={20} /></div>
      ) : shown.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No {filter !== 'all' ? filter : ''} comments.</p>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border bg-card">
          {shown.map((c) => (
            <div key={c.id} className="p-4 flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{c.guest_name}</span>
                  <span className="text-[11px] text-muted-foreground">{c.guest_email}</span>
                  {c.is_approved ? (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-foreground/10 text-foreground">Approved</span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-muted text-muted-foreground inline-flex items-center gap-1"><Clock size={9} /> Pending</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 whitespace-pre-line break-words">{c.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5">{new Date(c.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => moderate.mutate({ id: c.id, is_approved: !c.is_approved })}
                  className="p-2 hover:bg-muted transition-colors"
                  title={c.is_approved ? 'Unpublish' : 'Approve'}
                >
                  {c.is_approved ? <EyeOff size={14} /> : <Check size={14} />}
                </button>
                <button
                  onClick={async () => { if (confirm('Delete this comment?')) { await del.mutateAsync(c.id); toast.success('Deleted'); } }}
                  className="p-2 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PostEditor = ({ post, onChange, onSave, onCancel, saving }: {
  post: Partial<BlogPost>;
  onChange: (p: Partial<BlogPost>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [focusKeyword, setFocusKeyword] = useState('');
  const { data: categories = [] } = useBlogCategories();

  // ---- Auto-draft / recovery ----
  const { user } = useAuth();
  const userId = user?.uid || 'anon';
  const draftKey = post.id ? `blog_draft_${userId}_edit_${post.id}` : `blog_draft_${userId}`;
  const { recovered, clearDraft, dismissRecovery } = useFormDraft<Partial<BlogPost>>(draftKey, post);
  const [clearOpen, setClearOpen] = useState(false);

  const applyRecovered = () => {
    if (recovered) onChange(recovered);
    dismissRecovery();
  };
  const handleClearAll = () => {
    onChange({ ...emptyPost });
    clearDraft();
    setClearOpen(false);
    toast.success('All content cleared');
  };

  const seoResult = useMemo(() => analyzeBlogSEO({
    focusKeyword,
    title: post.title || '',
    slug: post.slug || '',
    content: post.content || '',
    excerpt: post.excerpt || '',
    seoTitle: post.seo_title || '',
    seoDescription: post.seo_description || '',
    coverImage: post.cover_image || '',
    coverAlt: post.cover_alt || '',
  }), [focusKeyword, post.title, post.slug, post.content, post.excerpt, post.seo_title, post.seo_description, post.cover_image, post.cover_alt]);

  const handleCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'blog');
      onChange({ ...post, cover_image: url });
      toast.success('Cover uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-background border border-border shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-light tracking-wide">{post.id ? 'Edit Post' : 'New Post'}</h3>
          <button onClick={onCancel} className="p-2 hover:bg-muted"><X size={16} /></button>
        </div>

        <div className="p-6 flex flex-col lg:flex-row gap-6">
          {/* Sticky SEO sidebar (mobile: accordion) */}
          <SeoSidebar
            result={seoResult}
            focusKeyword={focusKeyword}
            onFocusKeywordChange={setFocusKeyword}
            keywordPlaceholder="e.g. Eid fashion tips"
            preview={{
              title: post.seo_title || post.title || '',
              description: post.seo_description || post.excerpt || '',
              path: `/blog/${post.slug || 'post-slug'}`,
              image: post.cover_image || undefined,
            }}
          />

          {/* Main scrollable form */}
          <div className="flex-1 min-w-0 space-y-5">
          {recovered && (
            <DraftRecoveryBanner onContinue={applyRecovered} onDiscard={clearDraft} />
          )}
          <TextFieldWithGuidance
            label="Title"
            value={post.title || ''}
            onChange={v => onChange({ ...post, title: v, slug: post.slug || slugify(v) })}
            placeholder="e.g. Eid Fashion Tips"
            recommendedMin={50}
            recommendedMax={60}
            action={
              <button
                type="button"
                onClick={() => setClearOpen(true)}
                className="text-[10px] uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            }
          />
          <TextFieldWithGuidance
            label="Slug (URL)"
            value={post.slug || ''}
            onChange={v => onChange({ ...post, slug: slugify(v) })}
            placeholder="my-post-slug"
            recommendedMin={3}
            recommendedMax={80}
            mono
            hint={<p className="text-[10px] text-muted-foreground mt-1">/blog/{post.slug || 'your-slug'}</p>}
          />
          <TextFieldWithGuidance
            label="Excerpt"
            value={post.excerpt || ''}
            onChange={v => onChange({ ...post, excerpt: v })}
            placeholder="Short summary shown on blog list"
            recommendedMin={140}
            recommendedMax={160}
            multiline
            inputClassName="min-h-[60px]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Category">
              <select
                value={post.category || ''}
                onChange={e => onChange({ ...post, category: e.target.value })}
                className="luxury-input"
              >
                <option value="">— Select category —</option>
                {post.category && !categories.some(c => c.name === post.category) && (
                  <option value={post.category}>{post.category}</option>
                )}
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">Manage the list from “Manage Categories”.</p>
            </Field>
            <TextFieldWithGuidance
              label="Author"
              value={post.author || ''}
              onChange={v => onChange({ ...post, author: v })}
              placeholder="EIDLIP Editorial"
              recommendedMin={2}
              recommendedMax={50}
            />
            <TextFieldWithGuidance
              label="Tags (comma separated)"
              value={(post.tags || []).join(', ')}
              onChange={v => onChange({ ...post, tags: v.split(',').map(t => t.trim()).filter(Boolean) })}
              placeholder="summer, style, cotton"
              showCounter={false}
            />
          </div>

          <Field label="Cover Image">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleCover} className="hidden" />
            {post.cover_image ? (
              <div className="space-y-2">
                <img src={post.cover_image} alt="" className="w-full max-w-sm aspect-[16/9] object-cover border border-border" />
                <div className="flex gap-2">
                  <button onClick={() => onChange({ ...post, cover_image: '' })} className="text-[10px] text-destructive border border-destructive/30 px-2 py-1 hover:bg-destructive/10">Remove</button>
                  <button onClick={() => inputRef.current?.click()} className="text-[10px] border border-border px-2 py-1 hover:bg-muted">Replace</button>
                </div>
              </div>
            ) : (
              <button onClick={() => inputRef.current?.click()} disabled={uploading} className="w-full max-w-sm h-32 border-2 border-dashed border-border hover:border-foreground/50 flex flex-col items-center justify-center transition-colors">
                {uploading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <Upload size={20} className="text-muted-foreground mb-1.5" />
                    <span className="text-[10px] text-muted-foreground">Click to upload cover</span>
                  </>
                )}
              </button>
            )}
          </Field>
          <TextFieldWithGuidance
            label="Cover Image Alt Text"
            value={post.cover_alt || ''}
            onChange={v => onChange({ ...post, cover_alt: v })}
            placeholder="Describe the cover image"
            recommendedMin={80}
            recommendedMax={125}
          />

          {/* Author profile */}
          <div className="border border-border p-4 space-y-4">
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Author Profile</p>
            <TextFieldWithGuidance
              label="Author Bio"
              value={post.author_bio || ''}
              onChange={v => onChange({ ...post, author_bio: v })}
              placeholder="Short bio shown on the article"
              recommendedMin={50}
              recommendedMax={200}
              multiline
              inputClassName="min-h-[60px]"
            />
            <Field label="Author Avatar URL">
              <input value={post.author_avatar || ''} onChange={e => onChange({ ...post, author_avatar: e.target.value })} className="luxury-input" placeholder="https://… (optional)" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Facebook URL">
                <input value={post.author_social?.facebook || ''} onChange={e => onChange({ ...post, author_social: { ...post.author_social, facebook: e.target.value } })} className="luxury-input" placeholder="https://facebook.com/…" />
              </Field>
              <Field label="Instagram URL">
                <input value={post.author_social?.instagram || ''} onChange={e => onChange({ ...post, author_social: { ...post.author_social, instagram: e.target.value } })} className="luxury-input" placeholder="https://instagram.com/…" />
              </Field>
              <Field label="Twitter / X URL">
                <input value={post.author_social?.twitter || ''} onChange={e => onChange({ ...post, author_social: { ...post.author_social, twitter: e.target.value } })} className="luxury-input" placeholder="https://x.com/…" />
              </Field>
              <Field label="Website URL">
                <input value={post.author_social?.website || ''} onChange={e => onChange({ ...post, author_social: { ...post.author_social, website: e.target.value } })} className="luxury-input" placeholder="https://…" />
              </Field>
            </div>
          </div>

          <Field label="Content">
            <MarkdownToolbar textareaRef={contentRef} value={post.content || ''} onChange={(v) => onChange({ ...post, content: v })} />
            <textarea
              ref={contentRef}
              value={post.content || ''}
              onChange={e => onChange({ ...post, content: e.target.value })}
              className="luxury-input min-h-[320px] font-mono text-sm rounded-t-none"
              placeholder="Write in Markdown. Use the toolbar for headings, bold, lists, quotes, images, YouTube, product links, tables and FAQ blocks."
            />
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
              Supports Markdown. Embeds: <code>@youtube[URL]</code>, <code>@product[/products/slug | Label]</code>, and
              <code> @faq</code> … <code>@endfaq</code> blocks (auto SEO FAQ schema + Table of Contents from ## / ### headings).
            </p>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextFieldWithGuidance
              label="SEO Title"
              value={post.seo_title || ''}
              onChange={v => onChange({ ...post, seo_title: v })}
              placeholder="Optional — defaults to title"
              recommendedMin={50}
              recommendedMax={60}
            />
            <Field label="Sort Order">
              <input type="number" value={post.sort_order ?? 0} onChange={e => onChange({ ...post, sort_order: Number(e.target.value) })} className="luxury-input" />
            </Field>
          </div>
          <TextFieldWithGuidance
            label="SEO Description"
            value={post.seo_description || ''}
            onChange={v => onChange({ ...post, seo_description: v })}
            placeholder="Optional — defaults to excerpt"
            recommendedMin={140}
            recommendedMax={160}
            multiline
            inputClassName="min-h-[60px]"
          />

          <div className="border border-border p-4 space-y-4">
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Publishing</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Status">
                <select
                  value={post.status || 'published'}
                  onChange={e => onChange({ ...post, status: e.target.value as BlogPost['status'] })}
                  className="luxury-input"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </Field>
              {post.status === 'scheduled' && (
                <Field label="Publish Date & Time">
                  <input
                    type="datetime-local"
                    value={toLocalInput(post.scheduled_at)}
                    onChange={e => onChange({ ...post, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
                    className="luxury-input"
                  />
                </Field>
              )}
            </div>
            <label className="flex items-center gap-2 px-3 py-2 border border-border cursor-pointer w-fit">
              <input type="checkbox" checked={!!post.is_featured} onChange={e => onChange({ ...post, is_featured: e.target.checked })} />
              <span className="text-xs uppercase tracking-widest inline-flex items-center gap-1.5"><Star size={12} /> Featured Post</span>
            </label>
            <p className="text-[10px] text-muted-foreground">Featured posts appear first in the blog hero.</p>
          </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-6 py-4 flex gap-2 justify-end">
          <button onClick={onCancel} className="px-5 py-2.5 text-[10px] uppercase tracking-widest border border-border hover:bg-muted">Cancel</button>
          <button onClick={onSave} disabled={saving} className="px-5 py-2.5 text-[10px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 disabled:opacity-60 inline-flex items-center gap-1.5">
            {saving ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} />}
            {post.id ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </div>
      <ClearAllDialog
        open={clearOpen}
        onCancel={() => setClearOpen(false)}
        onConfirm={handleClearAll}
        items={['Text', 'Images', 'SEO data', 'Categories', 'Tags', 'Author info', 'Draft data']}
      />
    </div>,
    document.body,
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] text-muted-foreground tracking-widest uppercase block">{label}</label>
    {children}
  </div>
);

const CategoryManagerModal = ({ posts, onClose }: { posts: BlogPost[]; onClose: () => void }) => {
  const { data: categories = [], isLoading } = useBlogCategories();
  const addCat = useAddBlogCategory();
  const renameCat = useRenameBlogCategory();
  const deleteCat = useDeleteBlogCategory();

  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [reassignTo, setReassignTo] = useState('');

  const usage = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(p => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [posts]);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Category already exists'); return;
    }
    try { await addCat.mutateAsync(name); setNewName(''); toast.success('Category added'); }
    catch (e: any) { toast.error(e.message); }
  };

  const handleRename = async (id: string, oldName: string) => {
    const name = editName.trim();
    if (!name || name === oldName) { setEditingId(null); return; }
    try { await renameCat.mutateAsync({ id, oldName, name }); setEditingId(null); toast.success('Category renamed'); }
    catch (e: any) { toast.error(e.message); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const inUse = (usage[deleteTarget.name] || 0) > 0;
    if (inUse && !reassignTo) { toast.error('Choose a category to reassign posts to'); return; }
    try {
      await deleteCat.mutateAsync({ id: deleteTarget.id, name: deleteTarget.name, reassignTo: inUse ? reassignTo : undefined });
      toast.success('Category deleted');
      setDeleteTarget(null); setReassignTo('');
    } catch (e: any) { toast.error(e.message); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-md max-h-[85vh] bg-background border border-border shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-5 py-4 flex items-center justify-between z-10">
          <h3 className="text-base font-light tracking-wide inline-flex items-center gap-2"><Tags size={15} /> Categories</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted"><X size={15} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Add */}
          <div className="flex gap-2">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="New category name"
              className="luxury-input flex-1"
            />
            <button onClick={handleAdd} disabled={addCat.isPending} className="px-3 py-2 text-[10px] uppercase tracking-widest bg-foreground text-background hover:opacity-90 disabled:opacity-60 inline-flex items-center gap-1.5">
              <Plus size={12} /> Add
            </button>
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-muted-foreground" size={18} /></div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No categories yet.</p>
          ) : (
            <div className="border border-border divide-y divide-border">
              {categories.map(c => {
                const count = usage[c.name] || 0;
                return (
                  <div key={c.id} className="flex items-center gap-2 p-2.5">
                    {editingId === c.id ? (
                      <>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') handleRename(c.id, c.name); if (e.key === 'Escape') setEditingId(null); }}
                          autoFocus
                          className="luxury-input flex-1 py-1.5"
                        />
                        <button onClick={() => handleRename(c.id, c.name)} className="p-1.5 hover:bg-muted" title="Save"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-muted" title="Cancel"><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-sm">{c.name}</span>
                        <span className="text-[10px] text-muted-foreground tabular-nums">{count} post{count === 1 ? '' : 's'}</span>
                        <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="p-1.5 hover:bg-muted" title="Rename"><Edit size={13} /></button>
                        <button onClick={() => { setDeleteTarget({ id: c.id, name: c.name }); setReassignTo(''); }} className="p-1.5 text-destructive hover:bg-destructive/10" title="Delete"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {deleteTarget && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/40" onClick={() => setDeleteTarget(null)}>
            <div className="w-full max-w-sm bg-background border border-border shadow-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Delete “{deleteTarget.name}”?</p>
                  {(usage[deleteTarget.name] || 0) > 0 ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      {usage[deleteTarget.name]} post(s) use this category. Reassign them first:
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">This category is not used by any post.</p>
                  )}
                </div>
              </div>
              {(usage[deleteTarget.name] || 0) > 0 && (
                <select value={reassignTo} onChange={e => setReassignTo(e.target.value)} className="luxury-input">
                  <option value="">— Reassign posts to —</option>
                  {categories.filter(c => c.name !== deleteTarget.name).map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-[10px] uppercase tracking-widest border border-border hover:bg-muted">Cancel</button>
                <button onClick={confirmDelete} disabled={deleteCat.isPending} className="px-4 py-2 text-[10px] uppercase tracking-widest bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-60 inline-flex items-center gap-1.5">
                  {deleteCat.isPending ? <Loader2 className="animate-spin" size={12} /> : <Trash2 size={12} />} Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

const toLocalInput = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const StatusBadge = ({ post }: { post: Partial<BlogPost> }) => {
  const status = post.status || (post.is_published ? 'published' : 'draft');
  if (status === 'published') {
    return <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">Published</span>;
  }
  if (status === 'scheduled') {
    const live = post.scheduled_at && new Date(post.scheduled_at) <= new Date();
    return (
      <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 inline-flex items-center gap-1">
        <Clock size={9} /> {live ? 'Scheduled (live)' : `Scheduled`}
      </span>
    );
  }
  return <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-muted text-muted-foreground">Draft</span>;
};

const MarkdownToolbar = ({
  textareaRef, value, onChange,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (v: string) => void;
}) => {
  const wrap = (before: string, after = '', placeholder = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? value.length;
    const end = ta.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + before.length + selected.length;
      ta.setSelectionRange(pos, pos);
    });
  };
  const insertBlock = (text: string) => {
    const ta = textareaRef.current;
    const start = ta?.selectionStart ?? value.length;
    const prefix = value.slice(0, start);
    const needsNL = prefix && !prefix.endsWith('\n\n') ? (prefix.endsWith('\n') ? '\n' : '\n\n') : '';
    const next = prefix + needsNL + text + '\n\n' + value.slice(start);
    onChange(next);
    requestAnimationFrame(() => ta?.focus());
  };

  const btn = 'p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground';
  const tableSnippet = '| Column A | Column B |\n| --- | --- |\n| Value 1 | Value 2 |\n| Value 3 | Value 4 |';
  const faqSnippet = '@faq\nQ: What sizes are available?\nA: We offer S to XXL across this collection.\nQ: What is the return window?\nA: 7 days from delivery, unworn with tags.\n@endfaq';

  return (
    <div className="flex flex-wrap items-center gap-0.5 border border-border border-b-0 bg-muted/30 px-1.5 py-1 rounded-t-md">
      <button type="button" className={btn} title="Heading 2" onClick={() => insertBlock('## Heading')}><Heading2 size={15} /></button>
      <button type="button" className={btn} title="Heading 3" onClick={() => insertBlock('### Subheading')}><Heading3 size={15} /></button>
      <span className="w-px h-5 bg-border mx-1" />
      <button type="button" className={btn} title="Bold" onClick={() => wrap('**', '**', 'bold text')}><Bold size={15} /></button>
      <button type="button" className={btn} title="Italic" onClick={() => wrap('*', '*', 'italic text')}><Italic size={15} /></button>
      <button type="button" className={btn} title="Bullet list" onClick={() => insertBlock('- First item\n- Second item')}><List size={15} /></button>
      <button type="button" className={btn} title="Quote" onClick={() => insertBlock('> A memorable quote.')}><Quote size={15} /></button>
      <span className="w-px h-5 bg-border mx-1" />
      <button type="button" className={btn} title="Image" onClick={() => insertBlock('![Alt text](https://image-url.jpg)')}><ImageIcon size={15} /></button>
      <button type="button" className={btn} title="YouTube embed" onClick={() => insertBlock('@youtube[https://www.youtube.com/watch?v=VIDEO_ID]')}><Youtube size={15} /></button>
      <button type="button" className={btn} title="Product link" onClick={() => insertBlock('@product[/products/your-slug | Shop this product]')}><Link2 size={15} /></button>
      <button type="button" className={btn} title="Table" onClick={() => insertBlock(tableSnippet)}><TableIcon size={15} /></button>
      <button type="button" className={btn} title="FAQ block (with SEO schema)" onClick={() => insertBlock(faqSnippet)}><HelpCircle size={15} /></button>
    </div>
  );
};

const StatTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="border border-border p-5 bg-card">
    <div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-[10px] uppercase tracking-widest">{label}</span></div>
    <p className="text-2xl font-light mt-2">{value}</p>
  </div>
);

const BlogAnalyticsPanel = () => {
  const { data, isLoading } = useBlogAnalytics();
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-muted-foreground" size={20} /></div>;
  if (!data) return null;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile icon={<Eye size={14} />} label="Total Views" value={data.totalViews.toLocaleString()} />
        <StatTile icon={<Users size={14} />} label="Unique Readers" value={data.uniqueReaders.toLocaleString()} />
        <StatTile icon={<Mail size={14} />} label="Newsletter Subscribers" value={data.newsletterConversions.toLocaleString()} />
        <StatTile icon={<TrendingUp size={14} />} label="From Blog" value={data.blogNewsletterConversions.toLocaleString()} />
      </div>
      <div>
        <h3 className="text-sm font-medium tracking-wide mb-3">Most-read articles</h3>
        {data.mostRead.length === 0 ? (
          <p className="text-sm text-muted-foreground">No view data yet.</p>
        ) : (
          <div className="border border-border divide-y divide-border bg-card">
            {data.mostRead.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3">
                <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
                <p className="text-sm flex-1 truncate">{p.title}</p>
                <span className="text-[11px] text-muted-foreground font-mono">/blog/{p.slug}</span>
                <span className="text-sm tabular-nums inline-flex items-center gap-1.5"><Eye size={12} /> {(p.views || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
