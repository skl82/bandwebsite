import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-display text-3xl tracking-wide mb-8">ADMIN LOGIN</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-surface border border-white/10 rounded px-4 py-3 text-text text-sm focus:outline-none focus:border-accent"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full bg-surface border border-white/10 rounded px-4 py-3 text-text text-sm focus:outline-none focus:border-accent"
        />
        {error && <p className="text-accent text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
