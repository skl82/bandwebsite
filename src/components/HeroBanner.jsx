const heroImages = ['/hero.jpg', '/hero2.jpg']

const randomHero = heroImages[Math.floor(Math.random() * heroImages.length)]

export default function HeroBanner() {
  return (
    <div className="absolute inset-0 fade-in">
      <img
        src={randomHero}
        alt="araujia live"
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
