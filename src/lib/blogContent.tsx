import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ArrowRight } from 'lucide-react';
import defaultCover from '@/assets/blog-default-cover.jpg';

marked.setOptions({ gfm: true, breaks: true });

/** Default cover used when a post has no featured image. */
export const DEFAULT_BLOG_COVER = defaultCover;

/** Returns a usable cover image for a post, falling back to the branded default. */
export const blogCover = (cover?: string | null) =>
  cover && cover.trim() ? cover : DEFAULT_BLOG_COVER;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'section';

/** Extract a YouTube video id from a raw id or any common URL form. */
const youtubeId = (input: string) => {
  const s = input.trim();
  const m =
    s.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/) ||
    s.match(/^([\w-]{11})$/);
  return m ? m[1] : '';
};

export type TocItem = { id: string; text: string; level: 2 | 3 };
export type FaqItem = { q: string; a: string };

type Block =
  | { type: 'md'; md: string }
  | { type: 'youtube'; id: string }
  | { type: 'product'; href: string; label: string }
  | { type: 'faq'; items: FaqItem[] };

/**
 * Parse blog markdown content + custom directives into renderable blocks.
 * Supported directives (each on its own line):
 *   @youtube[VIDEO_ID_or_URL]
 *   @product[/products/slug | Label]
 *   @faq ... @endfaq   (lines of "Q: ..." / "A: ...")
 */
export function parseBlogContent(content: string): Block[] {
  const lines = (content || '').split(/\r?\n/);
  const blocks: Block[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.join('').trim()) blocks.push({ type: 'md', md: buffer.join('\n') });
    buffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const yt = trimmed.match(/^@youtube\[(.+?)\]$/i);
    const prod = trimmed.match(/^@product\[(.+?)\]$/i);

    if (yt) {
      const id = youtubeId(yt[1]);
      if (id) { flush(); blocks.push({ type: 'youtube', id }); continue; }
    }
    if (prod) {
      const [href, label] = prod[1].split('|').map((p) => p.trim());
      flush();
      blocks.push({ type: 'product', href: href || '/', label: label || 'View product' });
      continue;
    }
    if (/^@faq\s*$/i.test(trimmed)) {
      flush();
      const items: FaqItem[] = [];
      let q = '';
      let a = '';
      i++;
      for (; i < lines.length && !/^@endfaq\s*$/i.test(lines[i].trim()); i++) {
        const l = lines[i].trim();
        const qm = l.match(/^Q:\s*(.+)$/i);
        const am = l.match(/^A:\s*(.+)$/i);
        if (qm) {
          if (q) { items.push({ q, a: a.trim() }); a = ''; }
          q = qm[1].trim();
        } else if (am) {
          a = am[1].trim();
        } else if (l) {
          a += (a ? ' ' : '') + l;
        }
      }
      if (q) items.push({ q, a: a.trim() });
      if (items.length) blocks.push({ type: 'faq', items });
      continue;
    }
    buffer.push(line);
  }
  flush();
  return blocks;
}

/** Render a markdown string to sanitized HTML, adding ids to H2/H3 headings. */
export function renderMarkdown(md: string): string {
  const raw = marked.parse(md || '', { async: false }) as string;
  const withIds = raw.replace(
    /<h([23])>([\s\S]*?)<\/h\1>/g,
    (_, lvl, inner) => `<h${lvl} id="${slugify(inner)}">${inner}</h${lvl}>`,
  );
  return DOMPurify.sanitize(withIds, { ADD_ATTR: ['id', 'target', 'rel'] });
}

/** Build a Table of Contents from all H2/H3 headings across the content. */
export function buildToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  parseBlogContent(content).forEach((b) => {
    if (b.type !== 'md') return;
    b.md.split(/\r?\n/).forEach((line) => {
      const m = /^(##|###)\s+(.+?)\s*$/.exec(line);
      if (m) {
        const text = m[2].replace(/[*_`]/g, '').trim();
        items.push({ id: slugify(text), text, level: m[1].length as 2 | 3 });
      }
    });
  });
  return items;
}

/** Collect FAQ items for FAQPage JSON-LD. */
export function extractFaqItems(content: string): FaqItem[] {
  return parseBlogContent(content)
    .filter((b): b is Extract<Block, { type: 'faq' }> => b.type === 'faq')
    .flatMap((b) => b.items);
}

export function buildFaqJsonLd(content: string) {
  const items = extractFaqItems(content);
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

/** Renders parsed blog content (markdown + embeds + product links + FAQ accordions). */
export const BlogContent = ({ content }: { content: string }) => {
  const blocks = parseBlogContent(content);
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        if (b.type === 'md') {
          return (
            <div
              key={i}
              className="prose prose-neutral dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed prose-headings:luxury-heading prose-headings:tracking-[0.04em] prose-h2:text-2xl prose-h3:text-xl prose-a:text-foreground prose-img:w-full prose-table:text-sm prose-th:text-left scroll-mt-28"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(b.md) }}
            />
          );
        }
        if (b.type === 'youtube') {
          return (
            <div key={i} className="aspect-video overflow-hidden bg-muted border border-border">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${b.id}`}
                title="YouTube video"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }
        if (b.type === 'product') {
          const internal = b.href.startsWith('/');
          const cls =
            'group flex items-center justify-between gap-4 border border-border px-5 py-4 hover:border-foreground transition-colors no-underline';
          const inner = (
            <>
              <span className="text-sm font-medium">{b.label}</span>
              <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" />
            </>
          );
          return internal ? (
            <Link key={i} to={b.href} className={cls}>{inner}</Link>
          ) : (
            <a key={i} href={b.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
          );
        }
        if (b.type === 'faq') {
          return (
            <Accordion key={i} type="single" collapsible className="border border-border divide-y divide-border">
              {b.items.map((it, j) => (
                <AccordionItem key={j} value={`faq-${i}-${j}`} className="border-b-0 px-4">
                  <AccordionTrigger className="text-left text-sm">{it.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{it.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          );
        }
        return null;
      })}
    </div>
  );
};

/** Sticky / inline Table of Contents component. */
export const TableOfContents = ({ items }: { items: TocItem[] }) => {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Table of contents" className="border border-border p-5 bg-muted/20">
      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">On this page</p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className={it.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${it.id}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};