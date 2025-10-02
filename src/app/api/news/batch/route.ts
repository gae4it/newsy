import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { BatchNewsResponse, NewsResponse } from '@/types/news';
import { NEWS_SOURCES, type NewsSourceId } from '@/types/news';

/**
 * API Route Handler for /api/news/batch
 * Scrapes all news sources in parallel and generates AI summary prompt
 */
export async function GET(request: NextRequest) {
  // Add security headers to prevent indexing and caching
  const headers = {
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  try {
    console.log('Starting batch news scraping for all sources...');
    
    // Extract language parameter from URL
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('lang') ?? 'it';
    
    // Create array of all source IDs
    const sourceIds: NewsSourceId[] = Object.keys(NEWS_SOURCES) as NewsSourceId[];
    
    // Scrape all sources in parallel
    const promises = sourceIds.map(async (sourceId) => {
      try {
        const baseUrl = request.url.replace('/batch', '');
        const url = new URL(baseUrl);
        url.searchParams.set('site', sourceId);
        
        console.log(`Fetching from: ${url.toString()}`);
        
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as NewsResponse;
        console.log(`✓ ${sourceId}: ${data.titles.length} news fetched`);
        return data;
        
      } catch (error) {
        console.error(`✗ Error fetching from ${sourceId}:`, error);
        
        return {
          source: NEWS_SOURCES[sourceId]?.name || sourceId,
          sourceId,
          titles: [],
          links: [],
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
    
    // Wait for all sources to complete
    const sources = await Promise.all(promises);
    
    // Calculate statistics
    const totalNews = sources.reduce((sum, source) => sum + source.titles.length, 0);
    const failedSources = sources
      .filter(source => source.error)
      .map(source => `${source.source}: ${source.error}`);
    
    // Generate AI prompt for summarization
    const aiPrompt = generateAISummaryPrompt(sources, language);
    
    const batchResponse: BatchNewsResponse = {
      sources,
      totalNews,
      successfulSources: sources.length - failedSources.length,
      failedSources,
      aiPrompt
    };
    
    console.log(`Batch scraping completed: ${batchResponse.successfulSources}/${sources.length} sources successful, ${totalNews} total news`);
    
    return NextResponse.json(batchResponse, { headers });
    
  } catch (error) {
    console.error('Error in batch news scraping:', error);
    
    const errorResponse: BatchNewsResponse = {
      sources: [],
      totalNews: 0,
      successfulSources: 0,
      failedSources: ['All sources failed'],
      aiPrompt: undefined
    };
    
    return NextResponse.json(errorResponse, { status: 500, headers });
  }
}

/**
 * Generate AI summary prompt for all collected news
 */
function generateAISummaryPrompt(sources: NewsResponse[], language = 'it'): string {
  const isEnglish = language === 'en';
  
  let prompt = `Please analyze and summarize all the news in this comprehensive news collection. Follow these instructions:

ELIMINATE DUPLICATE NEWS: Remove any duplicate or very similar news stories.

ORGANIZE BY TOPIC: Group news into relevant categories (Politics, Economy, Technology, Sports, Health, International, etc.).

ORGANIZE BY COUNTRY: Within each topic, organize by country/region (Italy, Germany, USA, International).

${isEnglish ? 
  'TRANSLATE TO ENGLISH: Provide all summaries and final output in English language.' : 
  'TRANSLATE TO ITALIAN: Provide all summaries and final output in Italian language.'
}

PROVIDE INSIGHTS: Add brief analysis of major trends and connections between stories.

HIGHLIGHT IMPORTANT STORIES: Focus on the most impactful or relevant news of the day.

INCLUDE SECONDARY NEWS SECTION: At the end, provide a separate section called "${isEnglish ? 'Secondary News' : 'News Secondarie'}" that lists less important or marginal news items that were excluded from the main summary. This allows the reader to explore additional stories if desired.

NEWS SOURCES AND CONTENT:
---

`;

  sources.forEach(source => {
    prompt += `## ${source.source}\n`;
    
    if (source.error) {
      prompt += `ERROR: ${source.error}\n\n`;
    } else if (source.titles.length === 0) {
      prompt += `No news found from this source.\n\n`;
    } else {
      prompt += `Total articles: ${source.titles.length}\n\n`;
      source.titles.forEach((title, index) => {
        prompt += `${index + 1}. ${title}\n`;
      });
      prompt += '\n';
    }
  });

  prompt += `---

SUMMARY REQUIREMENTS:

Remove duplicates and very similar stories.

Group by topic categories.

Sub-organize by country within each topic.

${isEnglish ? 'Translate everything into English.' : 'Translate everything into Italian.'}

Provide concise but informative summaries.

Include trend analysis and connections between stories.

Highlight the most important stories of the day.

Include a final section "${isEnglish ? 'Secondary News' : 'News Secondarie'}" for minor or supplementary news.

Please provide a well-structured summary following these guidelines.`;

  return prompt;
}