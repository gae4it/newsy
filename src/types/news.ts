/**
 * TypeScript types and interfaces for the News Aggregator application
 */

// News source configuration
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  country: string;
  category: string;
}

// API response for news scraping
export interface NewsResponse {
  source: string;
  titles: string[];
  error?: string;
}

// Loading state for news fetching
export interface NewsLoadingState {
  isLoading: boolean;
  source?: string;
}

// Error state for API calls
export interface NewsError {
  message: string;
  source?: string;
}

// Component props
export interface NewsCardProps {
  newsData: NewsResponse | null;
  isLoading: boolean;
  error?: NewsError | null;
}

export interface NewsButtonProps {
  source: NewsSource;
  onClick: (sourceId: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

// Available news sources enum
export enum NewsSourceId {
  TELEVIDEO = 'televideo',
  IL_FATTO = 'il-fatto',
  REPUBBLICA = 'repubblica', 
  ANSA = 'ansa',
  REUTERS = 'reuters',
  NYTIMES = 'nytimes',
  BADISCHE = 'badische',
  K68_IT = '68k-it',
  K68_DE = '68k-de',
  K68_US = '68k-us'
}

// News sources configuration
export const NEWS_SOURCES: Record<NewsSourceId, NewsSource> = {
  [NewsSourceId.TELEVIDEO]: {
    id: NewsSourceId.TELEVIDEO,
    name: 'Televideo RAI',
    url: 'https://www.televideo.rai.it/televideo/pub/solotesto.jsp',
    country: 'IT',
    category: 'general'
  },
  [NewsSourceId.IL_FATTO]: {
    id: NewsSourceId.IL_FATTO,
    name: 'Il Fatto Quotidiano',
    url: 'https://www.ilfattoquotidiano.it/',
    country: 'IT',
    category: 'general'
  },
  [NewsSourceId.REPUBBLICA]: {
    id: NewsSourceId.REPUBBLICA,
    name: 'Repubblica',
    url: 'https://www.repubblica.it/',
    country: 'IT',
    category: 'general'
  },
  [NewsSourceId.ANSA]: {
    id: NewsSourceId.ANSA,
    name: 'ANSA',
    url: 'https://www.ansa.it/',
    country: 'IT',
    category: 'news'
  },
  [NewsSourceId.REUTERS]: {
    id: NewsSourceId.REUTERS,
    name: 'Reuters',
    url: 'https://www.reuters.com/',
    country: 'US',
    category: 'international'
  },
  [NewsSourceId.NYTIMES]: {
    id: NewsSourceId.NYTIMES,
    name: 'New York Times',
    url: 'https://www.nytimes.com/',
    country: 'US',
    category: 'general'
  },
  [NewsSourceId.BADISCHE]: {
    id: NewsSourceId.BADISCHE,
    name: 'Badische Zeitung',
    url: 'https://www.badische-zeitung.de/',
    country: 'DE',
    category: 'regional'
  },
  [NewsSourceId.K68_IT]: {
    id: NewsSourceId.K68_IT,
    name: '68k News IT',
    url: 'https://68k.news/index.php?section=nation&loc=IT',
    country: 'IT',
    category: 'tech'
  },
  [NewsSourceId.K68_DE]: {
    id: NewsSourceId.K68_DE,
    name: '68k News DE',
    url: 'https://68k.news/index.php?section=nation&loc=DE',
    country: 'DE',
    category: 'tech'
  },
  [NewsSourceId.K68_US]: {
    id: NewsSourceId.K68_US,
    name: '68k News US',
    url: 'https://68k.news/index.php?section=nation&loc=US',
    country: 'US',
    category: 'tech'
  }
};