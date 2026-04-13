import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function NewsPanel({ mobileLimit = false }) {
  const [articles, setArticles] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    supabase
      .from('news')
      .select('id, title, excerpt, body, image_url, link, date')
      .eq('visible', true)
      .order('date', { ascending: false })
      .then(({ data }) => setArticles(data || []))
  }, [])

  const visible = (mobileLimit && !showAll) ? articles.slice(0, 2) : articles

  return (
    <div className="space-y-6">
      {visible.map((article) => (
        <article
          key={article.id}
          className="border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition-colors"
        >
          {article.image_url && (
            <div className="aspect-[3/2] overflow-hidden">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}

          <div className="p-4 space-y-2">
            <span className="font-mono text-xs text-text-muted tracking-wider uppercase">
              {formatDate(article.date)}
            </span>
            <h3 className="font-display text-xl lg:text-2xl tracking-wide leading-tight">
              {article.title}
            </h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {expanded === article.id ? article.body : (article.excerpt || article.body)}
            </p>
            {article.excerpt && (
              <button
                onClick={() => setExpanded(expanded === article.id ? null : article.id)}
                className="font-mono text-xs text-accent hover:text-accent-hover cursor-pointer transition-colors"
              >
                {expanded === article.id ? '[collapse]' : '[read more]'}
              </button>
            )}
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono text-xs text-accent hover:text-accent-hover transition-colors"
              >
                [link]
              </a>
            )}
          </div>
        </article>
      ))}
      {mobileLimit && articles.length > 2 && (
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
