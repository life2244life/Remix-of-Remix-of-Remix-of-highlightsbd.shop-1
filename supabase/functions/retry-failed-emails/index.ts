import { admin, corsHeaders, sendEmail } from '../_shared/email-core.ts'

// Retries recently failed deliveries (max 3 attempts tracked in metadata).
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const db = admin()
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data: failed } = await db
    .from('email_logs')
    .select('*')
    .eq('status', 'failed')
    .gte('created_at', since)
    .order('created_at', { ascending: true })
    .limit(50)

  let retried = 0, recovered = 0, exhausted = 0
  for (const row of failed || []) {
    const meta = (row.metadata || {}) as Record<string, any>
    const attempts = Number(meta.retry_attempts || 0)
    if (attempts >= 3) { exhausted++; continue }
    retried++
    const r = await sendEmail(db, {
      to: row.recipient,
      templateKey: row.template_key || 'newsletter_broadcast',
      vars: meta.vars || {},
      orderId: row.order_id,
      category: meta.category || 'transactional',
      metadata: { ...meta, retry_attempts: attempts + 1 },
      skipRateLimit: true,
    })
    if (r.status === 'sent' || r.status === 'sandbox') {
      recovered++
      await db.from('email_logs').delete().eq('id', row.id)
    } else {
      await db.from('email_logs')
        .update({ metadata: { ...meta, retry_attempts: attempts + 1 } })
        .eq('id', row.id)
    }
  }
  return new Response(JSON.stringify({ retried, recovered, exhausted }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})