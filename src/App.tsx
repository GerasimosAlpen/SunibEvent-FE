import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home,NotFound,Events,Dashboard } from './pages'
import Login from './pages/auth/Login'


function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  )
}

export default App
