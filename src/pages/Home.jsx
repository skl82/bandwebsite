import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import HeroBanner from '../components/HeroBanner'
import SocialLinks from '../components/SocialLinks'
import SpotifyEmbed from '../components/SpotifyEmbed'
import TicketButton from '../components/TicketButton'

export default function Home() {
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

  return (
    <div className="pb-16">
      <HeroBanner show={nextShow} />

      <section className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="font-display text-4xl tracking-wide mb-6">FIND US</h2>
        <SocialLinks />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-display text-4xl tracking-wide mb-6">ABOUT</h2>
        <p className="text-text-muted leading-relaxed max-w-2xl">
          araujia is a band. This is placeholder bio text that should be replaced with the
          actual band biography. Write something compelling about the sound, the story,
          and what makes araujia worth seeing live.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="font-display text-4xl tracking-wide mb-6">LISTEN</h2>
        <SpotifyEmbed />
        {nextShow && (
          <div className="mt-8 flex items-center gap-4">
            <span className="text-text-muted">Catch this live &rarr;</span>
            <TicketButton href={nextShow.ticket_link} />
          </div>
        )}
      </section>
    </div>
  )
}
