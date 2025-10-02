import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import type { NewsResponse } from '@/types/news';
import { NewsSourceId, NEWS_SOURCES } from '@/types/news';

/**
 * News scraping utility functions for different news sources
 */

// Helper function to create HTTP client with proper headers
const createHttpClient = () => {
  return axios.create({
    timeout: 10000, // 10 second timeout
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }
  });
};

/**
 * Scrape Televideo RAI news
 */
const scrapeTelevideoNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.TELEVIDEO].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Televideo has a specific structure - looking for news items in the text
  $('pre').each((_, element) => {
    const text = $(element).text();
    const lines = text.split('\n');
    
    lines.forEach(line => {
      line = line.trim();
      if (line.length > 20 && line.length < 200 && !line.includes('RAI') && !line.includes('Televideo')) {
        // Basic filtering for news-like content
        if (/^[A-Z]/.test(line) && line.includes(' ')) {
          titles.push(line);
        }
      }
    });
  });
  
  return titles.slice(0, 10); // Return first 10 titles
};

/**
 * Scrape Il Fatto Quotidiano news
 */
const scrapeIlFattoNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.IL_FATTO].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Look for article titles in various selectors
  $('h1, h2, h3, .entry-title, .article-title, .headline, [class*="title"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10); // Remove duplicates and return first 10
};

/**
 * Scrape Repubblica news
 */
const scrapeRepubblicaNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.REPUBBLICA].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Repubblica specific selectors
  $('h1, h2, h3, .entry-title, .story__headline, .headline, [data-testid*="headline"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Scrape ANSA news
 */
const scrapeAnsaNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.ANSA].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // ANSA specific selectors
  $('h1, h2, h3, .news-title, .headline, .entry-title, [class*="title"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Scrape Reuters news
 */
const scrapeReutersNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.REUTERS].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Reuters specific selectors
  $('h1, h2, h3, [data-testid*="Heading"], .story-title, .headline').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Scrape New York Times news
 */
const scrapeNYTimesNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.NYTIMES].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // NYTimes specific selectors
  $('h1, h2, h3, .story-heading, .headline, [data-testid*="headline"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Scrape Badische Zeitung news
 */
const scrapeBadischeNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.BADISCHE].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Badische Zeitung specific selectors
  $('h1, h2, h3, .headline, .article-title, [class*="title"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Scrape 68k News (all variants)
 */
const scrape68kNews = async (sourceId: NewsSourceId): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[sourceId].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // 68k News specific selectors
  $('h1, h2, h3, .title, .headline, .story-title, a[href*="story"]').each((_, element) => {
    const title = $(element).text().trim();
    if (title.length > 10 && title.length < 200) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 10);
};

/**
 * Main scraping function that routes to appropriate scraper
 */
const scrapeNews = async (sourceId: NewsSourceId): Promise<string[]> => {
  switch (sourceId) {
    case NewsSourceId.TELEVIDEO:
      return await scrapeTelevideoNews();
    case NewsSourceId.IL_FATTO:
      return await scrapeIlFattoNews();
    case NewsSourceId.REPUBBLICA:
      return await scrapeRepubblicaNews();
    case NewsSourceId.ANSA:
      return await scrapeAnsaNews();
    case NewsSourceId.REUTERS:
      return await scrapeReutersNews();
    case NewsSourceId.NYTIMES:
      return await scrapeNYTimesNews();
    case NewsSourceId.BADISCHE:
      return await scrapeBadischeNews();
    case NewsSourceId.K68_IT:
    case NewsSourceId.K68_DE:
    case NewsSourceId.K68_US:
      return await scrape68kNews(sourceId);
    default:
      throw new Error(`Unknown source: ${sourceId as string}`);
  }
};

/**
 * API Route Handler for /api/news
 * Accepts GET requests with 'site' query parameter
 */
export async function GET(request: NextRequest) {
  // Add security headers to prevent indexing and caching
  const headers = {
    'X-Robots-Tag': 'noindex, nofollow, nosnippet, noarchive',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site');

    if (!site) {
      const response: NewsResponse = {
        source: 'Unknown',
        titles: [],
        error: 'Site parameter is required'
      };
      return NextResponse.json(response, { status: 400, headers });
    }

    // Validate that the site parameter is a valid NewsSourceId
    const sourceId = site as NewsSourceId;
    if (!Object.values(NewsSourceId).includes(sourceId)) {
      const response: NewsResponse = {
        source: site,
        titles: [],
        error: `Invalid site parameter: ${site}`
      };
      return NextResponse.json(response, { status: 400, headers });
    }

    // Get the source configuration
    const sourceConfig = NEWS_SOURCES[sourceId];
    
    console.log(`Scraping news from: ${sourceConfig.name} (${sourceConfig.url})`);
    
    // Perform the scraping
    const titles = await scrapeNews(sourceId);
    
    const response: NewsResponse = {
      source: sourceConfig.name,
      titles: titles,
    };
    
    return NextResponse.json(response, { headers });
    
  } catch (error) {
    console.error('Error scraping news:', error);
    
    const errorResponse: NewsResponse = {
      source: 'Unknown',
      titles: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    return NextResponse.json(errorResponse, { status: 500, headers });
  }
}