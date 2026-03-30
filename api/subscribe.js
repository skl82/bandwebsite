import mailchimp from '@mailchimp/mailchimp_marketing'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body || {}

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER_PREFIX,
  })

  try {
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
    })
    return res.status(200).json({ success: true })
  } catch (err) {
    if (err?.response?.body?.title === 'Member Exists') {
      return res.status(200).json({ success: true, alreadySubscribed: true })
    }
    console.error('Mailchimp error:', err?.response?.body || err.message)
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
