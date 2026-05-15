import { Link, useNavigate } from 'react-router-dom'

export default function InternalNavbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('employee')
    navigate('/internal')
  }

  return (
    <nav style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '24px' }}>🏢</span>
        <Link to="/internal-feedback" style={{ color: 'white', textDecoration: 'none' }}>📝 መጠይቅ</Link>
        <Link to="/internal-dashboard" style={{ color: 'white', textDecoration: 'none' }}>📊 ዳሽቦርድ</Link>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>🏠 ዋና ገጽ</Link>
      </div>
      <button onClick={handleLogout} style={{ backgroundColor: '#dc2626', padding: '8px 16px', borderRadius: '8px', border: 'none', color: 'white', cursor: 'pointer' }}>🚪 ውጣ</button>
    </nav>
  )
}