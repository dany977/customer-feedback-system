import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function EmployeeForm() {
  const [loading, setLoading] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
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
          full_name: '',
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
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-800">🏢 የሰራተኞች እርካታ መጠይቅ</h1>
          <Link to="/" className="text-green-600 hover:text-green-800">← ወደ ዋና ገጽ</Link>
        </div>

        {showPopup && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-center">
            ✅ ምላሽዎ ተመዝግቧል! እናመሰግናለን!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="font-bold text-sm">ሙሉ ስም</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full p-2 border rounded" /></div>
            <div><label className="font-bold text-sm">የሰራተኛ መታወቂያ *</label><input type="text" name="employee_id" value={formData.employee_id} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div><label className="font-bold text-sm">ዲፓርትመንት *</label><input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
            <div><label className="font-bold text-sm">ሹመት</label><input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full p-2 border rounded" /></div>
            <div><label className="font-bold text-sm">የስራ ዘመን (አመታት)</label><input type="number" name="years_of_service" value={formData.years_of_service} onChange={handleChange} className="w-full p-2 border rounded" /></div>
          </div>

          <div className="mt-4">
            <label className="font-bold text-sm">በአጠቃላይ ስራዎ እርካታ (1-5) *</label>
            <div className="flex gap-2 mt-1">
              {[1,2,3,4,5].map(v => (
                <button key={v} type="button" onClick={() => setFormData({...formData, overall_satisfaction: v})} className={`flex-1 py-2 rounded ${formData.overall_satisfaction === v ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{v}</button>
              ))}
            </div>
          </div>

          <div className="mt-4"><label className="font-bold text-sm">ማሻሻያ ሃሳቦች</label><textarea name="improvements" rows="3" value={formData.improvements} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>
          <div className="mt-4"><label className="font-bold text-sm">ሌላ አስተያየት</label><textarea name="comments" rows="2" value={formData.comments} onChange={handleChange} className="w-full p-2 border rounded"></textarea></div>

          <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            {loading ? 'በማስገባት ላይ...' : '✓ መልስ አስገባ'}
          </button>
        </form>
      </div>
    </div>
  )
}