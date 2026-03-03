import { useState } from 'react'
import HeroBanner from '../components/HeroBanner'
import ShowsPanel from '../components/ShowsPanel'
import SpotifyEmbed from '../components/SpotifyEmbed'
import SocialLinks from '../components/SocialLinks'

export default function Home() {
  const [openPanel, setOpenPanel] = useState(null)

  function toggle(panel) {
    setOpenPanel(prev => (prev === panel ? null : panel))
  }

  // Shift the main content when a panel opens
  const shift = openPanel === 'music' ? 'translate-x-[33.333%]'
    : openPanel === 'shows' ? '-translate-x-[33.333%]'
    : 'translate-x-0'

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Music panel — fixed left, always rendered */}
      <div className={`fixed top-0 left-0 h-full w-1/3 z-40 bg-bg transition-transform duration-300 ease-in-out ${
        openPanel === 'music' ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl tracking-wide">MUSIC</h2>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-text-muted hover:text-text text-2xl leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>
          <SpotifyEmbed height={352} />
        </div>
      </div>

      {/* Shows panel — fixed right, always rendered */}
      <div className={`fixed top-0 right-0 h-full w-1/3 z-40 bg-bg transition-transform duration-300 ease-in-out ${
        openPanel === 'shows' ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl tracking-wide">SHOWS</h2>
            <button
              onClick={() => setOpenPanel(null)}
              className="text-text-muted hover:text-text text-2xl leading-none cursor-pointer"
            >
              &times;
            </button>
          </div>
          <ShowsPanel />
        </div>
      </div>

      {/* Main content — shifts when panels open */}
      <div className={`h-full w-full relative transition-transform duration-300 ease-in-out ${shift}`}>
        <HeroBanner />

        {/* Logo */}
        <div className="absolute top-4 left-4 z-50 bg-bg/60 backdrop-blur-md rounded-lg px-6 py-5">
          <span className="font-display text-5xl tracking-wider text-text">ARAUJIA</span>
        </div>

        {/* Side tab: MUSIC (left) */}
        <button
          onClick={() => toggle('music')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-bg pl-0 pr-5 py-5 rounded-r-sm font-display text-8xl tracking-tight writing-vertical cursor-pointer hover:bg-surface transition-colors leading-none"
        >
          {'\u00A0\u00A0'}MUSIC{'\u00A0\u00A0'}
        </button>

        {/* Side tab: SHOWS (right) */}
        <button
          onClick={() => toggle('shows')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 bg-bg pl-0 pr-5 py-5 rounded-l-sm font-display text-8xl tracking-tight writing-vertical-right cursor-pointer hover:bg-surface transition-colors leading-none"
        >
          {'\u00A0\u00A0'}SHOWS{'\u00A0\u00A0'}
        </button>

        {/* Social links carousel */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-3">
          <SocialLinks />
        </div>
      </div>
    </div>
  )
}
