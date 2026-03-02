import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ShowForm from '../components/ShowForm'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shows, setShows] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchShows()
  }, [session])

  async function fetchShows() {
    const { data } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: false })
    setShows(data || [])
  }

  async function toggleVisible(id, visible) {
    await supabase.from('shows').update({ visible: !visible }).eq('id', id)
    fetchShows()
  }

  async function deleteShow(id) {
    if (!window.confirm('Delete this show?')) return
    await supabase.from('shows').delete().eq('id', id)
    fetchShows()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function handleSaved() {
    setShowForm(false)
    setEditing(null)
    fetchShows()
  }

  function handleEdit(show) {
    setEditing(show)
    setShowForm(true)
  }

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl tracking-wide">ADMIN</h1>
        <button
          onClick={handleLogout}
          className="text-text-muted text-sm hover:text-text transition-colors"
        >
          Sign Out
        </button>
      </div>

      {showForm ? (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wide">
              {editing ? 'EDIT SHOW' : 'NEW SHOW'}
            </h2>
            <button
              onClick={() => { setShowForm(false); setEditing(null) }}
              className="text-text-muted text-sm hover:text-text"
            >
              Cancel
            </button>
          </div>
          <ShowForm show={editing} onSaved={handleSaved} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded transition-colors"
        >
          + Add Show
        </button>
      )}

      <div className="space-y-3">
        {shows.map(show => (
          <div
            key={show.id}
            className="bg-surface rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${show.visible ? 'bg-green-500' : 'bg-text-muted'}`} />
                <span className="font-semibold truncate">{show.gig_name}</span>
              </div>
              <p className="text-text-muted text-sm mt-1">
                {new Date(show.date + 'T00:00:00').toLocaleDateString()} &middot; {show.venue}, {show.city}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => toggleVisible(show.id, show.visible)}
                className={`text-xs px-3 py-1.5 rounded ${
                  show.visible
                    ? 'bg-green-900/30 text-green-400'
                    : 'bg-white/5 text-text-muted'
                }`}
              >
                {show.visible ? 'Visible' : 'Hidden'}
              </button>
              <button
                onClick={() => handleEdit(show)}
                className="text-xs px-3 py-1.5 rounded bg-white/5 text-text-muted hover:text-text"
              >
                Edit
              </button>
              <button
                onClick={() => deleteShow(show.id)}
                className="text-xs px-3 py-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
