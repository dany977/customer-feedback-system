import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top row with logo centered */}
        <div className="flex justify-center items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="የግብርና ሚኒስቴር" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span className="font-bold text-green-800 text-lg">የግብርና ሚኒስቴር</span>
          </Link>
        </div>

        {/* Desktop Menu - Centered */}
        <div className="hidden md:flex justify-center gap-6 py-3 border-t">
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
         
          <Link to="/unified-dashboard" className={`transition ${isActive('/unified-dashboard') ? 'text-green-600 font-bold border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}>
  📊 የተዋሃደ ዳሽቦርድ
</Link>
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.username}</span>
              <Link to="/dashboard" className="text-gray-600 hover:text-green-600">📊 ዳሽቦርድ</Link>
            </>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-green-600">🔐 መግቢያ</Link>
          )}
        </div>

        {/* Mobile Menu Button (top right) */}
        <div className="md:hidden absolute right-4 top-4">
          <button className="text-gray-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}