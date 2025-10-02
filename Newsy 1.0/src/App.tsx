import { useState } from 'react'
import './App.css'
import NewsFetcher from './components/NewsFetcher'
import NewsList from './components/NewsList'

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [news, setNews] = useState<{title: string, summary: string}[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center my-8">
          newsy - Il tuo aggregatore di notizie semplice
        </h1>
        
        <div className="flex justify-center gap-4 mb-8">
          <NewsFetcher 
            country="IT" 
            setLoading={setLoading}
            setError={setError}
            setNews={setNews}
            setSelectedCountry={setSelectedCountry}
          />
          <NewsFetcher 
            country="DE" 
            setLoading={setLoading}
            setError={setError}
            setNews={setNews}
            setSelectedCountry={setSelectedCountry}
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2">Caricamento notizie in corso...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Notizie da {selectedCountry === 'IT' ? 'Italia' : 'Germania'}
            </h2>
            <NewsList news={news} />
          </>
        )}
      </div>
    </div>
  )
}

export default App
