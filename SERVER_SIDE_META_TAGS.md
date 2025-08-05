# Server-Side Meta Tag Implementation

This document describes the server-side meta tag rendering system implemented for the Florist in India project.

## Overview

The system renders meta tags server-side so they appear in view-source and are properly indexed by search engines. It also provides admin panel fields for customizing meta titles and descriptions for pages, categories, and products.

## Architecture

### 1. Server-Side Meta Generation (`/server/routes/meta.ts`)

The meta generation system:

- Fetches data from Supabase based on the current route
- Generates appropriate meta tags for different page types
- Caches results for 5 minutes to reduce database calls
- Supports homepage, categories, products, pages, and static routes

### 2. HTML Template (`/server/views/index.html`)

The server uses a custom HTML template with placeholders:

- `{{TITLE}}` - Page title
- `{{DESCRIPTION}}` - Meta description
- `{{OG_TITLE}}` - Open Graph title
- `{{OG_DESCRIPTION}}` - Open Graph description
- `{{CANONICAL}}` - Canonical URL
- `{{OG_IMAGE}}` - Open Graph image

### 3. Meta Injection Middleware

The `injectMetaTags` middleware:

- Runs before static file serving
- Generates meta data for each request
- Stores data in `res.locals` for template processing

### 4. Cache Management (`/client/lib/meta-cache.ts`)

Client-side utilities for cache management:

- Clear cache when admin makes changes
- API endpoints for cache control
- Hooks for easy integration in admin components

## Route-Specific Meta Tags

### Homepage (`/`)

- Uses global site settings
- Fallback to default meta title and description
- Includes site tagline if available

### Categories (`/category/:slug`)

- Uses category-specific meta_title and meta_description
- Fallback to category name and description
- Format: `{meta_title || name} | {site_name}`

### Products (`/product/:slug`)

- Uses product-specific meta_title and meta_description
- Fallback to product name and short_description
- Format: `{meta_title || name} | {site_name}`

### Pages (`/pages/:slug`)

- Uses page-specific meta_title and meta_description
- Fallback to page title
- Format: `{meta_title || title} | {site_name}`

### Static Pages

- Predefined meta tags for static routes like `/about`, `/contact`
- Consistent branding with site name

## Admin Panel Integration

### Categories Admin

- Added meta_title and meta_description fields
- Cache clearing on save/update
- SEO section in category edit form

### Pages Admin

- SEO tab with meta fields
- Cache clearing on page changes
- Proper fallback handling

### Products Admin

- SEO fields in product edit form
- Cache clearing on product updates
- Featured product changes clear all cache

### Settings Admin

- Global SEO settings affect all pages
- Cache clearing on settings update
- Default meta title and description configuration

## Database Schema

The following tables include meta fields:

```sql
-- Categories
ALTER TABLE product_categories ADD COLUMN meta_title VARCHAR(200);
ALTER TABLE product_categories ADD COLUMN meta_description TEXT;

-- Pages
ALTER TABLE pages ADD COLUMN meta_title VARCHAR(200);
ALTER TABLE pages ADD COLUMN meta_description TEXT;

-- Products
ALTER TABLE products ADD COLUMN meta_title VARCHAR(200);
ALTER TABLE products ADD COLUMN meta_description TEXT;
```

## API Endpoints

### Get Meta Data

```
GET /api/meta?pathname=/category/roses
```

### Clear Cache

```
POST /api/meta/clear-cache
Content-Type: application/json
{ "pathname": "/category/roses" }
```

## Build Process

The build process includes:

1. Build server TypeScript to JavaScript
2. Build client React application
3. Copy HTML template to server dist directory
4. Template is ready for production use

## SEO Benefits

1. **Server-Side Rendering**: Meta tags are present in initial HTML
2. **Social Media**: Proper Open Graph and Twitter Card tags
3. **Search Engines**: Crawlers see meta tags immediately
4. **Performance**: Cached meta data reduces database queries
5. **Customization**: Per-page/category/product meta tag control
6. **Fallbacks**: Graceful degradation with sensible defaults

## Usage Examples

### Setting Category Meta Tags

```typescript
// In Categories admin
const categoryData = {
  name: "Birthday Flowers",
  slug: "birthday-flowers",
  meta_title: "Birthday Flowers - Fresh Delivery | Florist in India",
  meta_description:
    "Order beautiful birthday flowers with same-day delivery across India. Premium flower arrangements perfect for birthday celebrations.",
};
```

### Setting Page Meta Tags

```typescript
// In Pages admin
const pageData = {
  title: "About Us",
  slug: "about",
  meta_title: "About Florist in India - Fresh Flower Delivery Experts",
  meta_description:
    "Learn about our commitment to delivering fresh, beautiful flowers across India with same-day delivery service.",
};
```

### Clearing Cache Programmatically

```typescript
import { useClearMetaCacheOnSave } from "@/lib/meta-cache";

const { clearCategoryCache, clearAllCache } = useClearMetaCacheOnSave();

// Clear specific category cache
await clearCategoryCache("roses");

// Clear all cache
await clearAllCache();
```

## Testing

To verify meta tags are working:

1. **View Source**: Right-click → View Source on any page
2. **Meta API**: GET `/api/meta?pathname=/category/roses`
3. **Social Media**: Test sharing URLs on Facebook/Twitter
4. **SEO Tools**: Use tools like Google's Rich Results Test

## Troubleshooting

### Meta Tags Not Updating

1. Check if cache needs clearing: `POST /api/meta/clear-cache`
2. Verify database has correct meta_title/meta_description values
3. Check server logs for meta generation errors

### Template Not Found

1. Ensure `server/views/index.html` exists
2. Verify post-build script ran successfully
3. Check `server/dist/views/index.html` was created

### API Errors

1. Verify Supabase connection
2. Check table permissions (RLS policies)
3. Ensure required columns exist in database

## Future Enhancements

1. **Structured Data**: Add JSON-LD schema markup
2. **Multi-language**: Support for internationalized meta tags
3. **A/B Testing**: Test different meta tag variations
4. **Analytics**: Track click-through rates from search results
5. **Auto-generation**: AI-powered meta tag suggestions
