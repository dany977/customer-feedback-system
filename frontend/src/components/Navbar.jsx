import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'ዋና ገጽ' },
    { path: '/about', label: 'ስለ እኛ' },
    { path: '/feedback', label: 'ግብረመልስ' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <span className="font-bold text-green-800 text-lg">የግብርና ሚኒስቴር</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition ${
                  isActive(link.path)
                    ? 'text-green-600 font-bold border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">እንኳን ደህና መጡ, {user.username}</span>
                <Link to="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  ዳሽቦርድ
                </Link>
              </div>
            ) : (
              <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                መግቢያ
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}