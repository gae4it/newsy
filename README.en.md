# Newsy - Your Simple News Aggregator

A React application that fetches and summarizes top news from Italy and Germany.

## ✨ Goal

**Newsy** is a web app built with React, TypeScript, and Tailwind CSS that provides a summary of the main news (up to 30) for the following countries:

- Italy: `http://68k.news/index.php?section=nation&loc=IT`
- Germany: `http://68k.news/index.php?section=nation&loc=DE`

## 🧠 How it works

1. The interface displays:
   - A title: `newsy - Your simple news aggregator`
   - Two central buttons: "Italy" and "Germany"

2. When one of the buttons is clicked:
   - Fetches the corresponding HTML page
   - Extracts the **first 30 news items** (or fewer, if not available)
   - Filters duplicate news (based on the title)
   - Generates a short summary in Italian for each news item

3. The news is displayed with title and summarized description on the same page

## 🛠️ Technologies Used

- **React** + **TypeScript** for frontend development
- **Tailwind CSS** for responsive styling
- **Cheerio** for client-side HTML parsing
- **Vite** as build tool

## 🏗️ Project Structure

```
src/
├── components/       # React components
│   ├── NewsFetcher.tsx
│   └── NewsList.tsx
├── services/         # Support services
│   └── corsProxy.ts
├── utils/            # Utilities and helpers
│   └── newsUtils.ts
├── App.tsx           # Main component
└── main.tsx          # Entry point
```

## 🚀 Getting Started

1. Clone the repository
   ```
   git clone https://your-repo/newsy.git
   cd newsy
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the app in development mode
   ```
   npm run dev
   ```

4. Open in your browser at `http://localhost:5173`

## 📌 CORS Issues

If you encounter CORS issues during development:

1. The app automatically tries several CORS proxies
2. You can install a browser extension to disable CORS restrictions (development only)
3. For production, implement server-side fetching of news

## 🗣️ Language & Translation

- All news is summarized in Italian
- Multilanguage support planned for future versions (Italian, German, English)
