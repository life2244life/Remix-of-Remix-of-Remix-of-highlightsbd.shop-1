import { admin, corsHeaders, sendEmail, SITE_URL } from '../_shared/email-core.ts'

// Sends staged abandoned-cart reminders: 1h, 24h, 72h after creation.
// reminders_sent tracks which stage was last sent (0,1,2,3).
const STAGES = [
  { idx: 0, minHours: 1 },
  { idx: 1, minHours: 24 },
  { idx: 2, minHours: 72 },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const db = admin()
  const now = Date.now()

  const { data: carts } = await db
    .from('abandoned_carts')
    .select('*')
    .eq('status', 'pending')
    .not('email', 'is', null)
    .lt('reminders_sent', 3)
    .limit(200)

  let sent = 0, skipped = 0
  for (const cart of carts || []) {
    const ageHours = (now - new Date(cart.created_at).getTime()) / 36e5
    const stage = STAGES[cart.reminders_sent]
    if (!stage || ageHours < stage.minHours) { skipped++; continue }

    const recoveryUrl = `${SITE_URL.replace(/\/$/, '')}/cart?recover=${cart.id}`
    const r = await sendEmail(db, {
      to: cart.email,
      templateKey: 'abandoned_cart',
      vars: {
        customer_name: cart.customer_name || 'there',
        total: cart.total,
        recovery_url: recoveryUrl,
      },
      category: 'marketing',
      metadata: { abandoned_cart_id: cart.id, stage: stage.idx },
      skipRateLimit: true,
      appendUnsubscribe: true,
    })
    if (r.status === 'sent' || r.status === 'sandbox') {
      sent++
      await db.from('abandoned_carts')
        .update({ reminders_sent: cart.reminders_sent + 1, last_reminder_at: new Date().toISOString() })
        .eq('id', cart.id)
    } else {
      skipped++
    }
  }
  return new Response(JSON.stringify({ candidates: carts?.length || 0, sent, skipped }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})