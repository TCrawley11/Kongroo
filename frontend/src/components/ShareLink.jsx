import { useState } from 'react'
import './ShareLink.css'

export default function ShareLink() {
  const [copied, setCopied] = useState(false)
  const url = window.location.origin

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="share-link">
      <span className="share-link__label">Invite collaborators</span>
      <div className="share-link__row">
        <span className="share-link__url">{url}</span>
        <button
          className={`share-link__btn${copied ? ' share-link__btn--copied' : ''}`}
          onClick={handleCopy}
          type="button"
        >
          {copied ? '✓ Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
