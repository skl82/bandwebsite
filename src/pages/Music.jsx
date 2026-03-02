import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import SpotifyEmbed from '../components/SpotifyEmbed'
import TicketButton from '../components/TicketButton'

export default function Music() {
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
  }, [])

  const formatted = nextShow
    ? new Date(nextShow.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <h1 className="font-display text-5xl tracking-wide mb-10">MUSIC</h1>

      <div className="space-y-12">
        <div>
          <h2 className="font-display text-2xl tracking-wide mb-4">LATEST RELEASE</h2>
          <SpotifyEmbed />
        </div>

        {nextShow && (
          <div className="bg-surface rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-text-muted text-sm uppercase tracking-wide">Catch this live</p>
              <p className="font-display text-xl tracking-wide mt-1">
                Next show {formatted} &middot; {nextShow.city}
              </p>
            </div>
            <TicketButton href={nextShow.ticket_link} />
          </div>
        )}
      </div>
    </div>
  )
}
