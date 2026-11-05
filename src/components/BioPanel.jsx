import { useState } from 'react'

// Plain strings, or fragments where a paragraph needs inline markup (italic titles, source links)
const PARAGRAPHS = [
  <>ARAUJIA is a four-piece from Washington, DC that merges alternative metal and shoegaze: fuzzed-out, downtuned riffs under ethereal, often bilingual vocals. Their music moves between the surreal liminality of dreams and the heart-pounding danger of nightmares. For fans of Deftones and Trauma Ray, ARAUJIA writes genre-bending songs that explore the sublime yet frightening experience of an unconscious mind. Independent UK music blog <a href="https://mixitallup.com/music-reviews/discover-araujia-arrhythmia/" target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover transition-colors">Mix It All Up</a> described the song “arrhythmia” as heavy shoegaze with “quieter, more post-rock moments with delicate melodies in the middle.”</>,
  'Shaped by the DIY ethos of 1980s DC punk, ARAUJIA considers the local scene and community essential parts of its music. The band plays benefit bills alongside peers and, at a recent show supporting Ayuda (a DC nonprofit providing legal services to immigrants), helped raise more than $600 in a single night. In playing for organizations supporting immigrant rights, environmental issues, and humanitarian aid, the band orients its music toward community.',
  'Live, an ARAUJIA set swings from metal solos and outright shred to ambient passages and noise breaks within a single song. Since forming as a full band three years ago, ARAUJIA has become a staple of the local DC scene, working its way from basement shows to headlining slots across iconic DC venues such as DC9, The Pocket, and Songbyrd, and appearing on bills at Pie Shop, Jammin Java, The Renegade, and Transmission. Outside DC, the band has toured the east coast and performed at Manhattan’s Nightclub 101, The Lilypad in Cambridge, and DIY spaces including Baltimore’s Lwnsphere and Charlottesville’s Ginkgo Bookshop.',
  <>The name ARAUJIA (ar-RAW-uh-jee-uh) is rooted in founder, lead vocalist, and rhythm guitarist Andres Alfonso’s heritage. While researching his mother’s Salvadoran family tree, Alfonso came across <em>Araujia sericifera</em>, the “cruel moth vine,” named after a man who shared his family’s surname. The project began in 2021 as Alfonso’s bedroom recordings, including a run of demos, singles, and the EP <em>Fermenting Dread</em>, before growing into the current lineup of Alfonso, lead guitarist Sebastian Larsen, bassist Jonathan Briggs, and drummer David Yang.</>,
  <>The 2025 EP <em>desire machine</em> was the first material written as a band. The new single “meat soup” (October 2026) is the first look at what comes next: a full-length due by the end of the year that pushes heavier and more atmospheric at the same time, building on the band’s unique sound. It is the record ARAUJIA has been building toward since the first demo.</>,
]

export default function BioPanel({ mobileLimit = false }) {
  const [expanded, setExpanded] = useState(false)
  const visible = mobileLimit && !expanded ? PARAGRAPHS.slice(0, 1) : PARAGRAPHS

  return (
    <div className="space-y-4">
      <img
        src="/bio.webp"
        alt="ARAUJIA performing live. From left: David Yang (drums), Jonathan Briggs (bass), Sebastian Larsen (lead guitar), and Andres Alfonso (vocals, rhythm guitar)"
        width={1000}
        height={1000}
        loading="lazy"
        className="w-full h-auto border border-white/10"
      />
      {visible.map((text, i) => (
        <p key={i} className="text-sm lg:text-[0.95rem] text-text/85 leading-relaxed">
          {text}
        </p>
      ))}
      {mobileLimit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 font-mono text-sm text-text-muted hover:text-text border border-white/10 rounded-lg cursor-pointer transition-colors"
        >
          {expanded ? '[see less]' : '[read more]'}
        </button>
      )}
    </div>
  )
}
