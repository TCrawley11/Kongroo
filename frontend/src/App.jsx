import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import StoryPage from './pages/StoryPage'
import RoundPage from './pages/RoundPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby/:roomId" element={<LobbyPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/round" element={<RoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
