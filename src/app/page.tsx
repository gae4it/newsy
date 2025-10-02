'use client';

import React, { useState } from 'react';
import NewsButton from '@/components/NewsButton';
import NewsCard from '@/components/NewsCard';
import { NEWS_SOURCES } from '@/types/news';
import type { NewsResponse, NewsLoadingState, NewsError, NewsSourceId } from '@/types/news';

/**
 * Main homepage component for the News Aggregator application
 * Features responsive design, loading states, and error handling
 */
export default function Home() {
  // State management for news data, loading, and errors
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loadingState, setLoadingState] = useState<NewsLoadingState>({ isLoading: false });
  const [error, setError] = useState<NewsError | null>(null);

  /**
   * Fetch news from the API for a specific source
   */
  const fetchNews = async (sourceId: NewsSourceId) => {
    setLoadingState({ isLoading: true, source: NEWS_SOURCES[sourceId].name });
    setError(null);
    setNewsData(null);

    try {
      const response = await fetch(`/api/news?site=${sourceId}`);
      const data = await response.json() as NewsResponse;

      if (!response.ok) {
        throw new Error(data.error ?? `HTTP error! status: ${response.status}`);
      }

      setNewsData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError({
        message: errorMessage,
        source: NEWS_SOURCES[sourceId].name
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  };

  // Convert NEWS_SOURCES object to array for mapping
  const sourcesList = Object.values(NEWS_SOURCES);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              📰 Newsy
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Your private news aggregator - Get the latest headlines from top sources worldwide
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>🔒</span>
              <span>Private</span>
              <span>•</span>
              <span>🚫</span>
              <span>No tracking</span>
              <span>•</span>
              <span>⚡</span>
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* News Sources Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Select a News Source
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {sourcesList.map((source) => (
              <NewsButton
                key={source.id}
                source={source}
                onClick={(sourceId: string) => fetchNews(sourceId as NewsSourceId)}
                isLoading={loadingState.isLoading && loadingState.source === source.name}
                disabled={loadingState.isLoading}
              />
            ))}
          </div>

          {/* Loading indicator for active source */}
          {loadingState.isLoading && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Fetching news from {loadingState.source}...</span>
              </div>
            </div>
          )}
        </section>

        {/* News Display Section */}
        <section>
          <NewsCard 
            newsData={newsData}
            isLoading={loadingState.isLoading}
            error={error}
          />
        </section>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              Newsy aggregates news from multiple sources for personal use only.
            </p>
            <p className="mb-2">
              Content belongs to respective news organizations.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <span className="flex items-center space-x-1">
                <span>🇮🇹</span>
                <span>Italian Sources: {sourcesList.filter(s => s.country === 'IT').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🇺🇸</span>
                <span>US Sources: {sourcesList.filter(s => s.country === 'US').length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🇩🇪</span>
                <span>German Sources: {sourcesList.filter(s => s.country === 'DE').length}</span>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
