'use client';

import React from 'react';
import type { SpecialActionButtonProps } from '@/types/news';

/**
 * Special Action Button component for batch operations
 * Handles special actions like "All Sources" with distinct styling
 */
const SpecialActionButton: React.FC<SpecialActionButtonProps> = ({ 
  action, 
  onClick, 
  isLoading, 
  disabled = false 
}) => {
  
  // Category color mapping for special actions
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'batch-english': return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
      case 'batch-italian': return 'bg-gradient-to-r from-green-300 to-green-800 hover:from-green-400 hover:to-green-900';
      case 'analysis': return 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700';
      case 'filter': return 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700';
      // Legacy support
      case 'batch': return 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
    }
  };

  const handleClick = () => {
    if (!disabled && !isLoading) {
      onClick(action.id);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden rounded-xl px-8 py-6 text-white font-bold text-lg
        transition-all duration-300 transform hover:scale-105 focus:outline-none
        focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed
        disabled:transform-none shadow-2xl hover:shadow-3xl border-2 border-white/20
        ${getCategoryColor(action.category)}
        ${isLoading ? 'animate-pulse' : ''}
      `}
      aria-label={action.description}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Processing all sources...</span>
          </div>
        </div>
      )}
      
      {/* Button content */}
      <div className="flex flex-col items-center space-y-3">
        {/* Icon */}
        <span className="text-4xl" role="img" aria-label={action.name}>
          {action.icon}
        </span>
        
        {/* Action name */}
        <span className="text-xl font-bold text-center leading-tight">
          {action.name}
        </span>
        
        {/* Description */}
        <span className="text-sm opacity-90 text-center font-medium max-w-xs leading-relaxed">
          {action.description}
        </span>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-white/20 rounded-full" />
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </button>
  );
};

export default SpecialActionButton;