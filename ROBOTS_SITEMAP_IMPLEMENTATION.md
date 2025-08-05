# Robots.txt and Sitemap.xml Implementation

## Overview
This implementation provides dynamic generation of robots.txt and sitemap.xml files with admin control through Site Settings.

## Features Added

### 🤖 Dynamic Robots.txt
- **URL**: `/robots.txt`
- **Admin Configurable**: Custom content via Site Settings
- **Automatic Generation**: Falls back to sensible defaults
- **SEO Optimized**: References sitemap.xml location

### 🗺️ Dynamic Sitemap.xml
- **URL**: `/sitemap.xml`
- **Real-time Generation**: Pulls from database on each request
- **Comprehensive Coverage**: All live content included
- **Admin Control**: Additional URLs via Site Settings

### 📄 Text Sitemap
- **URL**: `/sitemap.txt`
- **Simple Format**: Plain text list for AI parsing
- **Same Content**: Mirrors XML sitemap URLs

## Included Content

### Sitemap.xml Automatically Includes:
1. **Homepage** (`/`) - Priority 1.0
2. **Static Pages** (`/about`, `/contact`, `/cart`) - Priority 0.5-0.7
3. **Dynamic Pages** (`/pages/{slug}`) - Priority 0.7
4. **Categories** (`/category/{slug}`) - Priority 0.8
5. **Products** (`/product/{slug}`) - Priority 0.7
6. **Admin URLs** (Additional sitemap URLs from settings)

### Robots.txt Features:
- **Custom Content**: Admin can override completely
- **Auto-Generated**: Default rules when empty
- **Sitemap Reference**: Points to sitemap.xml
- **Security**: Blocks admin areas and sensitive paths

## Admin Configuration

### Site Settings → Meta Tags Tab

#### Additional Sitemap URLs
```
/special-offers
/gallery
/testimonials
https://blog.example.com/sitemap.xml
```
- **One URL per line**
- **Relative or absolute URLs supported**
- **Automatically includes in sitemap.xml**

#### Custom Robots.txt Content
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```
- **Complete override** of default robots.txt
- **Leave empty** for auto-generated content
- **SEO best practices** built-in

#### Sitemap Control
- **Enable/Disable**: Toggle sitemap generation
- **Cache Control**: 1-hour cache for performance

## Technical Implementation

### Database Requirements
Run migration: `add-sitemap-urls-setting-migration.sql`

```sql
-- Adds these site_settings entries:
-- additional_sitemap_urls: ""
-- sitemap_enabled: "true" 
-- robots_txt_content: ""
```

### Server Routes
**File**: `server/routes/sitemap.ts`

#### GET /robots.txt
- Fetches `robots_txt_content` from site_settings
- Falls back to generated content with sitemap reference
- Cache: 24 hours
- Content-Type: text/plain

#### GET /sitemap.xml
- Queries all active content (pages, categories, products)
- Includes last modification dates
- Adds admin-configured additional URLs
- Cache: 1 hour
- Content-Type: application/xml

#### GET /sitemap.txt
- Same content as XML sitemap
- Simple text format for AI parsing
- One URL per line

### Auto-Generated Robots.txt Default
```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://yourdomain.com/sitemap.xml

# Common crawl delays
Crawl-delay: 1

# Block sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/temp/
Disallow: /*?*

# Allow specific API endpoints for AI
Allow: /api/ai/
Allow: /api/sitemap
Allow: /api/meta
```

## SEO Benefits

### Search Engine Optimization
- **Proper Discovery**: Search engines find all content
- **Last Modified**: Tells crawlers when content changed
- **Priority Signals**: Indicates important vs secondary pages
- **Crawl Control**: Prevents wasting crawl budget on admin areas

### Performance Optimization
- **Caching**: Reduces database load
- **Efficient XML**: Clean, valid sitemap format
- **Conditional Generation**: Only includes active content

## Usage Examples

### Basic Setup
1. **Deploy**: Migration runs automatically
2. **Default Behavior**: Sitemap works immediately
3. **Custom URLs**: Add via Admin → Settings → Meta Tags

### Adding Custom URLs
```
# In Additional Sitemap URLs field:
/special-landing-page
/newsletter-signup
/customer-portal
https://external-blog.com/sitemap.xml
```

### Custom Robots.txt
```
# Complete override example:
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: *
Allow: /
Crawl-delay: 2
Disallow: /admin/
Disallow: /private/

Sitemap: https://floristinindia.com/sitemap.xml
Sitemap: https://blog.floristinindia.com/sitemap.xml
```

## Testing

### Validation
- **Google Search Console**: Submit sitemap.xml
- **XML Validator**: Check sitemap format
- **Robots.txt Tester**: Google Search Console

### URLs to Test
- `https://yourdomain.com/robots.txt`
- `https://yourdomain.com/sitemap.xml`
- `https://yourdomain.com/sitemap.txt`

## Files Modified

### Server-Side
- `server/routes/sitemap.ts` - Main implementation
- `add-sitemap-urls-setting-migration.sql` - Database migration

### Admin Panel
- `client/pages/admin/Settings.tsx` - UI for additional URLs and robots.txt

### Route Registration
- Routes are automatically registered via existing sitemap router in `server/index.ts`

## Performance Notes

- **XML Sitemap**: 1-hour cache, rebuilds on database changes
- **Robots.txt**: 24-hour cache, rarely changes
- **Database Queries**: Optimized to fetch only active content
- **Memory Usage**: Efficient XML generation without large buffers

The implementation provides complete SEO control while maintaining performance and ease of use for administrators.
