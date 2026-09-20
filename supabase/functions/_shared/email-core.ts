// Shared email core: rendering, sandbox/live sending, logging,
// rate limiting, suppression, and signed unsubscribe links.
import { createClient, SupabaseClient } from 'npm:@supabase/supabase-js@2'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export const SITE_NAME = 'EIDLIP'
// Sandbox sender works until a real verified domain is configured via EMAIL_FROM.
const SANDBOX_FROM = `${SITE_NAME} <onboarding@resend.dev>`
export const SITE_URL = Deno.env.get('SITE_URL') || 'https://demo.eidlip.com'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') || ''
const REPLY_TO = Deno.env.get('EMAIL_REPLY_TO') || 'support@demo.eidlip.com'

// Live mode requires a provider key. A verified domain (EMAIL_FROM) makes the
// system flip to its own sender automatically; otherwise the sandbox sender is used.
export function isLiveMode(): boolean {
  return RESEND_API_KEY.length > 0
}
export function fromAddress(): string {
  return EMAIL_FROM || SANDBOX_FROM
}

export function admin(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  )
}

// ---- Template rendering ----
export function renderTemplate(tpl: string, vars: Record<string, unknown>): string {
  return (tpl || '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_m, key) => {
    const v = vars[key]
    return v === undefined || v === null ? '' : String(v)
  })
}

// ---- HMAC signing for unsubscribe links ----
async function hmac(data: string): Promise<string> {
  const secret = Deno.env.get('EMAIL_SIGNING_SECRET') || ''
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function signUnsubscribe(email: string, scope = 'marketing'): Promise<string> {
  // 30 day expiry baked into the signature
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000
  const payload = `${email}:${scope}:${exp}`
  const sig = await hmac(payload)
  const token = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${SITE_URL.replace(/\/$/, '')}/functions/v1/unsubscribe?e=${encodeURIComponent(token)}&s=${sig}`
}

export async function verifyUnsubscribe(token: string, sig: string):
  Promise<{ ok: boolean; email?: string; scope?: string; reason?: string }> {
  try {
    const norm = token.replace(/-/g, '+').replace(/_/g, '/')
    const payload = atob(norm)
    const [email, scope, expStr] = payload.split(':')
    const exp = Number(expStr)
    if (!email || !exp) return { ok: false, reason: 'malformed' }
    if (Date.now() > exp) return { ok: false, reason: 'expired' }
    const expected = await hmac(payload)
    if (expected !== sig) return { ok: false, reason: 'bad_signature' }
    return { ok: true, email, scope }
  } catch {
    return { ok: false, reason: 'malformed' }
  }
}

// ---- Suppression + rate limiting ----
export async function isSuppressed(
  db: SupabaseClient, email: string, category: string,
): Promise<boolean> {
  if (category !== 'marketing') return false
  const { data } = await db
    .from('newsletter_subscribers')
    .select('status')
    .eq('email', email.toLowerCase())
    .maybeSingle()
  return data?.status === 'unsubscribed'
}

// Returns true if allowed to send (under the limit).
export async function rateLimitOk(
  db: SupabaseClient, email: string, templateKey: string,
  maxPerWindow = 3, windowMinutes = 10,
): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()
  const { count } = await db
    .from('email_logs')
    .select('id', { count: 'exact', head: true })
    .eq('recipient', email.toLowerCase())
    .eq('template_key', templateKey)
    .in('status', ['sent', 'sandbox'])
    .gte('created_at', since)
  return (count || 0) < maxPerWindow
}

// ---- Core send ----
export type SendArgs = {
  to: string
  templateKey: string
  vars?: Record<string, unknown>
  subjectOverride?: string
  htmlOverride?: string
  textOverride?: string
  orderId?: string | null
  category?: string
  metadata?: Record<string, unknown>
  skipRateLimit?: boolean
  appendUnsubscribe?: boolean
}

export type SendResult = {
  status: 'sent' | 'sandbox' | 'failed' | 'suppressed' | 'rate_limited'
  id?: string
  error?: string
}

export async function sendEmail(db: SupabaseClient, args: SendArgs): Promise<SendResult> {
  const to = (args.to || '').trim().toLowerCase()
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return { status: 'failed', error: 'invalid_recipient' }
  }

  // Resolve template (DB-driven, admin-editable)
  let subject = args.subjectOverride || ''
  let html = args.htmlOverride || ''
  let text = args.textOverride || ''
  let category = args.category || 'transactional'

  if (!html || !subject) {
    const { data: tpl } = await db
      .from('email_templates')
      .select('subject, html_body, text_body, category, is_active')
      .eq('template_key', args.templateKey)
      .maybeSingle()
    if (!tpl || tpl.is_active === false) {
      return { status: 'failed', error: 'template_inactive_or_missing' }
    }
    const vars = args.vars || {}
    subject = args.subjectOverride || renderTemplate(tpl.subject, vars)
    html = args.htmlOverride || renderTemplate(tpl.html_body, vars)
    text = args.textOverride || renderTemplate(tpl.text_body || '', vars)
    category = tpl.category || category
  }

  // Spam protection / suppression
  if (await isSuppressed(db, to, category)) {
    await logEmail(db, { to, args, subject, status: 'suppressed' })
    return { status: 'suppressed' }
  }

  // Rate limiting
  if (!args.skipRateLimit && !(await rateLimitOk(db, to, args.templateKey))) {
    await logEmail(db, { to, args, subject, status: 'rate_limited' })
    return { status: 'rate_limited' }
  }

  // Append signed unsubscribe footer for marketing mail
  if (args.appendUnsubscribe || category === 'marketing') {
    const link = await signUnsubscribe(to, 'marketing')
    html += `<p style="font-size:12px;color:#888;text-align:center;margin-top:24px">You are receiving this because you subscribed to ${SITE_NAME}. <a href="${link}">Unsubscribe</a>.</p>`
    text += `\n\nUnsubscribe: ${link}`
  }

  // Sandbox mode: log without dispatching to a provider
  if (!isLiveMode()) {
    const id = await logEmail(db, { to, args, subject, status: 'sandbox' })
    return { status: 'sandbox', id }
  }

  // Live send via Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress(), to: [to], reply_to: REPLY_TO, subject, html, text: text || undefined,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      await logEmail(db, { to, args, subject, status: 'failed', error: JSON.stringify(data) })
      return { status: 'failed', error: JSON.stringify(data) }
    }
    await logEmail(db, { to, args, subject, status: 'sent', providerId: data.id })
    return { status: 'sent', id: data.id }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'send_error'
    await logEmail(db, { to, args, subject, status: 'failed', error: msg })
    return { status: 'failed', error: msg }
  }
}

async function logEmail(
  db: SupabaseClient,
  o: { to: string; args: SendArgs; subject: string; status: string; providerId?: string; error?: string },
): Promise<string | undefined> {
  const { data } = await db.from('email_logs').insert({
    recipient: o.to,
    template_key: o.args.templateKey,
    subject: o.subject,
    status: o.status,
    provider: isLiveMode() ? 'resend' : 'sandbox',
    provider_message_id: o.providerId || null,
    error_message: o.error || null,
    order_id: o.args.orderId || null,
    metadata: o.args.metadata || {},
  }).select('id').maybeSingle()
  return data?.id
}