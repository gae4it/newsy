'use client';

import React from 'react';
import type { BatchNewsResponse } from '@/types/news';

interface BatchNewsCardProps {
  batchData: BatchNewsResponse | null;
  isLoading: boolean;
  error?: string | null;
}

/**
 * Card component to display batch news results and AI prompt
 */
const BatchNewsCard: React.FC<BatchNewsCardProps> = ({ batchData, isLoading, error }) => {
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-2xl p-8 animate-pulse border border-gray-200">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-purple-300 rounded-full"></div>
          <div className="h-8 bg-purple-300 rounded w-48"></div>
        </div>
        
        {/* Progress indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-red-500 text-3xl">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800">Batch Processing Error</h3>
        </div>
        <p className="text-red-700 text-lg">{error}</p>
      </div>
    );
  }

  // No data state
  if (!batchData) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-300 rounded-xl p-12">
        <div className="text-center">
          <div className="text-8xl mb-6">🌍</div>
          <h3 className="text-3xl font-bold text-purple-800 mb-4">
            Batch News Processing
          </h3>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto leading-relaxed">
            Click the &ldquo;All Sources Summary&rdquo; button to scrape news from all sources 
            and generate a comprehensive AI summary prompt
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
        <div className="flex items-center justify-between text-white">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <span>🌍</span>
            <span>All Sources Summary</span>
          </h3>
          <div className="text-purple-100 text-sm">
            {batchData.totalNews} total headlines
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{batchData.successfulSources}</div>
            <div className="text-sm text-gray-600">Successful Sources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{batchData.failedSources.length}</div>
            <div className="text-sm text-gray-600">Failed Sources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{batchData.totalNews}</div>
            <div className="text-sm text-gray-600">Total Headlines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{batchData.sources.length}</div>
            <div className="text-sm text-gray-600">Sources Processed</div>
          </div>
        </div>
      </div>

      {/* Failed sources warning */}
      {batchData.failedSources.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 px-8 py-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium text-yellow-800">
              Failed sources: {batchData.failedSources.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* AI Prompt */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-800">Generated AI Summary Prompt</h4>
          <button
            onClick={() => navigator.clipboard.writeText(batchData.aiPrompt ?? '')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
                     transition-colors duration-200 flex items-center space-x-2"
          >
            <span>📋</span>
            <span>Copy Prompt</span>
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
            {batchData.aiPrompt}
          </pre>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>
            📝 <strong>Usage:</strong> Copy this prompt and paste it into your preferred AI assistant 
            (ChatGPT, Claude, Gemini, etc.) to get a comprehensive summary of today&apos;s news.
          </p>
        </div>
      </div>

      {/* Sources breakdown */}
      <div className="px-8 pb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Sources Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchData.sources.map((source, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-800">{source.source}</h5>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  source.error || source.titles.length === 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {source.error ? 'Failed' : `${source.titles.length} news`}
                </span>
              </div>
              {source.error && (
                <p className="text-xs text-red-600">{source.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BatchNewsCard;