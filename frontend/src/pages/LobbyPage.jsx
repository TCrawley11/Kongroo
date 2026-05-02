import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './LobbyPage.css'

const HARDCODED_PLAYERS = [
  { id: 1, name: 'Anya', joined: true, color: '#aa3bff' },
  { id: 2, name: 'Marco', joined: true, color: '#e879f9' },
  { id: 3, name: 'Suki', joined: false, color: '#60a5fa' },
  { id: 4, name: 'Lev', joined: false, color: '#34d399' },
]

const HARDCODED_PROMPTS = [
  { playerId: 1, text: 'A city waking up to its last normal day — the streets too quiet, the sky the wrong shade of amber.' },
  { playerId: 2, text: 'An unsigned letter slipped under the door. No stamp, no return address. Just three words that change everything.' },
  { playerId: 3, text: null },
  { playerId: 4, text: null },
]

function PlayerSlot({ player, index }) {
  return (
    <div className={`player-slot${player.joined ? ' player-slot--joined' : ''}`}>
      <div className="player-slot__avatar" style={{ background: player.joined ? player.color : 'var(--border)' }}>
        {player.joined ? player.name[0].toUpperCase() : index + 1}
      </div>
      <div className="player-slot__info">
        <span className="player-slot__name">{player.joined ? player.name : `Player ${index + 1}`}</span>
        <span className="player-slot__status">
          {player.joined ? (
            <><span className="player-slot__dot player-slot__dot--online" />Joined</>
          ) : (
            <><span className="player-slot__dot player-slot__dot--waiting" />Waiting…</>
          )}
        </span>
      </div>
    </div>
  )
}

function PromptCard({ player, prompt, chapterIndex, isYours, onSubmit, submitted }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) onSubmit(text.trim())
  }

  return (
    <div className={`prompt-card${prompt?.text || submitted ? ' prompt-card--filled' : ''}${isYours ? ' prompt-card--yours' : ''}`}>
      <div className="prompt-card__header">
        <span className="prompt-card__chapter">Chapter {chapterIndex + 1}</span>
        {isYours && <span className="prompt-card__tag">Your turn</span>}
      </div>

      <div className="prompt-card__player">
        <div
          className="prompt-card__avatar"
          style={{ background: player.joined ? player.color : 'var(--border)' }}
        >
          {player.joined ? player.name[0].toUpperCase() : '?'}
        </div>
        <span className="prompt-card__name">{player.joined ? player.name : 'Waiting for player…'}</span>
      </div>

      {(prompt?.text || submitted) ? (
        <p className="prompt-card__text">"{prompt?.text || submitted}"</p>
      ) : isYours ? (
        <form className="prompt-card__form" onSubmit={handleSubmit}>
          <textarea
            className="prompt-card__textarea"
            placeholder="Describe a scene, a moment, a feeling — anything that moves you…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={280}
            rows={3}
          />
          <div className="prompt-card__form-footer">
            <span className="prompt-card__count">{text.length}/280</span>
            <button className="prompt-card__submit" type="submit" disabled={!text.trim()}>
              Submit
            </button>
          </div>
        </form>
      ) : (
        <p className="prompt-card__empty">Waiting for prompt…</p>
      )}
    </div>
  )
}

export default function LobbyPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const authorName = state?.authorName ?? 'You'

  const [players] = useState(() =>
    HARDCODED_PLAYERS.map((p, i) =>
      i === 0 ? { ...p, name: authorName, joined: true } : p
    )
  )

  const [prompts, setPrompts] = useState(HARDCODED_PROMPTS)
  const [submitted, setSubmitted] = useState(null)

  const myPlayerIndex = 0
  const allFilled = prompts.every((p) => p.text) || (submitted && prompts.filter(p => p.text).length >= 1)
  const readyCount = prompts.filter((p) => p.text).length + (submitted ? 1 : 0)

  const handleSubmit = (text) => {
    setSubmitted(text)
  }

  const handleGenerate = () => {
    const finalPrompts = prompts.map((p, i) =>
      i === myPlayerIndex ? { ...p, text: submitted } : p
    )
    navigate('/story', { state: { players, prompts: finalPrompts } })
  }

  return (
    <div className="lobby">
      <header className="lobby__header">
        <button className="lobby__back" onClick={() => navigate('/')}>← Home</button>
        <div className="lobby__room">
          <span className="lobby__room-label">Story Room</span>
          <span className="lobby__room-code">KNGR-4821</span>
        </div>
        <div className="lobby__status">
          <span className={`lobby__status-dot${players.filter(p => p.joined).length === 4 ? ' lobby__status-dot--full' : ''}`} />
          {players.filter(p => p.joined).length} / 4 players
        </div>
      </header>

      <div className="lobby__body">
        <aside className="lobby__sidebar">
          <h2 className="lobby__section-title">Players</h2>
          <div className="lobby__players">
            {players.map((player, i) => (
              <PlayerSlot key={player.id} player={player} index={i} />
            ))}
          </div>

          <div className="lobby__sidebar-footer">
            <div className="lobby__fill-bar">
              <div
                className="lobby__fill-bar-inner"
                style={{ width: `${(readyCount / 4) * 100}%` }}
              />
            </div>
            <span className="lobby__fill-label">{readyCount} / 4 prompts ready</span>
          </div>
        </aside>

        <main className="lobby__prompts">
          <h2 className="lobby__section-title">Prompts</h2>
          <div className="lobby__prompt-list">
            {prompts.map((prompt, i) => (
              <PromptCard
                key={i}
                player={players[i]}
                prompt={prompt}
                chapterIndex={i}
                isYours={i === myPlayerIndex && !submitted}
                onSubmit={handleSubmit}
                submitted={i === myPlayerIndex ? submitted : null}
              />
            ))}
          </div>
        </main>
      </div>

      <footer className="lobby__footer">
        <button
          className={`lobby__generate${readyCount >= 1 ? ' lobby__generate--ready' : ''}`}
          disabled={readyCount < 1}
          onClick={handleGenerate}
        >
          Generate Story →
        </button>
        {readyCount < 4 && (
          <p className="lobby__footer-hint">Submit your prompt to unlock story generation</p>
        )}
      </footer>
    </div>
  )
}
