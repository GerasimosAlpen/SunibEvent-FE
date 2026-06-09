import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home,NotFound,Events,Dashboard,Admin } from './pages'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import EventDetail from './pages/EventDetail'
import OrganizerLayout from './pages/organizer/OrganizerLayout'
import PostManagement from './pages/organizer/PostManagement'
import CreateEvent from './pages/organizer/CreateEvent'


function App() {
  return (
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/organizer" element={<OrganizerLayout />}>
            <Route index element={<PostManagement />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="posts/create" element={<CreateEvent />} />
            <Route path="posts/edit/:id" element={<CreateEvent />} />
          </Route>
          <Route path="/organizer/posts/:id" element={<EventDetail />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
  )
}

export default App
