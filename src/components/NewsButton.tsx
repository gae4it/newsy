'use client';

import React from 'react';
import type { NewsButtonProps } from '@/types/news';

/**
 * Button component for selecting a news source
 * Displays source name with country flag and handles loading state
 */
const NewsButton: React.FC<NewsButtonProps> = ({ 
  source, 
  onClick, 
  isLoading, 
  disabled = false 
}) => {
  // Country flag emoji mapping
  const getCountryFlag = (country: string): string => {
    switch (country) {
      case 'IT': return '🇮🇹';
      case 'US': return '🇺🇸';
      case 'DE': return '🇩🇪';
      default: return '🌐';
    }
  };

  // Category color mapping for visual distinction
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'general': return 'bg-blue-500 hover:bg-blue-600';
      case 'tech': return 'bg-purple-500 hover:bg-purple-600';
      case 'international': return 'bg-green-500 hover:bg-green-600';
      case 'regional': return 'bg-orange-500 hover:bg-orange-600';
      case 'news': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const handleClick = () => {
    if (!disabled && !isLoading) {
      onClick(source.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden rounded-lg px-6 py-4 text-white font-semibold
        transition-all duration-200 transform hover:scale-105 focus:outline-none
        focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none shadow-lg hover:shadow-xl
        ${getCategoryColor(source.category)}
        ${isLoading ? 'animate-pulse' : ''}
      `}
      aria-label={`Fetch news from ${source.name}`}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Button content */}
      <div className="flex items-center justify-center space-x-2">
        <span className="text-xl" role="img" aria-label={`${source.country} flag`}>
          {getCountryFlag(source.country)}
        </span>
        <span className="text-sm md:text-base font-medium">
          {source.name}
        </span>
      </div>
      
      {/* Category badge */}
      <div className="absolute top-1 right-1 text-xs bg-black bg-opacity-30 px-2 py-1 rounded">
        {source.category}
      </div>
    </button>
  );
};

export default NewsButton;