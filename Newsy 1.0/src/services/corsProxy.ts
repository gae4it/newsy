/**
 * This service provides methods to handle CORS issues during development
 * In a production environment, these requests should be handled by a backend service
 */

// List of CORS proxies that can be used if one fails
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url='
];

/**
 * Attempts to fetch a URL using multiple CORS proxies if needed
 * @param url The URL to fetch
 * @returns The response text
 */
export const fetchWithCorsProxy = async (url: string): Promise<string> => {
  let lastError: Error | null = null;
  
  // Try each proxy in sequence
  for (const proxy of CORS_PROXIES) {
    try {
      const response = await fetch(`${proxy}${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.warn(`Failed to fetch using proxy ${proxy}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to the next proxy
    }
  }
  
  // If we've tried all proxies and all failed
  throw new Error(`All CORS proxies failed. Last error: ${lastError?.message || 'Unknown error'}`);
};

/**
 * Creates a development-only fallback message for CORS issues
 * @returns Instructions for handling CORS in development
 */
export const getCorsErrorMessage = (): string => {
  return `
    CORS Error: Unable to fetch data due to Cross-Origin Resource Sharing restrictions.
    
    To resolve this during development:
    
    1. Use a CORS proxy (the app has already tried several)
    2. Install a browser extension to disable CORS (for development only)
    3. Run a local proxy server
    
    For production, implement server-side fetching of the news sources.
  `;
};
