import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NamePicker from '../components/NamePicker'
// import ShareLink from '../components/ShareLink'
import './HomePage.css'

export default function HomePage() {
  const [authorName, setAuthorName] = useState('')
  const navigate = useNavigate()

  return (
    <div className="home">
      <main className="home__content">
        <div className="home__logo-row">
          <h1 className="home__title">Kongroo</h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="47" height="51" viewBox="0 0 47 51" fill="none" style={{ width: 32, height: 32, filter: 'drop-shadow(0 3px 0 #FCBADE)', flexShrink: 0 }}>
            <g filter="url(#filter0_d_5_81)">
              <path d="M32.3125 0L47 14.6875L41.125 20.5625V35.25L8.8125 47L6.48339 44.6709L19.0408 32.1136C19.5261 32.2432 20.0362 32.3125 20.5625 32.3125C23.8072 32.3125 26.4375 29.6823 26.4375 26.4375C26.4375 23.1928 23.8072 20.5625 20.5625 20.5625C17.3178 20.5625 14.6875 23.1928 14.6875 26.4375C14.6875 26.9638 14.7567 27.4739 14.8865 27.9592L2.32912 40.5166L0 38.1875L11.75 5.875H26.4375L32.3125 0Z" fill="#620437"/>
            </g>
            <defs>
              <filter id="filter0_d_5_81" x="0" y="0" width="47" height="51" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.988235 0 0 0 0 0.729412 0 0 0 0 0.870588 0 0 0 1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5_81"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_5_81" result="shape"/>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="home__form-group">
          <div className="home__input-group">
            <p className="home__nickname-hint">Choose a nickname!</p>
            <NamePicker value={authorName} onChange={setAuthorName} />
          </div>

          <div className="home__cta-wrapper">
          <button
            className="home__cta"
            disabled={!authorName}
            onClick={() => navigate('/lobby', { state: { authorName } })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 21 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M18.8391 8.82288L5.14547 0.487497C2.85288 -0.907143 0 0.85733 0 3.66495V20.3349C0 23.1461 2.85288 24.907 5.14547 23.5123L18.8391 15.1811C21.1489 13.7755 21.1489 10.2285 18.8391 8.82288Z" fill="#620437"/>
            </svg>
            Start Game
          </button>
          </div>
        </div>

        <div className="home__join-section">
          <p className="home__join-hint">See existing lobbies!</p>
          <div className="home__join-wrapper">
            <button className="home__join" onClick={() => navigate('/lobby')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_5_109)">
                  <path d="M1.5 6.5C1.5 3.46243 3.96243 1 7 1C10.0376 1 12.5 3.46243 12.5 6.5C12.5 9.53757 10.0376 12 7 12C3.96243 12 1.5 9.53757 1.5 6.5Z" fill="#620437"/>
                  <path d="M14.4999 6.5C14.4999 8.00034 14.0593 9.39779 13.3005 10.57C14.2774 11.4585 15.5754 12 16.9999 12C20.0375 12 22.4999 9.53757 22.4999 6.5C22.4999 3.46243 20.0375 1 16.9999 1C15.5754 1 14.2774 1.54153 13.3005 2.42996C14.0593 3.60221 14.4999 4.99966 14.4999 6.5Z" fill="#620437"/>
                  <path d="M0 18C0 15.7909 1.79086 14 4 14H10C12.2091 14 14 15.7909 14 18V22C14 22.5523 13.5523 23 13 23H1C0.447716 23 0 22.5523 0 22V18Z" fill="#620437"/>
                  <path d="M16 18V23H23C23.5522 23 24 22.5523 24 22V18C24 15.7909 22.2091 14 20 14H14.4722C15.4222 15.0615 16 16.4633 16 18Z" fill="#620437"/>
                </g>
                <defs>
                  <clipPath id="clip0_5_109">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
              Join game
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
