import { admin, verifyUnsubscribe, SITE_NAME } from '../_shared/email-core.ts'

// Public GET endpoint hit from signed unsubscribe links in emails.
Deno.serve(async (req) => {
  const url = new URL(req.url)
  const token = url.searchParams.get('e') || ''
  const sig = url.searchParams.get('s') || ''

  const v = await verifyUnsubscribe(token, sig)
  if (!v.ok) {
    return html(
      v.reason === 'expired'
        ? 'This unsubscribe link has expired. Please contact support.'
        : 'Invalid unsubscribe link.',
      400,
    )
  }

  const db = admin()
  const email = v.email!.toLowerCase()
  await db.from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('email', email)
  await db.from('unsubscribe_tokens').insert({
    email, token: sig, scope: v.scope || 'marketing', used_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 864e5).toISOString(),
  })

  return html(`You (${email}) have been unsubscribed from ${SITE_NAME} emails.`, 200)

  function html(msg: string, status: number) {
    return new Response(
      `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SITE_NAME}</title></head><body style="font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 20px;text-align:center"><h1 style="font-size:20px">${SITE_NAME}</h1><p style="color:#444">${msg}</p></body></html>`,
      { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }
})