import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import HeroBanner from '../components/HeroBanner'
import SocialLinks from '../components/SocialLinks'

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
    <div className="h-screen overflow-hidden relative">
      <HeroBanner show={nextShow} />
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6">
        <SocialLinks />
      </div>
    </div>
  )
}
