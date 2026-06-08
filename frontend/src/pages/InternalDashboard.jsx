// frontend/src/pages/InternalDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

export default function InternalDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('all')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/employee/stats/')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      } else {
        // Mock data for development
        setStats({
          total_feedback: 24,
          average_satisfaction: 4.2,
          satisfaction_distribution: {
            very_satisfied: 12,
            satisfied: 8,
            neutral: 3,
            dissatisfied: 1,
            very_dissatisfied: 0
          },
          department_stats: [
            { department: 'ICT', avg_rating: 4.6, count: 5 },
            { department: 'Finance', avg_rating: 4.2, count: 4 },
            { department: 'HR', avg_rating: 4.5, count: 3 },
            { department: 'Procurement', avg_rating: 3.9, count: 6 },
            { department: 'Logistics', avg_rating: 4.0, count: 4 },
            { department: 'Maintenance', avg_rating: 4.3, count: 2 }
          ]
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ውሂብ በመጫን ላይ...</p>
        </div>
      </div>
    )
  }

  // Prepare data for pie chart
  const satisfactionData = stats?.satisfaction_distribution ? [
    { name: 'በጣም ረክተዋል', value: stats.satisfaction_distribution.very_satisfied, color: '#10b981', bg: 'bg-green-500' },
    { name: 'ረክተዋል', value: stats.satisfaction_distribution.satisfied, color: '#34d399', bg: 'bg-green-400' },
    { name: 'ገለልተኛ', value: stats.satisfaction_distribution.neutral, color: '#fbbf24', bg: 'bg-yellow-500' },
    { name: 'አልረካሁም', value: stats.satisfaction_distribution.dissatisfied, color: '#f97316', bg: 'bg-orange-500' },
    { name: 'በጣም አልረካሁም', value: stats.satisfaction_distribution.very_dissatisfied, color: '#ef4444', bg: 'bg-red-500' }
  ].filter(item => item.value > 0) : []

  // Department data for bar chart
  const departmentData = stats?.department_stats?.map(dept => ({
    name: dept.department,
    rating: dept.avg_rating,
    count: dept.count
  })) || []

  // Calculate percentages
  const total = stats?.total_feedback || 0
  const satisfactionRate = total > 0 ? 
    ((stats.satisfaction_distribution.very_satisfied + stats.satisfaction_distribution.satisfied) / total * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <span className="text-3xl">🏢</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">የውስጥ ሰራተኞች እርካታ ዳሽቦርድ</h1>
                <p className="text-blue-100 text-sm mt-1">የሰራተኞች አስተያየት ትንተና</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/internal-feedback" 
                className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-xl transition flex items-center gap-2"
              >
                <span>➕</span> አዲስ ምላሽ
              </Link>
              <Link 
                to="/" 
                className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-xl transition flex items-center gap-2"
              >
                <span>🏠</span> ዋና ገጽ
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ጠቅላላ ግብረመልስ</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.total_feedback || 0}</p>
                <p className="text-green-600 text-xs mt-2">↑ ከባለፈው ወር</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">አማካይ እርካታ</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-bold text-gray-800">{stats?.average_satisfaction || 0}</p>
                  <span className="text-gray-500">/ 5</span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats?.average_satisfaction || 0) / 5 * 100}%` }} />
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">የእርካታ መጠን</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{satisfactionRate}%</p>
                <p className="text-green-600 text-xs mt-2">በጣም ረክተዋል + ረክተዋል</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">የተሳተፉ ዲፓርትመንቶች</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats?.department_stats?.length || 0}</p>
                <p className="text-blue-600 text-xs mt-2">የተለያዩ ክፍሎች</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">🏛️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>🥧</span> የእርካታ ስርጭት
              </h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">ሙሉ ውሂብ</span>
            </div>
            {satisfactionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ሰዎች`, 'ብዛት']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-400">
                ምንም ውሂብ የለም
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>📊</span> በዲፓርትመንት እርካታ
              </h2>
              <select className="text-xs border rounded-lg px-2 py-1 bg-gray-50">
                <option>አማካይ እርካታ</option>
              </select>
            </div>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tickCount={6} />
                  <Tooltip formatter={(value) => [`${value} / 5`, 'አማካይ እርካታ']} />
                  <Legend />
                  <Bar dataKey="rating" fill="#3b82f6" radius={[8, 8, 0, 0]} name="አማካይ እርካታ">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.rating >= 4 ? '#10b981' : entry.rating >= 3 ? '#fbbf24' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-gray-400">
                ምንም ውሂብ የለም
              </div>
            )}
          </div>
        </div>

        {/* Department Statistics Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <span>📋</span> የዲፓርትመንት እርካታ ዝርዝር
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">#</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ዲፓርትመንት</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">አማካይ እርካታ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">የግብረመልስ ብዛት</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ደረጃ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">እድገት</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {departmentData.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm">🏢</span>
                        </div>
                        <span className="font-medium text-gray-800">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{dept.rating?.toFixed(1)}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(dept.rating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{dept.count} ግብረመልሶች</span>
                    </td>
                    <td className="px-6 py-4">
                      {dept.rating >= 4 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                          <span>🌟</span> ከፍተኛ
                        </span>
                      ) : dept.rating >= 3 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                          <span>📊</span> መካከለኛ
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 w-fit">
                          <span>⚠️</span> ዝቅተኛ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {dept.rating >= 4 ? (
                        <span className="text-green-600 text-sm">↑ +12%</span>
                      ) : dept.rating >= 3 ? (
                        <span className="text-yellow-600 text-sm">→ 0%</span>
                      ) : (
                        <span className="text-red-600 text-sm">↓ -5%</span>
                      )}
                    </td>
                  </tr>
                ))}
                {departmentData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                      ምንም ውሂብ የለም
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <div className="flex justify-center gap-6">
            <span>📅 መረጃው በየቀኑ ይዘመናል</span>
            <span>🕐 የቅርብ ጊዜ ዝመና: {new Date().toLocaleDateString('am-ET')}</span>
          </div>
        </div>
      </main>
    </div>
  )
}