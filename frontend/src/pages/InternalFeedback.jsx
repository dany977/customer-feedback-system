import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function InternalFeedback() {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const [formData, setFormData] = useState({
    employee_id: '',
    department: '',
    position: '',
    years_of_service: '',
    overall_satisfaction: 3,
    improvements: '',
    comments: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/employee/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setShowPopup(true)
        setFormData({
          employee_id: '',
          department: '',
          position: '',
          years_of_service: '',
          overall_satisfaction: 3,
          improvements: '',
          comments: ''
        })
        setTimeout(() => setShowPopup(false), 3000)
      } else {
        alert('ስህተት ተከስቷል!')
      }
    } catch (err) {
      console.error(err)
      alert('Connection error!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-5xl">🏢</span>
          <h1 className="text-3xl font-bold text-blue-800 mt-2">የውስጥ ሰራተኞች እርካታ መጠይቅ</h1>
          <p className="text-gray-600 mt-2">እባክዎ ከዚህ በታች መረጃዎን ይሙሉ</p>
        </div>

        {showPopup && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-6 text-center">
            ✅ እናመሰግናለን! ምላሽዎ ተመዝግቧል
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div><label className="font-bold text-sm">የሰራተኛ መታወቂያ *</label><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
              <div><label className="font-bold text-sm">ዲፓርትመንት *</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
              <div><label className="font-bold text-sm">ሹመት</label><input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" /></div>
              <div><label className="font-bold text-sm">የስራ ዘመን (አመታት)</label><input type="number" name="years_of_service" value={formData.years_of_service} onChange={handleChange} className="w-full p-2 border rounded" /></div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <label className="font-bold text-lg mb-3 block">⭐ በአጠቃላይ በድርጅቱ ውስጥ በመስራት ምን ያህል ረክተዋል?</label>
              <div className="flex gap-3">
                {[1,2,3,4,5].map(v => (
                  <button key={v} type="button" onClick={() => setFormData({...formData, overall_satisfaction: v})} className={`flex-1 py-3 rounded-lg font-bold transition ${formData.overall_satisfaction === v ? 'bg-blue-600 text-white' : 'bg-white border-2 border-blue-300 hover:bg-blue-100'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4"><label className="font-bold text-sm">ማሻሻያ ሃሳቦች</label><textarea name="improvements" rows="3" value={formData.improvements} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
            <div className="mb-6"><label className="font-bold text-sm">ሌላ አስተያየት</label><textarea name="comments" rows="2" value={formData.comments} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
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