// frontend/src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [qrSize, setQrSize] = useState(180)
  const [stats, setStats] = useState({
    total_feedback: 0,
    average_satisfaction: 0,
    sectors_count: 0,
    loading: true
  })

  // Carousel slides content
  const slides = [
  {
    id: 1,
    title: "የግብርና ሚኒስቴር",
    description: "ዘላቂ የግብርና ልማት ለኢትዮጵያ ትውልድ",
    image: "/images/ministry1.jpg"
  },
  {
    id: 2,
    title: "ተልዕኮአችን",
    description: "ጥራት ያለው እና ተደራሽ የግብርና አገልግሎት በመስጠት የአገርን የምግብ ዋስትና ማረጋገጥ",
    image: "/images/mission.jpg"
  },
  {
    id: 3,
    title: "ራዕያችን",
    description: "ዘመናዊ ቴክኖሎጂን በመጠቀም ኢትዮጵያን በአፍሪካ የግብርና መሪ ማድረግ",
    image: "/images/vision.jpg"
  },
  {
    id: 4,
    title: "አገልግሎቶቻችን",
    description: "የምክር አገልግሎት · የኢንቨስትመንት ድጋፍ · የእንስሳት እርባታ · የመሬት አስተዳደር · የአነስተኛ መስኖ",
    image: "/images/services.jpg"
  }
]

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Fetch real stats (same as before)
  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const externalRes = await fetch('http://localhost:8000/api/dashboard/stats/')
      let externalData = null
      if (externalRes.ok) externalData = await externalRes.json()

      const internalRes = await fetch('http://localhost:8000/api/employee/stats/')
      let internalData = null
      if (internalRes.ok) internalData = await internalRes.json()

      const total = (externalData?.total_feedback || 0) + (internalData?.total_feedback || 0)
      let avgSatisfaction = 0
      if (externalData?.average_satisfaction && internalData?.average_satisfaction) {
        avgSatisfaction = ((externalData.average_satisfaction + internalData.average_satisfaction) / 2).toFixed(1)
      } else if (externalData?.average_satisfaction) {
        avgSatisfaction = externalData.average_satisfaction
      } else if (internalData?.average_satisfaction) {
        avgSatisfaction = internalData.average_satisfaction
      }
      const sectorsCount = externalData?.sector_stats?.length || 0

      setStats({
        total_feedback: total,
        average_satisfaction: avgSatisfaction,
        sectors_count: sectorsCount,
        loading: false
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  const formUrl = 'http://localhost:5173/feedback'

  const downloadQR = () => {
    const svg = document.getElementById('home-qr-code')
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

  const copyUrl = () => {
    navigator.clipboard.writeText(formUrl)
    alert('✅ ሊንኩ ተቀድቷል!')
  }

  const statsCards = [
    { id: 1, title: 'ጠቅላላ ግብረመልሶች', value: stats.total_feedback, suffix: '+', icon: '📊', color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'አማካይ እርካታ', value: stats.average_satisfaction, suffix: ' / 5', icon: '⭐', color: 'from-yellow-500 to-yellow-600' },
    { id: 3, title: 'የአገልግሎት ዘርፎች', value: stats.sectors_count, suffix: '+', icon: '🏢', color: 'from-green-500 to-green-600' },
    { id: 4, title: 'ክፍት አገልግሎት', value: '24/7', suffix: '', icon: '🕐', color: 'from-purple-500 to-purple-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Image Slider / Carousel - Original Colors */}
<div className="relative w-full h-96 overflow-hidden">
  {slides.map((slide, index) => (
    <div
      key={slide.id}
      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
        index === currentSlide ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Image only - no color overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.image})` }}
      ></div>
      
      {/* Dark overlay for text readability (optional - you can remove if image is already dark) */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4 z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h2>
        <p className="text-lg md:text-xl max-w-2xl drop-shadow-md">{slide.description}</p>
      </div>
    </div>
  ))}
  
  {/* Navigation Arrows */}
  <button
    onClick={prevSlide}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-20"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button
    onClick={nextSlide}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition z-20"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
  
  {/* Dots indicator */}
  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-2 h-2 rounded-full transition-all ${
          index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
        }`}
      />
    ))}
  </div>
</div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div key={card.id} className={`bg-gradient-to-br ${card.color} rounded-xl shadow-lg p-4 text-white transform hover:scale-105 transition duration-300`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{card.icon}</span>
                {stats.loading && card.id !== 4 && <div className="animate-pulse w-4 h-4 bg-white/50 rounded-full"></div>}
              </div>
              <div className="text-2xl font-bold">
                {stats.loading && card.id !== 4 ? (
                  <div className="animate-pulse h-8 w-16 bg-white/30 rounded"></div>
                ) : (
                  `${card.value}${card.suffix}`
                )}
              </div>
              <div className="text-xs text-white/80 mt-1">{card.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">እንኳን ደህና መጡ!</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ይህ የግብርና ሚኒስቴር የአገልግሎት እርካታ መመዘኛ ስርዓት ነው።
            እባክዎ አስተያየትዎን በመስጠት አገልግሎታችንን ለማሻሻል ይረዱን።
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - QR Code */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="mb-4">
              <span className="text-5xl">📱</span>
              <h3 className="text-xl font-bold text-gray-800 mt-2">በQR Code ይሙሉ</h3>
              <p className="text-gray-500 text-sm mt-1">ስልክዎን በመጠቀም በቀላሉ ግብረመልስ ይስጡ</p>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-xl shadow-md border-2 border-green-200">
                <QRCodeSVG id="home-qr-code" value={formUrl} size={qrSize} bgColor="#FFFFFF" fgColor="#166534" level="H" includeMargin={true} />
              </div>
            </div>
            <div className="max-w-xs mx-auto mb-4">
              <label className="block text-sm text-gray-600 mb-1">QR Code መጠን: {qrSize}px</label>
              <input type="range" min="120" max="250" value={qrSize} onChange={(e) => setQrSize(parseInt(e.target.value))} className="w-full" />
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={downloadQR} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                📥 አውርድ
              </button>
              <button onClick={copyUrl} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                📋 ሊንክ ቅዳ
              </button>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg text-left">
              <p className="text-sm text-green-800">
                <span className="font-bold">📌 እንዴት መጠቀም ይቻላል?</span><br/>
                1️⃣ QR Code ን በስልክዎ ካሜራ ቀንደው ይቃኙ<br/>
                2️⃣ ወደ ግብረመልስ ቅጽ ይመራዎታል<br/>
                3️⃣ ጥያቄዎቹን በመሙላት አስተያየትዎን ይስጡ
              </p>
            </div>
          </div>

          {/* Right Column - Direct Link */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
            <div className="mb-4">
              <span className="text-5xl">💻</span>
              <h3 className="text-xl font-bold text-gray-800 mt-2">በኮምፒውተር ይሙሉ</h3>
              <p className="text-gray-500 text-sm mt-1">በኮምፒውተርዎ በቀጥታ ቅጹን ይሙሉ</p>
            </div>
            <div className="mb-6">
              <Link to="/feedback" className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold">
                📝 ወደ ግብረመልስ ቅጽ ይሂዱ
              </Link>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                <span className="font-bold">🕐 ጊዜ: </span> 5-7 ደቂቃ ብቻ<br/>
                <span className="font-bold">🔒 ሚስጥራዊነት: </span> ምላሽዎ በምስጥር ይጠበቃል<br/>
                <span className="font-bold">🎯 ዓላማ: </span> አገልግሎታችንን ለማሻሻል
              </p>
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500 mb-2">የውስጥ ሰራተኛ ከሆኑ:</p>
              <Link to="/internal-feedback" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition text-sm">
                🏢 የውስጥ ሰራተኞች ቅጽ
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-bold text-gray-800">ጥራት ያለው አገልግሎት</h3>
            <p className="text-gray-500 text-sm mt-2">ለደንበኞቻችን ከፍተኛ ጥራት ያለው አገልግሎት እንሰጣለን</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="font-bold text-gray-800">ተባባሪነት</h3>
            <p className="text-gray-500 text-sm mt-2">ከባለድርሻ አካላት ጋር በመተባበር</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="font-bold text-gray-800">ዘመናዊ ቴክኖሎጂ</h3>
            <p className="text-gray-500 text-sm mt-2">ዘመናዊ የቴክኖሎጂ አጠቃቀም ለተሻለ አገልግሎት</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2026 የግብርና ሚኒስቴር - መብቱ በህግ የተጠበቀ ነው</p>
        </div>
      </div>
    </div>
  )
}