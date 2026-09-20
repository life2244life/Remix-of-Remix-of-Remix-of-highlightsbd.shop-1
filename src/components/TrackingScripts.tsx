import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { initConsentDefaults } from '@/lib/consent';
import { loadTikTokPixel } from '@/lib/tiktok';
import { captureAttribution } from '@/lib/attribution';

const GTM_ID_REGEX = /^GTM-[A-Z0-9]+$/;
const GA4_ID_REGEX = /^G-[A-Z0-9]+$/;

type Settings = Record<string, string>;

/** Injects a raw HTML snippet into a target node, executing any <script> tags.
 *  All previously injected nodes for the same `marker` are removed first to
 *  guarantee no duplicate injections across re-renders. */
const injectSnippet = (marker: string, html: string, target: HTMLElement, position: 'append' | 'prepend') => {
  document.querySelectorAll(`[data-injected="${marker}"]`).forEach((n) => n.remove());
  if (!html || !html.trim()) return;
  const template = document.createElement('template');
  template.innerHTML = html;
  const nodes = Array.from(template.content.childNodes);
  const place = (node: Node) => (position === 'prepend' ? target.prepend(node) : target.appendChild(node));
  nodes.forEach((node) => {
    if (node.nodeName === 'SCRIPT') {
      // Cloning a parsed <script> won't execute it; recreate it explicitly.
      const src = node as HTMLScriptElement;
      const s = document.createElement('script');
      Array.from(src.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.text = src.text;
      s.setAttribute('data-injected', marker);
      place(s);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      (node as HTMLElement).setAttribute('data-injected', marker);
      place(node);
    } else {
      place(node);
    }
  });
};

/** Upserts a single <meta name=.. content=..> verification tag (deduped by name). */
const setVerificationMeta = (name: string, content: string) => {
  const existing = document.head.querySelector(`meta[name="${name}"]`);
  if (!content || !content.trim()) {
    existing?.remove();
    return;
  }
  if (existing) {
    existing.setAttribute('content', content.trim());
    return;
  }
  const m = document.createElement('meta');
  m.setAttribute('name', name);
  m.setAttribute('content', content.trim());
  document.head.appendChild(m);
};

const TrackingScripts = () => {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    // Attribution + consent defaults must run as early as possible.
    captureAttribution();
    (async () => {
      const { data } = await (supabase as any).rpc('get_public_tracking_settings');
      const map: Settings = {};
      (data as any[] | null)?.forEach((s: any) => { map[s.key] = s.value; });
      setSettings(map);
      initConsentDefaults({
        analytics: (map.consent_default_analytics as any) || 'denied',
        ad: (map.consent_default_ad as any) || 'denied',
        ad_user_data: (map.consent_default_ad_user_data as any) || 'denied',
        ad_personalization: (map.consent_default_ad_personalization as any) || 'denied',
      });
    })();
  }, []);

  // ----- GTM (master layer) -----
  useEffect(() => {
    const gtmId = settings.gtm_container_id;
    const enabled = settings.gtm_enabled !== 'false';
    if (!enabled || !gtmId || !GTM_ID_REGEX.test(gtmId)) return;
    if (document.getElementById('gtm-script')) return;

    const s = document.createElement('script');
    s.id = 'gtm-script';
    s.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(s);

    const ns = document.createElement('noscript');
    ns.id = 'gtm-noscript';
    ns.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.prepend(ns);
  }, [settings.gtm_container_id, settings.gtm_enabled]);

  // ----- GA4 (direct gtag, used when no GTM container or as a complement) -----
  useEffect(() => {
    const gaId = settings.ga4_measurement_id;
    const hasGtm = settings.gtm_enabled !== 'false' && GTM_ID_REGEX.test(settings.gtm_container_id || '');
    if (hasGtm || !gaId || !GA4_ID_REGEX.test(gaId)) return;
    if (document.getElementById('ga4-script')) return;

    const s = document.createElement('script');
    s.id = 'ga4-script';
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(s);

    const cfg = document.createElement('script');
    cfg.id = 'ga4-config';
    cfg.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:true});`;
    document.head.appendChild(cfg);
  }, [settings.ga4_measurement_id, settings.gtm_container_id, settings.gtm_enabled]);

  // ----- TikTok Pixel -----
  useEffect(() => {
    const ttId = settings.tiktok_pixel_id;
    if (ttId && /^[A-Z0-9]+$/i.test(ttId)) loadTikTokPixel(ttId);
  }, [settings.tiktok_pixel_id]);

  // ----- Meta Pixel -----
  useEffect(() => {
    const pixelId = settings.meta_pixel_id;
    if (!pixelId || !/^\d+$/.test(pixelId)) return;
    if ((window as any).fbq || document.getElementById('meta-pixel')) return;
    const s = document.createElement('script');
    s.id = 'meta-pixel';
    s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
    document.head.appendChild(s);
  }, [settings.meta_pixel_id]);

  // ----- Site verification meta tags -----
  useEffect(() => {
    setVerificationMeta('facebook-domain-verification', settings.fb_domain_verification || '');
    setVerificationMeta('google-site-verification', settings.google_site_verification || '');
    setVerificationMeta('msvalidate.01', settings.bing_verification || '');
    setVerificationMeta('p:domain_verify', settings.pinterest_verification || '');
    setVerificationMeta('yandex-verification', settings.yandex_verification || '');
  }, [
    settings.fb_domain_verification,
    settings.google_site_verification,
    settings.bing_verification,
    settings.pinterest_verification,
    settings.yandex_verification,
  ]);

  // ----- Custom code snippets (multiple per location, from tracking_codes table) -----
  useEffect(() => {
    (async () => {
      const { data } = await (supabase as any).rpc('get_public_tracking_codes');
      const rows = (data as any[] | null) || [];
      const byLoc: Record<string, string[]> = { head: [], body_top: [], body_bottom: [] };
      rows.forEach((r: any) => { if (byLoc[r.location]) byLoc[r.location].push(r.code || ''); });
      injectSnippet('custom-head', byLoc.head.join('\n'), document.head, 'append');
      injectSnippet('custom-body', byLoc.body_top.join('\n'), document.body, 'prepend');
      injectSnippet('custom-footer', byLoc.body_bottom.join('\n'), document.body, 'append');
    })();
  }, []);

  return null;
};

export default TrackingScripts;
