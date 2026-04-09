import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import ShowCard from '../components/ShowCard'

export default function Shows() {
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [showPast, setShowPast] = useState(false)

  useEffect(() => {
    supabase
      .from('shows')
      .select('*')
      .eq('visible', true)
      .order('date', { ascending: true })
      .then(({ data }) => {
        if (!data) return
        const today = new Date().toISOString().split('T')[0]
        setUpcoming(data.filter(s => s.date >= today))
        setPast(data.filter(s => s.date < today).reverse())
      })
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pb-24">
      <h1 className="font-display text-5xl tracking-wide mb-10">SHOWS</h1>

      {upcoming.length === 0 && (
        <p className="text-text-muted text-lg">No upcoming shows right now. Check back soon.</p>
      )}

      <div className="grid gap-6">
        {upcoming.map(show => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>

      {past.length > 0 && (
        <div className="mt-16">
          <button
            onClick={() => setShowPast(!showPast)}
            className="font-display text-2xl tracking-wide text-text-muted hover:text-text transition-colors"
          >
            PAST SHOWS {showPast ? '−' : '+'}
          </button>
          {showPast && (
            <div className="grid gap-6 mt-6 opacity-60">
              {past.map(show => (
                <ShowCard key={show.id} show={show} isPast />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
