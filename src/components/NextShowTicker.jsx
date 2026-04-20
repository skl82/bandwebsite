import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { supabase } from '../supabase'

const SPEED = 60

export default function NextShowTicker() {
  const [text, setText] = useState('ARAUJIA')
  const [copies, setCopies] = useState(4)
  const containerRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(null)
  const lastRef = useRef(null)

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
        if (data && data.length > 0) {
          const show = data[0]
          const formatted = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
          setText(`COMING UP: ARAUJIA AT ${show.venue.toUpperCase()} ON ${formatted.toUpperCase()}`)
        }
      })
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    function recompute() {
      const containerWidth = container.offsetWidth
      if (!containerWidth) return
      const singleWidth = track.scrollWidth / copies
      if (!singleWidth) return
      const needed = Math.max(4, Math.ceil((containerWidth * 2) / singleWidth) + 1)
      if (needed !== copies) setCopies(needed)
    }

    recompute()
    const ro = new ResizeObserver(recompute)
    ro.observe(container)
    return () => ro.disconnect()
  }, [text, copies])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !text) return

    function tick(now) {
      if (lastRef.current === null) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now

      offsetRef.current -= SPEED * dt

      const copyWidth = track.scrollWidth / copies
      if (copyWidth && Math.abs(offsetRef.current) >= copyWidth) {
        offsetRef.current += copyWidth
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      lastRef.current = null
    }
  }, [text, copies])

  const items = Array.from({ length: copies }, () => text)

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-accent carousel-glitch-wrap-offset">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {items.map((t, i) => (
          <span key={i} className="inline-flex items-center font-mono text-sm tracking-widest uppercase text-white py-2">
            <span className="px-8">{t}</span>
            <span className="text-white/40">//</span>
          </span>
        ))}
      </div>
    </div>
  )
}
