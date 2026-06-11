import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function FeedbackForm() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [feedbackId, setFeedbackId] = useState(null)
  
  const today = new Date().toISOString().split('T')[0]
  
  const [formData, setFormData] = useState({
    service_date: today,
    gender: '',
    stakeholder_type: '',
    stakeholder_other: '',
    sector: '',
    minister_office: '',
    executive_director: '',
    crop_development: '',
    natural_resource: '',
    livestock: '',
    investment: '',
    provider_name: '',
    service_duration: '',
    service_types: [],
    other_service: '',
    ease_of_access: null,
    staff_respect: null,
    staff_clarity: null,
    fast_response: null,
    accurate_service: null,
    clear_info: null,
    timely_service: null,
    met_expectations: null,
    overall_satisfaction: null,
    improvement: '',
    comments: '',
    contact: '',
    full_name: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      let updated = [...formData.service_types]
      if (checked) updated.push(value)
      else updated = updated.filter(v => v !== value)
      setFormData(prev => ({ ...prev, service_types: updated }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRating = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const dataToSend = {
      ...formData,
      service_types: formData.service_types.join(', '),
      service_date: today,
      service_duration: parseInt(formData.service_duration) || 0
    }
    
    try {
      const res = await fetch('http://localhost:8000/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      if (res.ok) {
        const data = await res.json()
        setFeedbackId(data.id || Math.floor(Math.random() * 1000000))
        setShowPopup(true)
        setFormData({
          service_date: today,
          gender: '',
          stakeholder_type: '',
          stakeholder_other: '',
          sector: '',
          minister_office: '',
          executive_director: '',
          crop_development: '',
          natural_resource: '',
          livestock: '',
          investment: '',
          provider_name: '',
          service_duration: '',
          service_types: [],
          other_service: '',
          ease_of_access: null,
          staff_respect: null,
          staff_clarity: null,
          fast_response: null,
          accurate_service: null,
          clear_info: null,
          timely_service: null,
          met_expectations: null,
          overall_satisfaction: null,
          improvement: '',
          comments: '',
          contact: ''
        })
      } else {
        alert('ስህተት ተከስቷል!')
      }
    } catch (err) { 
      console.error('Error:', err)
      alert('Connection error!')
    }
    finally { setLoading(false) }
  }

  const LikertButtons = ({ name, label }) => {
    return (
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <label className="block font-bold text-gray-700 mb-2 text-sm">{label}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { v: 1, l: 'በፍጹም አልስማማም' },
            { v: 2, l: 'አልስማማም' },
            { v: 3, l: 'ገለልተኛ' },
            { v: 4, l: 'እስማማለሁ' },
            { v: 5, l: 'በጣም እስማማለሁ' }
          ].map(opt => (
           <button
  key={opt.v}
  type="button"
  onClick={(e) => {
    e.preventDefault();      // ✅ Prevents any default behavior
    e.stopPropagation();     // ✅ Stops event from bubbling up
    handleRating(name, opt.v);
  }}
  className={`flex-1 px-2 py-2 rounded text-sm transition ${
    formData[name] === opt.v 
      ? 'bg-green-600 text-white' 
      : 'bg-white border border-gray-300 hover:bg-green-100'
  }`}
>
  {opt.v} - {opt.l}
</button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-3 px-3">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-4 text-center max-w-sm w-full">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-lg font-bold mb-2">እናመሰግናለን!</h2>
            <p className="text-gray-600 mb-3 text-sm">ግብረመልስዎ ተመዝግቧል</p>
            <div className="bg-green-100 p-2 rounded-lg mb-3">
              <p className="text-xs">ID: <strong>{feedbackId}</strong></p>
            </div>
            <button onClick={() => setShowPopup(false)} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm">
              ዝጋ
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 pb-3 border-b gap-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <h1 className="text-lg sm:text-2xl font-bold text-green-800">የግብርና ሚኒስቴር</h1>
          </div>
          <Link to="/login" className="w-full sm:w-auto text-center bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">
            🔐 አስተዳዳሪ መግቢያ
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 p-2 rounded-lg mb-4 text-xs text-blue-800">
          ይህ መጠይቅ በግብርና ሚኒስቴር የሚሰጡ አገልግሎቶችን ጥራት እና ውጤታማነት ለማሻሻል ግብረ-መልስ ለማሰብሰብ ተዘጋጅቷል።
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Personal Information */}
          <div className="mb-6">
            <h2 className="text-base sm:text-xl font-bold text-green-800 mb-3 border-b pb-2">ክፍል 1: የአገልግሎት ተጠቃሚ መረጃ</h2>

            <div className="space-y-3">
              {/* 1.1 Date */}
              <div>
                <label className="font-bold text-sm block mb-1">1.1 አገልግሎቱ የተገኘበት ቀን *</label>
                <input type="date" name="service_date" value={formData.service_date} onChange={handleChange} max={today} className="w-full p-2 border rounded text-sm" required />
              </div>
              
              {/* 1.2 Gender */}
              <div>
                <label className="font-bold text-sm block mb-1">1.2 ጾታ *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded text-sm" required>
                  <option value="">ይምረጡ</option>
                  <option value="male">ወንድ</option>
                  <option value="female">ሴት</option>
                </select>
              </div>
              
              {/* 1.3 Stakeholder Type */}
              <div>
                <label className="font-bold text-sm block mb-1">1.3 የባለድርሻ አካል ዓይነት</label>
                <select name="stakeholder_type" value={formData.stakeholder_type} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                  <option value="">ይምረጡ</option>
                  <option value="የመንግስት ሚኒስቴር መስሪያ ቤት">የመንግስት ሚኒስቴር መስሪያ ቤት</option>
                  <option value="መንግስታዊ ያልሆነ ድርጅት (NGO)">መንግስታዊ ያልሆነ ድርጅት (NGO)</option>
                  <option value="የግል ዘርፍ">የግል ዘርፍ</option>
                  <option value="ግብርና ሚኒስቴር - ዘርፍ">ግብርና ሚኒስቴር - ዘርፍ</option>
                  <option value="ግብርና ሚኒስቴር - ድጋፍ ዘርፍ">ግብርና ሚኒስቴር - ድጋፍ ዘርፍ</option>
                  <option value="ተጠሪ ተቋም">ተጠሪ ተቋም</option>
                  <option value="ፕሮጀክት">ፕሮጀክት</option>
                  <option value="ሌላ">ሌላ</option>
                </select>
              </div>
              {formData.stakeholder_type === 'ሌላ' && (
                <input type="text" name="stakeholder_other" value={formData.stakeholder_other} onChange={handleChange} placeholder="እባክዎ ይግለጹ" className="w-full p-2 border rounded text-sm"/>
              )}
              
              {/* 1.4 Sector */}
              <div>
                <label className="font-bold text-sm block mb-1">1.4 አገልግሎት የሚሰጠው ዘርፍ</label>
                <select name="sector" value={formData.sector} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                  <option value="">ይምረጡ</option>
                  <option value="የሚኒስትር ጽ/ቤት">የሚኒስትር ጽ/ቤት</option>
                  <option value="የሥራ አመራር ዘርፍ">የሥራ አመራር ዘርፍ</option>
                  <option value="የእርሻና ሆርቲካልቸር ልማት ዘርፍ">የእርሻና ሆርቲካልቸር ልማት ዘርፍ</option>
                  <option value="የተፈጥሮ ሀብት ልማት ዘርፍ">የተፈጥሮ ሀብት ልማት ዘርፍ</option>
                  <option value="የእንስሳትና ዓሳ ልማት ዘርፍ">የእንስሳትና ዓሳ ልማት ዘርፍ</option>
                  <option value="የግብርና ኢንቨስትመንትና ግብዓት ዘርፍ">የግብርና ኢንቨስትመንትና ግብዓት ዘርፍ</option>
                </select>
              </div>

              {/* Sub-sector fields */}
              {formData.sector === 'የሚኒስትር ጽ/ቤት' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.1 የሚኒስትር ጽ/ቤት</label>
                  <select name="minister_office" value={formData.minister_office} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የፖሊሲና ስትራተጂ ጥናትና ምርምር መሪ ሥራ አስፈጻሚ">የፖሊሲና ስትራተጂ ጥናትና ምርምር መሪ ሥራ አስፈጻሚ</option>
                    <option value="የህዝብ ግንኙነት ሥራ አስፈጻሚ">የህዝብ ግንኙነት ሥራ አስፈጻሚ</option>
                    <option value="የውስጥ ኦዲት ሥራ አስፈጻሚ">የውስጥ ኦዲት ሥራ አስፈጻሚ</option>
                    <option value="የስነ ምግባርና ፀረ ሙስና ሥራ አስፈጻሚ">የስነ ምግባርና ፀረ ሙስና ሥራ አስፈጻሚ</option>
                    <option value="የህግ አገልግሎት ሥራ አስፈጻሚ">የህግ አገልግሎት ሥራ አስፈጻሚ</option>
                    <option value="የሥርዓተ ምግብ ጽ/ቤት">የሥርዓተ ምግብ ጽ/ቤት</option>
                    <option value="የምግብ ዋስትና ጽ/ቤት">የምግብ ዋስትና ጽ/ቤት</option>
                  </select>
                </div>
              )}

              {formData.sector === 'የሥራ አመራር ዘርፍ' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.3 የሥራ አመራር ዋና ሥራ አስፈጻሚ</label>
                  <select name="executive_director" value={formData.executive_director} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የስትራቴጂክ ጉዳዮች ሥራ አስፈጻሚ">የስትራቴጂክ ጉዳዮች ሥራ አስፈጻሚ</option>
                    <option value="የተቋማዊ ለውጥ ሥራ አስፈጻሚ">የተቋማዊ ለውጥ ሥራ አስፈጻሚ</option>
                    <option value="የፋይናንስ ሥራ አስፈጻሚ">የፋይናንስ ሥራ አስፈጻሚ</option>
                    <option value="የግዥ ሥራ አስፈጻሚ">የግዥ ሥራ አስፈጻሚ</option>
                    <option value="የብቃትና የሰው ሀብት አስተዳደር ሥራ አስፈጻሚ">የብቃትና የሰው ሀብት አስተዳደር ሥራ አስፈጻሚ</option>
                    <option value="የሴቶችና ማኅበራዊ ጉዳዮች አካቶ ትግበራ ሥራ አስፈጻሚ">የሴቶችና ማኅበራዊ ጉዳዮች አካቶ ትግበራ ሥራ አስፈጻሚ</option>
                    <option value="የኢንፎርሜሽንና ኮሙኒኬሽን ቴክኖሎጂ ሥራ አስፈጻሚ">የኢንፎርሜሽንና ኮሙኒኬሽን ቴክኖሎጂ ሥራ አስፈጻሚ</option>
                    <option value="የመሠረታዊ አገልግሎት ሥራ አስፈጻሚ">የመሠረታዊ አገልግሎት ሥራ አስፈጻሚ</option>
                  </select>
                </div>
              )}

              {formData.sector === 'የእርሻና ሆርቲካልቸር ልማት ዘርፍ' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.4 አገልግሎት</label>
                  <select name="crop_development" value={formData.crop_development} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የሰብል ልማት መሪ ሥራ አስፈጻሚ">የሰብል ልማት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የሆልቲካልቸር ልማት መሪ ሥራ አስፈጻሚ">የሆልቲካልቸር ልማት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የዕፅዋት ጥበቃ መሪ ሥራ አስፈጻሚ">የዕፅዋት ጥበቃ መሪ ሥራ አስፈጻሚ</option>
                    <option value="የእርሻና ሆርቲካልቸር ኤክስቴንሽን አገልግሎት መሪ ሥራ አስፈጻሚ">የእርሻና ሆርቲካልቸር ኤክስቴንሽን አገልግሎት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የጥጥ ልማት መሪ ሥራ አስፈጻሚ">የጥጥ ልማት መሪ ሥራ አስፈጻሚ</option>
                  </select>
                </div>
              )}

              {formData.sector === 'የተፈጥሮ ሀብት ልማት ዘርፍ' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.5 የተፈጥሮ ሀብት ልማት</label>
                  <select name="natural_resource" value={formData.natural_resource} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የገጠር መሬት አስተዳደርና አጠቃቀም መሪ ሥራ አስፈጻሚ">የገጠር መሬት አስተዳደርና አጠቃቀም መሪ ሥራ አስፈጻሚ</option>
                    <option value="የአነስተኛ ይዞታ መስኖ ልማት መሪ ሥራ አስፈጻሚ">የአነስተኛ ይዞታ መስኖ ልማት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የተፈጥሮ ሃብት ልማት፣ ጥበቃና አጠቃቀም መሪ ሥራ አስፈጻሚ">የተፈጥሮ ሃብት ልማት፣ ጥበቃና አጠቃቀም መሪ ሥራ አስፈጻሚ</option>
                    <option value="የአፈር ሃብት ልማት መሪ ሥራ አስፈጻሚ">የአፈር ሃብት ልማት መሪ ሥራ አስፈጻሚ</option>
                  </select>
                </div>
              )}

              {formData.sector === 'የእንስሳትና ዓሳ ልማት ዘርፍ' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.6 የእንስሳትና ዓሳ ልማት</label>
                  <select name="livestock" value={formData.livestock} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የመኖ ሃብት ልማት መሪ ሥራ አስፈጻሚ">የመኖ ሃብት ልማት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የእንስሳትና አሳ ሃብት ልማት መሪ ሥራ አስፈጻሚ">የእንስሳትና አሳ ሃብት ልማት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የእንስሳት ጤናና ቬተርነሪ ፕብሊክ ሄልዝ መሪ ሥራ አስፈጻሚ">የእንስሳት ጤናና ቬተርነሪ ፕብሊክ ሄልዝ መሪ ሥራ አስፈጻሚ</option>
                    <option value="የእንስሳትና ዓሳ ሃብት ልማት ኤክስቴንሽን አገልግሎት መሪ ሥራ አስፈጻሚ">የእንስሳትና ዓሳ ሃብት ልማት ኤክስቴንሽን አገልግሎት መሪ ሥራ አስፈጻሚ</option>
                  </select>
                </div>
              )}

              {formData.sector === 'የግብርና ኢንቨስትመንትና ግብዓት ዘርፍ' && (
                <div>
                  <label className="font-bold text-sm block mb-1">1.4.7 የግብርና ኢንቨስትመንትና ግብዓት</label>
                  <select name="investment" value={formData.investment} onChange={handleChange} className="w-full p-2 border rounded text-sm">
                    <option value="">ይምረጡ</option>
                    <option value="የግብዓት አቅርቦት መሪ ሥራ አስፈጻሚ">የግብዓት አቅርቦት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የግብርና ሜካናይዜሽን መሪ ሥራ አስፈጻሚ">የግብርና ሜካናይዜሽን መሪ ሥራ አስፈጻሚ</option>
                    <option value="የግብርና ኢንቨስትመንትና ምርት ግብይት መሪ ሥራ አስፈጻሚ">የግብርና ኢንቨስትመንትና ምርት ግብይት መሪ ሥራ አስፈጻሚ</option>
                    <option value="የከተማ ግብርና ልማት መሪ ሥራ አስፈጻሚ">የከተማ ግብርና ልማት መሪ ሥራ አስፈጻሚ</option>
                  </select>
                </div>
              )}
              
             {/* Optional: Full Name */}
<div>
  <label className="font-bold text-sm block mb-1">ሙሉ ስም (አማራጭ)</label>
  <input 
    type="text" 
    name="full_name" 
    value={formData.full_name} 
    onChange={handleChange} 
    className="w-full p-2 border rounded text-sm"
    placeholder="ስምዎን ያስገቡ (ካልፈለጉ ባዶ ይተዉት)"
  />
  <p className="text-gray-400 text-xs mt-1">※ አማራጭ ነው - መሙላት የለብዎትም</p>
</div>

          {/* Section 2: Service Types */}
          <div className="mb-6">
            <h2 className="text-base sm:text-xl font-bold text-green-800 mb-3 border-b pb-2">ክፍል 2: ያገኙት አገልግሎት ዓይነት</h2>
            <p className="text-xs text-gray-500 mb-3">አንድ ወይም ብዙ መምረጥ ይችላሉ</p>
            
            <div className="space-y-2">
              {['የምክር አገልግሎት', 'የኢንቨስትመንት ድጋፍ', 'የእንስሳት እርባታ', 'የእንስሳት ሕክምና', 'የአነስተኛ መስኖ', 'የግብርና ምርምር', 'የመሬት አስተዳደር', 'ለጨረታ ውድድር', 'ክፍያ ለመቀበል', 'ሌሎች'].map(s => (
                <label key={s} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                  <input type="checkbox" value={s} checked={formData.service_types.includes(s)} onChange={handleChange} className="w-4 h-4"/>
                  <span>{s}</span>
                </label>
              ))}
            </div>
            
            {formData.service_types.includes('ሌሎች') && (
              <input type="text" name="other_service" value={formData.other_service} onChange={handleChange} placeholder="እባክዎ ይግለጹ" className="w-full mt-3 p-2 border rounded text-sm"/>
            )}
          </div>

              {/* 1.6 Service Duration */}
              <div>
                <label className="font-bold text-sm block mb-1">1.6 አገልግሎቱን ለማግኘት የወሰደው ጊዜ (በደቂቃ)</label>
                <input type="number" name="service_duration" value={formData.service_duration} onChange={handleChange} className="w-full p-2 border rounded text-sm"/>
              </div>
            </div>
          </div>
          {/* Section 3: Evaluation */}
          <div className="mb-6">
            <h2 className="text-base sm:text-xl font-bold text-green-800 mb-3 border-b pb-2">ክፍል 3: አጠቃላይ አገልግሎት ግምገማ</h2>
            
            <LikertButtons name="ease_of_access" label="3.1. አገልግሎቱን በቀላሉ ማግኘት ችያለሁ" />
            <LikertButtons name="staff_respect" label="3.2. ሰራተኞቹ በአክብሮት ተቀብለውኛል" />
            <LikertButtons name="staff_clarity" label="3.3. ሰራተኞቹ ስለአገልግሎቱ የሰጡኝ ማብራሪያ የተሟላና ግልጽ ነው" />
            <LikertButtons name="fast_response" label="3.4. ለጥያቄዬም ፈጣን ምላሽ አግኝቻለው" />
            <LikertButtons name="accurate_service" label="3.5. የተሰጠኝ አገልግሎት ትክክለኛ እና አስተማማኝ ነው" />
            <LikertButtons name="clear_info" label="3.6. የተሰጠው መረጃ ወይም አገልግሎት ግልጽ እና ለመረዳት ቀላል ነበር" />
            <LikertButtons name="timely_service" label="3.7. አገልግሎቱ በተመጣጣኝ የጊዜ ገደብ ውስጥ ተሰጥቷል" />
            <LikertButtons name="met_expectations" label="3.8. አገልግሎቱ ፍላጎቴንና የሚጠበቀውን ውጤት አሟልቷል" />
            
            <div className="mt-3 p-3 bg-green-50 rounded-lg">
              <label className="font-bold text-sm mb-2 block">3.9. በአጠቃላይ በተቀበሉት አገልግሎት ምን ያህል ረክተዋል?</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { v: 1, l: 'በጣም አልረካሁም' },
                  { v: 2, l: 'አልረካሁም' },
                  { v: 3, l: 'እርግጠኛ አይደለሁም' },
                  { v: 4, l: 'ረክቻለሁ' },
                  { v: 5, l: 'በጣም ረክቻለሁ' }
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => handleRating('overall_satisfaction', opt.v)}
                    className={`flex-1 px-2 py-2 rounded text-sm transition ${
                      formData.overall_satisfaction === opt.v
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-green-100'
                    }`}
                  >
                    {opt.v} - {opt.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Comments */}
          <div className="mb-6">
            <h2 className="text-base sm:text-xl font-bold text-green-800 mb-3 border-b pb-2">አስተያየቶች</h2>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-sm block mb-1">4. ካገኙት አገልግሎት ውስጥ እንዲሻሻል የሚፈልጉት ነገር ካለ እባክዎ ያብራሩ</label>
                <textarea name="improvement" rows="2" value={formData.improvement} onChange={handleChange} className="w-full p-2 border rounded text-sm"></textarea>
              </div>
              <div>
                <label className="font-bold text-sm block mb-1">5. ስለ ግብርና ሚኒስቴር አጠቃላይ አፈጻጸም ሌላ አስተያየት ወይም ሃሳብ ካለዎት</label>
                <textarea name="comments" rows="2" value={formData.comments} onChange={handleChange} className="w-full p-2 border rounded text-sm"></textarea>
              </div>
              <div>
                <label className="font-bold text-sm block mb-1">6. ስልክ/ኢሜይል (አማራጭ)</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded text-sm"/>
              </div>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-800">
              ሀሳብዎን ለማካፈል ጊዜዎን ስለሰጡን እናመሰግናለን!
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 mt-4">
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
              {loading ? 'በማስገባት ላይ...' : '✓ ግብረመልስ አስገባ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}