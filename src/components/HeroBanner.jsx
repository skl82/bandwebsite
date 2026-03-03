import TicketButton from './TicketButton'

export default function HeroBanner({ show }) {
  const formatted = show
    ? new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src="/hero.jpg"
        alt="araujia live"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-center px-4">
        <h1 className="font-display text-7xl sm:text-9xl tracking-wider mb-4">ARAUJIA</h1>
        {show && (
          <div className="mt-6 space-y-3">
            <p className="text-text-muted text-lg">
              {formatted} &middot; {show.city}
            </p>
            <p className="font-display text-2xl tracking-wide">{show.gig_name}</p>
            <div className="mt-4">
              <TicketButton href={show.ticket_link} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
