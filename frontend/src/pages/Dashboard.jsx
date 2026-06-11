import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [externalStats, setExternalStats] = useState(null);
  const [internalStats, setInternalStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrSize, setQrSize] = useState(180);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    try {
      const [extRes, intRes] = await Promise.all([
        fetch('http://localhost:8000/api/dashboard/stats/'),
        fetch('http://localhost:8000/api/employee/stats/')
      ]);
      const extData = extRes.ok ? await extRes.json() : null;
      const intData = intRes.ok ? await intRes.json() : null;
      setExternalStats(extData);
      setInternalStats(intData);

      const [extList, intList] = await Promise.all([
        fetch('http://localhost:8000/api/feedback/list/'),
        fetch('http://localhost:8000/api/employee/list/')
      ]);
      let externalItems = [], internalItems = [];
      if (extList.ok) {
        const data = await extList.json();
        externalItems = data.map(item => ({
          id: item.id,
          type: 'ውጭ',
          name: item.full_name || item.stakeholder_type || 'ያልተጠቀሰ',
          rating: item.overall_satisfaction || 0,
          date: item.created_at ? item.created_at.split('T')[0] : (item.service_date || '')
        }));
      }
      if (intList.ok) {
        const data = await intList.json();
        internalItems = data.map(item => ({
          id: item.id,
          type: 'ውስጥ',
          name: item.department || item.full_name || 'ሰራተኛ',
          rating: item.overall_satisfaction || 0,
          date: item.created_at ? item.created_at.split('T')[0] : ''
        }));
      }
      const combined = [...externalItems, ...internalItems]
        .filter(item => item.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentFeedback(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const exportExternal = () => {
    window.location.href = 'http://localhost:8000/api/export/excel/';
  };

  const exportInternal = () => {
    window.location.href = 'http://localhost:8000/api/employee/export/';
  };

  const formUrl = 'http://localhost:5173/feedback';
  const downloadQR = () => {
    const svg = document.getElementById('dashboard-qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'qr_code_feedback.png';
        link.href = pngFile;
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const totalFeedback = (externalStats?.total_feedback || 0) + (internalStats?.total_feedback || 0);
  const avgSatisfaction = ((externalStats?.average_satisfaction || 0) + (internalStats?.average_satisfaction || 0)) / 2;

  const externalPie = externalStats?.satisfaction_distribution ? [
    { name: 'በጣም ረክተዋል', value: externalStats.satisfaction_distribution.very_satisfied, color: '#10b981' },
    { name: 'ረክተዋል', value: externalStats.satisfaction_distribution.satisfied, color: '#34d399' },
    { name: 'ገለልተኛ', value: externalStats.satisfaction_distribution.neutral, color: '#fbbf24' },
    { name: 'አልረካሁም', value: externalStats.satisfaction_distribution.dissatisfied, color: '#f97316' },
    { name: 'በጣም አልረካሁም', value: externalStats.satisfaction_distribution.very_dissatisfied, color: '#ef4444' }
  ].filter(i => i.value > 0) : [];

  const internalPie = internalStats?.satisfaction_distribution ? [
    { name: 'በጣም ረክተዋል', value: internalStats.satisfaction_distribution.very_satisfied, color: '#10b981' },
    { name: 'ረክተዋል', value: internalStats.satisfaction_distribution.satisfied, color: '#34d399' },
    { name: 'ገለልተኛ', value: internalStats.satisfaction_distribution.neutral, color: '#fbbf24' },
    { name: 'አልረካሁም', value: internalStats.satisfaction_distribution.dissatisfied, color: '#f97316' },
    { name: 'በጣም አልረካሁም', value: internalStats.satisfaction_distribution.very_dissatisfied, color: '#ef4444' }
  ].filter(i => i.value > 0) : [];

  const comparisonData = [
    { name: 'የውጭ ደንበኞች', እርካታ: externalStats?.average_satisfaction || 0 },
    { name: 'የውስጥ ሰራተኞች', እርካታ: internalStats?.average_satisfaction || 0 }
  ];

  const departmentData = internalStats?.department_stats?.map(dept => ({
    name: dept.department,
    rating: dept.avg_rating,
    count: dept.count
  })) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <h1 className="text-xl font-bold text-gray-800">የተዋሃደ የአገልግሎት እርካታ ዳሽቦርድ</h1>
            <p className="text-sm text-gray-500 hidden md:block">እንኳን ደህና መጡ፣ {user?.username}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={exportExternal} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              📥 External Export 
            </button>
            <button onClick={exportInternal} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              📥 Internal Export 
            </button>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">ውጣ</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="text-gray-500 text-sm">ጠቅላላ ግብረመልስ</div>
            <div className="text-3xl font-bold text-gray-800">{totalFeedback}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">አማካይ እርካታ</div>
            <div className="text-3xl font-bold text-gray-800">{avgSatisfaction.toFixed(1)} / 5</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">የውጭ ግብረመልስ</div>
            <div className="text-3xl font-bold text-gray-800">{externalStats?.total_feedback || 0}</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
            <div className="text-gray-500 text-sm">የውስጥ ግብረመልስ</div>
            <div className="text-3xl font-bold text-gray-800">{internalStats?.total_feedback || 0}</div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          <h2 className="font-bold text-gray-800 mb-3 text-lg">📊 የአማካይ እርካታ ንጽጽር</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="እርካታ" fill="#8b5cf6" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Two Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-2">🥧 የውጭ ደንበኞች እርካታ ስርጭት</h2>
            {externalPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={externalPie} cx="50%" cy="50%" outerRadius={80} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} dataKey="value">
                    {externalPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-64 flex items-center justify-center text-gray-400">ምንም ውሂብ የለም</div>}
          </div>
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="font-bold text-gray-800 mb-2">🥧 የውስጥ ሰራተኞች እርካታ ስርጭት</h2>
            {internalPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={internalPie} cx="50%" cy="50%" outerRadius={80} label={({ percent }) => `${(percent * 100).toFixed(0)}%`} dataKey="value">
                    {internalPie.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="h-64 flex items-center justify-center text-gray-400">ምንም ውሂብ የለም</div>}
          </div>
        </div>

        {/* Two Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-green-700 px-4 py-3"><h3 className="text-white font-bold">🌍 በዘርፍ እርካታ (የውጭ)</h3></div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2">ዘርፍ</th><th className="px-3 py-2">አማካይ</th><th className="px-3 py-2">ብዛት</th></tr></thead>
                <tbody>
                  {externalStats?.sector_stats?.map((s, i) => (
                    <tr key={i}><td className="px-3 py-2">{s.sector}</td><td className="px-3 py-2">{s.avg_rating?.toFixed(1)}</td><td className="px-3 py-2">{s.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-indigo-700 px-4 py-3"><h3 className="text-white font-bold">🏢 በዲፓርትመንት እርካታ (ውስጥ)</h3></div>
            <div className="overflow-x-auto p-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr><th className="px-3 py-2">ዲፓርትመንት</th><th className="px-3 py-2">አማካይ</th><th className="px-3 py-2">ብዛት</th></tr></thead>
                <tbody>
                  {departmentData.map((d, i) => (
                    <tr key={i}><td className="px-3 py-2">{d.name}</td><td className="px-3 py-2">{d.rating?.toFixed(1)}</td><td className="px-3 py-2">{d.count}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="text-center">
            <h3 className="font-bold text-gray-800 mb-3">📱 QR Code በመጠቀም ይሙሉ</h3>
            <div className="flex justify-center mb-3">
              <div className="bg-white p-3 rounded-xl shadow-md border-2 border-green-200">
                <QRCodeSVG id="dashboard-qr-code" value={formUrl} size={qrSize} bgColor="#FFFFFF" fgColor="#166534" level="H" includeMargin />
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={downloadQR} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">📥 አውርድ</button>
              <Link to="/feedback" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">📝 ቅጽ ሙላ</Link>
            </div>
          </div>
        </div>

  
       {/* Recent Feedback Table */}
<div className="bg-white rounded-xl shadow-md overflow-hidden">
  <div className="bg-gray-800 px-6 py-3">
    <h2 className="text-white font-bold">📝 የቅርብ ጊዜ ግብረመልሶች</h2>
  </div>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-5 py-3">መታወቂያ</th>
          <th className="px-5 py-3">ዓይነት</th>
          <th className="px-5 py-3">ስም/ዲፓርትመንት</th>
          <th className="px-5 py-3">እርካታ</th>
          <th className="px-5 py-3">ቀን</th>
        </tr>
      </thead>
      <tbody>
        {recentFeedback.map(fb => (
          <tr key={`${fb.type}-${fb.id}`} className="hover:bg-gray-50 border-b">
            <td className="px-5 py-3">#{fb.id}</td>
            <td className="px-5 py-3">
              <span className={`px-2 py-1 rounded-full text-xs ${fb.type === 'ውጭ' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                {fb.type}
              </span>
            </td>
            <td className="px-5 py-3">{fb.name}</td>
            <td className="px-5 py-3">{fb.rating} {'⭐'.repeat(fb.rating)}</td>
            <td className="px-5 py-3">{fb.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
      </main>

      <div className="text-center text-sm text-gray-400 pb-6 mt-4">
        መረጃው በየቀኑ ይዘመናል | {new Date().toLocaleDateString('am-ET')}
      </div>
    </div>
  );
}