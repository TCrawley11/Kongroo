import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LobbyPage from './pages/LobbyPage'
import StoryPage from './pages/StoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/story" element={<StoryPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
