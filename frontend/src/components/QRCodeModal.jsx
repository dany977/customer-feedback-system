// frontend/src/components/QRCodeModal.jsx (Simple version without QR)
import { useState } from 'react'

export default function QRCodeModal({ isOpen, onClose, feedbackId, qrValue }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">እናመሰግናለን!</h3>
          <p className="text-gray-600 mb-4">
            ግብረመልስዎ በሚገባ ተመዝግቧል።
          </p>
          
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="text-5xl mb-2">📱</div>
            <p className="text-sm text-gray-700">የግብረመልስ መታወቂያ: <strong>{feedbackId}</strong></p>
          </div>
          
          <div className="bg-gray-50 p-2 rounded-lg mb-4">
            <p className="text-xs text-gray-600 break-all">{qrValue}</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {copied ? '✓ ተቀድቷል' : '📋 ሊንክ ቅዳ'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              ዝጋ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}