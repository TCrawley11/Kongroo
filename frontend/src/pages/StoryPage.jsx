import { useLocation, useNavigate } from 'react-router-dom'
import './StoryPage.css'

const HARDCODED_CHAPTERS = [
  {
    id: 1,
    author: 'Anya',
    prompt: 'A city waking up to its last normal day — the streets too quiet, the sky the wrong shade of amber.',
    story: 'The morning fog clung to the cobblestones like a held breath. Elena stepped out of her apartment and noticed it immediately — the absence of pigeons, the silence where traffic should have been. The amber light overhead wasn\'t sunrise. It was something else entirely, and deep in her chest, she already knew the world would not recover from today.',
    gradient: 'linear-gradient(135deg, #aa3bff 0%, #7c3aed 100%)',
    accent: '#aa3bff',
  },
  {
    id: 2,
    author: 'Marco',
    prompt: 'An unsigned letter slipped under the door. No stamp, no return address. Just three words that change everything.',
    story: 'She almost stepped over it. The envelope was pale, unremarkable — the kind you could buy anywhere. But the handwriting stopped her cold. She had last seen those loops and slants fourteen years ago, on a birthday card from someone who was supposed to be dead. Inside, three words: *I found it.*',
    gradient: 'linear-gradient(135deg, #e879f9 0%, #db2777 100%)',
    accent: '#e879f9',
  },
  {
    id: 3,
    author: 'Suki',
    prompt: 'The moment the clocks all stopped at once — not just here, but everywhere, all at the same time.',
    story: 'It happened at 11:07 AM. Every clock in the city — digital, analogue, the ancient one in the cathedral square — froze mid-tick. People checked their phones. The phones agreed. Somewhere across the ocean, in a timezone eleven hours ahead, the clocks had also stopped. At 11:07. The same 11:07. Time had not paused. It had simply chosen a side.',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
    accent: '#60a5fa',
  },
  {
    id: 4,
    author: 'Lev',
    prompt: 'A reunion with someone you buried — not metaphorically, but actually buried — standing at your door.',
    story: 'She opened the door because the knock was exactly his knock — three slow, then two fast. He stood in the amber light, wearing the coat she had given to the funeral home. He did not look like a ghost. He looked tired, the way people look after a very long journey. "I\'m sorry it took so long," he said. She could not speak. She stepped aside, and he came home.',
    gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
    accent: '#34d399',
  },
]

function ChapterCard({ chapter }) {
  return (
    <article className="chapter-card">
      <div className="chapter-card__image" style={{ background: chapter.gradient }}>
        <div className="chapter-card__image-overlay">
          <span className="chapter-card__image-label">AI image</span>
        </div>
      </div>
      <div className="chapter-card__body">
        <div className="chapter-card__meta">
          <span className="chapter-card__num" style={{ color: chapter.accent }}>
            Chapter {chapter.id}
          </span>
          <span className="chapter-card__author">by {chapter.author}</span>
        </div>
        <blockquote className="chapter-card__prompt" style={{ borderLeftColor: chapter.accent }}>
          "{chapter.prompt}"
        </blockquote>
        <p className="chapter-card__story">{chapter.story}</p>
      </div>
    </article>
  )
}

export default function StoryPage() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const chapters = state?.prompts
    ? HARDCODED_CHAPTERS.map((c, i) => ({
        ...c,
        author: state.players?.[i]?.name ?? c.author,
        prompt: state.prompts[i]?.text ?? c.prompt,
      }))
    : HARDCODED_CHAPTERS

  return (
    <div className="story">
      <header className="story__header">
        <button className="story__back" onClick={() => navigate('/lobby')}>
          ← Back
        </button>
        <div className="story__meta">
          <h1 className="story__title">Kongroo</h1>
          <p className="story__tagline">A collaborative visual novel</p>
        </div>
        <div className="story__header-spacer" />
      </header>

      <main className="story__grid">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </main>

      <footer className="story__footer">
        <button className="story__restart" onClick={() => navigate('/')}>
          Start a new story →
        </button>
      </footer>
    </div>
  )
}
