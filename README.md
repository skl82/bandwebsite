# Araujia Band Website

The official site for Araujia, live at **[araujiaband.com](https://araujiaband.com)**. Fans can see upcoming shows, listen to releases, read news, and join the mailing list. The band manages all of it from a private admin page, with no code changes needed.

![The Araujia homepage: an upcoming show card with poster and ticket button, a mailing list signup, and a scrolling bar of streaming and social links](docs/screenshot.jpg)

## What it does

**For fans**
- **Shows:** upcoming and past gigs with posters, lineups, door and show times, ticket links, and "Add to Google Calendar".
- **Music:** embedded Spotify player and links to every streaming and social platform.
- **News:** posts with cover images and call-to-action links.
- **Mailing list:** a one-field signup that adds the visitor to the band's Mailchimp audience.

**For the band** (`/admin`, behind a login)
- Create, edit, hide, or delete shows and news posts, and upload posters and cover images straight to storage.
- Tick "notify mailing list" when publishing, and subscribers get a branded email announcing the new show or post.
- Two days before each show, a daily scheduled job emails a reminder automatically. A per-show flag ensures nobody gets the same reminder twice.

## How it's built

| Part | Tools |
|---|---|
| Frontend | React 19, React Router 7, Tailwind CSS 4, built with Vite 7 |
| Data and auth | [Supabase](https://supabase.com): Postgres, Auth, and Storage for posters and images |
| Email | Mailchimp Marketing API, with custom HTML email templates (previews in `email-templates/`) |
| Server code | Vercel Functions in `api/`, plus a Vercel Cron job for show reminders |
| Hosting | Vercel |

### Design notes

- **No custom backend for content.** The browser talks to Supabase directly. Access is enforced in the database with row-level security: the public can read only rows marked visible, and only a signed-in admin can write. Schema changes live in `supabase/migrations/`.
- **Secrets stay server-side.** The Mailchimp key and the Supabase service key are only used inside `api/` functions. The notify endpoints verify the admin's Supabase session, and the cron endpoint requires a shared secret.
- **Safe emails.** All user-entered text is HTML-escaped before it goes into an email, and links are restricted to `http`/`https`.

## Run it locally

```bash
npm install
cp .env.example .env    # add your Supabase project URL and anon key
npm run dev
```

The site and admin page run with just the two Supabase values. The email functions in `api/` also need `MAILCHIMP_API_KEY`, `MAILCHIMP_SERVER_PREFIX`, `MAILCHIMP_AUDIENCE_ID`, `SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET`, which are set in the Vercel project.

## Project layout

```
src/pages/           # Home, Shows, Music, Login, Admin
src/components/      # show cards and ticker, news panel, admin forms, signup, social links
api/                 # subscribe, notify (shows), notify-news, remind (cron)
supabase/migrations/ # database schema and access rules
email-templates/     # HTML previews of the announcement and reminder emails
```
