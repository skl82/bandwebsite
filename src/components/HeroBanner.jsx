export default function HeroBanner() {
  return (
    <div className="absolute inset-0">
      <img
        src="/hero.jpg"
        alt="araujia live"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  )
}
