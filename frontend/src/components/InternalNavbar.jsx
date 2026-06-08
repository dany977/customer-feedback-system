import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function InternalFeedback() {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [formData, setFormData] = useState({
    full_name: '',
    employee_id: '',
    department: '',
    position: '',
    years_of_service: '',
    asset_liked: '',
    asset_suggestions: '',
    facility_suggestions: '',
    logistics_suggestions: '',
    vehicle_registration: '',
    vehicle_type: '',
    liked_service: '',
    improvement_needs: '',
    overall_satisfaction: 3,
    general_comments: '',
    contact: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRating = (value) => {
    setFormData({ ...formData, overall_satisfaction: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    if (!formData.employee_id || !formData.department) {
      alert('እባክዎ የሰራተኛ መታወቂያ እና ዲፓርትመንት ይሙሉ!')
      setLoading(false)
      return
    }
    
    const dataToSend = {
      full_name: formData.full_name || '',
      employee_id: formData.employee_id,
      department: formData.department,
      position: formData.position || '',
      years_of_service: parseInt(formData.years_of_service) || 0,
      asset_liked: formData.asset_liked || '',
      asset_suggestions: formData.asset_suggestions || '',
      facility_suggestions: formData.facility_suggestions || '',
      logistics_suggestions: formData.logistics_suggestions || '',
      vehicle_registration: formData.vehicle_registration || '',
      vehicle_type: formData.vehicle_type || '',
      liked_service: formData.liked_service || '',
      improvement_needs: formData.improvement_needs || '',
      overall_satisfaction: formData.overall_satisfaction,
      general_comments: formData.general_comments || '',
      contact: formData.contact || ''
    }
    
    console.log('Sending data:', dataToSend)
    
    try {
      const res = await fetch('http://localhost:8000/api/employee/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      const data = await res.json()
      console.log('Response:', data)
      
      if (res.ok) {
        setShowPopup(true)
        setFormData({
          full_name: '', employee_id: '', department: '', position: '', years_of_service: '',
          asset_liked: '', asset_suggestions: '', facility_suggestions: '', logistics_suggestions: '',
          vehicle_registration: '', vehicle_type: '', liked_service: '', improvement_needs: '',
          overall_satisfaction: 3, general_comments: '', contact: ''
        })
        setTimeout(() => setShowPopup(false), 3000)
      } else {
        alert('ስህተት: ' + (data.error || JSON.stringify(data)))
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Connection error! Make sure backend is running on port 8000')
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'personal', name: '👤 መረጃ' },
    { id: 'asset', name: '📦 ንብረት' },
    { id: 'facility', name: '🏛️ ግቢ' },
    { id: 'logistics', name: '🚚 ሎጂስቲክስ' },
    { id: 'maintenance', name: '🔧 ጥገና' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-5xl">🏢</span>
          <h1 className="text-3xl font-bold text-blue-800 mt-2">የውስጥ ሰራተኞች እርካታ መጠይቅ</h1>
        </div>

        {showPopup && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center">
            ✅ እናመሰግናለን! ምላሽዎ ተመዝግቧል
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b pb-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">👤 መሰረታዊ መረጃ</h2>
                <div className="space-y-4">
                  <div><label className="font-bold text-sm">ሙሉ ስም</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="font-bold text-sm">የሰራተኛ መታወቂያ *</label><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
                  <div><label className="font-bold text-sm">ዲፓርትመንት *</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
                  <div><label className="font-bold text-sm">ሹመት</label><input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="font-bold text-sm">የስራ ዘመን (አመታት)</label><input type="number" name="years_of_service" value={formData.years_of_service} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                </div>
              </div>
            )}

            {/* Asset Management Tab */}
            {activeTab === 'asset' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">📦 ንብረት አስተዳደር</h2>
                <div><label className="font-bold text-sm block mb-1">የተወደደው አገልግሎት</label><textarea name="asset_liked" rows="3" value={formData.asset_liked} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                <div className="mt-4"><label className="font-bold text-sm block mb-1">ማሻሻያ ሃሳቦች</label><textarea name="asset_suggestions" rows="3" value={formData.asset_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
              </div>
            )}

            {/* Facility Tab */}
            {activeTab === 'facility' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🏛️ ግቢ ውበት እና ህንጻ</h2>
                <div><label className="font-bold text-sm block mb-1">አስተያየት እና ጥቆማዎች</label><textarea name="facility_suggestions" rows="4" value={formData.facility_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
              </div>
            )}

            {/* Logistics Tab */}
            {activeTab === 'logistics' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🚚 ሎጂስቲክስ እና ተሽከርካሪ አስተዳደር</h2>
                <div><label className="font-bold text-sm block mb-1">ማሻሻያ ሃሳቦች</label><textarea name="logistics_suggestions" rows="4" value={formData.logistics_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
              </div>
            )}

            {/* Vehicle Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🔧 የተሽከርካሪ ጥገና አገልግሎት</h2>
                <div><label className="font-bold text-sm block mb-1">የተሽከርካሪ ምዝገባ ቁጥር</label><input type="text" name="vehicle_registration" value={formData.vehicle_registration} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                <div><label className="font-bold text-sm block mb-1">የተሽከርካሪ አይነት</label><input type="text" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                <div><label className="font-bold text-sm block mb-1">የተወደደው አገልግሎት</label><textarea name="liked_service" rows="3" value={formData.liked_service} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                <div><label className="font-bold text-sm block mb-1">ማሻሻያ የሚፈልጉት</label><textarea name="improvement_needs" rows="3" value={formData.improvement_needs} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
              </div>
            )}

            {/* Overall Satisfaction */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-bold text-green-800 mb-4">⭐ አጠቃላይ እርካታ</h2>
              <div className="mb-4">
                <label className="block font-bold text-sm mb-2">በአጠቃላይ በድርጅቱ ውስጥ በመስራት ምን ያህል ረክተዋል? (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleRating(v)}
                      className={`flex-1 py-2 rounded transition ${
                        formData.overall_satisfaction === v ? 'bg-green-600 text-white' : 'bg-gray-200'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="font-bold text-sm block mb-1">አጠቃላይ አስተያየት</label><textarea name="general_comments" rows="3" value={formData.general_comments} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
              <div><label className="font-bold text-sm block mb-1">ስልክ/ኢሜይል (አማራጭ)</label><input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded" /></div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
              {loading ? 'በማስገባት ላይ...' : '✓ መልስ አስገባ'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800">← ወደ ዋና ገጽ ተመለስ</Link>
        </div>
      </div>
    </div>
  )
}