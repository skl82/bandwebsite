import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { safeHref } from '../lib/url'

export default function Links() {
  const [nextShow, setNextShow] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('shows')
      .select('*')
      .eq('visible', true)
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.length) setNextShow(data[0])
      })
      .catch(() => {})
  }, [])

  const links = [
    ...(nextShow
      ? [{
          label: `Tickets — ${new Date(nextShow.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          href: safeHref(nextShow.ticket_link),
          highlight: true,
        }]
      : []),
    { label: 'Spotify', href: '#' },
    { label: 'Apple Music', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'All Shows', href: '/shows', internal: true },
  ]

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-6xl tracking-wider mb-2">ARAUJIA</h1>
        <p className="text-text-muted text-sm mb-10 tracking-wide">music for the restless</p>

        <div className="flex flex-col gap-3">
          {links.map(({ label, href, highlight, internal }) => {
            const cls = `block w-full py-4 px-6 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
              highlight
                ? 'bg-accent text-white hover:bg-accent-hover scale-105'
                : 'bg-surface text-text hover:bg-surface-light'
            }`

            if (internal) {
              return (
                <a key={label} href={href} className={cls}>
                  {label}
                </a>
              )
            }

            return (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {label}
              </a>
            )
          })}
        </div>

        <p className="text-text-muted text-xs mt-10">&copy; {new Date().getFullYear()} araujia</p>
      </div>
    </div>
  )
}
