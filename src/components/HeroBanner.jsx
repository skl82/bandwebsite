const heroImages = ['/hero.jpg', '/hero2.jpg', '/hero3.jpg', '/hero4.jpg', '/hero5.jpg', '/hero7.jpg', '/hero9.jpg', '/hero10.jpg']

const last = sessionStorage.getItem('lastHero')
const filtered = heroImages.filter((img) => img !== last)
const randomHero = filtered[Math.floor(Math.random() * filtered.length)]
sessionStorage.setItem('lastHero', randomHero)

export default function HeroBanner() {
  return (
    <div className="absolute inset-0 fade-in">
      <img
        src={randomHero}
        alt="araujia live"
        fetchPriority="high"
        decoding="async"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
