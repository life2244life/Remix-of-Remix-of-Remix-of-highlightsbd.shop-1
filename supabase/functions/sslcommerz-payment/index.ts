import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SANDBOX_BASE = 'https://sandbox.sslcommerz.com'
const LIVE_BASE = 'https://securepay.sslcommerz.com'

const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

async function getGateway(sb: any) {
  const { data } = await sb.from('payment_gateways').select('*').eq('gateway', 'sslcommerz').maybeSingle()
  return data
}

function creds(gw: any) {
  const c = (gw?.credentials || {})[gw?.mode === 'live' ? 'live' : 'sandbox'] || {}
  return { store_id: c.store_id || '', store_passwd: c.store_passwd || '' }
}

function base(gw: any) {
  return gw?.mode === 'live' ? LIVE_BASE : SANDBOX_BASE
}

function redirect(url: string) {
  return new Response(null, { status: 302, headers: { ...corsHeaders, Location: url } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const sb = admin()
  const url = new URL(req.url)
  const action = url.searchParams.get('action') || (req.method === 'POST' ? (await safeJson(req)).action : '')

  try {
    const gw = await getGateway(sb)

    // ---- TEST: validate saved credentials without creating an order ----
    if (action === 'test') {
      if (!gw) return json({ ok: false, error: 'SSLCommerz gateway not configured' }, 400)
      const { store_id, store_passwd } = creds(gw)
      if (!store_id || !store_passwd) {
        return json({ ok: false, error: `Store ID / Password missing for ${gw.mode} mode. Save credentials first.` }, 400)
      }
      const params = new URLSearchParams({
        store_id, store_passwd, total_amount: '10', currency: 'BDT',
        tran_id: `TEST-${Date.now()}`,
        success_url: 'https://example.com', fail_url: 'https://example.com', cancel_url: 'https://example.com',
        cus_name: 'Connection Test', cus_email: 'test@example.com', cus_phone: '01700000000',
        cus_add1: 'Dhaka', cus_city: 'Dhaka', cus_country: 'Bangladesh',
        shipping_method: 'NO', product_name: 'Test', product_category: 'test', product_profile: 'general', num_of_item: '1',
      })
      const res = await fetch(`${base(gw)}/gwprocess/v4/api.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString(),
      })
      const data = await res.json().catch(() => ({}))
      if (data.status === 'SUCCESS') return json({ ok: true, mode: gw.mode, message: 'Credentials valid' })
      return json({ ok: false, mode: gw.mode, error: data.failedreason || data.status || 'Credential validation failed' }, 400)
    }

    if (!gw || !gw.is_active) {
      return json({ error: 'SSLCommerz is not enabled' }, 400)
    }
    const { store_id, store_passwd } = creds(gw)

    // ---- INIT: create a payment session ----
    if (action === 'init') {
      const body = await safeJson(req)
      const { order_id, amount, origin, is_advance } = body
      if (!order_id || !amount) return json({ error: 'order_id and amount required' }, 400)
      if (!store_id || !store_passwd) return json({ error: 'SSLCommerz credentials missing' }, 400)

      const { data: order } = await sb.from('orders').select('*').eq('id', order_id).maybeSingle()
      if (!order) return json({ error: 'Order not found' }, 404)

      const { data: txn } = await sb.from('payment_transactions').insert({
        order_id, gateway: 'sslcommerz', amount, currency: 'BDT', status: 'pending',
        is_advance: !!is_advance, customer_phone: order.customer_phone,
        raw_response: { origin: origin || '' },
      }).select().single()

      const fnUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/sslcommerz-payment`
      const params = new URLSearchParams({
        store_id, store_passwd, total_amount: String(amount), currency: 'BDT',
        tran_id: txn.id,
        success_url: `${fnUrl}?action=callback&result=success`,
        fail_url: `${fnUrl}?action=callback&result=fail`,
        cancel_url: `${fnUrl}?action=callback&result=cancel`,
        ipn_url: `${fnUrl}?action=ipn`,
        cus_name: order.customer_name || 'Customer',
        cus_email: order.customer_email || 'customer@eidlip.com',
        cus_phone: order.customer_phone || '01700000000',
        cus_add1: order.customer_address || 'N/A',
        cus_city: order.customer_city || 'Dhaka',
        cus_country: 'Bangladesh',
        shipping_method: 'Courier', product_name: 'Order', product_category: 'general', product_profile: 'general',
        num_of_item: String((order.items || []).length || 1),
      })

      const res = await fetch(`${base(gw)}/gwprocess/v4/api.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString(),
      })
      const data = await res.json()
      if (data.status === 'SUCCESS' && data.GatewayPageURL) {
        return json({ url: data.GatewayPageURL, transaction_id: txn.id })
      }
      await sb.from('payment_transactions').update({ status: 'failed', error_message: data.failedreason || 'init failed', raw_response: data }).eq('id', txn.id)
      return json({ error: data.failedreason || 'Failed to initiate payment' }, 400)
    }

    // ---- CALLBACK / IPN: validate & finalize ----
    if (action === 'callback' || action === 'ipn') {
      // Record webhook receipt for monitoring (best-effort).
      if (action === 'ipn') {
        await sb.from('payment_gateways').update({ last_webhook_at: new Date().toISOString() }).eq('gateway', 'sslcommerz')
      }
      const form = await req.formData().catch(() => null)
      const get = (k: string) => (form ? String(form.get(k) || '') : url.searchParams.get(k) || '')
      const tran_id = get('tran_id')
      const result = url.searchParams.get('result') || ''
      const val_id = get('val_id')
      const status = get('status')

      const { data: txn } = await sb.from('payment_transactions').select('*').eq('id', tran_id).maybeSingle()
      const origin = txn?.raw_response?.origin || Deno.env.get('APP_URL') || 'https://demo.eidlip.com'

      if (result === 'cancel' || status === 'CANCELLED') {
        await sb.from('payment_transactions').update({ status: 'cancelled' }).eq('id', tran_id)
        return action === 'ipn' ? json({ ok: true }) : redirect(`${origin}/checkout/complete?order=${txn?.order_id || ''}&status=cancelled`)
      }
      if (result === 'fail' || status === 'FAILED') {
        await sb.from('payment_transactions').update({ status: 'failed' }).eq('id', tran_id)
        return action === 'ipn' ? json({ ok: true }) : redirect(`${origin}/checkout/complete?order=${txn?.order_id || ''}&status=failed`)
      }

      // Validate against SSLCommerz
      let ok = false
      let valData: any = {}
      if (val_id) {
        const vurl = `${base(gw)}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(val_id)}&store_id=${encodeURIComponent(store_id)}&store_passwd=${encodeURIComponent(store_passwd)}&format=json`
        const vres = await fetch(vurl)
        valData = await vres.json()
        ok = valData.status === 'VALID' || valData.status === 'VALIDATED'
      }

      if (ok && txn) {
        await sb.from('payment_transactions').update({
          val_id, raw_response: valData,
        }).eq('id', tran_id)
        await sb.rpc('finalize_payment', { _txn_id: tran_id, _gateway_ref: valData.bank_tran_id || val_id })
        // Record last successful payment for monitoring (best-effort).
        await sb.from('payment_gateways').update({ last_payment_at: new Date().toISOString() }).eq('gateway', 'sslcommerz')
        return action === 'ipn' ? json({ ok: true }) : redirect(`${origin}/checkout/complete?order=${txn.order_id}&status=success`)
      }

      await sb.from('payment_transactions').update({ status: 'failed', error_message: 'validation failed', raw_response: valData }).eq('id', tran_id)
      return action === 'ipn' ? json({ ok: true }) : redirect(`${origin}/checkout/complete?order=${txn?.order_id || ''}&status=failed`)
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})

async function safeJson(req: Request) { try { return await req.json() } catch { return {} } }
function json(b: any, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
