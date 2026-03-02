import TicketButton from './TicketButton'

function buildCalendarUrl(show) {
  const dateStr = show.date.replace(/-/g, '')
  let startTime = '120000'
  if (show.time) {
    startTime = show.time.replace(/:/g, '').slice(0, 6).padEnd(6, '0')
  }
  const start = `${dateStr}T${startTime}`
  // Assume 3 hour event
  const startDate = new Date(`${show.date}T${show.time || '12:00:00'}`)
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000)
  const endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0]

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: show.gig_name,
    dates: `${start}/${endStr}`,
    location: `${show.venue}, ${show.city}`,
    details: show.ticket_link || '',
  })

  return `https://calendar.google.com/calendar/render?${params}`
}

export default function ShowCard({ show, isPast }) {
  const formatted = new Date(show.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const time = show.time
    ? new Date(`2000-01-01T${show.time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <div className="bg-surface rounded-lg overflow-hidden flex flex-col sm:flex-row">
      {show.poster_url && (
        <div className="sm:w-48 sm:h-48 shrink-0">
          <img
            src={show.poster_url}
            alt={show.gig_name}
            className="w-full h-48 sm:h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 p-5 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-display text-2xl tracking-wide">{show.gig_name}</h3>
          <p className="text-text-muted text-sm mt-1">
            {formatted}{time && ` · ${time}`} · {show.venue}, {show.city}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isPast && show.ticket_link && <TicketButton href={show.ticket_link} />}
          <a
            href={buildCalendarUrl(show)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted text-xs hover:text-text transition-colors"
          >
            + Add to Calendar
          </a>
        </div>
      </div>
    </div>
  )
}
