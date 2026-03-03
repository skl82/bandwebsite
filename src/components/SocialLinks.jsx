import { useRef, useEffect } from 'react'

const platforms = [
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/artist/7jjxND0ZjxZsOEEX6pWr7A',
    color: '#1DB954',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    name: 'Apple Music',
    href: 'https://music.apple.com/us/artist/araujia/1553193509',
    color: '#FA2D48',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M18 3.5v10a3.5 3.5 0 1 1-2-3.163V6.236L8 7.903v7.597a3.5 3.5 0 1 1-2-3.163V4.5a1 1 0 0 1 .757-.97l10-2.5A1 1 0 0 1 18 2v1.5z"/>
      </svg>
    ),
  },
  {
    name: 'Bandcamp',
    href: 'https://araujia.bandcamp.com/music',
    color: '#1DA0C3',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M0 18.75l7.437-13.5H24l-7.438 13.5z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/_araujia_/?hl=en',
    color: '#E4405F',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@ARAUJIA/featured',
    color: '#FF0000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@araujiaofficial?lang=en',
    color: '#ffffff',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
]

const SPEED = 50 // pixels per second

export default function SocialLinks({ reverseDirection = false, hideLabel = false }) {
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const rafRef = useRef(null)
  const lastRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // When scrolling right, start offset by one copy so there's content to reveal
    if (reverseDirection) {
      const copyWidth = track.scrollWidth / 4
      offsetRef.current = -copyWidth
    }

    function tick(now) {
      if (lastRef.current === null) lastRef.current = now
      const dt = (now - lastRef.current) / 1000
      lastRef.current = now

      const dir = reverseDirection ? 1 : -1
      offsetRef.current += dir * SPEED * dt

      // Reset after scrolling one copy's worth (1/4 of total since we render 4 copies)
      const copyWidth = track.scrollWidth / 4
      if (reverseDirection) {
        if (offsetRef.current >= 0) offsetRef.current -= copyWidth
      } else {
        if (Math.abs(offsetRef.current) >= copyWidth) offsetRef.current += copyWidth
      }

      track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const items = [...platforms, ...platforms, ...platforms, ...platforms]

  return (
    <div>
      {!hideLabel && (
        <div className="flex justify-start mb-1">
          <span className="font-mono text-xs text-text-muted tracking-widest lowercase bg-bg border border-white/10 border-b-0 px-4 py-1">// find us on:</span>
        </div>
      )}
      <div className={`relative overflow-hidden bg-bg carousel-glitch-wrap ${!hideLabel ? 'border-t border-white/10' : ''}`}>
        <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
          {items.map(({ name, href, color, icon }, i) => (
            <a
              key={`${name}-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center font-mono text-sm tracking-widest uppercase text-text-muted transition-colors py-3"
              style={{ '--platform-color': color }}
            >
              <span className="px-6 inline-flex items-center gap-2.5">
                <span className="group-hover:text-[var(--platform-color)] transition-colors duration-200">
                  {icon}
                </span>
                <span className="group-hover:text-text transition-colors duration-200">
                  {name}
                </span>
              </span>
              <span className="text-white/20">//</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
