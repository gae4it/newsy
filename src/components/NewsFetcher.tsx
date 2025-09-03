import React from 'react';
import { processNews } from '../utils/newsUtils';

interface NewsFetcherProps {
  country: 'IT' | 'DE';
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setNews: React.Dispatch<React.SetStateAction<{title: string, summary: string}[]>>;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string | null>>;
}

const NewsFetcher: React.FC<NewsFetcherProps> = ({ 
  country, 
  setLoading, 
  setError, 
  setNews,
  setSelectedCountry
}) => {
  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setNews([]);
    setSelectedCountry(country);
    
    try {
      const processedNews = await processNews(country);
      setNews(processedNews);
    } catch (error) {
      console.error(`Error fetching news from ${country}:`, error);
      setError(`Si è verificato un errore durante il caricamento delle notizie: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
      onClick={handleClick}
    >
      {country === 'IT' ? 'Italia' : 'Germania'}
    </button>
  );
};

export default NewsFetcher;
