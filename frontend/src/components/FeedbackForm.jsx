// frontend/src/FeedbackForm.jsx
import { useState } from 'react'
import QRCodeModal from './components/QRCodeModal'

export default function FeedbackForm() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [submittedFeedback, setSubmittedFeedback] = useState(null)
  
  const [formData, setFormData] = useState({
    // Sharepoint Questions
    sharepoint_help: null,
    sharepoint_better: null,
    sharepoint_better_reason: '',
    sharepoint_difficulty: null,
    sharepoint_difficulty_reason: '',
    ict_willing: null,
    ict_willing_reason: '',
    // Section 1
    service_date: '',
    gender: '',
    stakeholder_type: '',
    stakeholder_other: '',
    sector: '',
    sub_sector: '',
    provider_name: '',
    service_duration_minutes: '',
    // Section 2
    service_types: [],
    other_service: '',
    // Section 3
    ease_of_access: null,
    staff_respect: null,
    staff_clarity: null,
    fast_response: null,
    accurate_service: null,
    clear_info: null,
    timely_service: null,
    met_expectations: null,
    overall_satisfaction: null,
    // Section 4-6
    improvement_suggestions: '',
    general_comments: '',
    contact_info: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox') {
      let updated = [...formData.service_types]
      if (checked) {
        updated.push(value)
      } else {
        updated = updated.filter(v => v !== value)
      }
      setFormData(prev => ({ ...prev, service_types: updated }))
    } else if (type === 'radio') {
      const boolValue = value === 'true'
      setFormData(prev => ({ ...prev, [name]: boolValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRatingChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/api/feedback/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        const feedbackId = result.id || Math.floor(Math.random() * 1000000)
        const qrValue = `${window.location.origin}/feedback-status/${feedbackId}`
        
        setSubmittedFeedback({ id: feedbackId, qrValue: qrValue })
        setShowPopup(true)
        
        setFormData({
          sharepoint_help: null, sharepoint_better: null, sharepoint_better_reason: '',
          sharepoint_difficulty: null, sharepoint_difficulty_reason: '', ict_willing: null,
          ict_willing_reason: '', service_date: '', gender: '', stakeholder_type: '',
          stakeholder_other: '', sector: '', sub_sector: '', provider_name: '',
          service_duration_minutes: '', service_types: [], other_service: '',
          ease_of_access: null, staff_respect: null, staff_clarity: null, fast_response: null,
          accurate_service: null, clear_info: null, timely_service: null, met_expectations: null,
          overall_satisfaction: null, improvement_suggestions: '', general_comments: '',
          contact_info: ''
        })
        setStep(1)
      } else {
        alert('ስህተት ተከስቷል!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('ስህተት ተከስቷል!')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const LikertButtons = ({ name, label }) => (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <label className="block font-bold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {[
          { v: 1, l: 'በፍጹም አልስማማም' },
          { v: 2, l: 'አልስማማም' },
          { v: 3, l: 'ገለልተኛ' },
          { v: 4, l: 'እስማማለሁ' },
          { v: 5, l: 'በጣም እስማማለሁ' }
        ].map(option => (
          <button
            key={option.v}
            type="button"
            onClick={() => handleRatingChange(name, option.v)}
            className={`px-3 py-1 rounded transition ${
              formData[name] === option.v
                ? 'bg-green-600 text-white'
                : 'bg-white border border-gray-300 hover:bg-green-100'
            }`}
          >
            {option.v} - {option.l}
          </button>
        ))}
      </div>
    </div>
  )

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <QRCodeModal isOpen={showPopup} onClose={() => setShowPopup(false)} feedbackId={submittedFeedback?.id} qrValue={submittedFeedback?.qrValue} />

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center mb-6">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold text-green-800">የግብርና ሚኒስቴር</h1>
          <p className="text-gray-600 mt-2">የደንበኞች አገልግሎት እርካታ መመዘኛ ቅጽ</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            ይህ መጠይቅ በግብርና ሚኒስቴር የሚሰጡ አገልግሎቶችን ጥራት እና ውጤታማነት ለማሻሻል ግብረ-መልስ ለማሰብሰብ ተዘጋጅቷል። 
            መጠይቁን ለመሙላት ከ5-7 ደቂቃ ብቻ ይወስዳል። ምላሽዎ በምስጢር የሚጠበቅ ሲሆን ለአገልግሎት ማሻሻያ ብቻ ይውላል።
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1">
          {['መግቢያ', 'አገልግሎት', 'ግምገማ', 'አስተያየት'].map((label, idx) => (
            <div key={idx} className={`flex-1 text-center py-2 text-sm rounded transition ${step >= idx + 1 ? 'bg-green-600 text-white' : 'text-gray-500'}`}>
              {label}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Sharepoint and Basic Info */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">ስለ Sharepoint አጠቃቀም</h2>
              
              {/* Question 1 */}
              <div className="mb-5">
                <label className="block font-medium mb-2">1. ሼርፖይንት ምን ያክል አግዟችኃል?</label>
                <div className="flex gap-2 flex-wrap">
                  {[{v:1,l:'በፍጹም አላገዘኝም'},{v:2,l:'አልስማማም'},{v:3,l:'ገለልተኛ'},{v:4,l:'አግዞኛል'},{v:5,l:'በጣም አግዞኛል'}].map(opt => (
                    <button key={opt.v} type="button" onClick={() => handleRatingChange('sharepoint_help', opt.v)} className={`px-3 py-1 rounded ${formData.sharepoint_help === opt.v ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>{opt.l}</button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="mb-5">
                <label className="block font-medium mb-2">2. ሼርፖይንት ወረቀት ከመጠቀም የተሻለ ነው ብለው ያስባሉ?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="sharepoint_better" value="true" onChange={handleChange} /> አዎ</label>
                  <label className="flex items-center gap-2"><input type="radio" name="sharepoint_better" value="false" onChange={handleChange} /> አይደለም</label>
                </div>
                {formData.sharepoint_better === false && (
                  <textarea name="sharepoint_better_reason" value={formData.sharepoint_better_reason} onChange={handleChange} placeholder="እባክዎ ምክንያትዎን ይዘርዝሩ" className="w-full mt-2 p-2 border rounded" rows="2" />
                )}
              </div>

              {/* Question 3 */}
              <div className="mb-5">
                <label className="block font-medium mb-2">3. ሼርፖይንት ለመጠቀም ያሰቸገረዎት ነገር አለ?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="sharepoint_difficulty" value="true" onChange={handleChange} /> አዎ</label>
                  <label className="flex items-center gap-2"><input type="radio" name="sharepoint_difficulty" value="false" onChange={handleChange} /> አይደለም</label>
                </div>
                {formData.sharepoint_difficulty === true && (
                  <textarea name="sharepoint_difficulty_reason" value={formData.sharepoint_difficulty_reason} onChange={handleChange} placeholder="እባክዎ ምክንያትዎን ይዘርዝሩ" className="w-full mt-2 p-2 border rounded" rows="2" />
                )}
              </div>

              {/* Question 4 */}
              <div className="mb-5">
                <label className="block font-medium mb-2">4. የአይሲቲ ባለሙያዎች እናንተን ለማገዘ ፈቃደኛ ናቸው?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="radio" name="ict_willing" value="true" onChange={handleChange} /> አዎ</label>
                  <label className="flex items-center gap-2"><input type="radio" name="ict_willing" value="false" onChange={handleChange} /> አይደሉም</label>
                </div>
                {formData.ict_willing === false && (
                  <textarea name="ict_willing_reason" value={formData.ict_willing_reason} onChange={handleChange} placeholder="እባክዎ ምክንያትዎን ይዘርዝሩ" className="w-full mt-2 p-2 border rounded" rows="2" />
                )}
              </div>

              <hr className="my-4" />
              <h2 className="text-xl font-bold text-green-800 mb-4">ክፍል 1፡ የአገልግሎት ተጠቃሚ መረጃ</h2>

              {/* Section 1 fields */}
              <div className="space-y-3">
                <div><label className="block font-medium">1.1 አገልግሎቱ የተገኘበት ቀን *</label><input type="date" name="service_date" value={formData.service_date} onChange={handleChange} max={today} className="w-full p-2 border rounded" required /></div>
                <div><label className="block font-medium">1.2 ጾታ *</label><select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded" required><option value="">ይምረጡ</option><option value="male">ወንድ</option><option value="female">ሴት</option></select></div>
                <div><label className="block font-medium">1.3 የባለድርሻ አካል ዓይነት</label><input type="text" name="stakeholder_type" value={formData.stakeholder_type} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                <div><label className="block font-medium">1.4 ዘርፍ</label><input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                <div><label className="block font-medium">1.5 ንዑስ ዘርፍ</label><input type="text" name="sub_sector" value={formData.sub_sector} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                <div><label className="block font-medium">1.6 መረጃውን የሰጠው አካል/ባለሞያ ስም *</label><input type="text" name="provider_name" value={formData.provider_name} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
                <div><label className="block font-medium">1.7 አገልግሎቱን ለማግኘት የወሰደው ጊዜ (በደቂቃ)</label><input type="number" name="service_duration_minutes" value={formData.service_duration_minutes} onChange={handleChange} className="w-full p-2 border rounded" /></div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={nextStep} className="flex-1 bg-green-600 text-white py-2 rounded">ቀጥል →</button>
              </div>
            </div>
          )}

          {/* Step 2: Service Types */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">ክፍል 2፡ ያገኙት አገልግሎት ዓይነት</h2>
              <p className="text-sm text-gray-500 mb-3">አንድ ወይም ብዙ መምረጥ ይችላሉ</p>
              
              <div className="space-y-2">
                {['የምክር አገልግሎት', 'የኢንቨስትመንት ድጋፍ', 'የእንስሳት እርባታ', 'የእንስሳት ሕክምና', 'የአነስተኛ መስኖ', 'የግብርና ምርምር', 'የመሬት አስተዳደር', 'ለጨረታ ውድድር', 'ክፍያ ለመቀበል', 'ሌሎች'].map(service => (
                  <label key={service} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" value={service} checked={formData.service_types.includes(service)} onChange={handleChange} className="w-4 h-4" />
                    <span>{service}</span>
                  </label>
                ))}
              </div>

              {formData.service_types.includes('ሌሎች') && (
                <div className="mt-3"><input type="text" name="other_service" value={formData.other_service} onChange={handleChange} placeholder="እባክዎ ይግለጹ" className="w-full p-2 border rounded" /></div>
              )}

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-300 py-2 rounded">← ተመለስ</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-green-600 text-white py-2 rounded">ቀጥል →</button>
              </div>
            </div>
          )}

          {/* Step 3: Evaluation */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">ክፍል 3፡ አጠቃላይ አገልግሎት ግምገማ</h2>
              
              <LikertButtons name="ease_of_access" label="3.1. አገልግሎቱን በቀላሉ ማግኘት ችያለሁ" />
              <LikertButtons name="staff_respect" label="3.2. ሰራተኞቹ በአክብሮት ተቀብለውኛል" />
              <LikertButtons name="staff_clarity" label="3.3. ሰራተኞቹ ስለአገልግሎቱ የሰጡኝ ማብራሪያ የተሟላና ግልጽ ነው" />
              <LikertButtons name="fast_response" label="3.4. ለጥያቄዬም ፈጣን ምላሽ አግኝቻለው" />
              <LikertButtons name="accurate_service" label="3.5. የተሰጠኝ አገልግሎት ትክክለኛ እና አስተማማኝ ነው" />
              <LikertButtons name="clear_info" label="3.6. የተሰጠው መረጃ ግልጽ እና ለመረዳት ቀላል ነበር" />
              <LikertButtons name="timely_service" label="3.7. አገልግሎቱ በተመጣጣኝ የጊዜ ገደብ ውስጥ ተሰጥቷል" />
              <LikertButtons name="met_expectations" label="3.8. አገልግሎቱ ፍላጎቴን አሟልቷል" />

              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <label className="block font-bold mb-3">3.9. በአጠቃላይ በተቀበሉት አገልግሎት ምን ያህል ረክተዋል?</label>
                <div className="flex gap-2 flex-wrap">
                  {[{v:1,l:'በጣም አልረካሁም'},{v:2,l:'አልረካሁም'},{v:3,l:'እርግጠኛ አይደለሁም'},{v:4,l:'ረክቻለሁ'},{v:5,l:'በጣም ረክቻለሁ'}].map(opt => (
                    <button key={opt.v} type="button" onClick={() => handleRatingChange('overall_satisfaction', opt.v)} className={`px-3 py-1 rounded ${formData.overall_satisfaction === opt.v ? 'bg-green-600 text-white' : 'bg-white border'}`}>{opt.l}</button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-300 py-2 rounded">← ተመለስ</button>
                <button type="button" onClick={nextStep} className="flex-1 bg-green-600 text-white py-2 rounded">ቀጥል →</button>
              </div>
            </div>
          )}

          {/* Step 4: Comments */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-green-800 mb-4">አስተያየቶች እና ማነጋገሪያ</h2>
              
              <div className="space-y-4">
                <div><label className="block font-medium">4. ካገኙት አገልግሎት ውስጥ እንዲሻሻል የሚፈልጉት ነገር ካለ እባክዎ ያብራሩ</label><textarea name="improvement_suggestions" rows="3" value={formData.improvement_suggestions} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                <div><label className="block font-medium">5. ስለ ግብርና ሚኒስቴር አጠቃላይ አፈጻጸም ሌላ አስተያየት ወይም ሃሳብ ካለዎት</label><textarea name="general_comments" rows="3" value={formData.general_comments} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
                <div><label className="block font-medium">6. ወደፊት ለሚደረጉ ጥናቶች እርስዎን ለማግኘት ፈቃደኛ ከሆኑ ስልክ ቁጥርዎን ወይም ኢሜይልዎን እዚህ ያስፍሩ (አማራጭ)</label><input type="text" name="contact_info" value={formData.contact_info} onChange={handleChange} className="w-full p-2 border rounded" /></div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">ሀሳብዎን ለማካፈል ጊዜዎን ስለሰጡን እናመሰግናለን! አስተያየትዎ የአገልግሎታችንን ጥራት ለማሻሻል ይረዳናል።</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={prevStep} className="flex-1 bg-gray-300 py-2 rounded">← ተመለስ</button>
                <button type="submit" disabled={loading} className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50">
                  {loading ? 'በማስገባት ላይ...' : '✓ ግብረመልስ አስገባ'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}