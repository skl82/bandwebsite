import { useState } from 'react'

export default function MailchimpSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong.')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div>

      {status === 'success' ? (
        <p className="font-mono text-xs text-accent tracking-wide">
          // you're in — we'll keep you posted
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="email-signup" className="sr-only">
            Email address
          </label>
          <input
            id="email-signup"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 min-w-0 bg-surface border border-white/10 text-text font-mono text-sm px-3 py-2 rounded focus:border-accent focus:outline-none disabled:opacity-50 placeholder:text-text-muted/50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="font-mono text-xs uppercase tracking-widest text-text border border-accent hover:bg-accent/10 px-3 py-2 rounded transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : '[ Subscribe ]'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400 mt-2" aria-live="polite">
          {errorMsg}
        </p>
      )}
    </div>
  )
}
