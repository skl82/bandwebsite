# GEO: make the site readable by AI crawlers

## Problem (measured on araujiaband.com, 2026-11-05)

- AI crawlers (GPTBot, ClaudeBot, PerplexityBot) mostly don't run JavaScript. The raw HTML of the
  homepage contains only the boot loader, so the entire text they see is:
  `araujia $ ./araujia --boot --live ok ok ok ok ok ok [░░░░░░░░░░░░░░░░░░] 0%`
- `/robots.txt` and `/sitemap.xml` don't exist; the SPA catch-all rewrite serves `index.html` for them.
- No structured data, no canonical URL, no `og:image`, and a thin meta description.

## Plan

- [x] **1. One source of truth for band facts** — new `src/content/band.js` (plain JS, no JSX):
      bio paragraphs as text segments (plain / italic / link), members + roles, genres, hometown,
      founding year, releases, and social URLs. `BioPanel` and `SocialLinks` read from it, so the
      on-page bio and the crawler copy can never drift apart.
- [x] **2. Build-time injection (small Vite plugin, `vite.config.js`)** via `transformIndexHtml`,
      so it runs in both dev and build:
      - Static HTML inside `<div id="root">`: `<h1>ARAUJIA</h1>`, one-line summary, the full bio
        (same text, italics and review link included), members, and listen/follow links.
        React replaces it on mount; it's the same content people see, so it's not cloaking.
      - A `MusicGroup` JSON-LD block in `<head>`: name, url, description, genre, foundingDate,
        foundingLocation (Washington, DC), members with roles, EPs (`desire machine`,
        `Fermenting Dread`), image, and `sameAs` → Spotify, Apple Music, Bandcamp, Instagram,
        YouTube, TikTok.
- [x] **3. Head meta** in `index.html`: descriptive `<title>` and meta description, canonical
      `https://araujiaband.com/`, `og:url`, `og:image` (+ width/height), `twitter:image`.
      og:image: a 1200×630 JPG cropped from the live band photo (`public/og.jpg`).
- [x] **4. `public/robots.txt`**: allow everything (AI crawlers named explicitly), disallow
      `/admin` and `/login`, point to the sitemap. **`public/sitemap.xml`**: the homepage.
      Vercel serves real files before the rewrite, so these fix the HTML-for-robots issue.
- [x] ~~**5. No flash of the static copy for visitors.**~~ Replaced: nothing visitors see may change, so
      the crawler copy is `display:none` (stylesheet rule) instead of altering the loader.
      Original idea: On repeat visits the loader is removed
      instantly, which would show the plain-HTML bio for a split second before React mounts.
      Instead keep the loader's black backdrop (without the boot animation) until React has
      mounted, then fade it out as on first visits. Side benefit: if the JS ever fails to load,
      the loader's existing 8s cap reveals the static bio instead of a blank page.

## Verify

- `curl` the dev server and `vite build` output: the raw HTML contains the full bio, members and
  links; the JSON-LD parses and has the expected fields.
- `/robots.txt` and `/sitemap.xml` come back as text/XML from `vite preview`.
- Desktop and mobile look unchanged; no flash of static text on first or repeat visits;
  no console errors; lint passes for touched files (excluding the 2 errors already on main).

## Not included (possible follow-ups)

- `Event` structured data for upcoming shows: shows come from Supabase at runtime, so they'd need
  a build hook or edge function to reach non-JS crawlers.
- `llms.txt`: an emerging convention with little evidence crawlers use it yet.
- Off-site consistency: the same bio on Spotify, Apple Music and Bandcamp matters as much as
  anything on this site.

## Review (2026-11-05)

Changed from the plan at the user's request: nothing visible to visitors changes, and the crawler
copy is never shown. `llms.txt` added. Tab title kept as `araujia` (user preference); meta description reworded by the user;
og:title / og:description unchanged.

- Raw HTML a non-JS crawler sees: 9 words of loader text → 429 words (bio, members, links).
- JSON-LD parses: MusicGroup, 4 members with roles, 2 EPs, 6 `sameAs` profiles.
- With scripts stripped, `.seo-copy` computes to `display:none`, height 0. After React mounts,
  it's gone from the DOM (React clears #root), so JS-rendering crawlers index only the visible bio.
- Bio panel HTML and all 6 social links (href, label, color, icon) are byte-identical before/after
  the move to `src/content/band.js`.
- Dev server: robots.txt (text/plain), sitemap.xml (text/xml), llms.txt, og.jpg all 200.
  `vite build` emits all four plus the injected index.html. No console errors; lint clean on
  touched files (one pre-existing warning in SocialLinks).
