import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NamePicker from '../components/NamePicker'
import ShareLink from '../components/ShareLink'
import './HomePage.css'

export default function HomePage() {
  const [authorName, setAuthorName] = useState('')
  const navigate = useNavigate()

  return (
    <div className="home">
      <main className="home__content">
        <div className="home__logo-row">
          <h1 className="home__title">Kongroo</h1>
          <div className="home__logo-icon">
            <span className="home__logo-mark">✦</span>
          </div>
        </div>

        <NamePicker value={authorName} onChange={setAuthorName} />

        <ShareLink />

        <button
          className={`home__cta${authorName ? ' home__cta--active' : ''}`}
          disabled={!authorName}
          onClick={() => navigate('/lobby', { state: { authorName } })}
        >
          Enter the story →
        </button>
      </main>
    </div>
  )
}
