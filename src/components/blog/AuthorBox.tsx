import { Facebook, Instagram, Twitter, Globe, Linkedin, User } from 'lucide-react';
import type { BlogPost } from '@/hooks/useBlog';

const AuthorBox = ({ post }: { post: BlogPost }) => {
  const social = post.author_social || {};
  const links = [
    { key: 'facebook', icon: Facebook, url: social.facebook },
    { key: 'instagram', icon: Instagram, url: social.instagram },
    { key: 'twitter', icon: Twitter, url: social.twitter },
    { key: 'linkedin', icon: Linkedin, url: social.linkedin },
    { key: 'website', icon: Globe, url: social.website },
  ].filter((l) => l.url && l.url.trim());

  if (!post.author && !post.author_bio) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border flex gap-4 sm:gap-5">
      <div className="shrink-0">
        {post.author_avatar ? (
          <img
            src={post.author_avatar}
            alt={post.author}
            loading="lazy"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-border"
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <User size={22} />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Written by</p>
        <h3 className="text-base font-medium tracking-wide mt-0.5">{post.author || 'EIDLIP'}</h3>
        {post.author_bio && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{post.author_bio}</p>}
        {links.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${post.author} on ${l.key}`}
                className="p-1.5 border border-border rounded-sm text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                <l.icon size={14} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorBox;