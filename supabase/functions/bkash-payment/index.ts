import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// bKash Tokenized Checkout
const SANDBOX_BASE = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
const LIVE_BASE = 'https://tokenized.pay.bka.sh/v1.2.0-beta'

const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

async function getGateway(sb: any) {
  const { data } = await sb.from('payment_gateways').select('*').eq('gateway', 'bkash').maybeSingle()
  return data
}
function creds(gw: any) {
  const c = (gw?.credentials || {})[gw?.mode === 'live' ? 'live' : 'sandbox'] || {}
  return {
    app_key: c.app_key || '', app_secret: c.app_secret || '',
    username: c.username || '', password: c.password || '',
  }
}
const baseUrl = (gw: any) => (gw?.mode === 'live' ? LIVE_BASE : SANDBOX_BASE)

async function grantToken(gw: any) {
  const { app_key, app_secret, username, password } = creds(gw)
  const res = await fetch(`${baseUrl(gw)}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: 'application/json', username, password },
    body: JSON.stringify({ app_key, app_secret }),
  })
  const data = await res.json()
  return data.id_token as string | undefined
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const sb = admin()
  try {
    const body = await req.json().catch(() => ({}))
    const action = body.action
    const gw = await getGateway(sb)
    if (!gw || !gw.is_active) return json({ error: 'bKash is not enabled' }, 400)
    const { app_key } = creds(gw)

    const token = await grantToken(gw)
    if (!token) return json({ error: 'bKash auth failed — check credentials' }, 400)

    // ---- CREATE ----
    if (action === 'create') {
      const { order_id, amount, origin, is_advance } = body
      if (!order_id || !amount) return json({ error: 'order_id and amount required' }, 400)
      const { data: order } = await sb.from('orders').select('*').eq('id', order_id).maybeSingle()
      if (!order) return json({ error: 'Order not found' }, 404)

      const { data: txn } = await sb.from('payment_transactions').insert({
        order_id, gateway: 'bkash', amount, currency: 'BDT', status: 'pending',
        is_advance: !!is_advance, customer_phone: order.customer_phone, raw_response: { origin: origin || '' },
      }).select().single()

      const callback = `${origin || 'https://demo.eidlip.com'}/checkout/complete?order=${order_id}&gw=bkash&txn=${txn.id}`
      const res = await fetch(`${baseUrl(gw)}/tokenized/checkout/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json', authorization: token, 'x-app-key': app_key },
        body: JSON.stringify({
          mode: '0011', payerReference: order.customer_phone || '01', callbackURL: callback,
          amount: String(amount), currency: 'BDT', intent: 'sale', merchantInvoiceNumber: txn.id.slice(0, 18),
        }),
      })
      const data = await res.json()
      if (data.paymentID && data.bkashURL) {
        await sb.from('payment_transactions').update({ gateway_txn_id: data.paymentID, raw_response: { ...data, origin: origin || '' } }).eq('id', txn.id)
        return json({ url: data.bkashURL, paymentID: data.paymentID, transaction_id: txn.id })
      }
      await sb.from('payment_transactions').update({ status: 'failed', error_message: data.statusMessage || 'create failed', raw_response: data }).eq('id', txn.id)
      return json({ error: data.statusMessage || 'Failed to create bKash payment' }, 400)
    }

    // ---- EXECUTE ----
    if (action === 'execute') {
      const { paymentID, transaction_id } = body
      if (!paymentID) return json({ error: 'paymentID required' }, 400)
      const res = await fetch(`${baseUrl(gw)}/tokenized/checkout/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json', authorization: token, 'x-app-key': app_key },
        body: JSON.stringify({ paymentID }),
      })
      const data = await res.json()
      const { data: txn } = await sb.from('payment_transactions').select('*')
        .or(`id.eq.${transaction_id || '00000000-0000-0000-0000-000000000000'},gateway_txn_id.eq.${paymentID}`).maybeSingle()

      if (data.statusCode === '0000' && data.transactionStatus === 'Completed') {
        if (txn) {
          await sb.from('payment_transactions').update({ raw_response: data }).eq('id', txn.id)
          await sb.rpc('finalize_payment', { _txn_id: txn.id, _gateway_ref: data.trxID || paymentID })
        }
        return json({ status: 'success', trxID: data.trxID })
      }
      if (txn) await sb.from('payment_transactions').update({ status: 'failed', error_message: data.statusMessage || 'execute failed', raw_response: data }).eq('id', txn.id)
      return json({ status: 'failed', error: data.statusMessage || 'Payment not completed' }, 400)
    }

    // ---- REFUND ----
    if (action === 'refund') {
      const { paymentID, trxID, amount, reason } = body
      const res = await fetch(`${baseUrl(gw)}/tokenized/checkout/payment/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: 'application/json', authorization: token, 'x-app-key': app_key },
        body: JSON.stringify({ paymentID, trxID, amount: String(amount), sku: 'order', reason: reason || 'refund' }),
      })
      const data = await res.json()
      return json(data, res.ok ? 200 : 400)
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})

function json(b: any, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
