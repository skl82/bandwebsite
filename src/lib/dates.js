const HOUR = 60 * 60 * 1000

// Earliest show date (YYYY-MM-DD) that still counts as upcoming. Shows store a date but no time
// zone, so instead of guessing the venue's zone, a show stays listed until noon UTC the day after:
// about 7am in DC, 4am in LA, noon in London. It never drops off while it's happening, anywhere
// from Hawaii to Eastern Europe, and every visitor sees the same list wherever they are.
// (The old check used the UTC date directly, which hid a DC show from 7–8pm on show night.)
export function upcomingCutoffDate() {
  return new Date(Date.now() - 12 * HOUR).toISOString().slice(0, 10)
}

// Today's date (YYYY-MM-DD) on the user's own clock, e.g. to prefill an admin form.
// toISOString() would give the UTC date, which is already tomorrow on a US evening.
export function localToday() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
