import { admin, corsHeaders, sendEmail } from '../_shared/email-core.ts'

// Bulk newsletter send to confirmed, non-unsubscribed subscribers.
// Body: { subject, html, text?, template_key?, vars? }
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const db = admin()
    const body = await req.json().catch(() => ({}))
    const { subject, html, text, template_key, vars, test_to } = body as Record<string, any>

    if (!template_key && (!subject || !html)) {
      return json({ error: 'missing_subject_or_html' }, 400)
    }

    if (test_to) {
      const r = await sendEmail(db, {
        to: test_to, templateKey: template_key || 'newsletter_broadcast',
        subjectOverride: subject, htmlOverride: html, textOverride: text,
        vars: vars || {}, category: 'marketing', skipRateLimit: true, appendUnsubscribe: true,
      })
      return json({ test: true, ...r })
    }

    const { data: subs, error } = await db
      .from('newsletter_subscribers')
      .select('email')
      .eq('status', 'confirmed')
    if (error) return json({ error: error.message }, 500)

    let sent = 0, suppressed = 0, failed = 0
    for (const s of subs || []) {
      const r = await sendEmail(db, {
        to: s.email, templateKey: template_key || 'newsletter_broadcast',
        subjectOverride: subject, htmlOverride: html, textOverride: text,
        vars: vars || {}, category: 'marketing', skipRateLimit: true, appendUnsubscribe: true,
      })
      if (r.status === 'sent' || r.status === 'sandbox') sent++
      else if (r.status === 'suppressed') suppressed++
      else failed++
    }
    return json({ total: subs?.length || 0, sent, suppressed, failed })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'unknown_error' }, 500)
  }

  function json(obj: unknown, status = 200) {
    return new Response(JSON.stringify(obj), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})