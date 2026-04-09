import mailchimp from '@mailchimp/mailchimp_marketing'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
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

  const posterBlock = poster_url
    ? `<tr><td align="center" style="padding-bottom: 24px;">
        <img src="${poster_url}" alt="${gig_name}" width="400" style="max-width: 100%; height: auto; border-radius: 4px;" />
      </td></tr>`
    : ''

  const ticketBlock = ticket_link
    ? `<tr><td align="center" style="padding-top: 32px; padding-bottom: 40px;">
        <a href="${ticket_link}" style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #f1f1f1; border: 1px solid #e63946; padding: 12px 24px; text-decoration: none; display: inline-block;">[ Get Tickets ]</a>
      </td></tr>`
    : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono&display=swap');</style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; color: #f1f1f1;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr><td align="center" style="padding: 40px 20px;">
      <table role="presentation" width="500" cellpadding="0" cellspacing="0" style="max-width: 500px; width: 100%;">
        <tr><td align="center" style="padding-bottom: 40px;">
          <img src="https://araujiaband.com/araujialogo.png" alt="Araujia" width="200" style="max-width: 200px; height: auto;" />
        </td></tr>
        <tr><td style="border-top: 1px solid rgba(255,255,255,0.1); padding-bottom: 40px;"></td></tr>
        <tr><td style="padding-bottom: 24px;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 11px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin: 0;">// new show announced</p>
        </td></tr>
        ${posterBlock}
        <tr><td style="padding-bottom: 8px;">
          <h1 style="font-family: 'Bebas Neue', Arial, sans-serif; font-size: 36px; letter-spacing: 3px; color: #f1f1f1; margin: 0;">${gig_name}</h1>
        </td></tr>
        <tr><td style="padding-bottom: 6px;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 13px; color: #f1f1f1; margin: 0;">${formatted}</p>
        </td></tr>
        ${timeLine ? `<tr><td style="padding-bottom: 6px;"><p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 12px; color: #888888; margin: 0;">${timeLine}</p></td></tr>` : ''}
        <tr><td style="padding-bottom: 6px;">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 13px; color: #f1f1f1; margin: 0;">${venue} &mdash; ${city}</p>
        </td></tr>
        ${ticketBlock}
        <tr><td style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 32px; padding-bottom: 0; margin-top: 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding-top: 8px;"></td></tr></table>
        </td></tr>
        <tr><td align="center">
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 10px; color: #888888; letter-spacing: 1px; margin: 0 0 16px 0;">ARAUJIA &mdash; *|CURRENT_YEAR|*</p>
          <p style="font-family: 'Space Mono', 'Courier New', monospace; font-size: 10px; color: #888888; margin: 0;">
            <a href="*|UNSUB|*" style="color: #888888; text-decoration: underline;">unsubscribe</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    // 1. Create campaign
    const campaign = await mailchimp.campaigns.create({
      type: 'regular',
      recipients: { list_id: audienceId },
      settings: {
        subject_line: `${gig_name} — ${formatted}`,
        from_name: 'Araujia',
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
