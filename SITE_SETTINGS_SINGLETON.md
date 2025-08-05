# Site Settings Singleton Content Model

## Overview

The Site Settings is a singleton content model that centralizes all site-wide configuration including meta tags, business information, and schema markup data. This model provides a structured approach to managing SEO and business data that can be dynamically injected into layouts and meta tags.

## Architecture

### Database Structure
The site settings are stored in the `site_settings` table with a key-value structure:

```sql
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Admin Interface
- **Location**: `/admin/settings` 
- **Component**: `client/pages/admin/Settings.tsx`
- **Layout**: Organized in tabs for better UX

### Data Access
- **Hook**: `client/hooks/useSiteSettings.ts`
- **Component**: `client/components/DynamicMetaTags.tsx`
- **Integration**: Automatic layout integration

## Site Settings Fields

### 1. Site Identity
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `site_name` | text | Website name | "Florist in India" |
| `site_tagline` | text | Short tagline | "Fresh Flowers Delivered Daily" |
| `site_description` | text | Business description | "Premium flower delivery service" |
| `logo_url` | text | Site logo URL | "/uploads/logo.png" |
| `favicon_url` | text | Favicon URL | "/uploads/favicon.ico" |

### 2. Meta Tags & SEO
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `defaultMetaTitle` | text | Default page title | "Florist in India - Fresh Flowers Delivered Daily" |
| `defaultMetaDescription` | text | Default page description | "Premium flower delivery service across India..." |
| `defaultOgImage` | text | Default social image | "/uploads/og-default.jpg" |

### 3. Business Information
| Field | Type | Description | Schema.org Property |
|-------|------|-------------|---------------------|
| `businessName` | text | Official business name | `name` |
| `phone` | text | Primary phone number | `telephone` |
| `contact_email` | text | Business email | `email` |

### 4. Business Address
| Field | Type | Description | Schema.org Property |
|-------|------|-------------|---------------------|
| `streetAddress` | text | Street address | `address.streetAddress` |
| `locality` | text | City/locality | `address.addressLocality` |
| `region` | text | State/region | `address.addressRegion` |
| `postalCode` | text | Postal code | `address.postalCode` |
| `countryCode` | text | Country code | `address.addressCountry` |

### 5. Business Operations
| Field | Type | Description | Schema.org Property |
|-------|------|-------------|---------------------|
| `openingHours` | text | Hours (Schema.org format) | `openingHours` |
| `serviceArea` | text | Service areas | `areaServed` |

## Usage Examples

### 1. Setting Up Site Settings (Admin)

```typescript
// Access admin settings at /admin/settings
// Navigate to "Meta Tags" tab
const settings = {
  defaultMetaTitle: "Florist in India - Fresh Flowers Delivered Daily",
  defaultMetaDescription: "Premium flower delivery service across India. Same-day delivery available in 100+ cities.",
  defaultOgImage: "/uploads/og-default.jpg",
  businessName: "Florist in India Pvt. Ltd.",
  phone: "+91-9876543210",
  streetAddress: "123 Flower Street, Garden District",
  locality: "Mumbai",
  region: "Maharashtra",
  postalCode: "400001",
  countryCode: "IN",
  openingHours: "Mo-Su 08:00-20:00",
  serviceArea: "Mumbai, Delhi, Bangalore, Chennai, Kolkata"
};
```

### 2. Using Settings in Components

```typescript
import { useSiteSettings } from '@/hooks/useSiteSettings';

function MyComponent() {
  const { settings, isLoading, generateMetaTags, generateOrganizationSchema } = useSiteSettings();
  
  if (isLoading) return <div>Loading...</div>;
  
  // Use settings data
  const metaTags = generateMetaTags(
    "Custom Page Title",
    "Custom page description",
    "/custom-image.jpg"
  );
  
  const schema = generateOrganizationSchema();
  
  return (
    <div>
      <h1>{settings.site_name}</h1>
      <p>{settings.site_tagline}</p>
    </div>
  );
}
```

### 3. Automatic Meta Tag Injection

```typescript
// In any page component
import DynamicMetaTags from '@/components/DynamicMetaTags';

function ProductPage() {
  return (
    <div>
      <DynamicMetaTags 
        title="Red Roses Bouquet - Premium Fresh Flowers"
        description="Beautiful red roses bouquet with same-day delivery..."
        image="/uploads/products/red-roses.jpg"
        type="product"
      />
      {/* Page content */}
    </div>
  );
}
```

## Generated Schema.org Output

The system automatically generates structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Florist in India Pvt. Ltd.",
  "description": "Premium flower delivery service across India",
  "url": "https://floristinindia.com",
  "logo": "https://floristinindia.com/uploads/logo.png",
  "telephone": "+91-9876543210",
  "email": "info@floristinindia.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Flower Street, Garden District",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra", 
    "postalCode": "400001",
    "addressCountry": "IN"
  },
  "openingHours": "Mo-Su 08:00-20:00",
  "areaServed": ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"],
  "sameAs": [
    "https://facebook.com/floristinindia",
    "https://instagram.com/floristinindia"
  ]
}
```

## Migration & Setup

### 1. Database Migration
Run the migration script to add structured fields:

```bash
# Execute in Supabase SQL editor
psql -f site-settings-structured-migration.sql
```

### 2. Admin Configuration
1. Navigate to `/admin/settings`
2. Configure "Meta Tags" tab with defaults
3. Fill "Business Info" tab with company details
4. Save settings

### 3. Legacy Field Migration
The system automatically migrates from legacy fields:
- `default_meta_title` → `defaultMetaTitle`
- `default_meta_description` → `defaultMetaDescription`
- `og_image_url` → `defaultOgImage`
- `contact_phone` → `phone`
- `contact_address` → `streetAddress`

## API Integration

### Fetch Settings
```typescript
const { data } = await supabase
  .from('site_settings')
  .select('key, value');
```

### Update Setting
```typescript
await supabase
  .from('site_settings')
  .upsert({
    key: 'defaultMetaTitle',
    value: 'New Title',
    type: 'text',
    description: 'Default meta title'
  }, { onConflict: 'key' });
```

### Cache Management
Settings are cached client-side and automatically cleared when admin makes changes.

## SEO Benefits

### 1. Structured Data
- **Local Business Schema**: Enhanced Google My Business integration
- **Organization Schema**: Better brand recognition
- **Address Schema**: Improved local SEO

### 2. Meta Tag Management
- **Consistent Branding**: Unified meta tags across site
- **Social Media**: Optimized sharing previews
- **Search Engines**: Better click-through rates

### 3. Performance
- **Client-side Caching**: Reduced database queries
- **Lazy Loading**: Settings loaded once per session
- **Cache Invalidation**: Automatic updates when changed

## Best Practices

### 1. Meta Tags
- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Use high-quality OG images (1200×630px)

### 2. Business Information
- Use complete addresses for better local SEO
- Format phone numbers consistently
- Use Schema.org opening hours format

### 3. Performance
- Set up proper caching headers
- Optimize images before uploading
- Monitor Core Web Vitals impact

## Troubleshooting

### Settings Not Loading
1. Check Supabase connection
2. Verify site_settings table exists
3. Check browser console for errors

### Meta Tags Not Updating
1. Clear browser cache
2. Check DynamicMetaTags component mounting
3. Verify settings hook data

### Schema Markup Issues
1. Test with Google's Rich Results Tool
2. Validate JSON-LD syntax
3. Check console for structured data errors

## Future Enhancements

1. **Multi-language Support**: Localized settings per language
2. **A/B Testing**: Test different meta tag variations
3. **Analytics Integration**: Track meta tag performance
4. **AI Suggestions**: Auto-generate optimized meta tags
5. **Bulk Import/Export**: Settings backup and migration tools

This singleton model provides a comprehensive foundation for site-wide configuration management with proper SEO optimization and schema markup support.
