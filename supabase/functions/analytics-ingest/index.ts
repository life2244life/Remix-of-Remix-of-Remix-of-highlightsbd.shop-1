import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const META_GRAPH_URL = 'https://graph.facebook.com/v18.0';
const TIKTOK_EVENTS_URL = 'https://business-api.tiktok.com/open_api/v1.3/event/track/';
const GA4_MP_URL = 'https://www.google-analytics.com/mp/collect';

// ---- in-memory rate limiter (per IP, best-effort) ----
const rl = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const e = rl.get(ip);
  if (!e || now > e.reset) { rl.set(ip, { count: 1, reset: now + windowMs }); return false; }
  e.count++;
  return e.count > limit;
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const norm = (s?: string | null) => (s || '').toString().trim().toLowerCase();
const digits = (s?: string | null) => (s || '').toString().replace(/[^0-9]/g, '');
async function hashArr(v?: string | null) { const n = norm(v); return n ? [await sha256(n)] : undefined; }

const EventSchema = z.object({
  provider: z.enum(['ga4', 'meta', 'tiktok']),
  event_name: z.string().min(1).max(64),
  event_id: z.string().min(1).max(128),
  value: z.number().optional(),
  currency: z.string().max(8).optional(),
  order_id: z.string().uuid().optional(),
  user_data: z.record(z.any()).optional(),
  custom_data: z.record(z.any()).optional(),
  event_source_url: z.string().optional(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  ttclid: z.string().optional(),
  client_id: z.string().optional(),
});
const BodySchema = z.object({
  environment: z.string().max(32).optional(),
  events: z.array(EventSchema).min(1).max(50),
});

function getSettings(rows: any[]): Record<string, string> {
  const m: Record<string, string> = {};
  rows?.forEach(r => { m[r.key] = r.value; });
  return m;
}

async function forwardMeta(ev: any, s: Record<string, string>, req: Request): Promise<void> {
  const pixelId = s['meta_pixel_id'];
  const token = s['meta_capi_access_token'];
  if (!pixelId || !token) throw new Error('Meta not configured');
  const ud = ev.user_data || {};
  const user_data: Record<string, any> = {
    em: await hashArr(ud.email_address || ud.email),
    ph: (ud.phone_number || ud.phone) ? [await sha256(digits(ud.phone_number || ud.phone))] : undefined,
    fn: await hashArr(ud.first_name), ln: await hashArr(ud.last_name),
    ct: await hashArr(ud.city), country: await hashArr(ud.country || 'BD'),
    zp: await hashArr(ud.postal_code || ud.zip),
    fbp: ev.fbp, fbc: ev.fbc,
    client_user_agent: req.headers.get('user-agent') || undefined,
    client_ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
  };
  Object.keys(user_data).forEach(k => user_data[k] === undefined && delete user_data[k]);
  const res = await fetch(`${META_GRAPH_URL}/${pixelId}/events?access_token=${token}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: [{
      event_name: ev.event_name, event_time: Math.floor(Date.now() / 1000),
      event_id: ev.event_id, event_source_url: ev.event_source_url,
      action_source: 'website', user_data, custom_data: ev.custom_data || {},
    }] }),
  });
  if (!res.ok) throw new Error(`Meta ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

async function forwardTikTok(ev: any, s: Record<string, string>, req: Request): Promise<void> {
  const pixelId = s['tiktok_pixel_id'];
  const token = s['tiktok_access_token'];
  if (!pixelId || !token) throw new Error('TikTok not configured');
  const ud = ev.user_data || {};
  const user: Record<string, any> = {
    email: ud.email_address || ud.email ? await sha256(norm(ud.email_address || ud.email)) : undefined,
    phone: (ud.phone_number || ud.phone) ? await sha256(digits(ud.phone_number || ud.phone)) : undefined,
    ttclid: ev.ttclid,
    ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
    user_agent: req.headers.get('user-agent') || undefined,
  };
  Object.keys(user).forEach(k => user[k] === undefined && delete user[k]);
  const res = await fetch(TIKTOK_EVENTS_URL, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Access-Token': token },
    body: JSON.stringify({
      event_source: 'web', event_source_id: pixelId,
      data: [{
        event: ev.event_name, event_id: ev.event_id,
        event_time: Math.floor(Date.now() / 1000),
        user, page: { url: ev.event_source_url }, properties: ev.custom_data || {},
      }],
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json && json.code && json.code !== 0)) {
    throw new Error(`TikTok ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  }
}

async function forwardGa4(ev: any, s: Record<string, string>): Promise<void> {
  const mid = s['ga4_measurement_id'];
  const secret = s['ga4_api_secret'];
  if (!mid || !secret) throw new Error('GA4 MP not configured');
  const res = await fetch(`${GA4_MP_URL}?measurement_id=${mid}&api_secret=${secret}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: ev.client_id || ev.event_id,
      events: [{ name: ev.event_name, params: { ...(ev.custom_data || {}), currency: ev.currency, value: ev.value, engagement_time_msec: 1 } }],
    }),
  });
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }

  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
  const { environment = 'production', events } = parsed.data;

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { data: settingsRows } = await supabase.from('tracking_settings').select('key, value');
  const s = getSettings(settingsRows || []);

  const toggles: Record<string, boolean> = {
    meta: s['server_side_meta_enabled'] !== 'false',
    tiktok: s['server_side_tiktok_enabled'] !== 'false',
    ga4: s['server_side_ga4_enabled'] !== 'false',
  };

  const results: any[] = [];
  for (const ev of events) {
    if (!toggles[ev.provider]) { results.push({ event_id: ev.event_id, provider: ev.provider, status: 'skipped' }); continue; }

    // Idempotency: unique(event_id, provider). Insert; if it already exists & sent, skip.
    const { data: existing } = await supabase.from('conversion_events')
      .select('id, status').eq('event_id', ev.event_id).eq('provider', ev.provider).maybeSingle();
    if (existing?.status === 'sent') { results.push({ event_id: ev.event_id, provider: ev.provider, status: 'duplicate' }); continue; }

    let rowId = existing?.id as string | undefined;
    if (!rowId) {
      const { data: ins } = await supabase.from('conversion_events').insert({
        event_id: ev.event_id, event_name: ev.event_name, provider: ev.provider,
        environment, order_id: ev.order_id || null, value: ev.value ?? null,
        currency: ev.currency || 'BDT', status: 'queued', payload: ev,
      }).select('id').maybeSingle();
      rowId = ins?.id;
    }

    try {
      if (ev.provider === 'meta') await forwardMeta(ev, s, req);
      else if (ev.provider === 'tiktok') await forwardTikTok(ev, s, req);
      else await forwardGa4(ev, s);
      if (rowId) await supabase.from('conversion_events').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', rowId);
      results.push({ event_id: ev.event_id, provider: ev.provider, status: 'sent' });
      console.log(JSON.stringify({ level: 'info', provider: ev.provider, event: ev.event_name, event_id: ev.event_id, status: 'sent' }));
    } catch (e: any) {
      if (rowId) {
        const { data: cur } = await supabase.from('conversion_events').select('attempts').eq('id', rowId).maybeSingle();
        await supabase.from('conversion_events').update({
          status: 'failed', attempts: (cur?.attempts || 0) + 1, last_error: String(e?.message || e),
        }).eq('id', rowId);
      }
      results.push({ event_id: ev.event_id, provider: ev.provider, status: 'failed', error: String(e?.message || e) });
      console.error(JSON.stringify({ level: 'error', provider: ev.provider, event: ev.event_name, event_id: ev.event_id, error: String(e?.message || e) }));
    }
  }

  return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
});
