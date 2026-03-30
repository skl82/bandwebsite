// notify-new-gig: Supabase Edge Function
//
// PURPOSE:
//   Send a Mailchimp campaign to all subscribers when a new show is added.
//
// TRIGGER:
//   Supabase database webhook on INSERT to the `shows` table.
//   Configure in: Supabase Dashboard → Database → Webhooks
//     - Table: shows
//     - Events: INSERT
//     - Type: Edge Function
//     - Function: notify-new-gig
//
// REQUIRED SECRETS (set via `supabase secrets set`):
//   - MAILCHIMP_API_KEY
//   - MAILCHIMP_AUDIENCE_ID
//   - MAILCHIMP_SERVER_PREFIX
//
// WEBHOOK PAYLOAD:
//   The webhook sends { type, table, record, schema, old_record }
//   record contains: gig_name, date, time, venue, city, ticket_link, etc.

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const show = payload.record

    // TODO: Implement Mailchimp campaign send
    // 1. Create a campaign using Mailchimp Marketing API:
    //    POST https://{server}.api.mailchimp.com/3.0/campaigns
    //    { type: 'regular', recipients: { list_id: AUDIENCE_ID }, settings: { subject_line, from_name, reply_to } }
    //
    // 2. Set campaign content with show details (gig_name, date, venue, city, ticket_link):
    //    PUT https://{server}.api.mailchimp.com/3.0/campaigns/{campaign_id}/content
    //
    // 3. Send the campaign:
    //    POST https://{server}.api.mailchimp.com/3.0/campaigns/{campaign_id}/actions/send

    console.log('New show added:', show?.gig_name, 'at', show?.venue)

    return new Response(JSON.stringify({ message: 'Scaffold only — campaign send not yet implemented' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
