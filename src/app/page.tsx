import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-grip-50 to-white">
      {/* Navigation */}
      <nav className="bg-grip-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Grip Science</Link>
          <div className="flex gap-6">
            <Link href="/shoes" className="hover:text-grip-200 transition-colors">Shoe Selector</Link>
            <span className="text-grip-300">Grip Forecast (soon)</span>
          </div>
        </div>
      </nav>
      
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-grip-500 mb-4">
          Grip Science
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Climbing conditions forecasting. Know before you go.
        </p>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/shoes" className="block">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-grip-100 hover:shadow-xl hover:border-grip-300 transition-all">
              <div className="text-4xl mb-4">👟</div>
              <h2 className="text-xl font-semibold text-grip-500 mb-2">Shoe Selector</h2>
              <p className="text-gray-500">
                Find the perfect climbing shoe based on rock type, style, and conditions.
              </p>
              <span className="inline-block mt-4 text-grip-500 font-medium">Try it now →</span>
            </div>
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 opacity-60">
            <div className="text-4xl mb-4">🌤️</div>
            <h2 className="text-xl font-semibold text-gray-500 mb-2">Grip Forecast</h2>
            <p className="text-gray-400">
              Predict climbing conditions based on weather, rock temp, and humidity.
            </p>
            <span className="inline-block mt-4 text-gray-400 font-medium">Coming soon</span>
          </div>
        </div>
      </div>
    </main>
  );
}
