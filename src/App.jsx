import { Outlet, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NextShowBanner from './components/NextShowBanner'

export default function App() {
  const isHome = useLocation().pathname === '/'

  return (
    <div className={`min-h-screen flex flex-col bg-bg text-text ${isHome ? 'h-screen overflow-hidden' : ''}`}>
      {!isHome && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isHome && <Footer />}
      {!isHome && <NextShowBanner />}
      <Analytics />
    </div>
  )
}
