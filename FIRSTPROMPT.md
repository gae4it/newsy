# NEWSY - News Aggregator Project Prompt

## Project Overview
Build a news aggregator web application using Next.js, TypeScript, Tailwind CSS, and Node.js.

## Requirements

### 1. Project Setup
- Use Next.js with TypeScript
- Use Tailwind CSS for styling
- Set up project structure with pages, API routes, and components
- Use React hooks for state management on the frontend
- Ensure that the site is **not indexed by search engines** and **cannot be discovered or accessed by AI bots** (add proper `robots.txt`, `noindex` meta tags, or headers)

### 2. Backend / API Routes
- Create a single API route `/api/news` that accepts a query parameter `site`
- Based on the `site` parameter, scrape the home page of the following news websites:
  - Televideo (https://www.televideo.rai.it/televideo/pub/solotesto.jsp)
  - Il Fatto Quotidiano (https://www.ilfattoquotidiano.it/)
  - Repubblica (https://www.repubblica.it/)
  - ANSA (https://www.ansa.it/)
  - Reuters (https://www.reuters.com/)
  - NYTimes (https://www.nytimes.com/)
  - Badische Zeitung (https://www.badische-zeitung.de/)
  - 68k News IT (https://68k.news/index.php?section=nation&loc=IT)
  - 68k News DE (https://68k.news/index.php?section=nation&loc=DE)
  - 68k News US (https://68k.news/index.php?section=nation&loc=US)
- Extract the main news titles from each site using `axios` and `cheerio`
- Return the scraped data in JSON format:
  ```json
  {
    "source": "Repubblica",
    "titles": ["Title 1", "Title 2", "Title 3"]
  }
  ```

### 3. Frontend
- Create a homepage with:
  - A main title and subtitle
  - A button for each news site
- When a user clicks a button, call the API with the corresponding `site` parameter
- Display the list of news titles in a styled card using Tailwind
- Show a loading state while fetching data

### 4. Code Quality
- Use TypeScript types for API responses and state
- Include comments explaining each function and important code sections
- All comments must be written in **English**

### 5. Bonus Features
- Make the layout responsive
- Use a grid for buttons and cards
- Ensure accessibility (buttons should have clear labels, proper HTML semantics)

## Technical Stack
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Scraping**: axios, cheerio
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Security & Privacy
- Prevent search engine indexing
- Block AI bot access
- Implement proper robots.txt
- Add noindex meta tags

## Expected Deliverables
- Complete working Next.js application
- Responsive design with proper accessibility
- Clean, commented TypeScript code
- Proper error handling and loading states
- SEO prevention configuration