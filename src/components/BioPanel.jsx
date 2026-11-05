import { useState } from 'react'
import { BIO } from '../content/band'

function Segment({ part }) {
  if (typeof part === 'string') return part
  if (part.em) return <em>{part.em}</em>
  return (
    <a href={part.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover transition-colors">
      {part.text}
    </a>
  )
}

export default function BioPanel({ mobileLimit = false }) {
  const [expanded, setExpanded] = useState(false)
  const visible = mobileLimit && !expanded ? BIO.slice(0, 1) : BIO

  return (
    <div className="space-y-4">
      <img
        src="/bio.webp"
        alt="ARAUJIA performing live. From left: David Yang (drums), Jonathan Briggs (bass), Sebastian Larsen (lead guitar), and Andres Alfonso (vocals, rhythm guitar)"
        width={1000}
        height={1000}
        loading="lazy"
        className="w-full h-auto border border-white/10"
      />
      {visible.map((parts, i) => (
        <p key={i} className="text-sm lg:text-[0.95rem] text-text/85 leading-relaxed">
          {parts.map((part, j) => <Segment key={j} part={part} />)}
        </p>
      ))}
      {mobileLimit && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 font-mono text-sm text-text-muted hover:text-text border border-white/10 rounded-lg cursor-pointer transition-colors"
        >
          {expanded ? '[see less]' : '[read more]'}
        </button>
      )}
    </div>
  )
}
