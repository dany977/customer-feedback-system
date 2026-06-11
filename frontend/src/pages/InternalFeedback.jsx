import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function InternalFeedback() {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [formData, setFormData] = useState({
  // Personal information (keep as empty strings)
  full_name: '',
  employee_id: '',
  department: '',
  position: '',
  years_of_service: '',
  
  // Asset Management
  asset_liked: '',
  asset_suggestions: '',
  
  // Facility (change all 3 to null)
  cleanliness_aesthetics: null,
  external_appearance: null,
  internal_cleanliness: null,
  facility_condition: null,
  space_utilization: null,
  security_service: null,
  light_air_quality: null,
  maintenance_care: null,
  facility_suggestions: '',
  
  // Logistics (change all 3 to null)
  logistics_service_speed: null,
  vehicle_readiness: null,
  travel_time: null,
  driver_conduct: null,
  travel_safety: null,
  logistics_suggestions: '',
  
  // Vehicle Maintenance
  vehicle_registration: '',
  vehicle_type: '',
  maintenance_quality: null,
  service_speed: null,
  staff_behavior: null,
  liked_service: '',
  improvement_needs: '',
  
  // Overall
  overall_satisfaction: null,
  general_comments: '',
  contact: ''
});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRating = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // if (!formData.employee_id || !formData.department) {
    //   alert('እባክዎ የሰራተኛ መታወቂያ እና ዲፓርትመንት ይሙሉ!')
    //   setLoading(false)
    //   return
    // }
    
    const dataToSend = {
      full_name: formData.full_name,
      employee_id: formData.employee_id,
      department: formData.department,
      position: formData.position,
      years_of_service: parseInt(formData.years_of_service) || 0,
      asset_liked: formData.asset_liked,
      asset_suggestions: formData.asset_suggestions,
      cleanliness_aesthetics: formData.cleanliness_aesthetics,
      external_appearance: formData.external_appearance,
      internal_cleanliness: formData.internal_cleanliness,
      facility_condition: formData.facility_condition,
      space_utilization: formData.space_utilization,
      security_service: formData.security_service,
      light_air_quality: formData.light_air_quality,
      maintenance_care: formData.maintenance_care,
      facility_suggestions: formData.facility_suggestions,
      logistics_service_speed: formData.logistics_service_speed,
      vehicle_readiness: formData.vehicle_readiness,
      travel_time: formData.travel_time,
      driver_conduct: formData.driver_conduct,
      travel_safety: formData.travel_safety,
      logistics_suggestions: formData.logistics_suggestions,
      vehicle_registration: formData.vehicle_registration,
      vehicle_type: formData.vehicle_type,
      maintenance_quality: formData.maintenance_quality,
      service_speed: formData.service_speed,
      staff_behavior: formData.staff_behavior,
      liked_service: formData.liked_service,
      improvement_needs: formData.improvement_needs,
      overall_satisfaction: formData.overall_satisfaction,
      general_comments: formData.general_comments,
      contact: formData.contact
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/employee/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      if (res.ok) {
        setShowPopup(true)
        setFormData({
          full_name: '', employee_id: '', department: '', position: '', years_of_service: '',
          asset_liked: '', asset_suggestions: '',
          cleanliness_aesthetics: 3, external_appearance: 3, internal_cleanliness: 3,
          facility_condition: 3, space_utilization: 3, security_service: 3,
          light_air_quality: 3, maintenance_care: 3, facility_suggestions: '',
          logistics_service_speed: 3, vehicle_readiness: 3, travel_time: 3,
          driver_conduct: 3, travel_safety: 3, logistics_suggestions: '',
          vehicle_registration: '', vehicle_type: '', maintenance_quality: 3,
          service_speed: 3, staff_behavior: 3, liked_service: '', improvement_needs: '',
          overall_satisfaction: 3, general_comments: '', contact: ''
        })
        setTimeout(() => setShowPopup(false), 3000)
      } else {
        const error = await res.json()
        alert('ስህተት: ' + JSON.stringify(error))
      }
    } catch (err) {
      console.error(err)
      alert('Connection error!')
    }
    setLoading(false)
  }

const RatingButtons = ({ name, label }) => (
  <div className="mb-4">
    <label className="block font-bold text-sm text-gray-700 mb-2">{label}</label>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map(v => (
        <button
          key={v}
          type="button"
          onClick={() => handleRating(name, v)}
          className={`
            flex-1 py-2 rounded-lg font-bold transition-all duration-200
            ${formData[name] === v 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md scale-105' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
            }
          `}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
);

  const tabs = [
    { id: 'personal', name: '👤 መረጃ', icon: '👤' },
    { id: 'asset', name: '📦 ንብረት አስተዳደር', icon: '📦' },
    { id: 'facility', name: '🏛️ ግቢ ውበት እና ህንጻ', icon: '🏛️' },
    { id: 'logistics', name: '🚚 ሎጂስቲክስ እና ተሽከርካሪ', icon: '🚚' },
    { id: 'maintenance', name: '🔧 የተሽከርካሪ ጥገና', icon: '🔧' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-5xl">🏢</span>
          <h1 className="text-3xl font-bold text-blue-800 mt-2">የውስጥ ሰራተኞች አጠቃላይ እርካታ መጠይቅ</h1>
          <p className="text-gray-600 mt-2">እባክዎ ለእያንዳንዱ ክፍል መልስ ይስጡ</p>
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
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">👤 መሰረታዊ መረጃ</h2>
                <div className="space-y-4">
                  <div><label className="font-bold text-sm">ሙሉ ስም (አማራጭ)</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="font-bold text-sm">የሰራተኛ መታወቂያ (አማራጭ)</label><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="font-bold text-sm">ዲፓርትመንት (አማራጭ)</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                </div>
              </div>
            )}

            {/* Asset Management Tab */}
            {activeTab === 'asset' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">📦 ንብረት አስተዳደር አገልግሎት</h2>
                <div className="space-y-4">
                  <div><label className="font-bold text-sm block mb-1">የተወደደው አገልግሎት</label><textarea name="asset_liked" rows="3" value={formData.asset_liked} onChange={handleChange} className="w-full p-2 border rounded" placeholder="ምን አገልግሎት ወደዱ?"></textarea></div>
                  <div><label className="font-bold text-sm block mb-1">ማሻሻያ ሃሳቦች</label><textarea name="asset_suggestions" rows="3" value={formData.asset_suggestions} onChange={handleChange} className="w-full p-2 border rounded" placeholder="ምን ማሻሻያ ማድረግ ይፈልጋሉ?"></textarea></div>
                </div>
              </div>
            )}

            {/* Facility Tab */}
            {activeTab === 'facility' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🏛️ ግቢ ውበት እና ህንጻ አጠቃቀም</h2>
                <div className="space-y-4">
                  <RatingButtons name="cleanliness_aesthetics" label="የግቢው ንፅህና እና ውበት" />
                  <RatingButtons name="external_appearance" label="የህንጻው ውጫዊ ገጽታ" />
                  <RatingButtons name="internal_cleanliness" label="የህንጻው ውስጣዊ ንፅህና እና አቀራረብ" />
                  <RatingButtons name="facility_condition" label="የመገልገያ ቦታዎች ሁኔታ" />
                  <RatingButtons name="space_utilization" label="የቦታ አጠቃቀም" />
                  <RatingButtons name="security_service" label="የደህንነት አገልግሎት" />
                  <RatingButtons name="light_air_quality" label="የብርሃን እና አየር ሁኔታ" />
                  <RatingButtons name="maintenance_care" label="የጥገና እና እንክብካቤ ሁኔታ" />
                  <div><label className="font-bold text-sm block mb-1">አስተያየት እና ጥቆማዎች</label><textarea name="facility_suggestions" rows="3" value={formData.facility_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                </div>
              </div>
            )}

            {/* Logistics Tab */}
            {activeTab === 'logistics' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🚚 ሎጂስቲክስ እና ተሽከርካሪ አስተዳደር</h2>
                <div className="space-y-4">
                  <RatingButtons name="logistics_service_speed" label="የአገልግሎት ፍጥነት" />
                  <RatingButtons name="vehicle_readiness" label="የመኪና ዝግጁነት" />
                  <RatingButtons name="travel_time" label="የጉዞ ጊዜ አክባሪነት" />
                  <RatingButtons name="driver_conduct" label="የአሽከርካሪ ስነ-ምግባር" />
                  <RatingButtons name="travel_safety" label="የጉዞ ደህንነት" />
                  <div><label className="font-bold text-sm block mb-1">ማሻሻያ ሃሳቦች</label><textarea name="logistics_suggestions" rows="3" value={formData.logistics_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                </div>
              </div>
            )}

            {/* Vehicle Maintenance Tab */}
            {activeTab === 'maintenance' && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-4">🔧 የተሽከርካሪ ጥገና አገልግሎት</h2>
                <div className="space-y-4">
                  <div><label className="font-bold text-sm block mb-1">የተሽከርካሪ ምዝገባ ቁጥር</label><input type="text" name="vehicle_registration" value={formData.vehicle_registration} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <div><label className="font-bold text-sm block mb-1">የተሽከርካሪ አይነት</label><input type="text" name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                  <RatingButtons name="maintenance_quality" label="የጥገና ጥራት" />
                  <RatingButtons name="service_speed" label="የአገልግሎት ፍጥነት" />
                  <RatingButtons name="staff_behavior" label="የሰራተኞች ባህሪ እና አካሄድ" />
                  <div><label className="font-bold text-sm block mb-1">የተወደደው አገልግሎት</label><textarea name="liked_service" rows="2" value={formData.liked_service} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                  <div><label className="font-bold text-sm block mb-1">ማሻሻያ የሚፈልጉት</label><textarea name="improvement_needs" rows="2" value={formData.improvement_needs} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                </div>
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
                      onClick={() => handleRating('overall_satisfaction', v)}
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
              {loading ? 'በማስገባት ላይ...' : '✓ ሁሉንም መልሶች አስገባ'}
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