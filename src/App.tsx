import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home,NotFound,Events,Dashboard,Admin } from './pages'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import EventDetail from './pages/EventDetail'


function App() {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
  )
}

export default App
