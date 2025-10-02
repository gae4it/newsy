import * as cheerio from 'cheerio';
import { fetchWithCorsProxy, getCorsErrorMessage } from '../services/corsProxy';

interface NewsItem {
  title: string;
  description: string;
}

interface ProcessedNewsItem {
  title: string;
  summary: string;
}

// Fetch HTML content from the news source
export const fetchNewsFromSource = async (countryCode: string): Promise<string> => {
  try {
    const targetUrl = `http://68k.news/index.php?section=nation&loc=${countryCode}`;
    
    try {
      // Use our CORS proxy service that tries multiple proxies
      return await fetchWithCorsProxy(targetUrl);
    } catch (corsError) {
      console.error('All CORS proxies failed:', corsError);
      throw new Error(getCorsErrorMessage());
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// Extract news items from HTML
export const extractNewsFromHtml = (html: string): NewsItem[] => {
  const $ = cheerio.load(html);
  const newsItems: NewsItem[] = [];
  
  // Find news links in the 68k.news page
  // The selector may need adjustment based on the actual HTML structure
  $('a').each((_, element) => {
    const $element = $(element);
    const href = $element.attr('href');
    const title = $element.text().trim();
    
    // Filter out navigation links and empty titles
    if (href && 
        href.includes('article.php') && 
        title && 
        title.length > 10 && 
        !title.includes('68k.news')) {
      
      // For description, we'll use a placeholder since we don't have actual descriptions
      // In a real app, you might want to fetch the actual article content
      newsItems.push({
        title,
        description: 'Clicca per leggere l\'articolo completo'
      });
    }
  });
  
  // Limit to first 30 items
  return newsItems.slice(0, 30);
};

// Remove duplicate news based on title
export const removeDuplicates = (news: NewsItem[]): NewsItem[] => {
  const uniqueTitles = new Set<string>();
  return news.filter(item => {
    if (uniqueTitles.has(item.title)) {
      return false;
    }
    uniqueTitles.add(item.title);
    return true;
  });
};

// Mock AI summarization in Italian
export const summarizeContent = (newsItems: NewsItem[]): ProcessedNewsItem[] => {
  // In a real application, you would use an AI service like OpenAI or similar
  return newsItems.map(item => {
    let summary: string;
    
    if (item.title.toLowerCase().includes('covid') || item.title.toLowerCase().includes('virus')) {
      summary = "Aggiornamento sulla situazione sanitaria e misure di contenimento del virus.";
    } else if (item.title.toLowerCase().includes('economia') || item.title.toLowerCase().includes('finanz')) {
      summary = "Analisi dell'impatto economico e delle prospettive finanziarie.";
    } else if (item.title.toLowerCase().includes('politic') || item.title.toLowerCase().includes('govern')) {
      summary = "Sviluppi politici e dichiarazioni da parte delle istituzioni governative.";
    } else if (item.title.toLowerCase().includes('tech') || item.title.toLowerCase().includes('digital')) {
      summary = "Innovazioni tecnologiche e trasformazione digitale nel settore.";
    } else if (item.title.toLowerCase().includes('sport') || item.title.toLowerCase().includes('calcio')) {
      summary = "Risultati sportivi e commenti sulle prestazioni degli atleti.";
    } else {
      summary = "Notizia di attualità con potenziali sviluppi nei prossimi giorni.";
    }
    
    // Add the original country context for German news
    if (item.title.match(/[äöüßÄÖÜ]/)) {
      summary += " Notizia tradotta dal tedesco all'italiano.";
    }
    
    return {
      title: item.title,
      summary
    };
  });
};

// Main function to process news
export const processNews = async (countryCode: string): Promise<ProcessedNewsItem[]> => {
  try {
    const html = await fetchNewsFromSource(countryCode);
    const extractedNews = extractNewsFromHtml(html);
    const uniqueNews = removeDuplicates(extractedNews);
    return summarizeContent(uniqueNews.slice(0, 30));
  } catch (error) {
    console.error('Error processing news:', error);
    throw error;
  }
};
