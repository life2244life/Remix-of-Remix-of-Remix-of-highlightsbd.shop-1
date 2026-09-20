import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import forge from 'npm:node-forge@1.3.1'

// Nagad payment gateway (Tokenized / DFS checkout)
const SANDBOX_BASE = 'https://sandbox.mynagad.com:10060/remote-payment-gateway-1.0/api/dfs'
const LIVE_BASE = 'https://api.mynagad.com/api/dfs'

const admin = () =>
  createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

async function getGateway(sb: any) {
  const { data } = await sb.from('payment_gateways').select('*').eq('gateway', 'nagad').maybeSingle()
  return data
}
function creds(gw: any) {
  const c = (gw?.credentials || {})[gw?.mode === 'live' ? 'live' : 'sandbox'] || {}
  return {
    merchant_id: c.merchant_id || '',
    merchant_number: c.merchant_number || '',
    public_key: normalizeKey(c.pg_public_key || '', 'PUBLIC'),
    private_key: normalizeKey(c.merchant_private_key || '', 'PRIVATE'),
  }
}
const baseUrl = (gw: any) => (gw?.mode === 'live' ? LIVE_BASE : SANDBOX_BASE)

function normalizeKey(key: string, type: 'PUBLIC' | 'PRIVATE') {
  if (!key) return ''
  if (key.includes('BEGIN')) return key
  const header = type === 'PUBLIC' ? 'PUBLIC KEY' : 'PRIVATE KEY'
  const body = key.replace(/\s+/g, '').match(/.{1,64}/g)?.join('\n') || key
  return `-----BEGIN ${header}-----\n${body}\n-----END ${header}-----`
}

function encrypt(plain: string, pubPem: string) {
  const pub = forge.pki.publicKeyFromPem(pubPem)
  const enc = pub.encrypt(plain, 'RSAES-PKCS1-V1_5')
  return forge.util.encode64(enc)
}
function sign(plain: string, privPem: string) {
  const priv = forge.pki.privateKeyFromPem(privPem)
  const md = forge.md.sha256.create()
  md.update(plain, 'utf8')
  return forge.util.encode64(priv.sign(md))
}
function decrypt(b64: string, privPem: string) {
  const priv = forge.pki.privateKeyFromPem(privPem)
  const dec = priv.decrypt(forge.util.decode64(b64), 'RSAES-PKCS1-V1_5')
  return dec
}

function nowStamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  const sb = admin()
  try {
    const body = await req.json().catch(() => ({}))
    const action = body.action
    const gw = await getGateway(sb)
    if (!gw || !gw.is_active) return json({ error: 'Nagad is not enabled' }, 400)
    const { merchant_id, public_key, private_key } = creds(gw)
    if (!merchant_id || !public_key || !private_key) return json({ error: 'Nagad credentials missing (merchant id, keys)' }, 400)

    const headers = {
      'Content-Type': 'application/json', accept: 'application/json',
      'X-KM-Api-Version': 'v-0.2.0', 'X-KM-IP-V4': '0.0.0.0', 'X-KM-Client-Type': 'PC_WEB',
    }

    if (action === 'init') {
      const { order_id, amount, origin, is_advance } = body
      if (!order_id || !amount) return json({ error: 'order_id and amount required' }, 400)
      const { data: order } = await sb.from('orders').select('*').eq('id', order_id).maybeSingle()
      if (!order) return json({ error: 'Order not found' }, 404)

      const invoice = nowStamp() + Math.floor(Math.random() * 9000 + 1000)
      const { data: txn } = await sb.from('payment_transactions').insert({
        order_id, gateway: 'nagad', amount, currency: 'BDT', status: 'pending',
        is_advance: !!is_advance, customer_phone: order.customer_phone,
        raw_response: { origin: origin || '', invoice },
      }).select().single()

      const dateTime = nowStamp()
      const sensitive = JSON.stringify({ merchantId: merchant_id, datetime: dateTime, orderId: invoice, challenge: txn.id.replace(/-/g, '').slice(0, 16) })
      const initBody = { accountNumber: creds(gw).merchant_number, dateTime, sensitiveData: encrypt(sensitive, public_key), signature: sign(sensitive, private_key) }

      const initRes = await fetch(`${baseUrl(gw)}/check-out/initialize/${merchant_id}/${invoice}`, { method: 'POST', headers, body: JSON.stringify(initBody) })
      const initData = await initRes.json()
      if (!initData.sensitiveData) {
        await sb.from('payment_transactions').update({ status: 'failed', error_message: initData.message || 'init failed', raw_response: initData }).eq('id', txn.id)
        return json({ error: initData.message || 'Nagad init failed', detail: initData }, 400)
      }
      const decoded = JSON.parse(decrypt(initData.sensitiveData, private_key))
      const paymentRefId = decoded.paymentReferenceId
      const challenge = decoded.challenge

      const callback = `${origin || 'https://demo.eidlip.com'}/checkout/complete?order=${order_id}&gw=nagad&txn=${txn.id}`
      const confirmSensitive = JSON.stringify({ merchantId: merchant_id, orderId: invoice, currencyCode: '050', amount: String(amount), challenge })
      const completeBody = {
        sensitiveData: encrypt(confirmSensitive, public_key), signature: sign(confirmSensitive, private_key),
        merchantCallbackURL: callback, additionalMerchantInfo: { orderRef: order_id },
      }
      const compRes = await fetch(`${baseUrl(gw)}/check-out/complete/${paymentRefId}`, { method: 'POST', headers, body: JSON.stringify(completeBody) })
      const compData = await compRes.json()
      await sb.from('payment_transactions').update({ gateway_txn_id: paymentRefId, raw_response: { ...txn.raw_response, paymentRefId, complete: compData } }).eq('id', txn.id)

      if (compData.callBackUrl || compData.status === 'Success') {
        return json({ url: compData.callBackUrl, transaction_id: txn.id, paymentRefId })
      }
      await sb.from('payment_transactions').update({ status: 'failed', error_message: compData.message || 'complete failed', raw_response: compData }).eq('id', txn.id)
      return json({ error: compData.message || 'Nagad checkout failed', detail: compData }, 400)
    }

    if (action === 'verify') {
      const { paymentRefId, transaction_id } = body
      if (!paymentRefId) return json({ error: 'paymentRefId required' }, 400)
      const vRes = await fetch(`${baseUrl(gw)}/verify/payment/${paymentRefId}`, { headers })
      const vData = await vRes.json()
      const { data: txn } = await sb.from('payment_transactions').select('*').eq('id', transaction_id).maybeSingle()
      if (vData.status === 'Success' && txn) {
        await sb.from('payment_transactions').update({ raw_response: vData }).eq('id', txn.id)
        await sb.rpc('finalize_payment', { _txn_id: txn.id, _gateway_ref: vData.issuerPaymentRefNo || paymentRefId })
        return json({ status: 'success' })
      }
      if (txn) await sb.from('payment_transactions').update({ status: 'failed', error_message: vData.message || 'not verified', raw_response: vData }).eq('id', txn.id)
      return json({ status: 'failed', detail: vData }, 400)
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Server error' }, 500)
  }
})

function json(b: any, status = 200) {
  return new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
}
