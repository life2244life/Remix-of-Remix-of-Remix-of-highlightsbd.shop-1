// TikTok Pixel browser-side abstraction. Loaded lazily by TrackingScripts.
// Server-side forwarding (Events API) is handled by the analytics-ingest edge function.

declare global {
  interface Window {
    ttq?: any;
  }
}

function ttq() {
  if (typeof window === 'undefined') return null;
  return window.ttq || null;
}

export function loadTikTokPixel(pixelId: string) {
  if (typeof window === 'undefined' || !pixelId) return;
  if (document.getElementById('ttq-script')) return;
  /* eslint-disable */
  (function (w: any, d: any, t: string) {
    w.TiktokAnalyticsObject = t;
    var ttqObj = (w[t] = w[t] || []);
    ttqObj.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent'];
    ttqObj.setAndDefer = function (target: any, method: string) {
      target[method] = function () { target.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
    };
    for (var i = 0; i < ttqObj.methods.length; i++) ttqObj.setAndDefer(ttqObj, ttqObj.methods[i]);
    ttqObj.instance = function (id: string) {
      var inst = (ttqObj._i[id] = ttqObj._i[id] || []);
      for (var n = 0; n < ttqObj.methods.length; n++) ttqObj.setAndDefer(inst, ttqObj.methods[n]);
      return inst;
    };
    ttqObj.load = function (id: string, cfg?: any) {
      var url = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttqObj._i = ttqObj._i || {};
      ttqObj._i[id] = [];
      ttqObj._i[id]._u = url;
      ttqObj._t = ttqObj._t || {};
      ttqObj._t[id] = +new Date();
      ttqObj._o = ttqObj._o || {};
      ttqObj._o[id] = cfg || {};
      var script = d.createElement('script');
      script.id = 'ttq-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src = url + '?sdkid=' + id + '&lib=' + t;
      var first = d.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
    };
    ttqObj.load(pixelId);
    ttqObj.page();
  })(window, document, 'ttq');
  /* eslint-enable */
}

type TikTokEvent =
  | 'ViewContent' | 'Search' | 'AddToCart'
  | 'InitiateCheckout' | 'AddPaymentInfo' | 'CompletePayment' | 'PlaceAnOrder';

export function trackTikTok(event: TikTokEvent, params: Record<string, any> = {}, eventId?: string) {
  const q = ttq();
  if (!q) return;
  try {
    q.track(event, params, eventId ? { event_id: eventId } : undefined);
  } catch { /* noop */ }
}
