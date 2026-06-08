// frontend/src/pages/UnifiedDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  AreaChart, Area
} from 'recharts'

export default function UnifiedDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [externalStats, setExternalStats] = useState(null)
  const [internalStats, setInternalStats] = useState(null)
  const [recentFeedback, setRecentFeedback] = useState([])

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch external stats
      const externalRes = await fetch('http://localhost:8000/api/dashboard/stats/')
      if (externalRes.ok) {
        const externalData = await externalRes.json()
        setExternalStats(externalData)
      } else {
        // Mock data for external
        setExternalStats({
          total_feedback: 156,
          average_satisfaction: 4.1,
          satisfaction_distribution: {
            very_satisfied: 78,
            satisfied: 45,
            neutral: 20,
            dissatisfied: 8,
            very_dissatisfied: 5
          },
          sector_stats: [
            { sector: 'የሚኒስትር ጽ/ቤት', avg_rating: 4.3, count: 45 },
            { sector: 'የእርሻና ሆርቲካልቸር', avg_rating: 4.0, count: 38 },
            { sector: 'የእንስሳትና ዓሳ ልማት', avg_rating: 4.2, count: 32 },
            { sector: 'የግብርና ኢንቨስትመንት', avg_rating: 3.8, count: 41 }
          ]
        })
      }

      // Fetch internal stats
      const internalRes = await fetch('http://localhost:8000/api/employee/stats/')
      if (internalRes.ok) {
        const internalData = await internalRes.json()
        setInternalStats(internalData)
      } else {
        // Mock data for internal
        setInternalStats({
          total_feedback: 87,
          average_satisfaction: 4.3,
          satisfaction_distribution: {
            very_satisfied: 42,
            satisfied: 28,
            neutral: 12,
            dissatisfied: 4,
            very_dissatisfied: 1
          },
          department_stats: [
            { department: 'ICT', avg_rating: 4.6, count: 18 },
            { department: 'Finance', avg_rating: 4.3, count: 15 },
            { department: 'HR', avg_rating: 4.4, count: 12 },
            { department: 'Procurement', avg_rating: 4.0, count: 20 },
            { department: 'Logistics', avg_rating: 4.1, count: 14 },
            { department: 'Maintenance', avg_rating: 4.2, count: 8 }
          ]
        })
      }

      // Mock recent feedback
      setRecentFeedback([
        { id: 1, type: 'ውጭ', name: 'አብይ ተመስገን', dept: 'የሚኒስትር ጽ/ቤት', rating: 5, date: '2024-01-15' },
        { id: 2, type: 'ውስጥ', name: 'ሰራተኛ 101', dept: 'ICT', rating: 4, date: '2024-01-15' },
        { id: 3, type: 'ውጭ', name: 'ሰላም አለሙ', dept: 'የእንስሳት ልማት', rating: 5, date: '2024-01-14' },
        { id: 4, type: 'ውስጥ', name: 'ሰራተኛ 205', dept: 'Finance', rating: 3, date: '2024-01-14' },
        { id: 5, type: 'ውጭ', name: 'ብርሃን ገብረ', dept: 'የእርሻ ልማት', rating: 4, date: '2024-01-13' }
      ])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Prepare combined satisfaction data
  const combinedSatisfaction = [
    { name: 'ውጭ ደንበኞች', very_satisfied: externalStats?.satisfaction_distribution?.very_satisfied || 0, satisfied: externalStats?.satisfaction_distribution?.satisfied || 0, neutral: externalStats?.satisfaction_distribution?.neutral || 0 },
    { name: 'ውስጥ ሰራተኞች', very_satisfied: internalStats?.satisfaction_distribution?.very_satisfied || 0, satisfied: internalStats?.satisfaction_distribution?.satisfied || 0, neutral: internalStats?.satisfaction_distribution?.neutral || 0 }
  ]

  const weeklyTrend = [
    { day: 'ሰኞ', external: 4.2, internal: 4.5 },
    { day: 'ማክሰ', external: 4.0, internal: 4.3 },
    { day: 'ረቡዕ', external: 4.3, internal: 4.4 },
    { day: 'ሐሙስ', external: 4.1, internal: 4.2 },
    { day: 'አርብ', external: 4.4, internal: 4.6 },
    { day: 'ቅዳሜ', external: 4.0, internal: 4.1 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ውሂብ በመጫን ላይ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-blue-700 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <span className="text-3xl">🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">የግብርና ሚኒስቴር ዳሽቦርድ</h1>
                <p className="text-green-100 text-sm mt-1">የውስጥ እና የውጭ አጠቃላይ እርካታ መረጃ</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/feedback" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition text-sm">
                📝 የውጭ ቅጽ
              </Link>
              <Link to="/internal-feedback" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition text-sm">
                🏢 የውስጥ ቅጽ
              </Link>
              <Link to="/" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition text-sm">
                🏠 ዋና ገጽ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap gap-2 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-t-lg transition flex items-center gap-2 font-medium ${activeTab === 'overview' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <span>📊</span> አጠቃላይ እይታ
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`px-6 py-3 rounded-t-lg transition flex items-center gap-2 font-medium ${activeTab === 'external' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <span>🌍</span> የውጭ ደንበኞች
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-6 py-3 rounded-t-lg transition flex items-center gap-2 font-medium ${activeTab === 'internal' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <span>🏢</span> የውስጥ ሰራተኞች
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-6 py-3 rounded-t-lg transition flex items-center gap-2 font-medium ${activeTab === 'comparison' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <span>⚖️</span> ንጽጽር
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-blue-100 text-sm">ጠቅላላ ግብረመልስ</p>
                    <p className="text-3xl font-bold mt-1">{(externalStats?.total_feedback || 0) + (internalStats?.total_feedback || 0)}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">📊</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-green-100 text-sm">አማካይ እርካታ</p>
                    <p className="text-3xl font-bold mt-1">{(((externalStats?.average_satisfaction || 0) + (internalStats?.average_satisfaction || 0)) / 2).toFixed(1)} / 5</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">⭐</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-purple-100 text-sm">የውጭ ግብረመልስ</p>
                    <p className="text-3xl font-bold mt-1">{externalStats?.total_feedback || 0}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">🌍</div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-indigo-100 text-sm">የውስጥ ግብረመልስ</p>
                    <p className="text-3xl font-bold mt-1">{internalStats?.total_feedback || 0}</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-lg">🏢</div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Satisfaction Comparison */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> የእርካታ ንጽጽር
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={combinedSatisfaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="very_satisfied" fill="#10b981" name="በጣም ረክተዋል" />
                    <Bar dataKey="satisfied" fill="#34d399" name="ረክተዋል" />
                    <Bar dataKey="neutral" fill="#fbbf24" name="ገለልተኛ" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Weekly Trend */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span> ሳምንታዊ አዝማሚያ
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="external" stroke="#3b82f6" name="ውጭ ደንበኞች" strokeWidth={2} />
                    <Line type="monotone" dataKey="internal" stroke="#8b5cf6" name="ውስጥ ሰራተኞች" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Feedback Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
                <h2 className="text-white font-bold flex items-center gap-2">
                  <span>📝</span> የቅርብ ጊዜ ግብረመልሶች
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">መታወቂያ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ዓይነት</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ስም/ዲፓርትመንት</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">እርካታ</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">ቀን</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentFeedback.map(fb => (
                      <tr key={fb.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-sm text-gray-500">#{fb.id}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${fb.type === 'ውጭ' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {fb.type}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm">{fb.name}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{fb.rating}</span>
                            <div className="text-yellow-400">{'⭐'.repeat(fb.rating)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">{fb.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* External Tab */}
        {activeTab === 'external' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">ጠቅላላ የውጭ ግብረመልስ</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{externalStats?.total_feedback || 0}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">አማካይ እርካታ</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{externalStats?.average_satisfaction || 0} / 5</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">የእርካታ መጠን</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {((((externalStats?.satisfaction_distribution?.very_satisfied || 0) + (externalStats?.satisfaction_distribution?.satisfied || 0)) / (externalStats?.total_feedback || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🏢 በዘርፍ የተከፋፈለ እርካታ</h2>
              <div className="space-y-4">
                {externalStats?.sector_stats?.map((sector, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-48 text-sm font-medium">{sector.sector}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(sector.avg_rating / 5) * 100}%` }} />
                        </div>
                        <span className="text-sm font-bold w-12">{sector.avg_rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 w-20">({sector.count})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Internal Tab */}
        {activeTab === 'internal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">ጠቅላላ የውስጥ ግብረመልስ</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{internalStats?.total_feedback || 0}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">አማካይ እርካታ</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{internalStats?.average_satisfaction || 0} / 5</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-500 text-sm">የእርካታ መጠን</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {((((internalStats?.satisfaction_distribution?.very_satisfied || 0) + (internalStats?.satisfaction_distribution?.satisfied || 0)) / (internalStats?.total_feedback || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🏢 በዲፓርትመንት እርካታ</h2>
              <div className="space-y-4">
                {internalStats?.department_stats?.map((dept, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium">{dept.department}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${(dept.avg_rating / 5) * 100}%` }} />
                        </div>
                        <span className="text-sm font-bold w-12">{dept.avg_rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 w-20">({dept.count})</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                <span>🌍</span> የውጭ ደንበኞች እርካታ
              </h2>
              <div className="space-y-3">
                {Object.entries(externalStats?.satisfaction_distribution || {}).map(([key, value]) => {
                  const labels = { very_satisfied: 'በጣም ረክተዋል', satisfied: 'ረክተዋል', neutral: 'ገለልተኛ', dissatisfied: 'አልረካሁም', very_dissatisfied: 'በጣም አልረካሁም' }
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-36 text-sm">{labels[key] || key}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${(value / (externalStats?.total_feedback || 1)) * 100}%` }} />
                      </div>
                      <div className="text-sm font-bold w-16">{value}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <span>🏢</span> የውስጥ ሰራተኞች እርካታ
              </h2>
              <div className="space-y-3">
                {Object.entries(internalStats?.satisfaction_distribution || {}).map(([key, value]) => {
                  const labels = { very_satisfied: 'በጣም ረክተዋል', satisfied: 'ረክተዋል', neutral: 'ገለልተኛ', dissatisfied: 'አልረካሁም', very_dissatisfied: 'በጣም አልረካሁም' }
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="w-36 text-sm">{labels[key] || key}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${(value / (internalStats?.total_feedback || 1)) * 100}%` }} />
                      </div>
                      <div className="text-sm font-bold w-16">{value}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}