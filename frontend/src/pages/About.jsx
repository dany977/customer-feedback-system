import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">ስለ እኛ</h1>
          <p className="text-gray-600 text-lg">የግብርና ሚኒስቴር የአገልግሎት ጥራት ማሻሻያ</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">ተልዕኮአችን</h2>
          <p className="text-gray-700 leading-relaxed">
            ጥራት ያለው እና ተደራሽ የግብርና አገልግሎት በመስጠት የአገርን የምግብ ዋስትና ማረጋገጥ እና የገበሬውን ኑሮ ማሻሻል።
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-4">ራዕያችን</h2>
          <p className="text-gray-700 leading-relaxed">
            ዘመናዊ ቴክኖሎጂን በመጠቀም ዘላቂ የግብርና ልማት ማረጋገጥ እና ኢትዮጵያን በአፍሪካ የግብርና መሪ ማድረግ።
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ጥራት</h3>
            <p className="text-gray-600">ጥራት ያለው አገልግሎት መስጠት</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">💡</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ፈጠራ</h3>
            <p className="text-gray-600">ዘመናዊ ቴክኖሎጂን መጠቀም</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">ታማኝነት</h3>
            <p className="text-gray-600">ግልጽ እና ታማኝ አገልግሎት</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-green-600 hover:text-green-800">
            ← ወደ ዋና ገጽ ተመለስ
          </Link>
        </div>
      </div>
    </div>
  )
}