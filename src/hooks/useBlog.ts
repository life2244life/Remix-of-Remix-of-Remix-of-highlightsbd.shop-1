import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { slugify } from '@/data/products';

export const readingTime = (content: string) => {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  cover_alt: string;
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  sort_order: number;
  category: string;
  tags: string[];
  author: string;
  author_bio: string;
  author_avatar: string;
  author_social: { facebook?: string; instagram?: string; twitter?: string; website?: string; linkedin?: string };
  noindex?: boolean;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_at: string | null;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type BlogComment = {
  id: string;
  post_id: string;
  guest_name: string;
  guest_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
};

// ---------------- Categories ----------------

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

/** All blog categories (public read). Drives the editor dropdown + manager. */
export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_categories')
        .select('id, name, slug, sort_order')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []) as BlogCategory[];
    },
  });
};

export const useAddBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const clean = name.trim();
      if (!clean) throw new Error('Category name required');
      const { error } = await (supabase as any)
        .from('blog_categories')
        .insert({ name: clean, slug: slugify(clean) });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-categories'] }),
  });
};

export const useRenameBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, oldName, name }: { id: string; oldName: string; name: string }) => {
      const clean = name.trim();
      if (!clean) throw new Error('Category name required');
      const { error } = await (supabase as any)
        .from('blog_categories')
        .update({ name: clean, slug: slugify(clean) })
        .eq('id', id);
      if (error) throw error;
      // Keep existing posts in sync with the renamed category.
      if (oldName && oldName !== clean) {
        const { error: e2 } = await (supabase as any)
          .from('blog_posts')
          .update({ category: clean })
          .eq('category', oldName);
        if (e2) throw e2;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-categories'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name, reassignTo }: { id: string; name: string; reassignTo?: string }) => {
      // Optionally move posts to another category before removing this one.
      if (reassignTo) {
        const { error: e2 } = await (supabase as any)
          .from('blog_posts')
          .update({ category: reassignTo })
          .eq('category', name);
        if (e2) throw e2;
      }
      const { error } = await (supabase as any).from('blog_categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-categories'] });
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
};

/** A post is publicly live if published, or scheduled with a past publish time. */
export const isPostLive = (p: Partial<BlogPost>): boolean => {
  if (p.status === 'published') return true;
  if (p.status === 'scheduled' && p.scheduled_at) return new Date(p.scheduled_at) <= new Date();
  // Backward-compat for rows created before the status workflow existed.
  if (!p.status) return !!p.is_published;
  return false;
};

export const useBlogPosts = (includeUnpublished = false) => {
  return useQuery({
    queryKey: ['blog-posts', includeUnpublished],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      const rows = (data || []) as BlogPost[];
      return includeUnpublished ? rows : rows.filter(isPostLive);
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from('blog_posts').select('*').eq('slug', slug).maybeSingle();
      if (error) throw error;
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });
};

export const useUpsertBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: Partial<BlogPost> & { id?: string }) => {
      // Keep the legacy is_published flag in sync with the status workflow
      // so the build-time RSS/sitemap generators stay correct.
      if (post.status) {
        post = { ...post, is_published: post.status === 'published' };
      }
      if (post.id) {
        const { id, created_at, updated_at, ...rest } = post;
        const { error } = await (supabase as any).from('blog_posts').update(rest).eq('id', id);
        if (error) throw error;
      } else {
        const { id, created_at, updated_at, ...rest } = post;
        const { error } = await (supabase as any).from('blog_posts').insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['blog-post'] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('blog_posts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-posts'] }),
  });
};

// ---------------- Comments ----------------

// Approved comments for a single post (public).
export const useBlogComments = (postId?: string) => {
  return useQuery({
    queryKey: ['blog-comments', postId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_comments_public')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as BlogComment[];
    },
    enabled: !!postId,
  });
};

// Approved comment counts keyed by post_id (public) — for listing badges.
export const useBlogCommentCounts = () => {
  return useQuery({
    queryKey: ['blog-comment-counts'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_comments_public')
        .select('post_id')
        .eq('is_approved', true);
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((r: any) => { counts[r.post_id] = (counts[r.post_id] || 0) + 1; });
      return counts;
    },
    staleTime: 60 * 1000,
  });
};

export const useSubmitComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (c: { post_id: string; guest_name: string; guest_email: string; content: string }) => {
      const { error } = await (supabase as any).from('blog_comments').insert({
        post_id: c.post_id,
        guest_name: c.guest_name.trim().slice(0, 80),
        guest_email: c.guest_email.trim().slice(0, 160),
        content: c.content.trim().slice(0, 2000),
        is_approved: false,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog-comments'] }),
  });
};

// Admin: all comments (any approval state).
export const useAllComments = () => {
  return useQuery({
    queryKey: ['blog-comments-admin'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('blog_comments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as BlogComment[];
    },
  });
};

export const useModerateComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_approved }: { id: string; is_approved: boolean }) => {
      const { error } = await (supabase as any).from('blog_comments').update({ is_approved }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-comments-admin'] });
      qc.invalidateQueries({ queryKey: ['blog-comments'] });
      qc.invalidateQueries({ queryKey: ['blog-comment-counts'] });
    },
  });
};

export const useDeleteComment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from('blog_comments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-comments-admin'] });
      qc.invalidateQueries({ queryKey: ['blog-comments'] });
      qc.invalidateQueries({ queryKey: ['blog-comment-counts'] });
    },
  });
};

// ---------------- Views & analytics ----------------

const VISITOR_KEY = 'eidlip-visitor-id';
const getVisitorId = () => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() || `v_${Date.now()}_${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return `v_${Math.random().toString(36).slice(2)}`;
  }
};

/** Records a view once per mount: bumps the counter and logs a unique visitor. */
export const useTrackBlogView = (postId?: string) => {
  useEffect(() => {
    if (!postId) return;
    const key = `eidlip-viewed-${postId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    (supabase as any).rpc('track_blog_view', { _post_id: postId, _visitor_id: getVisitorId() }).then(() => {});
  }, [postId]);
};

export type BlogAnalytics = {
  totalViews: number;
  uniqueReaders: number;
  newsletterConversions: number;
  blogNewsletterConversions: number;
  mostRead: { id: string; title: string; slug: string; views: number }[];
};

/** Admin analytics: total views, unique readers, newsletter conversions, most-read. */
export const useBlogAnalytics = () => {
  return useQuery({
    queryKey: ['blog-analytics'],
    queryFn: async (): Promise<BlogAnalytics> => {
      const [postsRes, uniqueRes, subsRes] = await Promise.all([
        (supabase as any).from('blog_posts').select('id, title, slug, views'),
        (supabase as any).from('blog_post_views').select('visitor_id'),
        (supabase as any).from('newsletter_subscribers').select('source'),
      ]);
      const posts = (postsRes.data || []) as { id: string; title: string; slug: string; views: number }[];
      const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
      const uniqueReaders = new Set((uniqueRes.data || []).map((r: any) => r.visitor_id)).size;
      const subs = (subsRes.data || []) as { source: string }[];
      const newsletterConversions = subs.length;
      const blogNewsletterConversions = subs.filter((s) => s.source === 'blog').length;
      const mostRead = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 8);
      return { totalViews, uniqueReaders, newsletterConversions, blogNewsletterConversions, mostRead };
    },
  });
};
