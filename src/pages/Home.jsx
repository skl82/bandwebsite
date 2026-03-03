import { useState } from 'react'
import HeroBanner from '../components/HeroBanner'
import ShowsPanel from '../components/ShowsPanel'
import SpotifyEmbed from '../components/SpotifyEmbed'
import SocialLinks from '../components/SocialLinks'
import NextShowTicker from '../components/NextShowTicker'

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null)

  function toggle(panel) {
    setOpenPanel(prev => (prev === panel ? null : panel))
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
      <div className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${openPanel === 'music' ? 'translate-x-[33.333%]' : 'translate-x-0'}`}>
        <NextShowTicker />
      </div>
      <div className={`hidden lg:block fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${openPanel === 'music' ? 'translate-x-[33.333%]' : 'translate-x-0'}`}>
        <SocialLinks />
      </div>

      {/* Main content — shifts when music opens (desktop only) */}
      <div className={`w-full relative transition-transform duration-300 ease-in-out ${shift}`}>
        {/* Hero — full viewport */}
        <div className="h-[75vh] lg:h-screen relative">
          <HeroBanner />

          {/* Top bars — mobile only: ticker + social links flush */}
          <div className="lg:hidden absolute top-0 left-0 right-0 z-20">
            <NextShowTicker />
            <SocialLinks reverseDirection hideLabel />
          </div>

          {/* Logo */}
          <div className="absolute top-24 lg:top-12 left-4 z-50">
            <img src="/araujialogo.png" alt="ARAUJIA" className="h-16 lg:h-[8.4rem]" />
          </div>

          {/* Side tab: MUSIC — desktop vertical tab */}
          <button
            onClick={() => toggle('music')}
            className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-bg pl-0 pr-5 py-5 font-mono text-8xl tracking-tight writing-vertical cursor-pointer hover:bg-surface transition-colors leading-none"
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
        <div className="lg:hidden relative mx-4 mt-6 rounded-lg bg-bg/95 backdrop-blur-sm border border-white/10 p-4 z-10">
          <h2 className="font-mono text-xl tracking-widest uppercase mb-4">// Music</h2>
          <SpotifyEmbed height={352} />
        </div>

        {/* Black backdrop below tiles — mobile only */}
        <div className="bg-bg px-4 pb-8 lg:hidden" />
      </div>
    </div>
  )
}
