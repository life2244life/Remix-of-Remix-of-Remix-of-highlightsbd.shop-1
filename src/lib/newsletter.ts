// Centralised, DB-driven newsletter settings + subscribe helper.
// All settings live in the `store_settings` key-value table (backward compatible).
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { flag, text, type Settings } from './siteSettings';

export type NewsletterSource = 'homepage' | 'blog' | 'footer' | 'checkout' | 'general';

export interface NewsletterSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  placeholder: string;
  ctaText: string;
  successMessage: string;
  errorMessage: string;
  doubleOptIn: boolean;
  allowDuplicate: boolean;
  showHomepage: boolean;
  showBlog: boolean;
  showFooter: boolean;
  showCheckout: boolean;
  thankYouTitle: string;
  thankYouMessage: string;
}

export function getNewsletterSettings(s?: Settings): NewsletterSettings {
  return {
    enabled: flag(s, 'newsletter_enabled', true),
    title: text(s, 'newsletter_title', 'Join our newsletter'),
    subtitle: text(s, 'newsletter_subtitle', 'Subscribe to get updates on new arrivals & exclusive offers.'),
    placeholder: text(s, 'newsletter_placeholder', 'Enter your email'),
    ctaText: text(s, 'newsletter_button_text', 'Subscribe'),
    successMessage: text(s, 'newsletter_success_message', 'Subscribed successfully!'),
    errorMessage: text(s, 'newsletter_error_message', 'Failed to subscribe. Please try again.'),
    doubleOptIn: flag(s, 'newsletter_double_optin', false),
    allowDuplicate: flag(s, 'newsletter_allow_duplicate', false),
    showHomepage: flag(s, 'newsletter_show_homepage', true),
    showBlog: flag(s, 'newsletter_show_blog', true),
    showFooter: flag(s, 'newsletter_show_footer', true),
    showCheckout: flag(s, 'newsletter_show_checkout', false),
    thankYouTitle: text(s, 'newsletter_thankyou_title', 'Thank you for subscribing.'),
    thankYouMessage: text(s, 'newsletter_thankyou_message', "You're on the list — watch your inbox for new drops & offers."),
  };
}

const emailSchema = z.string().trim().email({ message: 'Please enter a valid email address' }).max(160);

export type SubscribeStatus = 'subscribed' | 'duplicate' | 'invalid' | 'error';
export interface SubscribeResult { ok: boolean; status: SubscribeStatus; message: string }

// Simple in-memory rate limit (per browser session) — basic spam protection.
let lastSubmitAt = 0;
const RATE_LIMIT_MS = 4000;

export async function subscribeToNewsletter(
  cfg: NewsletterSettings,
  rawEmail: string,
  source: NewsletterSource = 'general',
): Promise<SubscribeResult> {
  const parsed = emailSchema.safeParse(rawEmail);
  if (!parsed.success) {
    return { ok: false, status: 'invalid', message: parsed.error.issues[0].message };
  }
  const now = Date.now();
  if (now - lastSubmitAt < RATE_LIMIT_MS) {
    return { ok: false, status: 'error', message: 'Please wait a moment before trying again.' };
  }
  lastSubmitAt = now;

  const email = parsed.data.toLowerCase();
  try {
    if (!cfg.allowDuplicate) {
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existing) {
        return { ok: true, status: 'duplicate', message: 'You are already subscribed!' };
      }
    }
    const { error } = await supabase.from('newsletter_subscribers').insert({ email, source });
    if (error) throw error;
    return { ok: true, status: 'subscribed', message: cfg.successMessage };
  } catch {
    return { ok: false, status: 'error', message: cfg.errorMessage };
  }
}
