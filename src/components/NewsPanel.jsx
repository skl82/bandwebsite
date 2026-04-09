import { useState } from 'react'

const MOCK_NEWS = [
  {
    id: 1,
    title: 'New Single Dropping This Friday',
    date: '2026-04-04',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=400&fit=crop',
    excerpt: 'We\'ve been cooking something up in the studio and it\'s finally ready. Pre-save link goes live Wednesday.',
    body: 'After months locked in the studio, we\'re beyond excited to announce our next single. This one pushes into territory we haven\'t explored before — heavier, weirder, louder. Pre-save links drop Wednesday so keep your eyes on our socials. First 100 pre-saves get early access to the visualizer.',
  },
  {
    id: 2,
    title: 'Summer Tour Dates Announced',
    date: '2026-03-28',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop',
    excerpt: 'Hitting the road this June through August. East coast, west coast, and a few surprises in between.',
    body: 'We\'re thrilled to announce our biggest tour yet. Kicking off June 12 in Brooklyn and wrapping August 15 in Portland. Tickets go on sale next Friday at 10am local time. VIP packages include early entry, a signed poster, and a meet & greet. Check the Shows tab for the full list of dates.',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Album Art Process',
    date: '2026-03-15',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop',
    excerpt: 'A look at how we worked with photographer Maria Kovacs to create the visual world for the new record.',
    body: 'The visual identity for this record was just as important as the sound. We connected with Maria Kovacs back in January and spent two weeks shooting in abandoned industrial spaces across the midwest. Her ability to find beauty in decay aligned perfectly with the themes of the album. We\'ll be releasing a full behind-the-scenes mini-doc next month.',
  },
  {
    id: 4,
    title: 'Collaboration with Void Signal',
    date: '2026-03-01',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
    excerpt: 'Two tracks. One weekend. Zero sleep. Our collab with Void Signal is out now.',
    body: 'What started as a late-night jam session turned into two of our favorite tracks we\'ve ever made. Void Signal brought a completely different energy to our process and pushed us into some uncomfortable (in a good way) sonic spaces. Both tracks are streaming everywhere now.',
  },
]

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NewsPanel({ mobileLimit = false }) {
  const [expanded, setExpanded] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const articles = (mobileLimit && !showAll) ? MOCK_NEWS.slice(0, 2) : MOCK_NEWS

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <article
          key={article.id}
          className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
        >
          <div className="aspect-[3/2] overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <div className="p-4 space-y-2">
            <span className="font-mono text-xs text-text-muted tracking-wider uppercase">
              {formatDate(article.date)}
            </span>
            <h3 className="font-display text-xl lg:text-2xl tracking-wide leading-tight">
              {article.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {expanded === article.id ? article.body : article.excerpt}
            </p>
            <button
              onClick={() => setExpanded(expanded === article.id ? null : article.id)}
              className="font-mono text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors"
            >
              {expanded === article.id ? '[collapse]' : '[read more]'}
            </button>
          </div>
        </article>
      ))}
      {mobileLimit && MOCK_NEWS.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 font-mono text-sm text-text-muted hover:text-text border border-white/10 rounded-lg cursor-pointer transition-colors"
        >
          {showAll ? '[see less]' : '[see more]'}
        </button>
      )}
    </div>
  )
}
