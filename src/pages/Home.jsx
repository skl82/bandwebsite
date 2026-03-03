import HeroBanner from '../components/HeroBanner'
import ShowsPanel from '../components/ShowsPanel'
import SpotifyEmbed from '../components/SpotifyEmbed'
import SocialLinks from '../components/SocialLinks'

export default function Home() {
  return (
    <div className="h-screen overflow-hidden relative">
      <HeroBanner />
      <ShowsPanel />

      {/* Spotify player — bottom left, above the carousel */}
      <div className="absolute bottom-16 left-4 z-30 w-80 bg-bg/60 backdrop-blur-md rounded-lg px-4 py-4">
        <h2 className="font-display text-2xl tracking-wide mb-3">MUSIC</h2>
        <SpotifyEmbed height={352} />
      </div>

      {/* Social links carousel — full width bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-3">
        <SocialLinks />
      </div>
    </div>
  )
}
