import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabase'
import ShowForm from '../components/ShowForm'
import NewsForm from '../components/NewsForm'

const greetings = [
  'Is that THE Araujia?',
  'Welcome back, Mr. Araujia.',
  'The moth vine himself.',
  'Security! Just kidding. Come in.',
  'You again? Fine, come in.',
  'Legend has it... you returned.',
  'The backstage door is open.',
  'Access granted. Try not to break anything.',
  'Oh wow, a real rock star.',
  'The vine grows ever onward.',
  'Ah yes, the talent has arrived.',
  'Quick, look busy — the boss is here.',
  'Another day, another gig to manage.',
  'Back so soon? Must be a busy tour.',
  'The flowers are blooming. So is the inbox.',
  'One does not simply log in to Araujia.',
  'Welcome to the control room. Handle with care.',
  'All systems nominal. Vibes: immaculate.',
  'You have 0 new fans. Just kidding.',
  'Plot twist: you were the admin all along.',
  'Doors: open. Soundcheck: pending.',
  'The algorithm smiles upon you today.',
  'Breaking news: local band updates website.',
  'May your set times be accurate and your ticket links unbroken.',
  'You look different. New haircut?',
]

const greeting = greetings[Math.floor(Math.random() * greetings.length)]

export default function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('shows')
  const [shows, setShows] = useState([])
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newsForm, setNewsForm] = useState(false)
  const [news, setNews] = useState([])
  const [editingNews, setEditingNews] = useState(null)

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
    if (session) {
      fetchShows()
      fetchNews()
    }
  }, [session])

  async function fetchShows() {
    const { data } = await supabase
      .from('shows')
      .select('*')
      .order('date', { ascending: false })
    setShows(data || [])
  }

  async function fetchNews() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false })
    setNews(data || [])
  }

  async function toggleNewsVisible(id, visible) {
    await supabase.from('news').update({ visible: !visible }).eq('id', id)
    fetchNews()
  }

  async function deleteNews(id) {
    if (!window.confirm('Delete this article?')) return
    await supabase.from('news').delete().eq('id', id)
    fetchNews()
  }

  async function toggleVisible(id, visible) {
    await supabase.from('shows').update({ visible: !visible }).eq('id', id)
    fetchShows()
  }

  async function sendNotification(showData) {
    try {
      const { data: { session: s } } = await supabase.auth.getSession()
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({
          gig_name: showData.gig_name,
          date: showData.date,
          time: showData.time,
          doors_time: showData.doors_time,
          venue: showData.venue,
          city: showData.city,
          ticket_link: showData.ticket_link,
          poster_url: showData.poster_url,
        }),
      })
      if (!res.ok) throw new Error()
      alert('Notification sent!')
    } catch {
      alert('Failed to send notification. Try again.')
    }
  }

  async function sendNewsNotification(articleData) {
    try {
      const { data: { session: s } } = await supabase.auth.getSession()
      const res = await fetch('/api/notify-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${s?.access_token}`,
        },
        body: JSON.stringify({
          title: articleData.title,
          body: articleData.body,
          image_url: articleData.image_url,
          link: articleData.link,
          link_text: articleData.link_text,
        }),
      })
      if (!res.ok) throw new Error()
      alert('News email sent!')
    } catch {
      alert('Failed to send news email. Try again.')
    }
  }

  async function handleNewsSaved({ notify, articleData } = {}) {
    setNewsForm(false)
    setEditingNews(null)
    fetchNews()
    if (notify && articleData) {
      await sendNewsNotification(articleData)
    }
  }

  async function deleteShow(id) {
    if (!window.confirm('Delete this show?')) return
    await supabase.from('shows').delete().eq('id', id)
    fetchShows()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleSaved({ notify, showData } = {}) {
    setShowForm(false)
    setEditing(null)
    fetchShows()
    if (notify && showData) {
      await sendNotification(showData)
    }
  }

  function handleEdit(show) {
    setEditing(show)
    setShowForm(true)
  }

  if (loading) return null
  if (!session) return <Navigate to="/login" replace />

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between pt-12 pb-8 shrink-0">
        <div>
          <h1 className="font-display text-3xl tracking-wide">ADMIN</h1>
          <p className="text-text-muted text-sm font-mono mt-1">{greeting}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-text-muted text-sm hover:text-text transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-5 py-3 font-mono text-sm tracking-wider uppercase transition-colors cursor-pointer ${
            activeTab === 'shows'
              ? 'text-text border-b-2 border-accent'
              : 'text-text-muted hover:text-text'
          }`}
        >
          // Shows
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-5 py-3 font-mono text-sm tracking-wider uppercase transition-colors cursor-pointer ${
            activeTab === 'news'
              ? 'text-text border-b-2 border-accent'
              : 'text-text-muted hover:text-text'
          }`}
        >
          // News
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pt-8 pb-24">
      {/* Shows tab */}
      {activeTab === 'shows' && (
        <>
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
              onClick={() => { setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
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
                    <span className={`w-2 h-2 rounded-full ${new Date(show.date + 'T00:00:00') < new Date(new Date().toDateString()) ? 'bg-text-muted' : show.visible ? 'bg-green-500' : 'bg-text-muted'}`} />
                    <span className={`font-semibold truncate ${new Date(show.date + 'T00:00:00') < new Date(new Date().toDateString()) ? 'text-text-muted line-through' : ''}`}>{show.gig_name}</span>
                  </div>
                  <p className="text-text-muted text-sm mt-1">
                    {new Date(show.date + 'T00:00:00').toLocaleDateString()} &middot; {show.venue}, {show.city}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {new Date(show.date + 'T00:00:00') < new Date(new Date().toDateString()) ? (
                    <span className="text-xs px-3 py-1.5 rounded bg-white/5 text-text-muted">
                      Past
                    </span>
                  ) : (
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
                  )}
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
        </>
      )}

      {/* News tab */}
      {activeTab === 'news' && (
        <>
          {newsForm ? (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl tracking-wide">
                  {editingNews ? 'EDIT ARTICLE' : 'NEW ARTICLE'}
                </h2>
                <button
                  onClick={() => { setNewsForm(false); setEditingNews(null) }}
                  className="text-text-muted text-sm hover:text-text"
                >
                  Cancel
                </button>
              </div>
              <NewsForm article={editingNews} onSaved={handleNewsSaved} />
            </div>
          ) : (
            <button
              onClick={() => setNewsForm(true)}
              className="mb-8 bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded transition-colors"
            >
              + Add Article
            </button>
          )}

          <div className="space-y-3">
            {news.map(article => (
              <div
                key={article.id}
                className="bg-surface rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${article.visible ? 'bg-green-500' : 'bg-text-muted'}`} />
                    <span className="font-semibold truncate">{article.title}</span>
                  </div>
                  <p className="text-text-muted text-sm mt-1">
                    {new Date(article.date + 'T00:00:00').toLocaleDateString()}
                    {article.link && <> &middot; <span className="text-accent">has link</span></>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleNewsVisible(article.id, article.visible)}
                    className={`text-xs px-3 py-1.5 rounded ${
                      article.visible
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-white/5 text-text-muted'
                    }`}
                  >
                    {article.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => { setEditingNews(article); setNewsForm(true) }}
                    className="text-xs px-3 py-1.5 rounded bg-white/5 text-text-muted hover:text-text"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNews(article.id)}
                    className="text-xs px-3 py-1.5 rounded bg-white/5 text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
