export default function TicketButton({ href, small, className = '' }) {
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block font-mono uppercase tracking-widest transition-colors border-b-2 border-accent hover:text-accent ${
        small
          ? 'text-xs py-1 text-white/80'
          : 'text-sm py-1 text-text'
      } ${className}`}
    >
      [ Get Tickets ]
    </a>
  )
}
