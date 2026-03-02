import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import NextShowBanner from './components/NextShowBanner'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <NextShowBanner />
    </div>
  )
}
