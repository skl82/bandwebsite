import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Shows from './pages/Shows'
import Music from './pages/Music'
// import Links from './pages/Links' // scaffold kept, route disabled
import Admin from './pages/Admin'
import Login from './pages/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="shows" element={<Shows />} />
          <Route path="music" element={<Music />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
        </Route>
        {/* <Route path="links" element={<Links />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
