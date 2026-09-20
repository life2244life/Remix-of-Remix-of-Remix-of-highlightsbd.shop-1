import { admin, corsHeaders, sendEmail, SendArgs } from '../_shared/email-core.ts'

// Generic transactional dispatcher. Either pass an explicit template_key + vars,
// or a `type` + order_id and vars are derived from the order automatically.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const db = admin()
    const body = await req.json().catch(() => ({}))
    let { to, template_key, vars, order_id, type } = body as Record<string, any>
    vars = vars || {}

    // Derive vars from an order for transactional types
    if (type && order_id) {
      const { data: order } = await db.from('orders').select('*').eq('id', order_id).maybeSingle()
      if (!order) {
        return json({ error: 'order_not_found' }, 404)
      }
      to = to || order.customer_email
      const shortId = String(order.id).slice(0, 8).toUpperCase()
      const base = {
        customer_name: order.customer_name || 'Customer',
        order_id: shortId,
        total: order.total,
      }
      const map: Record<string, { tpl: string; vars: Record<string, unknown> }> = {
        order_confirmation: { tpl: 'order_confirmation', vars: base },
        payment_success: { tpl: 'payment_success', vars: { ...base, amount: order.paid_amount ?? order.total, gateway: order.payment_method } },
        payment_failed: { tpl: 'payment_failed', vars: base },
        shipping_notification: { tpl: 'shipping_notification', vars: { ...base, courier: order.courier_provider || '', tracking_number: order.tracking_code || '' } },
      }
      const sel = map[type]
      if (!sel) return json({ error: 'unknown_type' }, 400)
      template_key = sel.tpl
      vars = { ...sel.vars, ...vars }
      order_id = order.id
    }

    if (!to || !template_key) return json({ error: 'missing_to_or_template_key' }, 400)

    const result = await sendEmail(db, {
      to, templateKey: template_key, vars, orderId: order_id || null,
      metadata: { type: type || 'manual' },
    } as SendArgs)

    const status = result.status === 'failed' ? 500 : 200
    return json(result, status)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown_error'
    return json({ error: msg }, 500)
  }

  function json(obj: unknown, status = 200) {
    return new Response(JSON.stringify(obj), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})