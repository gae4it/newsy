'use client';

import React from 'react';
import type { NewsCardProps } from '@/types/news';

/**
 * Card component to display scraped news titles
 * Shows loading state, error handling, and responsive design
 */
const NewsCard: React.FC<NewsCardProps> = ({ newsData, isLoading, error }) => {
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="text-red-500 text-xl">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800">Error Loading News</h3>
        </div>
        <p className="text-red-600 mb-4">{error.message}</p>
        {error.source && (
          <p className="text-sm text-red-500">Source: {error.source}</p>
        )}
      </div>
    );
  }

  // Empty state (no data selected yet)
  if (!newsData) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Select a News Source
          </h3>
          <p className="text-gray-500">
            Click on any button above to fetch the latest news headlines
          </p>
        </div>
      </div>
    );
  }

  // Main news display
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>📰</span>
            <span>{newsData.source}</span>
          </h3>
          <div className="text-blue-100 text-sm">
            {newsData.titles.length} headlines
          </div>
        </div>
      </div>

      {/* News titles */}
      <div className="p-6">
        {newsData.titles.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-600">No news found from this source</p>
            <p className="text-sm text-gray-500 mt-2">
              The source might be temporarily unavailable or changed its structure
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {newsData.titles.map((title, index) => (
              <div
                key={index}
                className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 
                         hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center 
                               justify-center text-xs font-semibold text-blue-600 group-hover:bg-blue-200">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 group-hover:text-blue-800 transition-colors duration-200
                               leading-relaxed text-sm md:text-base">
                      {title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer info */}
        {newsData.titles.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Error message in news data */}
      {newsData.error && (
        <div className="bg-yellow-50 border-t border-yellow-200 px-6 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <p className="text-sm text-yellow-800">{newsData.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsCard;