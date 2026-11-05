// Single source of truth for band facts. Read by the site (BioPanel, SocialLinks) and by the
// build-time SEO plugin (seo-plugin.js: crawler-readable HTML, JSON-LD, llms.txt), so what
// visitors see and what crawlers see can't drift apart. Plain JS only: no JSX, no browser APIs.

export const SITE_URL = 'https://araujiaband.com'

export const BAND = {
  name: 'ARAUJIA',
  summary: 'ARAUJIA is a four-piece band from Washington, DC that merges alternative metal and shoegaze: fuzzed-out, downtuned riffs under ethereal, often bilingual vocals.',
  genres: ['Alternative metal', 'Shoegaze'],
  location: { city: 'Washington', region: 'DC', country: 'US', label: 'Washington, DC' },
  foundingYear: 2021,
  members: [
    { name: 'Andres Alfonso', roles: ['Founder', 'Lead vocals', 'Rhythm guitar'] },
    { name: 'Sebastian Larsen', roles: ['Lead guitar'] },
    { name: 'Jonathan Briggs', roles: ['Bass'] },
    { name: 'David Yang', roles: ['Drums'] },
  ],
  releases: [
    { name: 'Fermenting Dread', type: 'EP' },
    { name: 'desire machine', type: 'EP', year: 2025 },
  ],
  image: '/bio.webp',
  logo: '/araujialogo.png',
}

// Profile links, in the order the social bar shows them.
export const LINKS = [
  { name: 'Spotify', href: 'https://open.spotify.com/artist/7jjxND0ZjxZsOEEX6pWr7A' },
  { name: 'Apple Music', href: 'https://music.apple.com/us/artist/araujia/1553193509' },
  { name: 'Bandcamp', href: 'https://araujia.bandcamp.com/music' },
  { name: 'Instagram', href: 'https://www.instagram.com/_araujia_/?hl=en' },
  { name: 'YouTube', href: 'https://www.youtube.com/@ARAUJIA/featured' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@araujiaofficial?lang=en' },
]

// Bio paragraphs. Each is a list of segments: a plain string, { em: 'italic text' },
// or { text: 'link text', href: 'https://…' }.
export const BIO = [
  [
    'ARAUJIA is a four-piece from Washington, DC that merges alternative metal and shoegaze: fuzzed-out, downtuned riffs under ethereal, often bilingual vocals. Their music moves between the surreal liminality of dreams and the heart-pounding danger of nightmares. For fans of Deftones and Trauma Ray, ARAUJIA writes genre-bending songs that explore the sublime yet frightening experience of an unconscious mind. Independent UK music blog ',
    { text: 'Mix It All Up', href: 'https://mixitallup.com/music-reviews/discover-araujia-arrhythmia/' },
    ' described the song “arrhythmia” as heavy shoegaze with “quieter, more post-rock moments with delicate melodies in the middle.”',
  ],
  [
    'Shaped by the DIY ethos of 1980s DC punk, ARAUJIA considers the local scene and community essential parts of its music. The band plays benefit bills alongside peers and, at a recent show supporting Ayuda (a DC nonprofit providing legal services to immigrants), helped raise more than $600 in a single night. In playing for organizations supporting immigrant rights, environmental issues, and humanitarian aid, the band orients its music toward community.',
  ],
  [
    'Live, an ARAUJIA set swings from metal solos and outright shred to ambient passages and noise breaks within a single song. Since forming as a full band three years ago, ARAUJIA has become a staple of the local DC scene, working its way from basement shows to headlining slots across iconic DC venues such as DC9, The Pocket, and Songbyrd, and appearing on bills at Pie Shop, Jammin Java, The Renegade, and Transmission. Outside DC, the band has toured the east coast and performed at Manhattan’s Nightclub 101, The Lilypad in Cambridge, and DIY spaces including Baltimore’s Lwnsphere and Charlottesville’s Ginkgo Bookshop.',
  ],
  [
    'The name ARAUJIA (ar-RAW-uh-jee-uh) is rooted in founder, lead vocalist, and rhythm guitarist Andres Alfonso’s heritage. While researching his mother’s Salvadoran family tree, Alfonso came across ',
    { em: 'Araujia sericifera' },
    ', the “cruel moth vine,” named after a man who shared his family’s surname. The project began in 2021 as Alfonso’s bedroom recordings, including a run of demos, singles, and the EP ',
    { em: 'Fermenting Dread' },
    ', before growing into the current lineup of Alfonso, lead guitarist Sebastian Larsen, bassist Jonathan Briggs, and drummer David Yang. The 2025 EP ',
    { em: 'desire machine' },
    ' was the first material written as a band, and marked the start of a new chapter that continues to unfold.',
  ],
]
