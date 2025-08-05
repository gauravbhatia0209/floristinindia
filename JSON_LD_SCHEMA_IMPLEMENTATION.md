# Server-Side JSON-LD Schema Implementation

## Overview

This implementation adds comprehensive server-side rendered JSON-LD structured data for SEO optimization, including LocalBusiness, BreadcrumbList, and Product schemas that pull values from the Site Settings model.

## Features Implemented

### 🏢 **LocalBusiness Schema (Site-wide)**
- **Rendered on**: All pages
- **Purpose**: Enhances Google My Business integration and local SEO
- **Data Source**: Site Settings (businessName, phone, address, etc.)

### 🍞 **BreadcrumbList Schema (All Pages)**
- **Rendered on**: All templated pages
- **Purpose**: Improves navigation understanding for search engines
- **Dynamic**: Auto-generates based on URL structure and page titles

### 🛍️ **Product Schema (Product Pages)**
- **Rendered on**: Individual product pages (`/product/[slug]`)
- **Purpose**: Rich product snippets in search results
- **Data Source**: Product database + Site Settings

### 🌐 **Website Schema (Homepage)**
- **Rendered on**: Homepage only
- **Purpose**: Defines the website entity and search functionality
- **Includes**: Site search action markup

## Schema Data Sources

### Site Settings Integration
All schemas pull data from the Site Settings singleton model:

```typescript
interface SiteSettings {
  // Business Identity
  businessName: string;        // Used in LocalBusiness.name
  site_name: string;          // Fallback for business name
  site_description: string;   // Used in descriptions

  // Contact Information  
  phone: string;              // LocalBusiness.telephone
  contact_email: string;      // LocalBusiness.email

  // Address Information
  streetAddress: string;      // PostalAddress.streetAddress
  locality: string;           // PostalAddress.addressLocality
  region: string;             // PostalAddress.addressRegion
  postalCode: string;         // PostalAddress.postalCode
  countryCode: string;        // PostalAddress.addressCountry

  // Business Operations
  openingHours: string;       // LocalBusiness.openingHours (Schema.org format)
  serviceArea: string;        // LocalBusiness.areaServed

  // Online Presence
  facebook_url: string;       // sameAs array
  instagram_url: string;      // sameAs array
  twitter_url: string;        // sameAs array
  youtube_url: string;        // sameAs array
  logo_url: string;           // LocalBusiness.logo
}
```

## Generated Schema Examples

### 1. LocalBusiness Schema
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://floristinindia.com#business",
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
  "areaServed": [
    {"@type": "City", "name": "Mumbai"},
    {"@type": "City", "name": "Delhi"},
    {"@type": "City", "name": "Bangalore"}
  ],
  "sameAs": [
    "https://facebook.com/floristinindia",
    "https://instagram.com/floristinindia"
  ],
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": ["Cash", "Credit Card", "UPI", "Net Banking"],
  "serviceType": "Flower Delivery Service"
}
```

### 2. BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://floristinindia.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Categories",
      "item": "https://floristinindia.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Birthday Flowers",
      "item": "https://floristinindia.com/category/birthday-flowers"
    }
  ]
}
```

### 3. Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://floristinindia.com/product/red-roses-bouquet#product",
  "name": "Premium Red Roses Bouquet",
  "description": "Beautiful red roses bouquet with 12 fresh stems...",
  "image": ["https://floristinindia.com/uploads/products/roses1.jpg"],
  "sku": "RRB-001",
  "brand": {
    "@type": "Brand",
    "name": "Florist in India"
  },
  "offers": {
    "@type": "Offer",
    "price": 1299,
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Florist in India"
    },
    "url": "https://floristinindia.com/product/red-roses-bouquet"
  },
  "category": "Flowers",
  "inStock": true
}
```

## Implementation Architecture

### Server-Side Generation
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   URL Request   │───▶│  Meta Generator  │───▶│  Schema Builder │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                    ┌──────────────────┐    ┌─────────────────┐
                    │  Site Settings   │    │   HTML Output   │
                    │    Database      │    │  with JSON-LD   │
                    └──────────────────┘    └─────────────────┘
```

### File Structure
```
server/
├── lib/
│   └── schema-generator.ts     # Schema generation functions
├── routes/
│   └── meta.ts                # Enhanced meta generation with schemas
└── views/
    └── index.html             # HTML template with schema placeholders

Generated schemas appear in:
- Homepage: LocalBusiness + Website
- Category pages: LocalBusiness + BreadcrumbList  
- Product pages: LocalBusiness + BreadcrumbList + Product
- Static pages: LocalBusiness + BreadcrumbList
```

## SEO Benefits

### 🎯 **Rich Search Results**
- **Product Rich Snippets**: Price, availability, reviews in search results
- **Business Information**: Contact details, hours, location in Google
- **Breadcrumb Navigation**: Enhanced search result navigation
- **Local SEO**: Improved Google My Business integration

### 📊 **Search Engine Understanding**
- **Entity Recognition**: Clear business and product entities
- **Relationship Mapping**: How pages connect to each other
- **Content Context**: What type of business and products you offer
- **Geographic Relevance**: Local search optimization

### 🔍 **Google Features**
- **Knowledge Graph**: Business appears in knowledge panels
- **Local Pack**: Better local search visibility
- **Shopping Results**: Products can appear in Google Shopping
- **Voice Search**: Better voice query understanding

## Admin Panel Integration

### Updating Schema Data
Admins can update schema data through:

1. **Site Settings** (`/admin/settings`)
   - Business Info tab: Name, phone, address
   - Meta Tags tab: Descriptions and images
   - Contact tab: Social media links

2. **Product Management** (`/admin/products`)
   - Product details automatically include in schema
   - Meta fields override defaults in schema

3. **Category Management** (`/admin/categories`)
   - Category titles used in breadcrumbs
   - Meta descriptions enhance context

### Real-Time Updates
- ✅ **Automatic Cache Clearing**: Schema updates when admin saves changes
- ✅ **Immediate Propagation**: New data appears on next page load
- ✅ **Fallback Values**: Graceful handling of empty fields

## Testing & Validation

### Schema Validation Tools
```bash
# Google's Rich Results Test
https://search.google.com/test/rich-results

# Schema.org Validator  
https://validator.schema.org/

# Testing URLs
https://yoursite.com/                    # LocalBusiness + Website
https://yoursite.com/category/roses      # LocalBusiness + BreadcrumbList
https://yoursite.com/product/red-roses   # All three schemas
```

### Verification Steps
1. **View Source**: Check for `<script type="application/ld+json">` tags
2. **Google Search Console**: Monitor rich result performance
3. **Rich Results Test**: Validate schema markup
4. **Local SEO Tools**: Check business information accuracy

## Schema Customization

### Adding New Schema Types
```typescript
// In server/lib/schema-generator.ts
export function generateEventSchema(event: any, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    // ... event properties
  };
}
```

### Extending Existing Schemas
```typescript
// Add more properties to LocalBusiness
const schema = {
  // ... existing properties
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Flower Catalog",
    "itemListElement": [
      // ... catalog items
    ]
  }
};
```

## Performance Considerations

### Caching Strategy
- ✅ **5-minute cache** for meta data and schemas
- ✅ **Automatic invalidation** when admin makes changes
- ✅ **Efficient database queries** with selective field fetching

### Optimization
- ✅ **Minimal database calls** through smart caching
- ✅ **Compressed schema output** by removing undefined properties
- ✅ **Conditional generation** only when data is available

This comprehensive JSON-LD implementation provides rich structured data that enhances search engine understanding, improves local SEO, and enables rich search result features while maintaining full admin control through the Site Settings interface.
