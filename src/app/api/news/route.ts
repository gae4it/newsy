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
      'Accept-Charset': 'utf-8, iso-8859-1;q=0.5, windows-1252;q=0.3',
      'Connection': 'keep-alive',
    },
    // Handle response as arraybuffer for proper encoding detection
    responseType: 'arraybuffer'
  });
};

/**
 * Decode response data with proper charset handling for German characters
 */
const decodeResponse = (data: ArrayBuffer, contentType?: string): string => {
  const buffer = Buffer.from(data);
  
  // Try to detect encoding from content-type header
  let encoding = 'utf-8';
  if (contentType) {
    const charsetRegex = /charset=([^;]+)/i;
    const charsetMatch = charsetRegex.exec(contentType);
    if (charsetMatch?.[1]) {
      encoding = charsetMatch[1].toLowerCase();
    }
  }
  
  // Handle different encodings commonly used by German sites
  try {
    switch (encoding) {
      case 'iso-8859-1':
      case 'latin1':
        return buffer.toString('latin1');
      case 'windows-1252':
      case 'cp1252':
        return buffer.toString('latin1');
      case 'utf-8':
      default:
        try {
          return buffer.toString('utf-8');
        } catch {
          return buffer.toString('latin1');
        }
    }
  } catch {
    return buffer.toString('latin1');
  }
};

/**
 * Scrape Televideo RAI news - Page 103 with chronological news format
 */
const scrapeTelevideoNews = async (): Promise<string[]> => {
  const client = createHttpClient();
  const response = await client.get(NEWS_SOURCES[NewsSourceId.TELEVIDEO].url);
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
  const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
  const $ = cheerio.load(html);
  
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
      'Accept-Language': 'de-DE,de;q=0.9,en-US,en;q=0.5',
      'Accept-Charset': 'utf-8, iso-8859-1;q=0.5, windows-1252;q=0.3',
      'Connection': 'keep-alive',
    },
    // Handle response as arraybuffer for proper encoding
    responseType: 'arraybuffer',
    httpsAgent: false,
  });

  try {
    const response = await client.get(httpUrl);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
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
 * Scrape Il Sole 24 Ore news
 */
const scrapeIlSole24OreNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.IL_SOLE_24_ORE].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    
    // Try multiple selectors for Il Sole 24 Ore
    const selectors = [
      'h1 a',
      'h2 a', 
      'h3 a',
      '.article-title',
      '.headline',
      '.title',
      '[data-testid*="title"]',
      'article h1',
      'article h2'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const title = $(element).text().trim();
        if (title && title.length > 10) {
          titles.push(title);
        }
      });
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Il Sole 24 Ore:', error);
    return [];
  }
};

/**
 * Scrape Sky TG24 news
 */
const scrapeSkyTG24News = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.SKY_TG24].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    
    // Try multiple selectors for Sky TG24
    const selectors = [
      'h1 a',
      'h2 a',
      'h3 a',
      '.news-title',
      '.article-title',
      '.headline',
      '.title',
      'article h1',
      'article h2'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const title = $(element).text().trim();
        if (title && title.length > 10) {
          titles.push(title);
        }
      });
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Sky TG24:', error);
    return [];
  }
};

/**
 * Scrape Internazionale news
 */
const scrapeInternazionaleNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.INTERNAZIONALE].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    
    // Try multiple selectors for Internazionale
    const selectors = [
      'h1 a',
      'h2 a',
      'h3 a',
      '.article-title',
      '.headline',
      '.title',
      'article h1',
      'article h2'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const title = $(element).text().trim();
        if (title && title.length > 10) {
          titles.push(title);
        }
      });
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Internazionale:', error);
    return [];
  }
};

/**
 * Scrape EuroNews news
 */
const scrapeEuroNewsNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const titles: string[] = [];
    const seenTitles = new Set<string>();
    
    // First try the RSS feed which is more reliable
    try {
      const rssResponse = await client.get('https://www.euronews.com/rss');
      const rssHtml = decodeResponse(rssResponse.data as ArrayBuffer, rssResponse.headers['content-type'] as string);
      const $rss = cheerio.load(rssHtml, { xmlMode: true });
      
      $rss('item title').each((_, element) => {
        const title = $rss(element).text().trim();
        
        if (title && 
            title.length > 15 && 
            title.length < 200 &&
            !seenTitles.has(title) &&
            !title.includes('Latest news bulletin') &&
            !title.includes('Watch the video')) {
          
          seenTitles.add(title);
          titles.push(title);
        }
      });
    } catch (rssError) {
      console.log('RSS feed failed, trying website scraping:', rssError);
    }
    
    // If RSS failed or didn't get enough titles, try website scraping
    if (titles.length < 10) {
      const response = await client.get(NEWS_SOURCES[NewsSourceId.EURONEWS].url);
      const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
      const $ = cheerio.load(html);
      
      // Look for article links and headlines
      $('a[href*="euronews.com"]').each((_, element) => {
        const title = $(element).text().trim();
        
        if (title && 
            title.length > 15 && 
            title.length < 200 &&
            !seenTitles.has(title) &&
            !title.includes('Go to') &&
            !title.includes('Continue without') &&
            !title.includes('Learn More') &&
            !title.includes('Cookie')) {
          
          seenTitles.add(title);
          titles.push(title);
        }
      });
      
      // Also check headers
      $('h1, h2, h3, h4').each((_, element) => {
        const title = $(element).text().trim();
        
        if (title && 
            title.length > 15 && 
            title.length < 200 &&
            !seenTitles.has(title)) {
          
          seenTitles.add(title);
          titles.push(title);
        }
      });
    }
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping EuroNews:', error);
    return [];
  }
};

/**
 * Scrape DW news
 */
const scrapeDWNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.DW].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    
    // Try multiple selectors for DW
    const selectors = [
      'h1 a',
      'h2 a',
      'h3 a',
      '.article-title',
      '.headline',
      '.title',
      'article h1',
      'article h2'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const title = $(element).text().trim();
        if (title && title.length > 10) {
          titles.push(title);
        }
      });
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping DW:', error);
    return [];
  }
};

/**
 * Scrape Tagesschau news
 */
const scrapeTagesschauNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.TAGESSCHAU].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    const seenTitles = new Set<string>();
    
    // Focus on article links - most effective approach based on HTML analysis
    $('a[href]').each((_, element) => {
      const title = $(element).text().trim();
      const href = $(element).attr('href');
      
      // Filter for meaningful article titles
      if (title && 
          title.length > 15 && 
          title.length < 200 &&
          href &&
          (href.startsWith('/') || href.includes('tagesschau.de')) &&
          !seenTitles.has(title) &&
          !title.includes('Cookie') &&
          !title.includes('Datenschutz') &&
          !title.includes('Impressum') &&
          !title.includes('Newsletter') &&
          !title.includes('Kontakt')) {
        
        seenTitles.add(title);
        titles.push(title);
      }
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Tagesschau:', error);
    return [];
  }
};

/**
 * Scrape Süddeutsche Zeitung news
 */
const scrapeSueddeutscheNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.SUEDDEUTSCHE].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    const seenTitles = new Set<string>();
    
    // Focus on headlines in headers and article links
    $('h1, h2, h3, h4').each((_, element) => {
      const title = $(element).text().trim();
      
      if (title && 
          title.length > 15 && 
          title.length < 200 &&
          !seenTitles.has(title) &&
          !title.includes('Newsletter') &&
          !title.includes('Datenschutz') &&
          !title.includes('Cookie') &&
          !title.includes('Menü') &&
          !title.includes('Suche')) {
        
        seenTitles.add(title);
        titles.push(title);
      }
    });
    
    // Also check article links
    $('a[href*="sueddeutsche.de"]').each((_, element) => {
      const title = $(element).text().trim();
      
      if (title && 
          title.length > 15 && 
          title.length < 200 &&
          !seenTitles.has(title)) {
        
        seenTitles.add(title);
        titles.push(title);
      }
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Süddeutsche Zeitung:', error);
    return [];
  }
};

/**
 * Scrape FAZ news
 */
const scrapeFAZNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.FAZ].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    const seenTitles = new Set<string>();
    
    // Look for FAZ+ articles and regular links
    $('a[href*="faz.net"]').each((_, element) => {
      let title = $(element).text().trim();
      
      // Clean FAZ+ pattern: "FAZ+ CATEGORY : Title"
      if (title.includes('FAZ+')) {
        const colonIndex = title.indexOf(' : ');
        if (colonIndex > -1) {
          title = title.substring(colonIndex + 3).trim();
        }
      }
      
      if (title && 
          title.length > 15 && 
          title.length < 200 &&
          !seenTitles.has(title) &&
          !title.includes('Newsletter') &&
          !title.includes('Datenschutz') &&
          !title.includes('Cookie') &&
          !title.includes('Kontakt') &&
          !title.includes('Impressum') &&
          !title.includes('Alle anzeigen')) {
        
        seenTitles.add(title);
        titles.push(title);
      }
    });
    
    // Also check headlines in headers
    $('h1, h2, h3').each((_, element) => {
      const title = $(element).text().trim();
      
      if (title && 
          title.length > 15 && 
          title.length < 200 &&
          !seenTitles.has(title)) {
        
        seenTitles.add(title);
        titles.push(title);
      }
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping FAZ:', error);
    return [];
  }
};

/**
 * Scrape Der Spiegel news
 */
const scrapeSpiegelNews = async (): Promise<string[]> => {
  try {
    const client = createHttpClient();
    const response = await client.get(NEWS_SOURCES[NewsSourceId.SPIEGEL].url);
    const html = decodeResponse(response.data as ArrayBuffer, response.headers['content-type'] as string);
    const $ = cheerio.load(html);
    
    const titles: string[] = [];
    
    // Try multiple selectors for Der Spiegel
    const selectors = [
      'h1 a',
      'h2 a',
      'h3 a',
      '.article-title',
      '.headline',
      '.title',
      'article h1',
      'article h2'
    ];
    
    selectors.forEach(selector => {
      $(selector).each((_, element) => {
        const title = $(element).text().trim();
        if (title && title.length > 10) {
          titles.push(title);
        }
      });
    });
    
    return [...new Set(titles)].slice(0, 50);
  } catch (error) {
    console.error('Error scraping Der Spiegel:', error);
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
    case NewsSourceId.IL_SOLE_24_ORE:
      return await scrapeIlSole24OreNews();
    case NewsSourceId.SKY_TG24:
      return await scrapeSkyTG24News();
    case NewsSourceId.REUTERS:
      return await scrapeReutersNews();
    case NewsSourceId.NYTIMES:
      return await scrapeNYTimesNews();
    case NewsSourceId.INTERNAZIONALE:
      return await scrapeInternazionaleNews();
    case NewsSourceId.EURONEWS:
      return await scrapeEuroNewsNews();
    case NewsSourceId.BADISCHE:
      return await scrapeBadischeNews();
    case NewsSourceId.DW:
      return await scrapeDWNews();
    case NewsSourceId.TAGESSCHAU:
      return await scrapeTagesschauNews();
    case NewsSourceId.SUEDDEUTSCHE:
      return await scrapeSueddeutscheNews();
    case NewsSourceId.FAZ:
      return await scrapeFAZNews();
    case NewsSourceId.SPIEGEL:
      return await scrapeSpiegelNews();
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
