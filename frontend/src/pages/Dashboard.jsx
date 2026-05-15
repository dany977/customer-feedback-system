import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [externalStats, setExternalStats] = useState(null)
  const [internalStats, setInternalStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('external')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchExternalStats()
    fetchInternalStats()
  }, [user, navigate])

  const fetchExternalStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/stats/', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setExternalStats(data)
      } else {
        // Mock data
        setExternalStats({
          total_feedback: 7,
          average_satisfaction: 3.71,
          satisfaction_distribution: {
            very_satisfied: 2,
            satisfied: 4,
            neutral: 0,
            dissatisfied: 1,
            very_dissatisfied: 0
          },
          sector_stats: [
            { sector: 'የሚኒስትር ጽ/ቤት', avg_rating: 4.2, count: 2 },
            { sector: 'የሥራ አመራር ዘርፍ', avg_rating: 3.3, count: 3 },
            { sector: 'የእርሻና ሆርቲካልቸር ልማት ዘርፍ', avg_rating: 4.0, count: 2 }
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchInternalStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/employee/stats/')
      if (response.ok) {
        const data = await response.json()
        setInternalStats(data)
      } else {
        // Mock data
        setInternalStats({
          total_feedback: 5,
          average_satisfaction: 4.2,
          satisfaction_distribution: {
            very_satisfied: 3,
            satisfied: 1,
            neutral: 1,
            dissatisfied: 0,
            very_dissatisfied: 0
          },
          department_stats: [
            { department: 'ICT', avg_rating: 4.5, count: 2 },
            { department: 'Finance', avg_rating: 4.0, count: 1 },
            { department: 'Procurement', avg_rating: 4.2, count: 2 }
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  // Prepare data for pie chart based on active tab
  const satisfactionData = (activeTab === 'external' && externalStats?.satisfaction_distribution) ? [
    { name: 'በጣም ረክተዋል (5)', value: externalStats.satisfaction_distribution.very_satisfied, color: '#22c55e' },
    { name: 'ረክተዋል (4)', value: externalStats.satisfaction_distribution.satisfied, color: '#86efac' },
    { name: 'ገለልተኛ (3)', value: externalStats.satisfaction_distribution.neutral, color: '#fbbf24' },
    { name: 'አልረካሁም (2)', value: externalStats.satisfaction_distribution.dissatisfied, color: '#f97316' },
    { name: 'በጣም አልረካሁም (1)', value: externalStats.satisfaction_distribution.very_dissatisfied, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  const internalSatisfactionData = (activeTab === 'internal' && internalStats?.satisfaction_distribution) ? [
    { name: 'በጣም ረክተዋል (5)', value: internalStats.satisfaction_distribution.very_satisfied, color: '#22c55e' },
    { name: 'ረክተዋል (4)', value: internalStats.satisfaction_distribution.satisfied, color: '#86efac' },
    { name: 'ገለልተኛ (3)', value: internalStats.satisfaction_distribution.neutral, color: '#fbbf24' },
    { name: 'አልረካሁም (2)', value: internalStats.satisfaction_distribution.dissatisfied, color: '#f97316' },
    { name: 'በጣም አልረካሁም (1)', value: internalStats.satisfaction_distribution.very_dissatisfied, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  const currentData = activeTab === 'external' ? satisfactionData : internalSatisfactionData
  const currentStats = activeTab === 'external' ? externalStats : internalStats

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <h1 className="text-xl font-bold text-gray-800">የግብርና ሚኒስቴር ዳሽቦርድ</h1>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            ውጣ
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab('external')}
            className={`px-6 py-2 rounded-t-lg transition ${activeTab === 'external' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            🌍 የውጭ ደንበኞች
          </button>
          <button
            onClick={() => setActiveTab('internal')}
            className={`px-6 py-2 rounded-t-lg transition ${activeTab === 'internal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            🏢 የውስጥ ሰራተኞች
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-500 text-sm">ጠቅላላ ግብረመልስ</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{currentStats?.total_feedback || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-gray-500 text-sm">አማካይ እርካታ</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">{currentStats?.average_satisfaction || 0} / 5</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${activeTab === 'external' ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${((currentStats?.average_satisfaction || 0) / 5) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Pie Chart - Satisfaction Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 የእርካታ ስርጭት</h2>
          {currentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={currentData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                >
                  {currentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} ግብረመልሶች`, 'ብዛት']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[350px] flex items-center justify-center text-gray-500">ምንም ውሂብ የለም</div>
          )}
        </div>

        {/* Sector/Department Stats Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {activeTab === 'external' ? '🏢 በዘርፍ የተከፋፈለ እርካታ' : '🏢 በዲፓርትመንት እርካታ'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    {activeTab === 'external' ? 'ዘርፍ' : 'ዲፓርትመንት'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">አማካይ እርካታ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">የግብረመልስ ብዛት</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ደረጃ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeTab === 'external' && externalStats?.sector_stats?.map((sector, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{sector.sector}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{sector.avg_rating?.toFixed(1) || 0}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${((sector.avg_rating || 0) / 5) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{sector.count}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${sector.avg_rating >= 4 ? 'bg-green-100 text-green-800' : sector.avg_rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {sector.avg_rating >= 4 ? 'ከፍተኛ' : sector.avg_rating >= 3 ? 'መካከለኛ' : 'ዝቅተኛ'}
                      </span>
                    </td>
                  </tr>
                ))}
                {activeTab === 'internal' && internalStats?.department_stats?.map((dept, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{dept.department}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{dept.avg_rating?.toFixed(1) || 0}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((dept.avg_rating || 0) / 5) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{dept.count}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${dept.avg_rating >= 4 ? 'bg-green-100 text-green-800' : dept.avg_rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {dept.avg_rating >= 4 ? 'ከፍተኛ' : dept.avg_rating >= 3 ? 'መካከለኛ' : 'ዝቅተኛ'}
                      </span>
                    </td>
                  </tr>
                ))}
                {((activeTab === 'external' && (!externalStats?.sector_stats || externalStats.sector_stats.length === 0)) ||
                  (activeTab === 'internal' && (!internalStats?.department_stats || internalStats.department_stats.length === 0))) && (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">ምንም ውሂብ የለም</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          መረጃው በየቀኑ ይዘመናል | የቅርብ ጊዜ ዝመና: {new Date().toLocaleDateString('am-ET')}
        </div>
      </main>
    </div>
  )
}