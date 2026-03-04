export function safeHref(url) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol) ? url : null
  } catch { return null }
}
