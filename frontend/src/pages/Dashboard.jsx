import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  RadialBarChart, RadialBar, AreaChart, Area
} from 'recharts'
import { 
  ArrowRightOnRectangleIcon, 
  DocumentArrowDownIcon,
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  QrCodeIcon,
  CalendarIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [recentFeedback, setRecentFeedback] = useState([])

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchStats()
    fetchRecentFeedback()
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/stats/', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Mock data
        setStats({
          total_feedback: 2,
          average_satisfaction: 4.5,
          satisfaction_distribution: {
            very_satisfied: 1,
            satisfied: 1,
            neutral: 0,
            dissatisfied: 0,
            very_dissatisfied: 0
          },
          sector_stats: [
            { sector: 'የሚኒስትር ጽ/ቤት', avg_rating: 4.5, count: 1 },
            { sector: 'የእርሻ ልማት', avg_rating: 4.5, count: 1 }
          ],
          rating_averages: {
            ease_of_access: 4.5,
            staff_respect: 4.5,
            staff_clarity: 4.5,
            fast_response: 4.5,
            accurate_service: 4.5,
            clear_info: 4.5,
            timely_service: 4.5,
            met_expectations: 4.5
          },
          monthly_trend: [
            { month: 'ጥር', count: 0, avg: 0 },
            { month: 'የካ', count: 0, avg: 0 },
            { month: 'መጋ', count: 1, avg: 4.5 },
            { month: 'ሚያ', count: 1, avg: 4.5 },
            { month: 'ግን', count: 0, avg: 0 },
            { month: 'ሰኔ', count: 0, avg: 0 }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentFeedback = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/feedback/list/', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setRecentFeedback(data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching recent feedback:', error)
    }
  }

  const exportToExcel = () => {
    setExporting(true)
    try {
      // Prepare data for Excel
      const excelData = recentFeedback.map(item => ({
        'መታወቂያ': item.id,
        'ተጠቃሚ': item.provider_name || 'N/A',
        'ጾታ': item.gender === 'male' ? 'ወንድ' : 'ሴት',
        'ዘርፍ': item.sector || 'N/A',
        'አገልግሎት ዓይነት': item.service_types || 'N/A',
        'ቀላል መድረስ': item.ease_of_access || 'N/A',
        'አክብሮት': item.staff_respect || 'N/A',
        'ግልጽ ማብራሪያ': item.staff_clarity || 'N/A',
        'ፈጣን ምላሽ': item.fast_response || 'N/A',
        'አጠቃላይ እርካታ': item.overall_satisfaction || 'N/A',
        'አስተያየት': item.improvement || 'N/A',
        'ቀን': new Date(item.created_at).toLocaleDateString('am-ET')
      }))
      
      const ws = XLSX.utils.json_to_sheet(excelData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Feedback Report')
      XLSX.writeFile(wb, `feedback_report_${new Date().toISOString().split('T')[0]}.xlsx`)
      alert('✅ ፋይል በተሳካ ሁኔታ ወርዷል!')
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ ስህተት ተከስቷል')
    } finally {
      setExporting(false)
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

  const satisfactionData = stats?.satisfaction_distribution ? [
    { name: 'በጣም ረክተዋል (5⭐)', value: stats.satisfaction_distribution.very_satisfied || 0, color: '#22c55e' },
    { name: 'ረክተዋል (4⭐)', value: stats.satisfaction_distribution.satisfied || 0, color: '#86efac' },
    { name: 'ገለልተኛ (3⭐)', value: stats.satisfaction_distribution.neutral || 0, color: '#fbbf24' },
    { name: 'አልረካሁም (2⭐)', value: stats.satisfaction_distribution.dissatisfied || 0, color: '#f97316' },
    { name: 'በጣም አልረካሁም (1⭐)', value: stats.satisfaction_distribution.very_dissatisfied || 0, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  const ratingData = stats?.rating_averages ? [
    { name: 'ቀላል መድረስ', value: stats.rating_averages.ease_of_access || 0 },
    { name: 'አክብሮት', value: stats.rating_averages.staff_respect || 0 },
    { name: 'ግልጽ ማብራሪያ', value: stats.rating_averages.staff_clarity || 0 },
    { name: 'ፈጣን ምላሽ', value: stats.rating_averages.fast_response || 0 },
    { name: 'ትክክለኛ አገልግሎት', value: stats.rating_averages.accurate_service || 0 },
    { name: 'ግልጽ መረጃ', value: stats.rating_averages.clear_info || 0 },
    { name: 'በጊዜ መሰጠት', value: stats.rating_averages.timely_service || 0 },
    { name: 'ፍላጎት መሟላት', value: stats.rating_averages.met_expectations || 0 }
  ] : []

  const totalFeedback = stats?.total_feedback || 0
  const avgSatisfaction = stats?.average_satisfaction || 0

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <h1 className="text-xl font-bold text-gray-800">የግብርና ሚኒስቴር ዳሽቦርድ</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/qr-generator')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <QrCodeIcon className="h-5 w-5" />
              QR ማመንጫ
            </button>
            <button
              onClick={exportToExcel}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5" />
              {exporting ? 'በማውጣት ላይ...' : 'Excel ማውጣት'}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              ውጣ
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">ጠቅላላ ግብረመልስ</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{totalFeedback}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">አማካይ እርካታ</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">{avgSatisfaction.toFixed(1)} / 5</div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(avgSatisfaction / 5) * 100}%` }} />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">የምላሽ መጠን</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">
                  {totalFeedback > 0 ? `${Math.min(Math.round((totalFeedback / 100) * 100), 100)}%` : '0%'}
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-500 text-sm">የእርካታ ደረጃ</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">
                  {avgSatisfaction >= 4 ? 'ከፍተኛ' : avgSatisfaction >= 3 ? 'መካከለኛ' : 'ዝቅተኛ'}
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckBadgeIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📊 የእርካታ ስርጭት</h2>
            {satisfactionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                    nameKey="name"
                  >
                    {satisfactionData.map((entry, index) => (
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

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📈 የአገልግሎት ግምገማ አማካይ ውጤት</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ratingData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} tickCount={6} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => [`${value}/5`, 'አማካይ']} />
                <Bar dataKey="value" fill="#22c55e" radius={[0, 4, 4, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 4 ? '#22c55e' : entry.value >= 3 ? '#fbbf24' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📉 ወርሃዊ አዝማሚያ</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.monthly_trend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#22c55e" name="ግብረመልስ ብዛት" />
                <Line type="monotone" dataKey="avg" stroke="#fbbf24" name="አማካይ እርካታ" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Stats Table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏢 በዘርፍ የተከፋፈለ እርካታ</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ዘርፍ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">አማካይ</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ብዛት</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ደረጃ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats?.sector_stats?.map((sector, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{sector.sector}</td>
                      <td className="px-4 py-3 text-sm font-medium">{sector.avg_rating?.toFixed(1) || 0}</td>
                      <td className="px-4 py-3 text-sm">{sector.count}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          sector.avg_rating >= 4 ? 'bg-green-100 text-green-800' :
                          sector.avg_rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sector.avg_rating >= 4 ? 'ከፍተኛ' : sector.avg_rating >= 3 ? 'መካከለኛ' : 'ዝቅተኛ'}
                        </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Feedback Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 የቅርብ ጊዜ ግብረመልሶች</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">መታወቂያ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ተጠቃሚ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ዘርፍ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">እርካታ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ቀን</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentFeedback.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{item.id}</td>
                    <td className="px-4 py-3 text-sm">{item.provider_name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">{item.sector || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{item.overall_satisfaction || 'N/A'}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(item.created_at).toLocaleDateString('am-ET')}</td>
                  </tr>
                ))}
                {recentFeedback.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">ምንም ግብረመልስ የለም</td>
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