import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import QRGenerator from './pages/QRGenerator'
import FeedbackForm from './FeedbackForm'
import Home from './pages/Home'
import About from './pages/About'
import Navbar from './components/Navbar'
import InternalFeedback from './pages/InternalFeedback'
import InternalDashboard from './pages/InternalDashboard'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/internal-feedback" element={<InternalFeedback />} />
        <Route path="/internal-dashboard" element={<InternalDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App