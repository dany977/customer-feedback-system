import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <span className="font-bold text-green-800 text-lg">የግብርና ሚኒስቴር</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`transition ${isActive('/') ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}>
              ዋና ገጽ
            </Link>
            <Link to="/about" className={`transition ${isActive('/about') ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}>
              ስለ እኛ
            </Link>
            <Link to="/feedback" className={`transition ${isActive('/feedback') ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}>
              📝 የውጭ ቅጽ
            </Link>
            <Link to="/internal-feedback" className={`transition ${isActive('/internal-feedback') ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}>
              🏢 የውስጥ ቅጽ
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.username}</span>
                <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  📊 ዳሽቦርድ
                </Link>
              </div>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                🔐 መግቢያ
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}