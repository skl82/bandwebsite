import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TicketButton from './TicketButton'

export default function NextShowBanner() {
  const [show, setShow] = useState(null)

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
        if (data?.length) setShow(data[0])
      })
      .catch(() => {})
  }, [])

  if (!show) return null

  const formatted = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-accent text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-display text-lg tracking-wide whitespace-nowrap">NEXT SHOW</span>
          <span className="text-sm truncate">
            {formatted} &middot; {show.venue}, {show.city}
          </span>
        </div>
        <TicketButton href={show.ticket_link} small />
      </div>
    </div>
  )
}
