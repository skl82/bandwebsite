export default function Footer() {
  const socials = [
    { label: 'Instagram', href: '#' },
    { label: 'Spotify', href: '#' },
    { label: 'Apple Music', href: '#' },
  ]

  return (
    <footer className="border-t border-white/5 bg-bg py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-muted text-sm">&copy; {new Date().getFullYear()} araujia</p>
        <div className="flex gap-6">
          {socials.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted text-sm hover:text-text transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
