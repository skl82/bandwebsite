import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <div className="fixed top-4 left-4 z-50 bg-bg/60 backdrop-blur-md rounded-lg px-6 py-5">
      <Link to="/" className="font-display text-5xl tracking-wider text-text hover:text-accent transition-colors">
        ARAUJIA
      </Link>
    </div>
  )
}
