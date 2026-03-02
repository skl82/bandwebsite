export default function TicketButton({ href, small, className = '' }) {
  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block font-bold uppercase tracking-wider text-center transition-all ${
        small
          ? 'bg-white text-accent px-4 py-1.5 text-xs rounded hover:bg-gray-100'
          : 'bg-accent hover:bg-accent-hover text-white px-6 py-3 text-sm rounded-md'
      } ${className}`}
    >
      Get Tickets
    </a>
  )
}
