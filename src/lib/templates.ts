// Full website templates for the customer-facing storefront.
// Each template bundles a complete color/font token set (CSS variables that
// override src/index.css) AND a homepage layout id. The admin picks one and it
// is stored in store_settings under "active_template". All visitors see it.
//
// Other pages (checkout, product, category, header, footer…) use the same CSS
// tokens, so their colors/fonts/radius change automatically with the template.
// Only the homepage swaps to a fully different layout (homeLayout).

export type ThemeTokens = Record<string, string>;

export type HomeLayout = 'classic' | 'modern' | 'noir' | 'boutique' | 'street';

export interface Template {
  key: string;
  name: string;
  description: string;
  /** small swatch preview for the admin picker (hex) */
  swatch: string[];
  /** homepage layout variant */
  homeLayout: HomeLayout;
  /** CSS variable overrides applied to :root */
  tokens: ThemeTokens;
}

const SUCCESS = '147 100% 33%';
const RATING = '45 100% 51%';

export const TEMPLATES: Template[] = [
  {
    key: 'classic',
    name: 'Classic Luxury',
    description: 'Crisp white editorial with a bold red accent and elegant serif headings — the signature look.',
    swatch: ['#ffffff', '#111111', '#f5f5f5', '#e53935'],
    homeLayout: 'classic',
    tokens: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 8%',
      '--card': '0 0% 99%',
      '--card-foreground': '0 0% 8%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 8%',
      '--primary': '0 0% 8%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '0 0% 96%',
      '--secondary-foreground': '0 0% 8%',
      '--muted': '0 0% 96%',
      '--muted-foreground': '0 0% 45%',
      '--accent': '0 0% 93%',
      '--accent-foreground': '0 0% 8%',
      '--border': '0 0% 90%',
      '--input': '0 0% 90%',
      '--ring': '0 0% 8%',
      '--radius': '0px',
      '--fab-ink': '0 0% 7%',
      '--fab-muted': '0 0% 40%',
      '--fab-line': '0 0% 92%',
      '--fab-soft': '0 0% 97%',
      '--fab-accent': '1 78% 55%',
      '--fab-success': SUCCESS,
      '--fab-rating': RATING,
      '--fab-bg': '0 0% 100%',
      '--fab-card': '0 0% 100%',
      '--font-display': "'Cormorant Garamond', serif",
      '--font-body': "'Inter', sans-serif",
    },
  },
  {
    key: 'modern',
    name: 'Modern Minimal',
    description: 'Clean white layout, electric indigo accent and soft rounded edges. Fast and friendly.',
    swatch: ['#ffffff', '#0f172a', '#eef2ff', '#4f46e5'],
    homeLayout: 'modern',
    tokens: {
      '--background': '0 0% 100%',
      '--foreground': '222 47% 11%',
      '--card': '0 0% 100%',
      '--card-foreground': '222 47% 11%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '222 47% 11%',
      '--primary': '243 75% 59%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '220 14% 96%',
      '--secondary-foreground': '222 47% 11%',
      '--muted': '220 14% 96%',
      '--muted-foreground': '220 9% 46%',
      '--accent': '243 75% 95%',
      '--accent-foreground': '243 60% 35%',
      '--border': '220 13% 91%',
      '--input': '220 13% 91%',
      '--ring': '243 75% 59%',
      '--radius': '12px',
      '--fab-ink': '222 47% 11%',
      '--fab-muted': '220 9% 46%',
      '--fab-line': '220 13% 91%',
      '--fab-soft': '220 14% 97%',
      '--fab-accent': '243 75% 59%',
      '--fab-success': SUCCESS,
      '--fab-rating': RATING,
      '--fab-bg': '0 0% 100%',
      '--fab-card': '0 0% 100%',
      '--font-display': "'Outfit', sans-serif",
      '--font-body': "'Inter', sans-serif",
    },
  },
  {
    key: 'noir',
    name: 'Noir & Gold',
    description: 'High-end dark theme with luxurious gold accents and a dramatic full-bleed hero.',
    swatch: ['#0f0f0f', '#171717', '#c9a84c', '#f0d78c'],
    homeLayout: 'noir',
    tokens: {
      '--background': '0 0% 6%',
      '--foreground': '40 30% 92%',
      '--card': '0 0% 9%',
      '--card-foreground': '40 30% 92%',
      '--popover': '0 0% 9%',
      '--popover-foreground': '40 30% 92%',
      '--primary': '43 55% 54%',
      '--primary-foreground': '0 0% 6%',
      '--secondary': '0 0% 14%',
      '--secondary-foreground': '40 30% 92%',
      '--muted': '0 0% 14%',
      '--muted-foreground': '40 10% 62%',
      '--accent': '43 40% 20%',
      '--accent-foreground': '43 55% 72%',
      '--border': '0 0% 18%',
      '--input': '0 0% 18%',
      '--ring': '43 55% 54%',
      '--radius': '2px',
      '--fab-ink': '40 30% 92%',
      '--fab-muted': '40 10% 62%',
      '--fab-line': '0 0% 18%',
      '--fab-soft': '0 0% 12%',
      '--fab-accent': '43 55% 54%',
      '--fab-success': SUCCESS,
      '--fab-rating': RATING,
      '--fab-bg': '0 0% 6%',
      '--fab-card': '0 0% 9%',
      '--font-display': "'Playfair Display', serif",
      '--font-body': "'Inter', sans-serif",
    },
  },
  {
    key: 'boutique',
    name: 'Warm Boutique',
    description: 'Soft, earthy sand neutrals with warm terracotta accents — an editorial magazine feel.',
    swatch: ['#faf8f5', '#2b241c', '#efe8de', '#b5613c'],
    homeLayout: 'boutique',
    tokens: {
      '--background': '40 33% 97%',
      '--foreground': '30 15% 18%',
      '--card': '40 30% 99%',
      '--card-foreground': '30 15% 18%',
      '--popover': '40 33% 97%',
      '--popover-foreground': '30 15% 18%',
      '--primary': '18 48% 47%',
      '--primary-foreground': '40 33% 97%',
      '--secondary': '36 25% 92%',
      '--secondary-foreground': '30 15% 18%',
      '--muted': '36 25% 92%',
      '--muted-foreground': '30 10% 45%',
      '--accent': '36 30% 88%',
      '--accent-foreground': '18 48% 35%',
      '--border': '36 20% 85%',
      '--input': '36 20% 85%',
      '--ring': '18 48% 47%',
      '--radius': '4px',
      '--fab-ink': '30 15% 18%',
      '--fab-muted': '30 10% 45%',
      '--fab-line': '36 20% 85%',
      '--fab-soft': '40 30% 94%',
      '--fab-accent': '18 48% 47%',
      '--fab-success': SUCCESS,
      '--fab-rating': RATING,
      '--fab-bg': '40 33% 97%',
      '--fab-card': '40 30% 99%',
      '--font-display': "'Cormorant Garamond', serif",
      '--font-body': "'Inter', sans-serif",
    },
  },
  {
    key: 'street',
    name: 'Bold Street',
    description: 'High-contrast streetwear energy — oversized type, sharp edges and a punchy lime accent.',
    swatch: ['#ffffff', '#0a0a0a', '#f1f1f1', '#a3e635'],
    homeLayout: 'street',
    tokens: {
      '--background': '0 0% 100%',
      '--foreground': '0 0% 4%',
      '--card': '0 0% 100%',
      '--card-foreground': '0 0% 4%',
      '--popover': '0 0% 100%',
      '--popover-foreground': '0 0% 4%',
      '--primary': '0 0% 4%',
      '--primary-foreground': '0 0% 100%',
      '--secondary': '0 0% 95%',
      '--secondary-foreground': '0 0% 4%',
      '--muted': '0 0% 95%',
      '--muted-foreground': '0 0% 38%',
      '--accent': '83 64% 70%',
      '--accent-foreground': '0 0% 8%',
      '--border': '0 0% 88%',
      '--input': '0 0% 88%',
      '--ring': '0 0% 4%',
      '--radius': '4px',
      '--fab-ink': '0 0% 4%',
      '--fab-muted': '0 0% 38%',
      '--fab-line': '0 0% 88%',
      '--fab-soft': '75 50% 96%',
      '--fab-accent': '83 64% 45%',
      '--fab-success': SUCCESS,
      '--fab-rating': RATING,
      '--fab-bg': '0 0% 100%',
      '--fab-card': '0 0% 100%',
      '--font-display': "'Archivo', sans-serif",
      '--font-body': "'Inter', sans-serif",
    },
  },
];

export const DEFAULT_TEMPLATE_KEY = 'classic';

export const getTemplate = (key?: string | null): Template =>
  TEMPLATES.find((t) => t.key === key) ?? TEMPLATES[0];

export const applyTemplateTokens = (key?: string | null) => {
  const tpl = getTemplate(key);
  const root = document.documentElement;
  Object.entries(tpl.tokens).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
};

export const resetTemplateTokens = () => {
  const root = document.documentElement;
  Object.keys(TEMPLATES[0].tokens).forEach((prop) => {
    root.style.removeProperty(prop);
  });
};