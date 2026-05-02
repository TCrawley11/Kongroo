import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './RoundPage.css'

const PLAYER_COLORS = [
  { bg: '#FCF1BA', accent: '#625204' },
  { bg: '#BAFCEB', accent: '#04624A' },
  { bg: '#BAC5FC', accent: '#041462' },
  { bg: '#E5BAFC', accent: '#410462' },
  { bg: '#FCBADE', accent: '#620437' },
  { bg: '#BAECFC', accent: '#044A62' },
  { bg: '#FCE0BA', accent: '#624504' },
  { bg: '#D5FCBA', accent: '#1E6204' },
]

const KangarooIcon = ({ accent }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="30" viewBox="0 0 37 39" fill="none" style={{ flexShrink: 0 }}>
    <path d="M32.6027 24.7508C32.5683 26.042 30.0741 26.9385 31.0902 28.2213C33.3315 28.5362 32.3126 30.0212 33.5405 30.5272C31.3693 34.061 27.8672 34.5023 24.5356 32.29C23.6652 31.7156 22.6038 31.5067 21.5807 31.7083C21.072 32.5237 21.8296 32.6186 22.3136 32.7368C24.6511 33.203 27.0175 36.8233 34.943 33.3748C36.0003 32.9307 35.8395 31.6231 35.3816 30.5946C36.2602 30.2206 36.3138 29.2443 36.4431 27.989C37.3066 25.1633 34.4755 25.404 32.6027 24.7508ZM20.1411 18.6087C18.9598 18.8799 17.8335 19.351 16.8108 20.0016C18.1377 20.7812 18.6643 21.7107 20.1411 21.4206C21.6178 21.1305 21.5903 20.1831 21.0087 19.0748C20.9278 18.9189 20.8017 18.7909 20.6469 18.7078C20.4921 18.6246 20.3158 18.5901 20.1411 18.6087ZM26.3795 0.00083813C24.5755 0.0833381 23.0245 4.91509 21.1847 8.34021C15.8965 10.5402 14.5723 7.68709 12.8453 8.15596C9.9042 2.16234 5.5372 -3.84916 4.35745 3.30084C4.61733 8.69909 2.4627 9.14459 2.65383 16.8487C2.65383 16.8487 -1.19617 24.5845 0.378204 31.4306C0.778297 33.2411 1.71966 34.887 3.07728 36.1498C4.43491 37.4126 6.14456 38.2326 7.9792 38.5008C8.2542 36.5277 11.3466 32.0782 10.4996 31.0401C8.38483 28.4496 9.04895 22.1026 14.4046 21.4481C15.1375 16.109 18.7688 17.1141 18.3921 15.57C17.2275 10.7327 22.2503 12.9905 23.0932 14.5758C24.6057 17.0893 25.6741 19.5602 26.9116 20.7303C28.0416 21.7339 29.3404 22.5294 30.7478 23.0802C30.2982 22.8052 26.4482 19.5423 25.3207 16.9257C24.8624 15.2595 24.657 13.5338 24.7116 11.8066C26.6655 11.5 27.4533 14.7876 29.575 17.77C29.6151 17.8527 29.636 17.9434 29.636 18.0353C29.636 18.1273 29.6151 18.218 29.575 18.3007C29.2835 18.1467 29.1817 17.759 28.8297 17.7122C28.5093 17.7122 28.2508 18.166 28.2508 18.7256C28.2508 19.2852 28.673 19.486 29.2546 19.7472C29.7756 20.785 30.6491 21.6034 31.7186 22.0558L29.1061 14.4122C29.0098 9.62446 29.5186 4.83809 26.7425 0.0503381C26.6253 0.0126754 26.5024 -0.00407999 26.3795 0.00083813ZM26.4042 1.52709C26.5486 1.52709 26.6792 1.62196 26.8016 1.84471C28.2495 4.56584 28.3031 10.9541 28.2921 13.2132C27.6046 11.6485 26.5747 9.01671 23.327 8.21509C23.327 8.21509 25.2245 1.54771 26.4042 1.52709ZM6.94933 2.13484C7.60933 2.13484 8.36008 2.51984 9.22908 4.10659C10.622 6.64484 11.6202 8.33334 12.1056 9.21334C13.0983 11.0008 11.6711 9.58734 11.2242 14.1785C11.2093 14.5477 11.1004 14.907 10.908 15.2224C10.7155 15.5378 10.4457 15.799 10.1242 15.9811C8.47325 13.9744 7.37505 11.5714 6.93833 9.00984C5.55233 11.0723 7.8362 14.2527 7.87608 16.9766C6.86219 17.2693 5.78803 17.2826 4.7672 17.0151C4.0522 16.6576 3.81708 12.2988 5.14258 8.91496C6.24258 6.09621 5.72145 2.51296 6.21233 2.35621C6.55058 2.24896 6.55333 2.13759 6.94933 2.13484Z" fill={accent}/>
  </svg>
)

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export default function RoundPage() {
  const { state } = useLocation()

  const roomId = state?.roomId ?? ''
  const playerId = state?.playerId ?? sessionStorage.getItem('kongroo_player_id') ?? ''
  const authorName = state?.authorName ?? ''

  const [players, setPlayers] = useState(
    (state?.players ?? []).map((p, i) => ({ ...p, colorIdx: i }))
  )
  const [currentPlayerId, setCurrentPlayerId] = useState(state?.currentPlayerId ?? null)
  const [submissions, setSubmissions] = useState([])
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('playing')
  const [panelIndex, setPanelIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [panelImages, setPanelImages] = useState([])

  const wsRef = useRef(null)
  const feedEndRef = useRef(null)
  const textRef = useRef('')

  const myIdx = players.findIndex(p => p.player_id === playerId)
  const myColor = PLAYER_COLORS[(myIdx >= 0 ? myIdx : 0) % PLAYER_COLORS.length]
  const isMyTurn = currentPlayerId === playerId
  const currentPlayer = players.find(p => p.player_id === currentPlayerId)
  const currentPlayerIdx = players.findIndex(p => p.player_id === currentPlayerId)
  const currentPlayerColor = PLAYER_COLORS[(currentPlayerIdx >= 0 ? currentPlayerIdx : 0) % PLAYER_COLORS.length]

  const words = wordCount(text)
  const overLimit = words > 20

  // Keep ref in sync so timer closure always reads latest text
  textRef.current = text

  useEffect(() => {
    if (!roomId) return
    const apiBase = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
    const wsBase = apiBase
      ? apiBase.replace(/^http/, 'ws')
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    const ws = new WebSocket(`${wsBase}/ws/${roomId}?player_id=${encodeURIComponent(playerId)}`)
    wsRef.current = ws

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      switch (msg.type) {
        case 'room_update':
          if (msg.room) {
            setPlayers(prev => {
              const updated = msg.room.players.map((p, i) => ({ ...p, colorIdx: i }))
              return updated.length ? updated : prev
            })
          }
          break
        case 'game_state_update':
          setCurrentPlayerId(msg.current_player_id)
          setSubmissions(msg.submissions ?? [])
          if (msg.players?.length) setPlayers(msg.players.map((p, i) => ({ ...p, colorIdx: i })))
          break
        case 'turn_update':
          setCurrentPlayerId(msg.current_player_id)
          setSubmissions(msg.submissions ?? [])
          break
        case 'game_complete':
          setSubmissions(msg.submissions ?? [])
          setPhase('done')
          break
      }
    }

    return () => ws.close()
  }, [roomId, playerId])

  useEffect(() => {
    if (!isMyTurn) { setTimeLeft(30); return }
    setTimeLeft(30)
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          const trimmed = textRef.current.trim()
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'submit_sentence', text: trimmed || '…' }))
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isMyTurn])

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [submissions])

  useEffect(() => {
    if (phase !== 'done' || submissions.length === 0) return
    const apiBase = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')
    const urls = []
    let cancelled = false

    const fetchPanel = async (idx) => {
      const cumulative = submissions.slice(0, idx + 1).map(s => s.text).join(' ')
      try {
        const res = await fetch(`${apiBase}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story_text: cumulative }),
        })
        if (!res.ok) return
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        if (cancelled) { URL.revokeObjectURL(url); return }
        urls[idx] = url
        setPanelImages(prev => {
          const next = [...prev]
          next[idx] = url
          return next
        })
      } catch {}
    }

    submissions.forEach((_, i) => fetchPanel(i))

    return () => {
      cancelled = true
      urls.forEach(u => u && URL.revokeObjectURL(u))
    }
  }, [phase, submissions])

  const submitSentence = () => {
    const trimmed = text.trim()
    if (!trimmed || overLimit || wsRef.current?.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ type: 'submit_sentence', text: trimmed }))
    setText('')
  }

  // ── Playback phase ──────────────────────────────────────────────────────────
  if (phase === 'done') {
    const panel = submissions[panelIndex]
    const pIdx = players.findIndex(p => p.player_id === panel?.player_id)
    const { bg, accent } = PLAYER_COLORS[(pIdx >= 0 ? pIdx : panelIndex) % PLAYER_COLORS.length]
    const isFirst = panelIndex === 0
    const isLast = panelIndex === submissions.length - 1
    const imgUrl = panelImages[panelIndex]

    return (
      <div className="round round--playback" style={{ background: `linear-gradient(160deg, ${bg} 0%, #fff8 100%)` }}>
        <div className="round__panel">
          <div className="round__panel-dots">
            {submissions.map((_, i) => (
              <button
                key={i}
                className={`round__panel-dot ${i === panelIndex ? 'round__panel-dot--active' : ''}`}
                style={{ background: i === panelIndex ? accent : `${accent}40` }}
                onClick={() => setPanelIndex(i)}
              />
            ))}
          </div>

          <div className="round__panel-image-wrap" style={{ borderColor: accent }}>
            {imgUrl ? (
              <img src={imgUrl} alt="" className="round__panel-image" />
            ) : (
              <div className="round__panel-image-loading" style={{ color: accent }}>
                Painting the scene…
              </div>
            )}
          </div>

          <p className="round__panel-author" style={{ color: accent }}>
            {panel?.player_name}
          </p>

          <p className="round__panel-text" style={{ color: accent }}>
            "{panel?.text}"
          </p>

          <div className="round__panel-nav">
            <div className="round__panel-btn-wrap" style={{ borderColor: accent, opacity: isFirst ? 0.3 : 1 }}>
              <button
                className="round__panel-btn"
                style={{ color: accent }}
                onClick={() => setPanelIndex(i => Math.max(0, i - 1))}
                disabled={isFirst}
              >
                ← Prev
              </button>
            </div>
            <div className="round__panel-btn-wrap" style={{ borderColor: accent, opacity: isLast ? 0.3 : 1 }}>
              <button
                className="round__panel-btn"
                style={{ color: accent }}
                onClick={() => setPanelIndex(i => Math.min(submissions.length - 1, i + 1))}
                disabled={isLast}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Playing phase ───────────────────────────────────────────────────────────
  return (
    <div className="round">
      <div className="round__body">
        <div className="round__main">

          <div className="round__hero">
            <div className="round__logo-row">
              <h1 className="round__title">Kongroo</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="47" height="51" viewBox="0 0 47 51" fill="none" style={{ width: 28, height: 28, filter: 'drop-shadow(0 3px 0 #FCBADE)', flexShrink: 0 }}>
                <g filter="url(#round_logo_filter)">
                  <path d="M32.3125 0L47 14.6875L41.125 20.5625V35.25L8.8125 47L6.48339 44.6709L19.0408 32.1136C19.5261 32.2432 20.0362 32.3125 20.5625 32.3125C23.8072 32.3125 26.4375 29.6823 26.4375 26.4375C26.4375 23.1928 23.8072 20.5625 20.5625 20.5625C17.3178 20.5625 14.6875 23.1928 14.6875 26.4375C14.6875 26.9638 14.7567 27.4739 14.8865 27.9592L2.32912 40.5166L0 38.1875L11.75 5.875H26.4375L32.3125 0Z" fill="#620437"/>
                </g>
                <defs>
                  <filter id="round_logo_filter" x="0" y="0" width="47" height="51" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feOffset dy="4"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.729412 0 0 0 0 0.870588 0 0 0 1 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                  </filter>
                </defs>
              </svg>
            </div>
            <p className="round__tagline">
              {isMyTurn
                ? 'Your turn — continue the story!'
                : `Waiting for ${currentPlayer?.display_name ?? '…'}`}
            </p>
          </div>

          <div className="round__content-row">

            {/* Player list with turn indicator */}
            <div className="round__players">
              {players.map((player, i) => {
                const { bg, accent } = PLAYER_COLORS[i % PLAYER_COLORS.length]
                const isTurn = player.player_id === currentPlayerId
                const submitted = submissions.some(s => s.player_id === player.player_id)
                return (
                  <div
                    key={player.player_id}
                    className={`round__player-card ${isTurn ? 'round__player-card--turn' : ''} ${submitted ? 'round__player-card--done' : ''}`}
                    style={{ background: bg, border: `4px solid ${accent}` }}
                  >
                    <KangarooIcon accent={accent} />
                    <span className="round__player-name" style={{ color: accent }}>
                      {player.display_name}
                    </span>
                    {submitted && <span className="round__player-check" style={{ color: accent }}>✓</span>}
                    {isTurn && !submitted && <span className="round__player-arrow" style={{ color: accent }}>✏</span>}
                  </div>
                )
              })}
            </div>

            {/* Story feed + write area */}
            <div className="round__game-col" style={{ borderColor: isMyTurn ? myColor.accent : currentPlayerColor.accent }}>
              <div className="round__story-feed">
                {submissions.length === 0 && (
                  <p className="round__feed-empty">The story begins here…</p>
                )}
                {submissions.map((s, i) => {
                  const idx = players.findIndex(p => p.player_id === s.player_id)
                  const { bg, accent } = PLAYER_COLORS[(idx >= 0 ? idx : i) % PLAYER_COLORS.length]
                  return (
                    <div key={i} className="round__sentence" style={{ background: bg, borderColor: accent }}>
                      <span className="round__sentence-author" style={{ color: accent }}>{s.player_name}: </span>
                      <span className="round__sentence-text" style={{ color: accent }}>{s.text}</span>
                    </div>
                  )
                })}
                <div ref={feedEndRef} />
              </div>

              {isMyTurn ? (
                <div className="round__write" style={{ background: myColor.bg, borderTopColor: myColor.accent }}>
                  <textarea
                    className="round__textarea"
                    style={{ background: myColor.bg, color: myColor.accent }}
                    placeholder="Add the next sentence…"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitSentence() }
                    }}
                    autoFocus
                  />
                  <div className="round__write-footer">
                    <span
                      className="round__word-count"
                      style={{ color: myColor.accent, opacity: overLimit ? 1 : 0.45 }}
                    >
                      {words} / 20 words{overLimit && ' — too long!'}
                    </span>
                    <div className="round__done-wrap" style={{ borderColor: myColor.accent }}>
                      <button
                        className="round__done"
                        style={{ color: myColor.accent }}
                        disabled={overLimit || !text.trim()}
                        onClick={submitSentence}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 24 20" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M23.0874 0.916875C21.8912 -0.305625 19.9524 -0.305625 18.7561 0.916875L7.92687 11.9569L5.22015 9.1969C4.0239 7.9819 2.08439 7.9819 0.888887 9.1969C-0.307363 10.4194 -0.307363 12.3994 0.888887 13.6144L5.76164 18.5869C6.95789 19.8094 8.89662 19.8094 10.0929 18.5869L23.0874 5.33439C24.2837 4.11189 24.2837 2.13188 23.0874 0.916875Z" fill={myColor.accent}/>
                        </svg>
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="round__waiting"
                  style={{ background: currentPlayerColor.bg, borderTopColor: currentPlayerColor.accent }}
                >
                  <span style={{ color: currentPlayerColor.accent }}>
                    {currentPlayer?.display_name ?? '…'} is writing…
                  </span>
                </div>
              )}
            </div>

          </div>

          <div
            className="round__timer-clock round__timer-clock--below"
            style={{ color: currentPlayerColor.accent, opacity: currentPlayerId ? 1 : 0 }}
          >
            <svg width="56" height="56" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke={currentPlayerColor.accent}
                strokeOpacity="0.2"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke={currentPlayerColor.accent}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 15}
                strokeDashoffset={2 * Math.PI * 15 * (1 - timeLeft / 30)}
                transform="rotate(-90 18 18)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span
              className="round__timer-num"
              style={{ fontWeight: timeLeft <= 10 ? 700 : 600 }}
            >
              {timeLeft}
            </span>
          </div>

          <p className="round__footer-tagline">Turn-based visual novel maker</p>
        </div>
      </div>
    </div>
  )
}
