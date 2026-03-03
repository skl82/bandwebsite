import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TicketButton from './TicketButton'

export default function ShowsPanel() {
  const [shows, setShows] = useState([])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('shows')
      .select('*')
      .eq('visible', true)
      .gte('date', today)
      .order('date', { ascending: true })
      .then(({ data }) => setShows(data || []))
  }, [])

  if (shows.length === 0) {
    return <p className="font-mono text-text-muted text-sm">// no upcoming shows</p>
  }

  return (
    <div className="space-y-5">
      {shows.map(show => {
        const formatted = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
        const time = show.time
          ? new Date(`2000-01-01T${show.time}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })
          : null
        const doorsTime = show.doors_time
          ? new Date(`2000-01-01T${show.doors_time}`).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })
          : null

        // Build Google Calendar URL
        const dateClean = show.date.replace(/-/g, '')
        const startDate = show.time
          ? `${dateClean}T${show.time.replace(/:/g, '')}00`
          : dateClean
        const endDate = show.time
          ? `${dateClean}T${String(Number(show.time.split(':')[0]) + 2).padStart(2, '0')}${show.time.split(':')[1]}00`
          : dateClean
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(show.gig_name)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(`${show.venue}, ${show.city}`)}&details=${encodeURIComponent(`Araujia live at ${show.venue}${show.ticket_link ? `\nTickets: ${show.ticket_link}` : ''}`)}`

        return (
          <div key={show.id} className="flex items-stretch gap-4 border-b border-white/10 pb-5 last:border-0">
            {show.poster_url && (
              <img
                src={show.poster_url}
                alt={show.gig_name}
                className="w-24 lg:w-42 shrink-0 object-contain self-center"
              />
            )}
            <div className="flex flex-col justify-between min-w-0 py-1">
              <h3 className="font-display text-xl lg:text-2xl tracking-wide">{show.gig_name}</h3>
              <p className="font-mono text-text-muted text-xs mt-2 tracking-wide">
                {formatted}
                {doorsTime && time
                  ? ` // Doors: ${doorsTime} // Show: ${time}`
                  : time ? ` // ${time}` : ''}
              </p>
              <p className="font-mono text-text-muted text-xs tracking-wide">
                {show.venue} &mdash; {show.city}
              </p>
              {show.lineup?.length > 0 && (
                <p className="font-mono text-text-muted text-xs tracking-wide">
                  w/ {show.lineup.join(', ')}
                </p>
              )}
              {show.ticket_link && (
                <div className="mt-3">
                  <TicketButton href={show.ticket_link} size="lg" />
                </div>
              )}
              <a
                href={gcalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-text-muted hover:text-text underline underline-offset-4 transition-colors mt-2"
              >
                [ Add to Google Calendar ]
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
