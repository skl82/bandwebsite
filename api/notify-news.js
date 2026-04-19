import mailchimp from '@mailchimp/mailchimp_marketing'
import { createClient } from '@supabase/supabase-js'

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
  )
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { title, body, image_url, link, link_text } = req.body || {}

  if (!title || !body) {
    return res.status(400).json({ error: 'Missing required news details' })
  }

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  })

  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const fromEmail = process.env.MAILCHIMP_FROM_EMAIL || 'updates@araujiaband.com'

  const safeTitle = escapeHtml(title)
  const safeImageUrl = escapeHtml(image_url)
  const safeLink = escapeHtml(link)
  const safeLinkText = escapeHtml(link_text || 'read more')

  const bodyHtml = escapeHtml(body)
    .split(/\n\n+/)
    .map(p => `<p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 14px; line-height: 1.7; color: #f1f1f1; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const imageBlock = image_url
    ? `<tr><td align="center" style="padding-bottom: 32px;">
        <img src="${safeImageUrl}" alt="${safeTitle}" width="500" style="max-width: 100%; height: auto; border-radius: 4px;" />
      </td></tr>`
    : ''

  const linkBlock = link
    ? `<tr><td align="center" style="padding-top: 16px; padding-bottom: 40px;">
        <a href="${safeLink}" style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #f1f1f1; border: 1px solid #e63946; padding: 12px 24px; text-decoration: none; display: inline-block;">[ ${safeLinkText} ]</a>
      </td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');
    :root { color-scheme: dark; supported-color-schemes: dark; }
    @media (prefers-color-scheme: dark) {
      body, .body-bg { background-color: #0a0a0a !important; }
    }
    u + .body-bg { background-color: #0a0a0a !important; }
  </style>
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
</head>
<body class="body-bg" style="margin: 0; padding: 0; background-color: #0a0a0a; color: #f1f1f1;">
  <div class="body-bg" style="background-color: #0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr><td align="center" style="padding: 40px 20px 10px; background-color: #0a0a0a;">
      <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; width: 100%; background-color: #0a0a0a;">
        <tr><td align="center" style="padding-bottom: 40px; background-color: #0a0a0a;">
          <img src="https://araujiaband.com/araujialogo.png" alt="Araujia" width="200" style="max-width: 200px; height: auto;" />
        </td></tr>
        <tr><td style="border-top: 1px solid rgba(255,255,255,0.1); padding-bottom: 40px; background-color: #0a0a0a;"></td></tr>
        <tr><td style="padding-bottom: 24px; background-color: #0a0a0a;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin: 0;">// band news</p>
        </td></tr>
        ${imageBlock}
        <tr><td style="padding-bottom: 20px; background-color: #0a0a0a;">
          <h1 style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 36px; letter-spacing: 3px; color: #f1f1f1; margin: 0;">${safeTitle}</h1>
        </td></tr>
        <tr><td style="padding-bottom: 8px; background-color: #0a0a0a;">
          ${bodyHtml}
        </td></tr>
        ${linkBlock}
        <tr><td style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; padding-bottom: 0; margin-top: 40px; background-color: #0a0a0a;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding-top: 8px;"></td></tr></table>
        </td></tr>
        <tr><td align="center" style="background-color: #0a0a0a;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 10px; color: #888888; letter-spacing: 1px; margin: 0 0 16px 0;">ARAUJIA &mdash; *|CURRENT_YEAR|*</p>
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 10px; color: #888888; margin: 0;">
            <a href="*|UNSUB|*" style="color: #888888; text-decoration: underline;">unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </div>
</body>
</html>`

  try {
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: audienceId },
      settings: {
        subject_line: safeTitle,
        from_name: 'ARAUJIA',
        reply_to: fromEmail,
      },
    })

    await mailchimp.campaigns.setContent(campaign.id, { html })
    await mailchimp.campaigns.send(campaign.id)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Mailchimp campaign error:', err?.response?.body || err.message)
    return res.status(500).json({ error: 'Failed to send notification' })
  }
}
