import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-96 bg-gray ">
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <img 
              src="/logo.png" 
              alt="የግብርና ሚኒስቴር" 
              className="h-20 w-auto mx-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <h1 className="text-3xl sm:text-5xl font-bold mb-3">የግብርና ሚኒስቴር</h1>
            <p className="text-sm sm:text-lg">ጥራት ያለው አገልግሎት ለሁሉም</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-green-800 mb-3">እንኳን ደህና መጡ!</h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            ይህ የግብርና ሚኒስቴር የአገልግሎት እርካታ መመዘኛ ስርዓት ነው።
            እባክዎ አስተያየትዎን በመስጠት አገልግሎታችንን ለማሻሻል ይረዱን።
          </p>
        </div>

        <div className="flex flex-col items-center">
          <Link 
            to="/feedback" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-center w-full sm:w-auto"
          >
            📝 ወደ ግብረመልስ ቅጽ ይሂዱ
          </Link>
        </div>
<img 
  src="/logo.jpg" 
  alt="የግብርና ሚኒስቴር" 
  className="h-20 w-auto mx-auto mb-4"
  onError={(e) => {
    e.target.onerror = null;
    e.target.style.display = 'none';
  }}
/>
        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-10 sm:mt-16">
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">ጥራት ያለው አገልግሎት</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">ለደንበኞቻችን ከፍተኛ ጥራት ያለው አገልግሎት</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">ተባባሪነት</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">ከባለድርሻ አካላት ጋር በመተባበር</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 text-center">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">ዘመናዊ ቴክኖሎጂ</h3>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">ዘመናዊ የቴክኖሎጂ አጠቃቀም</p>
          </div>
        </div>
      </div>
    </div>
  )
}