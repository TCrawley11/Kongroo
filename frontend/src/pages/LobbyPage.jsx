import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import './LobbyPage.css'

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
  <svg xmlns="http://www.w3.org/2000/svg" width="37" height="39" viewBox="0 0 37 39" fill="none" style={{ flexShrink: 0 }}>
    <path d="M32.6027 24.7508C32.5683 26.042 30.0741 26.9385 31.0902 28.2213C33.3315 28.5362 32.3126 30.0212 33.5405 30.5272C31.3693 34.061 27.8672 34.5023 24.5356 32.29C23.6652 31.7156 22.6038 31.5067 21.5807 31.7083C21.072 32.5237 21.8296 32.6186 22.3136 32.7368C24.6511 33.203 27.0175 36.8233 34.943 33.3748C36.0003 32.9307 35.8395 31.6231 35.3816 30.5946C36.2602 30.2206 36.3138 29.2443 36.4431 27.989C37.3066 25.1633 34.4755 25.404 32.6027 24.7508ZM20.1411 18.6087C18.9598 18.8799 17.8335 19.351 16.8108 20.0016C18.1377 20.7812 18.6643 21.7107 20.1411 21.4206C21.6178 21.1305 21.5903 20.1831 21.0087 19.0748C20.9278 18.9189 20.8017 18.7909 20.6469 18.7078C20.4921 18.6246 20.3158 18.5901 20.1411 18.6087ZM26.3795 0.00083813C24.5755 0.0833381 23.0245 4.91509 21.1847 8.34021C15.8965 10.5402 14.5723 7.68709 12.8453 8.15596C9.9042 2.16234 5.5372 -3.84916 4.35745 3.30084C4.61733 8.69909 2.4627 9.14459 2.65383 16.8487C2.65383 16.8487 -1.19617 24.5845 0.378204 31.4306C0.778297 33.2411 1.71966 34.887 3.07728 36.1498C4.43491 37.4126 6.14456 38.2326 7.9792 38.5008C8.2542 36.5277 11.3466 32.0782 10.4996 31.0401C8.38483 28.4496 9.04895 22.1026 14.4046 21.4481C15.1375 16.109 18.7688 17.1141 18.3921 15.57C17.2275 10.7327 22.2503 12.9905 23.0932 14.5758C24.6057 17.0893 25.6741 19.5602 26.9116 20.7303C28.0416 21.7339 29.3404 22.5294 30.7478 23.0802C30.2982 22.8052 26.4482 19.5423 25.3207 16.9257C24.8624 15.2595 24.657 13.5338 24.7116 11.8066C26.6655 11.5 27.4533 14.7876 29.575 17.77C29.6151 17.8527 29.636 17.9434 29.636 18.0353C29.636 18.1273 29.6151 18.218 29.575 18.3007C29.2835 18.1467 29.1817 17.759 28.8297 17.7122C28.5093 17.7122 28.2508 18.166 28.2508 18.7256C28.2508 19.2852 28.673 19.486 29.2546 19.7472C29.7756 20.785 30.6491 21.6034 31.7186 22.0558L29.1061 14.4122C29.0098 9.62446 29.5186 4.83809 26.7425 0.0503381C26.6253 0.0126754 26.5024 -0.00407999 26.3795 0.00083813ZM26.4042 1.52709C26.5486 1.52709 26.6792 1.62196 26.8016 1.84471C28.2495 4.56584 28.3031 10.9541 28.2921 13.2132C27.6046 11.6485 26.5747 9.01671 23.327 8.21509C23.327 8.21509 25.2245 1.54771 26.4042 1.52709ZM6.94933 2.13484C7.60933 2.13484 8.36008 2.51984 9.22908 4.10659C10.622 6.64484 11.6202 8.33334 12.1056 9.21334C13.0983 11.0008 11.6711 9.58734 11.2242 14.1785C11.2093 14.5477 11.1004 14.907 10.908 15.2224C10.7155 15.5378 10.4457 15.799 10.1242 15.9811C8.47325 13.9744 7.37505 11.5714 6.93833 9.00984C5.55233 11.0723 7.8362 14.2527 7.87608 16.9766C6.86219 17.2693 5.78803 17.2826 4.7672 17.0151C4.0522 16.6576 3.81708 12.2988 5.14258 8.91496C6.24258 6.09621 5.72145 2.51296 6.21233 2.35621C6.55058 2.24896 6.55333 2.13759 6.94933 2.13484Z" fill={accent}/>
  </svg>
)

export default function LobbyPage() {
  const { roomId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()

  const authorName = state?.authorName ?? 'Player'
  const playerId = state?.playerId ?? sessionStorage.getItem('kongroo_player_id') ?? ''

  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [connected, setConnected] = useState(false)

  const wsRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL ?? ''
    const wsBase = apiBase
      ? apiBase.replace(/^http/, 'ws')
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
    const ws = new WebSocket(
      `${wsBase}/ws/${roomId}?player_id=${encodeURIComponent(playerId)}`
    )
    wsRef.current = ws

    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      switch (msg.type) {
        case 'room_update': {
          const room = msg.room
          if (!room) return
          setPlayers(room.players.map((p) => ({ name: p.display_name, isHost: p.is_host })))
          const me = room.players.find((p) => p.player_id === playerId)
          if (me) setIsHost(me.is_host)
          break
        }
        case 'chat':
          setMessages((prev) => [...prev, { username: msg.username, message: msg.message }])
          break
        case 'game_started':
          navigate('/round', {
            state: {
              roomId,
              playerId,
              authorName,
              currentPlayerId: msg.current_player_id,
              players: msg.players,
            },
          })
          break
      }
    }

    return () => ws.close()
  }, [roomId, playerId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendChat = useCallback(() => {
    const text = input.trim()
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify({ type: 'chat', message: text }))
    setInput('')
  }, [input])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendChat()
    }
  }

  const handleStartGame = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'start_game' }))
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="lobby">
      <div className="lobby__body">
        <div className="lobby__main">

          <div className="lobby__hero">
            <div className="lobby__logo-row">
              <h1 className="lobby__title">Kongroo</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="47" height="51" viewBox="0 0 47 51" fill="none" style={{ width: 28, height: 28, filter: 'drop-shadow(0 3px 0 #FCBADE)', flexShrink: 0 }}>
                <g filter="url(#lobby_logo_filter)">
                  <path d="M32.3125 0L47 14.6875L41.125 20.5625V35.25L8.8125 47L6.48339 44.6709L19.0408 32.1136C19.5261 32.2432 20.0362 32.3125 20.5625 32.3125C23.8072 32.3125 26.4375 29.6823 26.4375 26.4375C26.4375 23.1928 23.8072 20.5625 20.5625 20.5625C17.3178 20.5625 14.6875 23.1928 14.6875 26.4375C14.6875 26.9638 14.7567 27.4739 14.8865 27.9592L2.32912 40.5166L0 38.1875L11.75 5.875H26.4375L32.3125 0Z" fill="#620437"/>
                </g>
                <defs>
                  <filter id="lobby_logo_filter" x="0" y="0" width="47" height="51" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
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
            <p className="lobby__tagline">Share your invite code with friends!</p>
            <button className="lobby__invite-outer" onClick={copyCode} title="Click to copy">
              <div className="lobby__invite-inner">
                <span className="lobby__invite-code">
                  {copied ? '✓ Copied!' : roomId}
                </span>
              </div>
            </button>
          </div>

          <div className="lobby__content-row">
            <div className="lobby__name-cards">
              {players.map((player, i) => {
                const { bg, accent } = PLAYER_COLORS[i % PLAYER_COLORS.length]
                return (
                  <div key={i} className="lobby__name-card" style={{ background: bg, border: `4px solid ${accent}` }}>
                    <KangarooIcon accent={accent} />
                    <span className="lobby__name-card-name" style={{ color: accent }}>
                      {player.name}
                      {player.isHost && <span className="lobby__host-badge"> ★</span>}
                    </span>
                  </div>
                )
              })}
              {players.length === 0 && (
                <p className="lobby__waiting">{connected ? 'Waiting for players…' : 'Connecting…'}</p>
              )}
            </div>

            <div className="lobby__chat-wrapper">
              <div className="lobby__chat-messages">
                {messages.length === 0 && (
                  <p className="lobby__chat-empty">No messages yet. Say hello!</p>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className="lobby__chat-msg">
                    <span className="lobby__chat-msg-user">{msg.username}: </span>
                    <span className="lobby__chat-msg-text">{msg.message}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="lobby__chat-input-row">
                <input
                  className="lobby__chat-input"
                  placeholder="Say something…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                />
                <button className="lobby__chat-send" onClick={sendChat} disabled={!input.trim()}>
                  Send
                </button>
              </div>
            </div>
          </div>

          {isHost && (
            <div className="lobby__start-wrapper">
              <button className="lobby__start" onClick={handleStartGame}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.8391 8.82288L5.14547 0.487497C2.85288 -0.907143 0 0.85733 0 3.66495V20.3349C0 23.1461 2.85288 24.907 5.14547 23.5123L18.8391 15.1811C21.1489 13.7755 21.1489 10.2285 18.8391 8.82288Z" fill="#620437"/>
                </svg>
                Start
              </button>
            </div>
          )}

          <p className="lobby__tagline">Turn-based visual novel maker</p>
        </div>
      </div>
    </div>
  )
}
