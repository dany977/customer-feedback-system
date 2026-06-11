// frontend/src/pages/UnifiedDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

export default function UnifiedDashboard() {
  const [loading, setLoading] = useState(true)
  const [qrSize, setQrSize] = useState(180)
  const [externalStats, setExternalStats] = useState(null)
  const [internalStats, setInternalStats] = useState(null)
  const [recentFeedback, setRecentFeedback] = useState([])

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true)
      try {
        // Fetch external stats
        const extRes = await fetch('http://localhost:8000/api/dashboard/stats/')
        if (extRes.ok) {
          const extData = await extRes.json()
          setExternalStats(extData)
        } else {
          // Fallback mock for development (optional)
          setExternalStats({
            total_feedback: 0,
            average_satisfaction: 0,
            satisfaction_distribution: { very_satisfied: 0, satisfied: 0, neutral: 0, dissatisfied: 0, very_dissatisfied: 0 },
            sector_stats: []
          })
        }

        // Fetch internal stats
        const intRes = await fetch('http://localhost:8000/api/employee/stats/')
        if (intRes.ok) {
          const intData = await intRes.json()
          setInternalStats(intData)
        } else {
          setInternalStats({
            total_feedback: 0,
            average_satisfaction: 0,
            satisfaction_distribution: { very_satisfied: 0, satisfied: 0, neutral: 0, dissatisfied: 0, very_dissatisfied: 0 },
            department_stats: []
          })
        }

        // Fetch recent feedback from both endpoints
        await fetchRecentFeedback()
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    const fetchRecentFeedback = async () => {
      try {
        // External feedback list
        const extListRes = await fetch('http://localhost:8000/api/feedback/list/')
        let externalItems = []
        if (extListRes.ok) {
          const data = await extListRes.json()
          externalItems = data.map(item => ({
            id: item.id,
            type: 'ውጭ',
            name: item.full_name || item.stakeholder_type || 'ያልተጠቀሰ',
            rating: item.overall_satisfaction || 0,
            date: item.created_at ? item.created_at.split('T')[0] : (item.service_date || '')
          }))
        }

        // Internal feedback list
        const intListRes = await fetch('http://localhost:8000/api/employee/list/')
        let internalItems = []
        if (intListRes.ok) {
          const data = await intListRes.json()
          internalItems = data.map(item => ({
            id: item.id,
            type: 'ውስጥ',
            name: item.department || item.full_name || 'ሰራተኛ',
            rating: item.overall_satisfaction || 0,
            date: item.created_at ? item.created_at.split('T')[0] : ''
          }))
        }

        // Combine, sort by date descending, take first 5
        const combined = [...externalItems, ...internalItems]
          .filter(item => item.date) // only those with a date
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)

        setRecentFeedback(combined)
      } catch (err) {
        console.error('Error fetching recent feedback:', err)
        setRecentFeedback([])
      }
    }

    fetchAllData()
  }, [])

  // Prepare pie chart data (external satisfaction)
  const satisfactionData = externalStats?.satisfaction_distribution ? [
    { name: 'በጣም ረክተዋል', value: externalStats.satisfaction_distribution.very_satisfied, color: '#10b981' },
    { name: 'ረክተዋል', value: externalStats.satisfaction_distribution.satisfied, color: '#34d399' },
    { name: 'ገለልተኛ', value: externalStats.satisfaction_distribution.neutral, color: '#fbbf24' },
    { name: 'አልረካሁም', value: externalStats.satisfaction_distribution.dissatisfied, color: '#f97316' },
    { name: 'በጣም አልረካሁም', value: externalStats.satisfaction_distribution.very_dissatisfied, color: '#ef4444' }
  ].filter(item => item.value > 0) : []

  // Prepare bar chart data (internal department satisfaction)
  const departmentData = internalStats?.department_stats?.map(dept => ({
    name: dept.department,
    rating: dept.avg_rating,
    count: dept.count
  })) || []

  // Combined totals
  const totalFeedback = (externalStats?.total_feedback || 0) + (internalStats?.total_feedback || 0)
  const avgSatisfaction = ((externalStats?.average_satisfaction || 0) + (internalStats?.average_satisfaction || 0)) / 2

  // QR code URL
  const formUrl = 'http://localhost:5173/feedback'

  const downloadQR = () => {
    const svg = document.getElementById('unified-qr-code')
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = 'qr_code_feedback.png'
        link.href = pngFile
        link.click()
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">የተዋሃደ የአገልግሎት እርካታ ዳሽቦርድ</h1>
                <p className="text-green-100 text-xs">የውጭ ደንበኞች እና የውስጥ ሰራተኞች አጠቃላይ እርካታ</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/feedback" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition text-sm">
                📝 የውጭ ቅጽ
              </Link>
              <Link to="/internal-feedback" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition text-sm">
                🏢 የውስጥ ቅጽ
              </Link>
              <Link to="/" className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition text-sm">
                🏠 ዋና ገጽ
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">ጠቅላላ ግብረመልስ</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{totalFeedback}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg"><span className="text-xl">📊</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">አማካይ እርካታ</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{avgSatisfaction.toFixed(1)} / 5</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg"><span className="text-xl">⭐</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">የውጭ ግብረመልስ</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{externalStats?.total_feedback || 0}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg"><span className="text-xl">🌍</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">የውስጥ ግብረመልስ</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{internalStats?.total_feedback || 0}</p>
              </div>
              <div className="bg-indigo-100 p-2 rounded-lg"><span className="text-xl">🏢</span></div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800">🥧 የውጭ ደንበኞች እርካታ ስርጭት</h2>
              <span className="text-xs text-gray-400">ከ{externalStats?.total_feedback || 0} ምላሾች</span>
            </div>
            {satisfactionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={satisfactionData} cx="50%" cy="50%" labelLine={true} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                    {satisfactionData.map((entry, idx) => <Cell key={idx} fill={entry.color} stroke="#fff" strokeWidth={2} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ሰዎች`, 'ብዛት']} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">ምንም ውሂብ የለም</div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-800">📊 የውስጥ ሰራተኞች እርካታ በዲፓርትመንት</h2>
              <span className="text-xs text-gray-400">ከ{internalStats?.total_feedback || 0} ምላሾች</span>
            </div>
            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value) => [`${value} / 5`, 'አማካይ እርካታ']} />
                  <Bar dataKey="rating" fill="#3b82f6" radius={[8,8,0,0]}>
                    {departmentData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.rating >= 4 ? '#10b981' : entry.rating >= 3 ? '#fbbf24' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400">ምንም ውሂብ የለም</div>
            )}
          </div>
        </div>

        {/* Sector Statistics Table (External) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
            <h3 className="text-white font-bold text-sm">🏢 በዘርፍ የተከፋፈለ እርካታ (የውጭ ደንበኞች)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr><th className="px-4 py-3 text-left">ዘርፍ</th><th className="px-4 py-3 text-left">አማካይ እርካታ</th><th className="px-4 py-3 text-left">ብዛት</th><th className="px-4 py-3 text-left">ደረጃ</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {externalStats?.sector_stats?.map((s, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.sector}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{s.avg_rating.toFixed(1)}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(s.avg_rating / 5) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{s.count}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.avg_rating >= 4 ? 'bg-green-100 text-green-700' : s.avg_rating >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {s.avg_rating >= 4 ? 'ከፍተኛ' : s.avg_rating >= 3 ? 'መካከለኛ' : 'ዝቅተኛ'}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!externalStats?.sector_stats || externalStats.sector_stats.length === 0) && (
                  <tr><td colSpan="4" className="text-center py-8 text-gray-400">ምንም ውሂብ የለም</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QR Code & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-4 text-center">
            <h3 className="font-bold text-gray-800 mb-2">📱 QR Code በመጠቀም ይሙሉ</h3>
            <div className="flex justify-center mb-3">
              <div className="bg-white p-3 rounded-xl shadow-md border-2 border-green-200">
                <QRCodeSVG id="unified-qr-code" value={formUrl} size={qrSize} bgColor="#FFFFFF" fgColor="#166534" level="H" includeMargin />
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={downloadQR} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700">📥 አውርድ</button>
              <Link to="/feedback" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700">📝 ቅጽ ሙላ</Link>
            </div>
            <p className="text-xs text-gray-500 mt-2">ስልክዎን ቀንደው ይሙሉ</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl shadow-md p-4 text-center">
            <span className="text-4xl mb-2 block">🏢</span>
            <h3 className="font-bold text-gray-800 mb-1">የውስጥ ሰራተኞች</h3>
            <p className="text-xs text-gray-600 mb-3">የውስጥ እርካታ መጠይቅ ለመሙላት</p>
            <Link to="/internal-feedback" className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700">ወደ ውስጥ ቅጽ ሂድ →</Link>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-md p-4 text-center">
            <span className="text-4xl mb-2 block">👨‍💼</span>
            <h3 className="font-bold text-gray-800 mb-1">አስተዳዳሪዎች</h3>
            <p className="text-xs text-gray-600 mb-3">የውሂብ ትንተና እና ሪፖርት ለማየት</p>
            <Link to="/login" className="inline-block bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-purple-700">ወደ አስተዳደር ገፅ ሂድ →</Link>
          </div>
        </div>

        {/* ✅ RECENT FEEDBACK TABLE (REAL DATA) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
            <h2 className="text-white font-bold flex items-center gap-2">
              <span>📝</span> የቅርብ ጊዜ ግብረመልሶች
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">መታወቂያ</th>
                  <th className="px-6 py-3 text-left">ዓይነት</th>
                  <th className="px-6 py-3 text-left">ስም/ዲፓርትመንት</th>
                  <th className="px-6 py-3 text-left">እርካታ</th>
                  <th className="px-6 py-3 text-left">ቀን</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentFeedback.length > 0 ? (
                  recentFeedback.map((fb) => (
                    <tr key={fb.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-500">#{fb.id}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${fb.type === 'ውጭ' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {fb.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium">{fb.name}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{fb.rating}</span>
                          <div className="text-yellow-400">{'⭐'.repeat(fb.rating)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{fb.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                      ምንም ግብረመልሶች የሉም
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-400">
          <p>መረጃው በየቀኑ ይዘመናል | የቅርብ ጊዜ ዝመና: {new Date().toLocaleDateString('am-ET')}</p>
        </div>
      </main>
    </div>
  )
}