export default function TicketButton({ href, small, size, className = '' }) {
  if (!href) return null

  const sizeClass = size === 'lg'
    ? 'text-lg px-4 py-2 text-text border border-accent hover:bg-accent/10'
    : small
      ? 'text-xs py-1 text-white/80 border-b-2 border-accent'
      : 'text-sm py-1 text-text border-b-2 border-accent'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block font-mono uppercase tracking-widest transition-colors hover:text-accent ${sizeClass} ${className}`}
    >
      [ Get Tickets ]
    </a>
  )
}
