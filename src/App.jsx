import { Outlet, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NextShowBanner from './components/NextShowBanner'

export default function App() {
  const isHome = useLocation().pathname === '/'

  return (
    <div className={`flex flex-col bg-bg text-text ${isHome ? 'h-dvh lg:h-screen overflow-hidden' : 'h-screen'}`}>
      {!isHome && <Navbar />}
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
      {!isHome && <Footer />}
      {!isHome && <NextShowBanner />}
      <Analytics />
    </div>
  )
}
