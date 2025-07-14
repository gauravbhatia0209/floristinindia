# Vercel Deployment Without vercel.json

## Structure Created

This deployment uses Vercel's file-based routing instead of `vercel.json`:

### API Routes

- `api/[...path].js` - Handles all `/api/*` requests
- Routes to Express server in `server/dist/index.js`

### Upload Routes

- `uploads/[...path].js` - Handles all `/uploads/*` requests
- Serves uploaded images through Express server

### Frontend

- `client/dist/` - Static React app with SPA routing
- `client/dist/404.html` - Handles client-side routing for direct URLs

## Deployment Process

1. **Build Command**: `npm run build`

   - Builds server TypeScript to `server/dist/`
   - Builds client React app to `client/dist/`
   - Generates `404.html` for SPA routing

2. **Deploy to Vercel**:
   - Vercel will automatically detect the `api/` directory
   - Frontend will be served from `client/dist/`
   - API and uploads will be handled by serverless functions

## File Structure

```
├── api/
│   ├── index.js           # Main API handler
│   └── [...path].js       # Catch-all API routes
├── uploads/
│   └── [...path].js       # Upload file handler
├── client/dist/           # Frontend build
│   ├── index.html
│   └── 404.html          # SPA routing support
└── server/dist/           # Backend build
    └── index.js
```

## Features Supported

- ✅ React Router SPA routing (no 404 on refresh)
- ✅ API endpoints (`/api/*`)
- ✅ File uploads and serving (`/uploads/*`)
- ✅ No `vercel.json` configuration needed
