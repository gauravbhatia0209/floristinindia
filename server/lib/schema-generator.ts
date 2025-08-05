// Schema.org JSON-LD generators for server-side rendering
export interface SiteSettings {
  site_name: string;
  site_description: string;
  businessName: string;
  phone: string;
  contact_email: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCode: string;
  openingHours: string;
  serviceArea: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  logo_url: string;
  defaultOgImage: string;
}

export function generateLocalBusinessSchema(
  siteSettings: Partial<SiteSettings>,
  baseUrl: string
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}#business`,
    name: siteSettings.businessName || siteSettings.site_name || "Florist in India",
    description: siteSettings.site_description || "Premium flower delivery service across India",
    url: baseUrl,
    logo: siteSettings.logo_url ? `${baseUrl}${siteSettings.logo_url}` : undefined,
    image: siteSettings.defaultOgImage ? `${baseUrl}${siteSettings.defaultOgImage}` : undefined,
    telephone: siteSettings.phone || undefined,
    email: siteSettings.contact_email || undefined,
    address: (siteSettings.streetAddress || siteSettings.locality) ? {
      "@type": "PostalAddress",
      streetAddress: siteSettings.streetAddress || undefined,
      addressLocality: siteSettings.locality || undefined,
      addressRegion: siteSettings.region || undefined,
      postalCode: siteSettings.postalCode || undefined,
      addressCountry: siteSettings.countryCode || "IN"
    } : undefined,
    openingHours: siteSettings.openingHours || undefined,
    areaServed: siteSettings.serviceArea 
      ? siteSettings.serviceArea.split(',').map(area => ({
          "@type": "City",
          name: area.trim()
        }))
      : undefined,
    sameAs: [
      siteSettings.facebook_url,
      siteSettings.instagram_url,
      siteSettings.twitter_url,
      siteSettings.youtube_url
    ].filter(Boolean),
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: ["Cash", "Credit Card", "UPI", "Net Banking"],
    serviceType: "Flower Delivery Service"
  };

  // Remove undefined properties
  return JSON.parse(JSON.stringify(schema));
}

export function generateBreadcrumbSchema(
  pathname: string,
  pageTitle: string,
  baseUrl: string
) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl
    }
  ];

  let currentPath = baseUrl;
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    let name = segment;
    
    // Convert segments to readable names
    if (segment === 'category') {
      name = 'Categories';
    } else if (segment === 'product') {
      name = 'Products';
    } else if (segment === 'pages') {
      name = 'Pages';
    } else if (segment === 'about') {
      name = 'About Us';
    } else if (segment === 'contact') {
      name = 'Contact Us';
    } else {
      // Capitalize and replace hyphens with spaces
      name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // For the last item, use the actual page title if provided
    if (index === segments.length - 1 && pageTitle) {
      name = pageTitle;
    }

    breadcrumbs.push({
      "@type": "ListItem",
      position: index + 2,
      name: name,
      item: currentPath
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs
  };
}

export function generateProductSchema(
  product: any,
  baseUrl: string,
  siteSettings: Partial<SiteSettings>
) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/product/${product.slug}#product`,
    name: product.name,
    description: product.description || product.short_description || "",
    image: product.images && product.images.length > 0 
      ? product.images.map((img: string) => `${baseUrl}${img}`)
      : undefined,
    sku: product.sku || undefined,
    brand: {
      "@type": "Brand",
      name: siteSettings.businessName || siteSettings.site_name || "Florist in India"
    },
    offers: {
      "@type": "Offer",
      price: product.sale_price || product.price,
      priceCurrency: "INR",
      availability: product.stock_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteSettings.businessName || siteSettings.site_name || "Florist in India"
      },
      validFrom: new Date().toISOString(),
      url: `${baseUrl}/product/${product.slug}`
    },
    category: product.category_name || "Flowers",
    inStock: product.stock_quantity > 0,
    weight: product.weight ? {
      "@type": "QuantitativeValue",
      value: product.weight,
      unitCode: "GRM"
    } : undefined,
    additionalProperty: product.tags && product.tags.length > 0 ? 
      product.tags.map((tag: string) => ({
        "@type": "PropertyValue",
        name: "tag",
        value: tag
      })) : undefined
  };

  // Add aggregateRating if reviews exist (placeholder for future implementation)
  if (product.average_rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.average_rating,
      reviewCount: product.review_count || 1,
      bestRating: 5,
      worstRating: 1
    };
  }

  // Remove undefined properties
  return JSON.parse(JSON.stringify(schema));
}

export function generateWebsiteSchema(
  siteSettings: Partial<SiteSettings>,
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: siteSettings.site_name || "Florist in India",
    description: siteSettings.site_description || "Premium flower delivery service across India",
    publisher: {
      "@id": `${baseUrl}#business`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}
