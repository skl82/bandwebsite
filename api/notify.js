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

  // Verify the caller is an authenticated Supabase user
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

  const { gig_name, date, time, doors_time, venue, city, ticket_link, poster_url } = req.body || {}

  if (!gig_name || !date || !venue || !city) {
    return res.status(400).json({ error: 'Missing required show details' })
  }

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  })

  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const fromEmail = process.env.MAILCHIMP_FROM_EMAIL || 'updates@araujiaband.com'

  // Format date
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Format times
  const fmtTime = (t) =>
    t ? new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null
  const showTime = fmtTime(time)
  const doorsAt = fmtTime(doors_time)

  const timeLine = doorsAt && showTime
    ? `Doors: ${doorsAt} // Show: ${showTime}`
    : showTime
      ? `Show: ${showTime}`
      : ''

  const safeGigName = escapeHtml(gig_name)
  const safeVenue = escapeHtml(venue)
  const safeCity = escapeHtml(city)
  const safePosterUrl = escapeHtml(poster_url)
  const safeTicketLink = escapeHtml(ticket_link)

  const posterBlock = poster_url
    ? `<tr><td align="center" style="padding-bottom: 24px;">
        <img src="${safePosterUrl}" alt="${safeGigName}" width="400" style="max-width: 100%; height: auto; border-radius: 4px;" />
      </td></tr>`
    : ''

  const ticketBlock = ticket_link
    ? `<tr><td align="center" style="padding-top: 32px; padding-bottom: 40px;">
        <a href="${safeTicketLink}" style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #f1f1f1; border: 1px solid #e63946; padding: 12px 24px; text-decoration: none; display: inline-block;">[ Get Tickets ]</a>
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
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin: 0;">// new show announced</p>
        </td></tr>
        ${posterBlock}
        <tr><td style="padding-bottom: 8px; background-color: #0a0a0a;">
          <h1 style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 36px; letter-spacing: 3px; color: #f1f1f1; margin: 0;">${safeGigName}</h1>
        </td></tr>
        <tr><td style="padding-bottom: 6px; background-color: #0a0a0a;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 13px; color: #f1f1f1; margin: 0;">${formatted}</p>
        </td></tr>
        ${timeLine ? `<tr><td style="padding-bottom: 6px; background-color: #0a0a0a;"><p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 12px; color: #888888; margin: 0;">${timeLine}</p></td></tr>` : ''}
        <tr><td style="padding-bottom: 6px; background-color: #0a0a0a;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 13px; color: #f1f1f1; margin: 0;">${safeVenue} &mdash; ${safeCity}</p>
        </td></tr>
        ${ticketBlock}
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
    // 1. Create campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: audienceId },
      settings: {
        subject_line: `${gig_name} — ${formatted}`,
        from_name: 'ARAUJIA',
        reply_to: fromEmail,
      },
    })

    // 2. Set email content
    await mailchimp.campaigns.setContent(campaign.id, { html })

    // 3. Send
    await mailchimp.campaigns.send(campaign.id)

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Mailchimp campaign error:', err?.response?.body || err.message)
    return res.status(500).json({ error: 'Failed to send notification' })
  }
}
