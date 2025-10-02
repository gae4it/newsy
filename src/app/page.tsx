'use client';

import React, { useState } from 'react';
import NewsButton from '@/components/NewsButton';
import NewsCard from '@/components/NewsCard';
import SpecialActionButton from '@/components/SpecialActionButton';
import BatchNewsCard from '@/components/BatchNewsCard';
import { NEWS_SOURCES, SPECIAL_ACTIONS, SpecialActionId } from '@/types/news';
import type { NewsResponse, NewsLoadingState, NewsError, NewsSourceId, BatchNewsResponse } from '@/types/news';

/**
 * Main homepage component for the News Aggregator application
 * Features responsive design, loading states, and error handling
 */
export default function Home() {
  // State management for news data, loading, and errors
  const [newsData, setNewsData] = useState<NewsResponse | null>(null);
  const [loadingState, setLoadingState] = useState<NewsLoadingState>({ isLoading: false });
  const [error, setError] = useState<NewsError | null>(null);
  
  // State for batch operations
  const [batchData, setBatchData] = useState<BatchNewsResponse | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState<string | null>(null);
  
  // View mode state
  const [viewMode, setViewMode] = useState<'single' | 'batch'>('single');

  /**
   * Fetch news from the API for a specific source
   */
  const fetchNews = async (sourceId: NewsSourceId) => {
    // Reset batch view when selecting single source
    setViewMode('single');
    setBatchData(null);
    setBatchError(null);
    
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

  /**
   * Handle special actions like batch operations
   */
  const handleSpecialAction = async (actionId: SpecialActionId) => {
    switch (actionId) {
      case SpecialActionId.ALL_SOURCES_EN:
        await fetchBatchNews('en');
        break;
      case SpecialActionId.ALL_SOURCES_IT:
        await fetchBatchNews('it');
        break;
      // Future special actions can be handled here
      default:
        console.warn('Unknown special action:', actionId);
    }
  };

  /**
   * Fetch news from all sources and generate AI prompt
   */
  const fetchBatchNews = async (language = 'it') => {
    // Switch to batch view and reset states
    setViewMode('batch');
    setNewsData(null);
    setError(null);
    
    setBatchLoading(true);
    setBatchError(null);
    setBatchData(null);

    try {
      const response = await fetch(`/api/news/batch?lang=${language}`);
      const data = await response.json() as BatchNewsResponse;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBatchData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setBatchError(errorMessage);
    } finally {
      setBatchLoading(false);
    }
  };

  /**
   * Reset to home state - clear all data and selections
   */
  const resetToHome = () => {
    setViewMode('single');
    setNewsData(null);
    setError(null);
    setLoadingState({ isLoading: false });
    setBatchData(null);
    setBatchError(null);
    setBatchLoading(false);
  };

  // Convert NEWS_SOURCES object to array for mapping
  const sourcesList = Object.values(NEWS_SOURCES);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 cursor-pointer 
                       hover:text-blue-600 transition-colors duration-200 select-none"
              onClick={resetToHome}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') resetToHome(); }}
              aria-label="Return to homepage - Clear all selections"
              title="Click to return to homepage"
            >
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
        {/* Special Actions Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            🚀 Special Actions
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="space-y-4 max-w-md">
              <SpecialActionButton
                action={SPECIAL_ACTIONS[SpecialActionId.ALL_SOURCES_EN]}
                onClick={handleSpecialAction}
                isLoading={batchLoading}
                disabled={loadingState.isLoading}
              />
              <SpecialActionButton
                action={SPECIAL_ACTIONS[SpecialActionId.ALL_SOURCES_IT]}
                onClick={handleSpecialAction}
                isLoading={batchLoading}
                disabled={loadingState.isLoading}
              />
            </div>
          </div>
        </section>

        {/* News Sources Grid */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Individual News Sources
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
          {viewMode === 'single' ? (
            <NewsCard 
              newsData={newsData}
              isLoading={loadingState.isLoading}
              error={error}
            />
          ) : (
            <BatchNewsCard
              batchData={batchData}
              isLoading={batchLoading}
              error={batchError}
            />
          )}
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
