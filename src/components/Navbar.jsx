import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shows', label: 'Shows' },
    { to: '/music', label: 'Music' },
  ]

  return (
    <nav className="fixed top-4 left-4 z-50 bg-bg/90 backdrop-blur-md rounded-lg px-5 py-4 flex flex-col gap-1">
      <Link to="/" className="font-display text-2xl tracking-wider text-text hover:text-accent transition-colors mb-2">
        ARAUJIA
      </Link>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className={`text-sm font-medium uppercase tracking-wide transition-colors py-1 ${
            pathname === to ? 'text-accent' : 'text-text-muted hover:text-text'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
