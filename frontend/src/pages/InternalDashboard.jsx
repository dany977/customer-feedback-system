import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function InternalDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/employee/stats/')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏢</span>
            <h1 className="text-xl font-bold">የውስጥ ሰራተኞች ዳሽቦርድ</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/internal-feedback" className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600">➕ አዲስ ምላሽ</Link>
            <Link to="/" className="bg-gray-500 px-4 py-2 rounded-lg hover:bg-gray-600">🏠 ዋና ገጽ</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-500 text-sm">ጠቅላላ ምላሽ</div>
            <div className="text-3xl font-bold mt-2">{stats?.total_feedback || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-500 text-sm">አማካይ እርካታ</div>
            <div className="text-3xl font-bold mt-2">{stats?.average_satisfaction || 0} / 5</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4">🏢 በዲፓርትመንት እርካታ</h2>
          {stats?.department_stats?.map((dept, i) => (
            <div key={i} className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <span className="w-40">{dept.department}</span>
              <span className="font-bold w-12">{dept.avg_rating?.toFixed(1)}/5</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(dept.avg_rating / 5) * 100}%` }} />
              </div>
            </div>
          ))}
          {(!stats?.department_stats || stats.department_stats.length === 0) && (
            <div className="text-center text-gray-500 py-8">ምንም ውሂብ የለም</div>
          )}
        </div>
      </main>
    </div>
  )
}