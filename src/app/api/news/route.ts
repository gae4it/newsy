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
      'Accept-Language': 'de-DE,de;q=0.9,en-US,en;q=0.8,it;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Charset': 'utf-8, iso-8859-1;q=0.5',
      'Connection': 'keep-alive',
    },
    // Ensure proper UTF-8 encoding for German characters
    responseType: 'text',
    responseEncoding: 'utf8'
  });
};

/**
 * Scrape Televideo RAI news - Page 103 with chronological news format
 */
const scrapeTelevideoNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.TELEVIDEO].url);
  const $ = cheerio.load(response.data as string);
  
  const titles: string[] = [];
  
  // Extract all text content from the page
  const pageText = $('body').text();
  const lines = pageText.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    
    // Look for timestamped news entries (format: "DD/MM HH:MM    News title")
    const timestampRegex = /^\d{2}\/\d{2}\s+\d{2}:\d{2}\s+(.+)$/;
    const timestampMatch = timestampRegex.exec(line);
    if (timestampMatch?.[1]) {
      const newsTitle = timestampMatch[1].trim();
      if (newsTitle.length > 10 && newsTitle.length < 150) {
        titles.push(newsTitle);
      }
    }
    
    // Also look for main headlines in CAPS (like "FLOTILLA, BARCHE TRAINATE AD ASHDOD")
    else if (line.length > 15 && line.length < 100 && 
             /^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ]/.test(line) &&
             line === line.toUpperCase() &&
             !line.includes('PAGINA') && 
             !line.includes('TELEVIDEO') &&
             !line.includes('RAI') &&
             !line.includes('HTTP') &&
             !/^\d/.exec(line) && // Exclude numbers
             line.includes(' ') &&
             !line.includes('PRIMA') &&
             !line.includes('ULTIMA') &&
             !line.includes('POLITICA') &&
             !line.includes('ECONOMIA') &&
             !line.includes('DALL\'ITALIA') &&
             !line.includes('DAL MONDO') &&
             !line.includes('CULTURE')) {
      titles.push(line);
    }
    
    // Look for regular news lines (mixed case, reasonable length)
    else if (line.length > 20 && line.length < 120 && 
             /^[A-ZÀ-ÿĀ-ž]/.test(line) && 
             line.includes(' ') &&
             !line.includes('Pagina') &&
             !line.includes('sottopagina') &&
             !line.includes('inserisci') &&
             !line.includes('Cattura') &&
             !/^\d{2}\/\d{2}/.exec(line) && // Not a timestamp
             !line.includes('Copyright') &&
             !line.includes('http') &&
             /[a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþ]/.test(line)) { // Contains lowercase
      titles.push(line);
    }
  });
  
  // Remove duplicates and return up to 50 titles
  return [...new Set(titles)].slice(0, 50);
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
  
  return [...new Set(titles)].slice(0, 50); // Remove duplicates and return first 50
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
  
  return [...new Set(titles)].slice(0, 50);
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
  
  return [...new Set(titles)].slice(0, 50);
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
  
  return [...new Set(titles)].slice(0, 50);
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
  
  return [...new Set(titles)].slice(0, 50);
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
    // Include German characters (ß, ä, ö, ü, Ä, Ö, Ü) in validation
    if (title.length > 10 && title.length < 200 && /[a-zA-ZäöüßÄÖÜ\s]/.test(title)) {
      titles.push(title);
    }
  });
  
  return [...new Set(titles)].slice(0, 50);
};

/**
 * Scrape 68k News (all variants) - Uses HTTP to avoid SSL certificate issues
 */
const scrape68kNews = async (sourceId: NewsSourceId): Promise<string[]> => {
  // Use HTTP instead of HTTPS to avoid SSL certificate issues
  const httpUrl = NEWS_SOURCES[sourceId].url.replace('https://', 'http://');
  
  const client = axios.create({
    timeout: 15000, // Increased timeout for 68k news
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
    },
    // Disable SSL verification for this source
    httpsAgent: false,
  });

  try {
    const response = await client.get(httpUrl);
    const $ = cheerio.load(response.data as string);
    
    const titles: string[] = [];
    
    // 68k News specific selectors - look for article links
    $('a').each((_, element) => {
      const $element = $(element);
      const href = $element.attr('href');
      const title = $element.text().trim();
      
      // Filter for actual news articles - support German characters
      if (href && 
          href.includes('article.php') && 
          title && 
          title.length > 10 && 
          title.length < 200 && 
          !title.includes('68k.news') &&
          !title.toLowerCase().includes('home') &&
          !title.toLowerCase().includes('about') &&
          /[a-zA-ZäöüßÄÖÜ\s]/.test(title)) {
        titles.push(title);
      }
    });
    
    // If no articles found with article.php, try other selectors
    if (titles.length === 0) {
      $('h1, h2, h3, .title, .headline, .story-title').each((_, element) => {
        const title = $(element).text().trim();
        if (title.length > 10 && title.length < 200 && !title.includes('68k.news') && /[a-zA-ZäöüßÄÖÜ\s]/.test(title)) {
          titles.push(title);
        }
      });
    }
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error(`Error scraping 68k news (${sourceId}):`, error);
    // Return empty array instead of throwing to allow other sources to work
    return [];
  }
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
