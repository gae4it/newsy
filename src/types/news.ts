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

// Special action configuration
export interface SpecialAction {
  id: SpecialActionId;
  name: string;
  description: string;
  icon: string;
  category: string;
}

// Batch news response containing all sources
export interface BatchNewsResponse {
  sources: NewsResponse[];
  totalNews: number;
  successfulSources: number;
  failedSources: string[];
  aiPrompt?: string;
}

// Special action button props
export interface SpecialActionButtonProps {
  action: SpecialAction;
  onClick: (actionId: SpecialActionId) => void;
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

// Special action IDs for batch operations
export enum SpecialActionId {
  ALL_SOURCES_EN = 'all-sources-en',
  ALL_SOURCES_IT = 'all-sources-it',
  // Future actions can be added here
  // TRENDING = 'trending',
  // BY_COUNTRY = 'by-country',
  // BY_CATEGORY = 'by-category'
}

// News sources configuration
export const NEWS_SOURCES: Record<NewsSourceId, NewsSource> = {
  [NewsSourceId.TELEVIDEO]: {
    id: NewsSourceId.TELEVIDEO,
    name: 'Televideo RAI',
    url: 'https://www.televideo.rai.it/televideo/pub/solotesto.jsp?pagina=103',
    country: 'IT',
    category: 'italy'
  },
  [NewsSourceId.IL_FATTO]: {
    id: NewsSourceId.IL_FATTO,
    name: 'Il Fatto Quotidiano',
    url: 'https://www.ilfattoquotidiano.it/',
    country: 'IT',
    category: 'italy'
  },
  [NewsSourceId.REPUBBLICA]: {
    id: NewsSourceId.REPUBBLICA,
    name: 'Repubblica',
    url: 'https://www.repubblica.it/',
    country: 'IT',
    category: 'italy'
  },
  [NewsSourceId.ANSA]: {
    id: NewsSourceId.ANSA,
    name: 'ANSA',
    url: 'https://www.ansa.it/',
    country: 'IT',
    category: 'italy'
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
    category: 'international'
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
    name: '68k Italy',
    url: 'http://68k.news/index.php?section=nation&loc=IT',
    country: 'IT',
    category: 'italy'
  },
  [NewsSourceId.K68_DE]: {
    id: NewsSourceId.K68_DE,
    name: '68k Germany',
    url: 'http://68k.news/index.php?section=nation&loc=DE',
    country: 'DE',
    category: 'germany'
  },
  [NewsSourceId.K68_US]: {
    id: NewsSourceId.K68_US,
    name: '68k U.S.A.',
    url: 'http://68k.news/index.php?section=nation&loc=US',
    country: 'US',
    category: 'international'
  }
};

// Special actions configuration
export const SPECIAL_ACTIONS: Record<SpecialActionId, SpecialAction> = {
  [SpecialActionId.ALL_SOURCES_EN]: {
    id: SpecialActionId.ALL_SOURCES_EN,
    name: 'News Summary (all sources)',
    description: 'Scrape all news sources and generate English AI summary prompt',
    icon: '🌍',
    category: 'batch-english'
  },
  [SpecialActionId.ALL_SOURCES_IT]: {
    id: SpecialActionId.ALL_SOURCES_IT,
    name: 'Sommario News (tutte le fonti)',
    description: 'Raccogli tutte le fonti di notizie e genera un prompt di riepilogo AI italiano',
    icon: '🌍',
    category: 'batch-italian'
  }
  // Future special actions can be added here
};