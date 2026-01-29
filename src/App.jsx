import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Game from './pages/Game'
import Login from './pages/Login'
import AddGame from './pages/AddGame'
import MyGames from './pages/MyGames'
import Moderation from './pages/Moderation'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Catalog />} />
            <Route path="games/:id" element={<Game />} />
            <Route path="login" element={<Login />} />
            <Route path="add-game" element={<AddGame />} />
            <Route path="my-games" element={<MyGames />} />
            <Route path="moderation" element={<Moderation />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
