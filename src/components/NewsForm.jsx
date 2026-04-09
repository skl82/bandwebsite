import { useState } from 'react'

export default function NewsForm({ article, onSaved }) {
  const [form, setForm] = useState({
    title: article?.title || '',
    body: article?.body || '',
    link: article?.link || '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(article?.image_url || null)

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

  function handleSubmit(e) {
    e.preventDefault()
    // No backend wiring yet — just log and call onSaved
    console.log('News article submitted:', { ...form, imageFile })
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
        placeholder="Link (optional)"
        value={form.link}
        onChange={e => update('link', e.target.value)}
        maxLength={500}
        className={inputCls}
      />

      <button
        type="submit"
        className="bg-accent hover:bg-accent-hover text-white font-semibold px-6 py-3 rounded transition-colors"
      >
        {article ? 'Update Article' : 'Create Article'}
      </button>
    </form>
  )
}
