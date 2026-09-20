// Shared Hero Slider model used by the admin editor and the storefront.
export type HeroAlign = 'left' | 'center' | 'right';
export type HeroButtonStyle = 'solid' | 'outline' | 'soft';

export interface HeroSlide {
  id: string;
  desktopImage: string;
  mobileImage: string;
  badge: string;
  heading: string;
  subheading: string;
  btn1Text: string;
  btn1Url: string;
  btn2Text: string;
  btn2Url: string;
  align: HeroAlign;
  overlay: number; // 0-100, darkness of the overlay
  textColor: string; // hex
  buttonStyle: HeroButtonStyle;
  enabled: boolean;
  publishAt: string; // ISO date or '' (no start limit)
  expireAt: string; // ISO date or '' (no end limit)
}

export const makeHeroSlide = (): HeroSlide => ({
  id: (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : `slide-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  desktopImage: '',
  mobileImage: '',
  badge: '',
  heading: '',
  subheading: '',
  btn1Text: '',
  btn1Url: '',
  btn2Text: '',
  btn2Url: '',
  align: 'left',
  overlay: 40,
  textColor: '#ffffff',
  buttonStyle: 'solid',
  enabled: true,
  publishAt: '',
  expireAt: '',
});

// Returns slides that should currently render on the storefront.
export const getActiveHeroSlides = (slides: HeroSlide[], now = new Date()): HeroSlide[] =>
  (slides || []).filter((s) => {
    if (!s.enabled) return false;
    if (!s.desktopImage && !s.mobileImage) return false;
    if (s.publishAt && new Date(s.publishAt) > now) return false;
    if (s.expireAt && new Date(s.expireAt) < now) return false;
    return true;
  });

export const parseHeroSlides = (config: any): HeroSlide[] => {
  const raw = config?.slides;
  if (!Array.isArray(raw)) return [];
  return raw.map((s: any) => ({ ...makeHeroSlide(), ...s }));
};