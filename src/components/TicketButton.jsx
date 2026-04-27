import { safeHref } from '../lib/url'

export default function TicketButton({ href, small, size, className = '' }) {
  const safe = safeHref(href)
  if (!safe) return null

  const sizeClass = size === 'lg'
    ? 'text-sm xl:text-base 2xl:text-lg px-3 2xl:px-4 py-1.5 2xl:py-2 text-text border border-accent hover:bg-accent/10 lg:whitespace-nowrap'
    : small
      ? 'text-xs py-1 text-white/80 border-b-2 border-accent'
      : 'text-sm py-1 text-text border-b-2 border-accent'

  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block max-w-full font-mono uppercase tracking-widest transition-colors hover:text-accent ${sizeClass} ${className}`}
    >
      [ Get Tickets ]
    </a>
  )
}
