import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import ShowsPanel from '../components/ShowsPanel'
import SpotifyEmbed from '../components/SpotifyEmbed'
import SocialLinks from '../components/SocialLinks'
import NextShowTicker from '../components/NextShowTicker'

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null)
  const [logoUnlocked, setLogoUnlocked] = useState(false)
  const hasAnimated = useRef(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [grabbed, setGrabbed] = useState(false)
  const [lidOpen, setLidOpen] = useState(false)
  const draggingRef = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const logoRef = useRef(null)
  const bucketRef = useRef(null)
  const navigate = useNavigate()

  function toggle(panel) {
    setOpenPanel(prev => (prev === panel ? null : panel))
  }

  function resetLogo() {
    setLogoUnlocked(false)
    draggingRef.current = false
    setDragOffset({ x: 0, y: 0 })
    setLidOpen(false)
  }

  const offsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape' && logoUnlocked) resetLogo()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [logoUnlocked])

  const lastClickTime = useRef(0)

  function onLogoPointerDown(e) {
    if (window.innerWidth < 1024) return
    const now = Date.now()
    const isDoubleClick = now - lastClickTime.current < 400
    lastClickTime.current = now

    if (!isDoubleClick) return

    // Double-click-and-hold: unlock + start dragging immediately
    e.preventDefault()
    hasAnimated.current = true
    setLogoUnlocked(true)
    draggingRef.current = true
    setGrabbed(true)
    offsetRef.current = { x: 0, y: 0 }
    dragStart.current = { x: e.clientX, y: e.clientY }

    function onMove(ev) {
      if (!draggingRef.current) return
      const nx = ev.clientX - dragStart.current.x
      const ny = ev.clientY - dragStart.current.y
      offsetRef.current = { x: nx, y: ny }
      setDragOffset({ x: nx, y: ny })
      // Proximity check for lid
      if (bucketRef.current) {
        const rect = bucketRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy)
        setLidOpen(dist < 150)
      }
    }

    function onUp(ev) {
      draggingRef.current = false
      setGrabbed(false)
      setLidOpen(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      if (bucketRef.current) {
        const rect = bucketRef.current.getBoundingClientRect()
        if (
          ev.clientX >= rect.left && ev.clientX <= rect.right &&
          ev.clientY >= rect.top && ev.clientY <= rect.bottom
        ) {
          navigate('/login')
          return
        }
      }
      resetLogo()
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  // Shift the main content when music panel opens (desktop only)
  const shift = openPanel === 'music' ? 'lg:translate-x-[33.333%]' : 'translate-x-0'

  return (
    <div className="h-screen overflow-y-auto lg:overflow-hidden relative">
      {/* Music panel — fixed left, always rendered */}
      <div className={`fixed top-0 left-0 h-full w-full lg:w-1/3 z-40 bg-bg transition-transform duration-300 ease-in-out ${
        openPanel === 'music' ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto px-4 py-4 lg:px-6 lg:py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xl tracking-widest uppercase">// Music</h2>
            <button
              onClick={() => setOpenPanel(null)}
              className="font-mono text-text-muted hover:text-text text-sm leading-none cursor-pointer"
            >
              [close]
            </button>
          </div>
          <SpotifyEmbed height={352} />
        </div>
      </div>

      {/* Desktop carousels — fixed, above shows panel, shift with music */}
      <div className={`hidden lg:block fixed top-0 left-0 right-0 z-50 fade-in-flat transition-transform duration-300 ease-in-out ${openPanel === 'music' ? 'translate-x-[33.333%]' : 'translate-x-0'}`}>
        <NextShowTicker />
      </div>
      <div className={`hidden lg:block fixed bottom-0 left-0 right-0 z-50 fade-in-flat transition-transform duration-300 ease-in-out ${openPanel === 'music' ? 'translate-x-[33.333%]' : 'translate-x-0'}`}>
        <SocialLinks />
      </div>

      {/* Main content — shifts when music opens (desktop only) */}
      <div className={`w-full relative transition-transform duration-300 ease-in-out ${shift}`}>
        {/* Hero — full viewport */}
        <div className="h-[75vh] lg:h-screen relative">
          <HeroBanner />

          {/* Top bars — mobile only: ticker + social links flush */}
          <div className="lg:hidden absolute top-0 left-0 right-0 z-20 fade-in-flat">
            <NextShowTicker />
            <SocialLinks reverseDirection hideLabel />
          </div>

          {/* Ghost outline — stays in original position when logo is unlocked */}
          {logoUnlocked && (
            <div className="absolute top-24 lg:top-12 left-4 z-40 pointer-events-none">
              <img src="/araujialogo.png" alt="" className="h-16 lg:h-[8.4rem] opacity-30 border border-dashed border-white/40" />
            </div>
          )}

          {/* Logo — draggable when unlocked */}
          <div
            ref={logoRef}
            onPointerDown={onLogoPointerDown}
            className={`absolute top-24 lg:top-12 left-4 z-[51] select-none ${
              logoUnlocked ? 'cursor-grab active:cursor-grabbing' : (hasAnimated.current ? '' : 'fade-in fade-in-delay-2')
            }`}
            style={logoUnlocked ? { transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${grabbed ? 0.5 : 1})`, transition: grabbed ? 'scale 0.2s ease' : 'transform 0.3s ease, scale 0.2s ease', touchAction: 'none' } : undefined}
          >
            <img
              src="/araujialogo.png"
              alt="ARAUJIA"
              className={`h-[6.9rem] lg:h-[8.4rem] transition-shadow ${
                logoUnlocked ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse' : ''
              }`}
              draggable={false}
            />
          </div>

          {/* Drop zone bucket with split lid */}
          {logoUnlocked && (
            <div
              ref={bucketRef}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] fade-in pointer-events-none"
            >
              {/* Split lid — two flaps that swing up and outward in 2D */}
              <div className="flex">
                {/* Left flap — hinges at bottom-right corner, rotates up-left */}
                <div
                  className="w-1/2 h-4 border-2 border-dashed border-white/50 rounded-tl-lg bg-white/10 transition-transform duration-300 ease-in-out"
                  style={{
                    transformOrigin: 'bottom left',
                    transform: lidOpen ? 'rotate(-60deg)' : 'rotate(0deg)',
                  }}
                />
                {/* Right flap — hinges at bottom-right corner, rotates up-right */}
                <div
                  className="w-1/2 h-4 border-2 border-l-0 border-dashed border-white/50 rounded-tr-lg bg-white/10 transition-transform duration-300 ease-in-out"
                  style={{
                    transformOrigin: 'bottom right',
                    transform: lidOpen ? 'rotate(60deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
              {/* Bucket body */}
              <div className={`border-2 border-t-0 border-dashed border-white/50 rounded-b-lg px-6 py-4 font-mono text-sm transition-colors duration-300 ${lidOpen ? 'text-red-500' : 'text-white/60'}`}>
                [admin login]
              </div>
            </div>
          )}

          {/* Side tab: MUSIC — desktop vertical tab */}
          <button
            onClick={() => toggle('music')}
            className="hidden lg:block absolute left-0 -translate-y-1/2 z-50 bg-bg pl-0 pr-5 py-5 font-mono tracking-tight writing-vertical cursor-pointer hover:bg-surface transition-colors leading-none fade-in fade-in-delay-3"
            style={{ fontSize: 'min(7.2rem, 9.6vh)', top: 'calc(50% + 5.7rem)' }}
          >
            {'\u00A0'}MUSIC{'\u00A0'}
          </button>

          {/* Social links — desktop: bottom */}
        </div>

        {/* Shows — overlapping tile on mobile, fixed panel on desktop */}
        <div className={`
          relative -mt-[6vh] mx-4 rounded-lg bg-bg/95 backdrop-blur-sm border border-white/10 p-4 z-10
          lg:fixed lg:top-14 lg:bottom-14 lg:right-4 lg:h-auto lg:w-1/3 lg:z-40 lg:bg-bg lg:backdrop-blur-none lg:border-0 lg:rounded-none lg:m-0 lg:p-0
          lg:transition-transform lg:duration-300 lg:ease-in-out
          fade-in fade-in-delay-3
          ${openPanel === 'music' ? 'lg:translate-x-full' : 'lg:translate-x-0'}
        `}>
          <div className="lg:relative lg:h-full">
            <div className="lg:h-full lg:overflow-y-auto lg:px-6 lg:pt-4 lg:pb-12">
              <h2 className="font-mono text-xl tracking-widest uppercase mb-6">// Shows</h2>
              <ShowsPanel />
            </div>
            <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Music tile — mobile only, below shows */}
        <div className="lg:hidden relative mx-4 mt-6 rounded-lg bg-bg/95 backdrop-blur-sm border border-white/10 p-4 z-10 fade-in fade-in-delay-4">
          <h2 className="font-mono text-xl tracking-widest uppercase mb-4">// Music</h2>
          <SpotifyEmbed height={352} />
        </div>

        {/* Black backdrop below tiles — mobile only */}
        <div className="bg-bg px-4 pb-8 lg:hidden" />
      </div>
    </div>
  )
}
