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
    <div className="relative w-full h-full">
      <img
        src="/hero.jpg"
        alt="araujia live"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {show && (
        <div className="absolute bottom-20 left-0 right-0 z-10 text-center px-4">
          <p className="text-text-muted text-sm uppercase tracking-widest">Next Show</p>
          <p className="font-display text-3xl sm:text-4xl tracking-wide mt-1">{show.gig_name}</p>
          <p className="text-text-muted mt-1">
            {formatted} &middot; {show.venue}, {show.city}
          </p>
          <div className="mt-4">
            <TicketButton href={show.ticket_link} />
          </div>
        </div>
      )}
    </div>
  )
}
