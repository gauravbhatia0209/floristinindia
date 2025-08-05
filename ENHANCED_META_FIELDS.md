# Enhanced Meta Fields Implementation

## Overview

This implementation adds `metaTitle`, `metaDescription`, and `ogImage` fields to each page, category, and product model in the admin panel. Admin users can update these directly from the panel, with automatic fallback to values from Site Settings when fields are empty.

## Features Added

### 🏷️ **Categories Admin Enhanced**

- **Meta Title Field**: Custom title for category pages
- **Meta Description Field**: Custom description for category pages
- **OG Image Field**: Custom Open Graph image for social sharing
- **Site Settings Fallbacks**: Shows preview of default values when fields are empty
- **Real-time Validation**: Visual indicators for fallback usage

### 📄 **Pages Admin Enhanced**

- **Meta Title Field**: Custom title for individual pages
- **Meta Description Field**: Custom description for individual pages
- **OG Image Field**: Custom Open Graph image for page sharing
- **Site Settings Integration**: Automatic fallback to global defaults
- **Enhanced SEO Tab**: Organized interface for meta management

### 🛍️ **Products Admin Enhanced**

- **Meta Title Field**: Custom title for product pages
- **Meta Description Field**: Custom description for product pages
- **OG Image Field**: Custom Open Graph image for product sharing
- **Fallback Indicators**: Clear indication when using default values
- **SEO Section**: Dedicated area for meta tag management

## Database Schema Updates

### New Fields Added

```sql
-- Categories table
ALTER TABLE product_categories ADD COLUMN og_image TEXT;

-- Pages table
ALTER TABLE pages ADD COLUMN og_image TEXT;

-- Products table
ALTER TABLE products ADD COLUMN og_image TEXT;
```

### Existing Fields Enhanced

- `meta_title` - Now shows Site Settings fallback
- `meta_description` - Now shows Site Settings fallback
- Server-side rendering updated to use new fallback hierarchy

## Fallback Hierarchy

### 1. Meta Title Fallback Order

```
Page/Category/Product meta_title
↓ (if empty)
Site Settings defaultMetaTitle
↓ (if empty)
Site Settings default_meta_title (legacy)
↓ (if empty)
Site name + tagline
↓ (if empty)
Default hardcoded title
```

### 2. Meta Description Fallback Order

```
Page/Category/Product meta_description
↓ (if empty)
Site Settings defaultMetaDescription
↓ (if empty)
Site Settings default_meta_description (legacy)
↓ (if empty)
Site description
↓ (if empty)
Default hardcoded description
```

### 3. OG Image Fallback Order

```
Page/Category/Product og_image
↓ (if empty)
Site Settings defaultOgImage
↓ (if empty)
Site Settings og_image_url (legacy)
↓ (if empty)
No image (graceful handling)
```

## Admin Panel UI/UX

### Visual Indicators

- **Empty Fields**: Show placeholder text from Site Settings
- **Fallback Preview**: Display "Will use default: [value]" below empty fields
- **Enhanced Labels**: Clear field names with context
- **Upload Interface**: Integrated image upload for OG images

### User Experience

```
1. Admin sees field with smart placeholder from Site Settings
2. If field is empty, preview shows what default will be used
3. Admin can override with custom values
4. Changes automatically clear server-side cache
5. Real-time feedback on what values will be used
```

## Server-Side Integration

### Enhanced Meta Generation

- Updated `getPageMeta()` to include `og_image`
- Updated `getCategoryMeta()` to include `og_image`
- Updated `getProductMeta()` to include `og_image`
- Added support for new Site Settings fields
- Intelligent fallback logic with proper hierarchy

### Cache Management

- Automatic cache clearing when content is updated
- Smart invalidation for related content
- Performance optimized with 5-minute cache TTL

## Usage Examples

### Setting Category Meta Tags

```typescript
// In Categories admin
const categoryData = {
  name: "Birthday Flowers",
  slug: "birthday-flowers",
  meta_title: "Birthday Flowers - Same Day Delivery | Florist in India",
  meta_description:
    "Order beautiful birthday flowers with same-day delivery across India. Premium arrangements perfect for celebrations.",
  og_image: "/uploads/categories/birthday-flowers-og.jpg",
};
```

### Setting Page Meta Tags

```typescript
// In Pages admin
const pageData = {
  title: "About Us",
  slug: "about",
  meta_title: "About Florist in India - Fresh Flower Experts",
  meta_description:
    "Learn about our commitment to delivering fresh, beautiful flowers across India with professional service.",
  og_image: "/uploads/pages/about-us-og.jpg",
};
```

### Setting Product Meta Tags

```typescript
// In Products admin
const productData = {
  name: "Red Roses Bouquet",
  slug: "red-roses-bouquet",
  meta_title: "Premium Red Roses Bouquet - Same Day Delivery",
  meta_description:
    "Beautiful red roses bouquet with 12 fresh stems. Perfect for love, anniversaries, and special occasions.",
  og_image: "/uploads/products/red-roses-og.jpg",
};
```

## Generated Output Examples

### With Custom Values

```html
<title>Birthday Flowers - Same Day Delivery | Florist in India</title>
<meta
  name="description"
  content="Order beautiful birthday flowers with same-day delivery across India. Premium arrangements perfect for celebrations."
/>
<meta
  property="og:image"
  content="https://site.com/uploads/categories/birthday-flowers-og.jpg"
/>
```

### With Site Settings Fallback

```html
<title>Florist in India - Fresh Flowers Delivered Daily</title>
<meta
  name="description"
  content="Premium flower delivery service across India. Same-day delivery available in 100+ cities."
/>
<meta property="og:image" content="https://site.com/uploads/default-og.jpg" />
```

## SEO Benefits

### 🎯 **Targeted Optimization**

- **Page-Specific Meta Tags**: Each page can have unique, optimized meta tags
- **Category-Specific SEO**: Categories get targeted titles and descriptions
- **Product-Specific Marketing**: Products get optimized for search and social

### 📱 **Social Media Ready**

- **Custom OG Images**: Each content type can have specific social sharing images
- **Consistent Fallbacks**: Always have appropriate images for sharing
- **Professional Appearance**: Branded social media previews

### 🔍 **Search Engine Optimization**

- **Unique Titles**: No duplicate title tags across site
- **Relevant Descriptions**: Context-specific meta descriptions
- **Better CTR**: Optimized snippets in search results

## Migration Guide

### 1. Run Database Migration

```bash
# Execute the migration script
psql -f add-og-image-fields-migration.sql
```

### 2. Configure Site Settings

```
1. Go to /admin/settings
2. Navigate to "Meta Tags" tab
3. Set defaultMetaTitle, defaultMetaDescription, defaultOgImage
4. Save settings
```

### 3. Update Content

```
1. Review existing categories, pages, products
2. Add custom meta tags where beneficial
3. Upload specific OG images for key content
4. Test social sharing previews
```

## Testing & Validation

### Meta Tag Testing

```bash
# Test meta generation API
curl "yoursite.com/api/meta?pathname=/category/roses"

# Expected output:
{
  "title": "Roses - Fresh Premium Quality | Florist in India",
  "description": "Beautiful fresh roses with same-day delivery...",
  "ogImage": "/uploads/categories/roses-og.jpg",
  "canonical": "https://yoursite.com/category/roses"
}
```

### Social Media Testing

1. **Facebook Debugger**: Test sharing URLs
2. **Twitter Card Validator**: Verify Twitter previews
3. **LinkedIn Post Inspector**: Check LinkedIn sharing
4. **Manual Testing**: Share actual URLs and verify previews

### SEO Validation

1. **Google Search Console**: Monitor search appearance
2. **Rich Results Test**: Verify structured data
3. **PageSpeed Insights**: Check Core Web Vitals impact
4. **Manual Review**: Check view-source for meta tags

## Best Practices

### 📝 **Content Guidelines**

- **Title Length**: Keep under 60 characters for full display
- **Description Length**: Keep under 160 characters for optimal snippets
- **OG Image Size**: Use 1200×630px for best social media display
- **Unique Content**: Avoid duplicate meta tags across pages

### ⚡ **Performance Optimization**

- **Image Optimization**: Compress OG images before upload
- **Cache Strategy**: Leverage server-side caching for meta data
- **Selective Updates**: Only add custom meta where truly beneficial
- **Monitor Impact**: Track Core Web Vitals after implementation

### 🎨 **User Experience**

- **Consistent Branding**: Maintain brand voice in meta descriptions
- **Action-Oriented**: Use compelling calls-to-action in descriptions
- **Keyword Integration**: Include relevant keywords naturally
- **Local SEO**: Include location terms where appropriate

This enhanced meta fields implementation provides a comprehensive solution for SEO optimization while maintaining ease of use for administrators and optimal performance for end users.
