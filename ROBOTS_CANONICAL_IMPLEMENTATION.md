# Robots and Canonical URL Implementation

## Overview

This implementation adds dynamic canonical URLs and customizable robots meta tags to all pages on the site. Admins can now control search engine crawling behavior on a per-page basis.

## Features Added

### 1. Dynamic Canonical URLs

- Automatically generated for all pages based on the resolved URL
- Uses the format: `{SITE_URL}/{pathname}`
- Added to HTML `<head>` as `<link rel="canonical" href="{url}" />`

### 2. Robots Meta Tags

- Default robots directive: `index, follow`
- Customizable per page/category/product through admin panel
- Falls back to Site Settings default when no override is set
- Common options available: `index, follow`, `noindex, nofollow`, etc.

## Database Changes

### New Fields Added

- `pages.robots` (VARCHAR(100)) - Custom robots directive for pages
- `product_categories.robots` (VARCHAR(100)) - Custom robots directive for categories
- `products.robots` (VARCHAR(100)) - Custom robots directive for products
- `site_settings.defaultRobots` - Default robots directive for all pages

### Migration

Run the migration script: `add-robots-field-migration.sql`

```sql
-- The migration adds robots columns to all content tables
-- and creates the defaultRobots site setting
```

## Admin Panel Changes

### Pages Admin

- Added "Robots Directive" field in SEO tab
- Dropdown with common robots values
- Shows fallback indicator when using default

### Categories Admin

- Added "Robots Directive" field in SEO section
- Same dropdown options as pages
- Applies to category archive pages

### Products Admin

- Added "Robots Directive" field in SEO section
- Controls individual product page robots
- Falls back to site default when empty

### Site Settings

- Added "Default Robots Directive" in Meta Tags section
- Controls site-wide default robots behavior
- Used when individual pages don't have custom settings

## Technical Implementation

### Server-Side Meta Generation

- Updated `MetaData` interface to include `robots?: string`
- Enhanced all meta generation functions to include robots
- Added `defaultRobots` to site settings fetch
- Proper fallback chain: page-specific → site default → "index, follow"

### HTML Template Updates

- Added `{{ROBOTS}}` placeholder in `server/views/index.html`
- Updated HTML injection logic in `server/index.ts`
- Robots value is processed and injected server-side

### Form Integration

- All admin forms now include robots field
- Consistent UI across pages, categories, and products
- Real-time preview of effective robots value
- Clear indication when using defaults

## Usage Examples

### Setting Page-Specific Robots

1. Go to Admin → Pages
2. Edit any page
3. Go to SEO tab
4. Select desired robots directive
5. Save - robots meta tag will be updated immediately

### Setting Site-Wide Default

1. Go to Admin → Settings
2. Go to Meta Tags tab
3. Update "Default Robots Directive"
4. Save - all pages without custom robots will use this value

### Common Use Cases

- **Landing pages**: Use `index, follow` (default)
- **Thank you pages**: Use `noindex, follow`
- **Admin/internal pages**: Use `noindex, nofollow`
- **Duplicate content**: Use `noindex, follow`
- **Print versions**: Use `noindex, nofollow, noarchive`

## Cache Management

- Robots changes trigger automatic meta cache clearing
- Changes are reflected immediately on the frontend
- No server restart required

## Testing

- Check page source to verify robots meta tag
- Confirm canonical URLs are correct
- Test admin forms save robots values properly
- Verify fallback behavior when fields are empty

## Files Modified

### Server-Side

- `server/routes/meta.ts` - Meta generation logic
- `server/views/index.html` - HTML template
- `server/index.ts` - HTML injection processing

### Database

- `add-robots-field-migration.sql` - Database migration

### Admin Panel

- `client/pages/admin/Pages.tsx` - Pages management
- `client/pages/admin/Categories.tsx` - Categories management
- `client/pages/admin/ProductEdit.tsx` - Product editing
- `client/pages/admin/Settings.tsx` - Site settings

## SEO Impact

- Better control over search engine crawling
- Canonical URLs prevent duplicate content issues
- Proper robots directives improve site SEO health
- Granular control over page indexing
