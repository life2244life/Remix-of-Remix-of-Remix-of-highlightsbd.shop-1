import { admin, corsHeaders, sendEmail } from '../_shared/email-core.ts'

// Processes queued emails (email_logs.status = 'queued'). Triggered by cron or manually.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const db = admin()
  const { data: queued } = await db
    .from('email_logs')
    .select('*')
    .eq('status', 'queued')
    .order('created_at', { ascending: true })
    .limit(50)

  let processed = 0, sent = 0, failed = 0
  for (const row of queued || []) {
    processed++
    const meta = (row.metadata || {}) as Record<string, any>
    const r = await sendEmail(db, {
      to: row.recipient,
      templateKey: row.template_key || 'newsletter_broadcast',
      vars: meta.vars || {},
      subjectOverride: row.subject || undefined,
      htmlOverride: meta.html || undefined,
      textOverride: meta.text || undefined,
      orderId: row.order_id,
      category: meta.category || 'transactional',
      skipRateLimit: true,
    })
    await db.from('email_logs').delete().eq('id', row.id)
    if (r.status === 'sent' || r.status === 'sandbox') sent++
    else failed++
  }
  return new Response(JSON.stringify({ processed, sent, failed }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})