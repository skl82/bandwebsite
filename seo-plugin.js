// Build-time SEO/GEO plugin. AI crawlers mostly don't run JavaScript, so the raw index.html
// they fetch would otherwise contain only the boot loader. From src/content/band.js this adds:
//   - a crawler-readable copy of the bio, members and links inside #root. It's display:none, so
//     visitors never see it, and React replaces #root's contents on mount anyway. It mirrors the
//     visible Bio panel exactly, which is what keeps it legitimate rather than hidden-text spam.
//   - MusicGroup JSON-LD in <head>
//   - /llms.txt (served in dev, emitted as a file in the build)
import { SITE_URL, BAND, LINKS, BIO } from './src/content/band.js'

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const absolute = (path) => new URL(path, SITE_URL).href
const profileUrl = (href) => href.split('?')[0] // drop ?hl=en etc. for canonical profile URLs

function segmentHtml(part) {
  if (typeof part === 'string') return escapeHtml(part)
  if (part.em) return `<em>${escapeHtml(part.em)}</em>`
  return `<a href="${escapeHtml(part.href)}">${escapeHtml(part.text)}</a>`
}

function segmentMarkdown(part) {
  if (typeof part === 'string') return part
  if (part.em) return `*${part.em}*`
  return `[${part.text}](${part.href})`
}

const memberLine = (m) => `${m.name}: ${m.roles.join(', ').toLowerCase()}`

function crawlerHtml() {
  const bio = BIO.map((parts) => `<p>${parts.map(segmentHtml).join('')}</p>`).join('\n')
  const members = BAND.members.map((m) => `<li>${escapeHtml(memberLine(m))}</li>`).join('')
  const links = LINKS.map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.name)}</a></li>`).join('')
  return `<div class="seo-copy">
<h1>${escapeHtml(BAND.name)}</h1>
<p>${escapeHtml(BAND.summary)}</p>
<h2>Bio</h2>
${bio}
<h2>Members</h2>
<ul>${members}</ul>
<h2>Listen and follow</h2>
<ul>${links}</ul>
</div>`
}

function jsonLd() {
  const place = {
    '@type': 'Place',
    name: BAND.location.label,
    address: {
      '@type': 'PostalAddress',
      addressLocality: BAND.location.city,
      addressRegion: BAND.location.region,
      addressCountry: BAND.location.country,
    },
  }
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${SITE_URL}/#band`,
    name: BAND.name,
    url: `${SITE_URL}/`,
    description: BAND.summary,
    genre: BAND.genres,
    foundingDate: String(BAND.foundingYear),
    foundingLocation: place,
    location: place,
    image: absolute(BAND.image),
    logo: absolute(BAND.logo),
    member: BAND.members.map((m) => ({
      '@type': 'OrganizationRole',
      member: { '@type': 'Person', name: m.name },
      roleName: m.roles,
    })),
    album: BAND.releases.map((r) => ({
      '@type': 'MusicAlbum',
      name: r.name,
      albumReleaseType: r.type === 'EP' ? 'https://schema.org/EPRelease' : 'https://schema.org/AlbumRelease',
      byArtist: { '@id': `${SITE_URL}/#band` },
      ...(r.year && { datePublished: String(r.year) }),
    })),
    sameAs: LINKS.map((l) => profileUrl(l.href)),
  }
  // Escape "<" so no string in the data can close the <script> tag early
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

function llmsTxt() {
  const bio = BIO.map((parts) => parts.map(segmentMarkdown).join('')).join('\n\n')
  const members = BAND.members.map((m) => `- ${memberLine(m)}`).join('\n')
  const releases = BAND.releases.map((r) => `- *${r.name}* (${r.type}${r.year ? `, ${r.year}` : ''})`).join('\n')
  const links = LINKS.map((l) => `- [${l.name}](${profileUrl(l.href)})`).join('\n')
  return `# ${BAND.name}

> ${BAND.summary}

${bio}

## Members

${members}

## Releases

${releases}

## Links

- [Official site](${SITE_URL}/): upcoming shows, music, news, and the mailing list
${links}
`
}

// Escaping keeps link text and quotes from breaking the HTML, but can't stop a dangerous scheme
// like `javascript:`. Fail the build if any link in band.js isn't a plain https:// URL.
function assertHttpsLinks() {
  const hrefs = [...LINKS.map((l) => l.href), ...BIO.flat().filter((p) => p.href).map((p) => p.href)]
  const bad = hrefs.filter((href) => !href.startsWith('https://'))
  if (bad.length) throw new Error(`band.js links must start with https:// — got: ${bad.join(', ')}`)
}

export default function seoPlugin() {
  assertHttpsLinks()
  return {
    name: 'araujia-seo',
    transformIndexHtml(html) {
      return {
        html: html.replace('<div id="root"></div>', `<div id="root">${crawlerHtml()}</div>`),
        tags: [
          { tag: 'style', children: '.seo-copy{display:none}', injectTo: 'head' },
          { tag: 'script', attrs: { type: 'application/ld+json' }, children: jsonLd(), injectTo: 'head' },
        ],
      }
    },
    configureServer(server) {
      server.middlewares.use('/llms.txt', (_req, res) => {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(llmsTxt())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt() })
    },
  }
}
