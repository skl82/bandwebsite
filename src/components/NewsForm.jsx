import { useState } from 'react'
import { supabase } from '../supabase'

export default function NewsForm({ article, onSaved }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    date: article?.date || new Date().toISOString().split('T')[0],
    body: article?.body || '',
    link: article?.link || '',
    link_text: article?.link_text || '',
    image_fit: article?.image_fit || 'cover',
    visible: article?.visible || false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(article?.image_url || null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0] || null
    setImageFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    } else {
      setImagePreview(article?.image_url || null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let image_url = article?.image_url || null

    if (imageFile) {
      const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { error: uploadError } = await supabase.storage
        .from('news-images')
        .upload(filename, imageFile)

      if (uploadError) {
        setError('Something went wrong. Please try again.')
        setSaving(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('news-images')
        .getPublicUrl(filename)

      image_url = publicUrl
    }

    const payload = {
      title: form.title,
      date: form.date,
      body: form.body,
      link: form.link || null,
      link_text: form.link_text || null,
      image_url,
      image_fit: form.image_fit,
      visible: form.visible,
    }

    if (article) {
      const { error } = await supabase.from('news').update(payload).eq('id', article.id)
      if (error) { setError('Something went wrong. Please try again.'); setSaving(false); return }
    } else {
      const { error } = await supabase.from('news').insert(payload)
      if (error) { setError('Something went wrong. Please try again.'); setSaving(false); return }
    }

    setSaving(false)
    onSaved()
  }

  const inputCls = 'w-full bg-bg border border-white/10 rounded px-4 py-3 text-text text-sm focus:outline-none focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={e => update('title', e.target.value)}
        required
        maxLength={200}
        className={inputCls}
      />

      <input
        type="date"
        value={form.date}
        onChange={e => update('date', e.target.value)}
        required
        className={inputCls}
      />

      <div>
        <label className="block text-text-muted text-sm mb-2">Cover Image</label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <span className="inline-block bg-white/5 border border-white/10 rounded px-4 py-2.5 text-sm font-mono text-text-muted group-hover:border-accent group-hover:text-text transition-colors">
            {imageFile ? imageFile.name : '[ Upload Image ]'}
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-3 rounded-lg max-h-48 object-cover border border-white/10"
          />
        )}
        <div className="flex items-center gap-4 mt-2">
          <span className="text-text-muted text-sm">Image fit:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="image_fit" value="cover" checked={form.image_fit === 'cover'} onChange={() => update('image_fit', 'cover')} className="accent-accent" />
            <span className="text-sm">Fill &amp; crop</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="image_fit" value="contain" checked={form.image_fit === 'contain'} onChange={() => update('image_fit', 'contain')} className="accent-accent" />
            <span className="text-sm">Show full image</span>
          </label>
        </div>
      </div>

      <textarea
        placeholder="Body text..."
        value={form.body}
        onChange={e => update('body', e.target.value)}
        required
        rows={6}
        className={inputCls + ' resize-y'}
      />

      <input
        type="url"
        placeholder="Link URL (optional)"
        value={form.link}
        onChange={e => update('link', e.target.value)}
        maxLength={500}
        className={inputCls}
      />

      <input
        type="text"
        placeholder="Link display text (e.g. &quot;buy tickets&quot;) — defaults to &quot;link&quot;"
        value={form.link_text}
        onChange={e => update('link_text', e.target.value)}
        maxLength={100}
        className={inputCls}
      />

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
        {saving ? 'Saving...' : article ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}
