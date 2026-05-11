import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { QRCodeSVG } from 'qrcode.react'

export default function QRGenerator() {
  const [size, setSize] = useState(200)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!user) {
    navigate('/login')
    return null
  }

  const formUrl = 'http://localhost:5173/feedback'

  const copyUrl = () => {
    navigator.clipboard.writeText(formUrl)
    setMessage('✅ URL ተቀድቷል!')
    setTimeout(() => setMessage(''), 3000)
  }

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg')
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
        link.download = `qr_code_feedback.png`
        link.href = pngFile
        link.click()
        setMessage('✅ QR Code ተወርዷል!')
        setTimeout(() => setMessage(''), 3000)
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-green-800">📱 QR Code ማመንጫ</h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
            ← ተመለስ
          </button>
        </div>

        {/* How to use section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-blue-800 mb-2 text-sm">📌 እንዴት መጠቀም ይቻላል?</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>1️⃣ QR Code ን በስልክዎ ያውርዱ ወይም ያትሙት</p>
            <p>2️⃣ ተጠቃሚዎች በስልካቸው ካሜራ ቀንደው ይቃኙ</p>
            <p>3️⃣ በቀጥታ ወደ ግብረመልስ ቅጽ ይመራሉ</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-lg text-sm text-center">
            {message}
          </div>
        )}

        {/* QR Code Display - Working QR Code */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl mb-6 flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCodeSVG 
              id="qr-code-svg"
              value={formUrl} 
              size={size}
              bgColor="#FFFFFF"
              fgColor="#000000"
              level="H"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            መጠን: {size}px
          </label>
          <input 
            type="range" 
            min="100" 
            max="300" 
            value={size} 
            onChange={(e) => setSize(parseInt(e.target.value))} 
            className="w-full"
          />
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 break-all">
            <span className="font-medium">URL:</span> {formUrl}
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={downloadQR} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
            📥 QR Code አውርድ
          </button>
          <button onClick={copyUrl} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            📋 URL ቅዳ
          </button>
        </div>

        {/* Note for scanning */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <span className="text-lg">📱</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">ማስታወሻ:</p>
              <p className="text-xs text-yellow-700 mt-1">
                • ይህን QR Code በስልክዎ ካሜራ ቀንደው ይቃኙ<br/>
                • በቀጥታ ወደ ግብረመልስ ቅጽ ይመራዎታል
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}