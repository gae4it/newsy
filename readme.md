# 📰 Newsy - News Aggregator

**A private, fast, and comprehensive news aggregation platform that collects articles from 18 international news sources across multiple countries and languages.**

## 🌟 Features

### 📡 **Multi-Source News Aggregation**
- **18 international news sources** from 4 countries (🇮🇹 Italy, 🇺🇸 USA, 🇩🇪 Germany, 🇪🇺 Europe)
- **Real-time web scraping** with optimized selectors for each source
- **Intelligent content extraction** with advanced HTML parsing
- **Automatic duplicate removal** and content filtering

### 🚀 **AI-Powered Batch Processing**
- **Dual-language AI prompt generation** (English/Italian)
- **Smart news summarization** ready for AI consumption
- **Batch processing** of all sources simultaneously
- **Structured output** for LLM integration

### 🔒 **Privacy & Security First**
- **No tracking or analytics** - completely private
- **Anti-indexing protection** blocks all search engines and AI bots
- **Local processing** - no data sent to third parties
- **No cookies or user data collection**

### 🎨 **Modern User Interface**
- **Responsive design** optimized for all devices
- **Real-time loading states** with smooth animations
- **Error handling** with user-friendly messages
- **Accessibility compliant** with ARIA labels and keyboard navigation
- **Country-coded visual indicators** for easy source identification

### 🌍 **Multi-Language Support**
- **German character encoding** support (UTF-8, ISO-8859-1, Windows-1252)
- **Automatic charset detection** for international sources
- **Content normalization** across different languages

## 📊 Supported News Sources

### 🇮🇹 **Italian Sources (7)**
- **Televideo RAI** - Italy's national broadcaster
- **Il Fatto Quotidiano** - Independent daily newspaper
- **Repubblica** - Major Italian newspaper
- **ANSA** - Italian news agency
- **Il Sole 24 Ore** - Financial and business news
- **SkyTg24** - Sky Italia's news channel
- **Internazionale** - International magazine

### 🇺🇸 **American Sources (4)**
- **Reuters** - International news agency
- **New York Times** - World section
- **68k News USA** - Technology focus
- **68k News Global** - International technology

### 🇩🇪 **German Sources (4)**
- **Deutsche Welle (DW)** - Germany's international broadcaster
- **Tagesschau** - ARD's news service
- **Süddeutsche Zeitung** - Leading German newspaper
- **Frankfurter Allgemeine (FAZ)** - Conservative German newspaper
- **Der Spiegel** - German news magazine
- **Badische Zeitung** - Regional newspaper

### 🇪🇺 **European Sources (3)**
- **EuroNews** - Pan-European news network with RSS fallback
- **68k News Germany** - German technology news
- **68k News Italy** - Italian technology news

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.5.4** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling

### **Backend**
- **Node.js** - Runtime environment
- **Next.js API Routes** - Serverless functions
- **Cheerio** - Server-side HTML parsing
- **Axios** - HTTP client for web scraping

### **Development**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Turbopack** - Fast bundler (development)

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Git

### **Installation**

```bash
# Clone the repository
git clone https://github.com/gae4it/newsy.git
cd newsy

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build for Production**

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📱 Usage

### **Individual Source Scraping**
1. **Select a news source** from the grid
2. **Wait for scraping** to complete (1-3 seconds)
3. **View extracted headlines** in the results card
4. **Click headlines** to access source content

### **Batch AI Prompt Generation**
1. **Choose language**: English or Italian
2. **Click batch button** to scrape all sources
3. **Get AI-ready prompt** with all news summarized
4. **Copy and use** in your preferred LLM

### **API Usage**

```bash
# Get news from specific source
GET /api/news?site=repubblica

# Get batch summary for AI
GET /api/news/batch?lang=en
GET /api/news/batch?lang=it
```

## 🔧 Configuration

### **Adding New Sources**

Edit `src/types/news.ts`:

```typescript
// Add to NewsSourceId enum
export enum NewsSourceId {
  // existing sources...
  NEW_SOURCE = 'new-source'
}

// Add to NEWS_SOURCES configuration
export const NEWS_SOURCES: Record<NewsSourceId, NewsSource> = {
  // existing sources...
  [NewsSourceId.NEW_SOURCE]: {
    id: NewsSourceId.NEW_SOURCE,
    name: 'New Source',
    url: 'https://newssite.com',
    country: 'US',
    category: 'general'
  }
};
```

Add scraper function in `src/app/api/news/route.ts`.

### **Environment Variables**

Create `.env.local`:

```bash
# Optional: Custom timeout (default: 10000ms)
NEWS_SCRAPING_TIMEOUT=15000

# Optional: User agent override
NEWS_USER_AGENT="Custom Bot 1.0"
```

## 🌐 Deployment

### **Netlify** (Recommended)

```bash
# Build for Netlify
npm run build:netlify

# Deploy
npm run deploy
```

### **Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Docker**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Privacy Features

- **No user tracking** or analytics
- **Blocked search engine indexing** (robots.txt + meta tags)
- **Anti-bot protection** against GPT, Claude, and other AI scrapers
- **Local data processing** - no external services
- **No persistent storage** of user data
- **No cookies** or session tracking

## 🎯 Use Cases

- **Personal news monitoring** across multiple sources
- **AI content generation** with current news context
- **Research and analysis** of news coverage
- **Educational purposes** and learning
- **Private news consumption** without tracking

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is for **educational and personal use only**. All scraped content belongs to respective news organizations.

## ⚠️ Disclaimer

This application is designed for:
- **Educational purposes**
- **Personal use and learning**
- **Testing web scraping techniques**
- **Private news aggregation**

**Not intended for:**
- Commercial use
- Redistribution of copyrighted content
- High-volume automated access
- Violation of website terms of service

## 🔗 Built With T3 Stack

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
