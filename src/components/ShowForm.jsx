import { useState } from 'react'
import { supabase } from '../supabase'

export default function ShowForm({ show, onSaved }) {
  const [form, setForm] = useState({
    gig_name: show?.gig_name || '',
    date: show?.date || '',
    time: show?.time || '',
    venue: show?.venue || '',
    city: show?.city || '',
    ticket_link: show?.ticket_link || '',
    visible: show?.visible || false,
  })
  const [posterFile, setPosterFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let poster_url = show?.poster_url || null

    if (posterFile) {
      const filename = `${Date.now()}-${posterFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { error: uploadError } = await supabase.storage
        .from('posters')
        .upload(filename, posterFile)

      if (uploadError) {
        setError(uploadError.message)
        setSaving(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(filename)

      poster_url = publicUrl
    }

    const payload = { ...form, poster_url }

    if (show) {
      const { error } = await supabase.from('shows').update(payload).eq('id', show.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('shows').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }

    setSaving(false)
    onSaved()
  }

  const inputCls = 'w-full bg-bg border border-white/10 rounded px-4 py-3 text-text text-sm focus:outline-none focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Gig Name"
        value={form.gig_name}
        onChange={e => update('gig_name', e.target.value)}
        required
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          value={form.date}
          onChange={e => update('date', e.target.value)}
          required
          className={inputCls}
        />
        <input
          type="time"
          value={form.time}
          onChange={e => update('time', e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Venue"
          value={form.venue}
          onChange={e => update('venue', e.target.value)}
          required
          className={inputCls}
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={e => update('city', e.target.value)}
          required
          className={inputCls}
        />
      </div>
      <input
        type="url"
        placeholder="Ticket Link (URL)"
        value={form.ticket_link}
        onChange={e => update('ticket_link', e.target.value)}
        className={inputCls}
      />
      <div>
        <label className="block text-text-muted text-sm mb-2">Poster Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setPosterFile(e.target.files[0] || null)}
          className="text-sm text-text-muted"
        />
        {show?.poster_url && !posterFile && (
          <p className="text-text-muted text-xs mt-1">Current poster will be kept</p>
        )}
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.visible}
          onChange={e => update('visible', e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <span className="text-sm">Visible (publish to site)</span>
      </label>
      {error && <p className="text-accent text-sm">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : show ? 'Update Show' : 'Create Show'}
      </button>
    </form>
  )
}
