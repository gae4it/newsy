# 🚀 Netlify Deployment Guide for Newsy

This guide will help you deploy the Newsy news aggregator to Netlify.

## 📋 Prerequisites

- A [Netlify account](https://netlify.com)
- Your repository pushed to GitHub/GitLab/Bitbucket
- Node.js 18+ locally for testing

## 🛠️ Deployment Steps

### 1. Connect Repository to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select your `newsy` repository

### 2. Configure Build Settings

Netlify should automatically detect the configuration from `netlify.toml`, but verify:

- **Base directory**: Leave empty (root)
- **Build command**: `npm run build:netlify`
- **Publish directory**: `.next`
- **Functions directory**: Auto-detected by Next.js plugin

### 3. Environment Variables (Optional)

In your Netlify site settings → Environment variables, add:

```
NODE_ENV=production
SKIP_ENV_VALIDATION=true
NEXT_PUBLIC_SITE_URL=https://your-site-name.netlify.app
```

### 4. Install Dependencies

Netlify will automatically run:
```bash
npm install
npm run build:netlify
```

### 5. Deploy

- Click "Deploy site"
- Wait for the build to complete (~2-3 minutes)
- Your site will be available at `https://random-name.netlify.app`

## 🎯 Site Configuration

### Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS with your domain provider
4. Enable HTTPS (automatic)

### Security Headers

The following security headers are automatically configured:

- `X-Robots-Tag: noindex, nofollow, nosnippet, noarchive`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🔧 Features Working on Netlify

✅ **Static Pages**: Homepage, error pages
✅ **API Routes**: `/api/news`, `/api/news/batch`
✅ **Server-Side Rendering**: Dynamic content
✅ **News Scraping**: All 10 news sources
✅ **Batch Processing**: English/Italian AI prompts
✅ **German Characters**: Proper encoding
✅ **Responsive Design**: Mobile/desktop
✅ **Security**: No indexing, private use

## 🚨 Important Notes

### Rate Limiting
- Netlify has function execution limits
- Consider implementing caching for production use
- Some news sites may block requests from cloud providers

### Privacy & Legal
- This is for **educational/personal use only**
- The site includes proper noindex directives
- Content belongs to respective news organizations
- Consider adding rate limiting for production

### Performance
- First build may take 3-5 minutes
- Subsequent builds ~1-2 minutes
- Functions have 10-second timeout
- Consider caching strategies for heavy usage

## 🔍 Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors in build logs

### API Routes Not Working
- Ensure `@netlify/plugin-nextjs` is installed
- Check function logs in Netlify dashboard
- Verify CORS settings if accessing from different domain

### News Sources Failing
- Some sites may block cloud provider IPs
- Check individual source endpoints manually
- Consider implementing retry logic

## 📱 Testing Locally

Before deploying, test the production build:

```bash
npm run build:netlify
npm start
```

## 🌟 Success!

Your Newsy aggregator is now live! Features include:

- 🌍 Dual-language batch processing (EN/IT)  
- 📰 10 international news sources
- 🇩🇪 German character support
- 🔒 Privacy-focused (no tracking/indexing)
- ⚡ Real-time news scraping
- 📱 Responsive design

Enjoy your private news aggregator! 📰✨