import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { Home,NotFound,Events,Dashboard } from './pages'
import { Navigationbar } from './components'

function App() {
  return (
    <>
      <Navigationbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  )
}

export default App
