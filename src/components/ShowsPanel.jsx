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
    return <p className="text-text-muted text-sm">No upcoming shows. Check back soon.</p>
  }

  return (
    <div className="space-y-4">
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

        return (
          <div key={show.id} className="border-b border-white/10 pb-4 last:border-0">
            {show.poster_url && (
              <img
                src={show.poster_url}
                alt={show.gig_name}
                className="w-full rounded-md mb-3 object-cover max-h-40"
              />
            )}
            <h3 className="font-display text-xl tracking-wide">{show.gig_name}</h3>
            <p className="text-text-muted text-sm mt-1">
              {formatted}{time && ` · ${time}`}
            </p>
            <p className="text-text-muted text-sm">
              {show.venue}, {show.city}
            </p>
            {show.ticket_link && (
              <div className="mt-3">
                <TicketButton href={show.ticket_link} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
