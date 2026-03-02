import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shows', label: 'Shows' },
    { to: '/music', label: 'Music' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-wider text-text hover:text-accent transition-colors">
          ARAUJIA
        </Link>
        <div className="flex gap-6">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`text-sm font-medium uppercase tracking-wide transition-colors ${
                pathname === to ? 'text-accent' : 'text-text-muted hover:text-text'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
