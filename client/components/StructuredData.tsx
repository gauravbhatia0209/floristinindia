import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface StructuredDataProps {
  type: "website" | "product" | "organization" | "breadcrumb" | "faq";
  data?: any;
}

interface SiteSettings {
  site_name: string;
  site_description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  [key: string]: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: "",
    site_description: "",
    logo_url: "",
    contact_email: "",
    contact_phone: "",
    contact_address: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
  });

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (siteSettings.site_name) {
      updateStructuredData();
    }
  }, [type, data, siteSettings, location.pathname]);

  async function fetchSiteSettings() {
    try {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("*");
      if (settings) {
        const settingsMap: any = {};
        settings.forEach((setting) => {
          settingsMap[setting.key] = setting.value;
        });
        setSiteSettings(settingsMap);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  }

  function updateStructuredData() {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    existingScripts.forEach((script) => {
      if (script.getAttribute("data-component") === "StructuredData") {
        script.remove();
      }
    });

    let structuredData: any = {};

    switch (type) {
      case "website":
        structuredData = generateWebsiteSchema();
        break;
      case "product":
        structuredData = generateProductSchema(data);
        break;
      case "organization":
        structuredData = generateOrganizationSchema();
        break;
      case "breadcrumb":
        structuredData = generateBreadcrumbSchema(data);
        break;
      case "faq":
        structuredData = generateFAQSchema(data);
        break;
    }

    if (structuredData && Object.keys(structuredData).length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-component", "StructuredData");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }

  function generateWebsiteSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteSettings.site_name,
      description: siteSettings.site_description,
      url: window.location.origin,
      logo: siteSettings.logo_url,
      sameAs: [
        siteSettings.facebook_url,
        siteSettings.instagram_url,
        siteSettings.twitter_url,
      ].filter(Boolean),
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${window.location.origin}/products?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      publisher: {
        "@type": "Organization",
        name: siteSettings.site_name,
        logo: {
          "@type": "ImageObject",
          url: siteSettings.logo_url,
        },
      },
    };
  }

  function generateProductSchema(product: any) {
    if (!product) return {};

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images || [],
      sku: product.id,
      mpn: product.id,
      brand: {
        "@type": "Brand",
        name: siteSettings.site_name,
      },
      category: product.category_name,
      offers: {
        "@type": "Offer",
        price: product.sale_price || product.price,
        priceCurrency: "INR",
        availability: product.is_active
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: siteSettings.site_name,
        },
        url: `${window.location.origin}/products/${product.slug}`,
      },
      aggregateRating: product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.review_count || 1,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
      manufacturer: {
        "@type": "Organization",
        name: siteSettings.site_name,
      },
      additionalProperty: product.features
        ? product.features.map((feature: string) => ({
            "@type": "PropertyValue",
            name: "Feature",
            value: feature,
          }))
        : undefined,
    };
  }

  function generateOrganizationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${window.location.origin}#organization`,
      name: siteSettings.site_name,
      description: siteSettings.site_description,
      url: window.location.origin,
      logo: {
        "@type": "ImageObject",
        url: siteSettings.logo_url,
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: siteSettings.contact_phone,
        contactType: "customer service",
        email: siteSettings.contact_email,
        availableLanguage: ["English", "Hindi"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: siteSettings.contact_address,
        addressCountry: "IN",
      },
      sameAs: [
        siteSettings.facebook_url,
        siteSettings.instagram_url,
        siteSettings.twitter_url,
      ].filter(Boolean),
      foundingDate: "2023",
      numberOfEmployees: "10-50",
      industry: "Floriculture",
      keywords:
        "flowers, flower delivery, bouquets, floral arrangements, gifts, occasions",
    };
  }

  function generateBreadcrumbSchema(breadcrumbs: any[]) {
    if (!breadcrumbs || breadcrumbs.length === 0) return {};

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${window.location.origin}${item.url}`,
      })),
    };
  }

  function generateFAQSchema(faqs: any[]) {
    if (!faqs || faqs.length === 0) return {};

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
  }

  return null; // This component doesn't render anything
}

// Hook for managing structured data
export function useStructuredData() {
  const addProductStructuredData = (product: any) => {
    // This will be handled by the StructuredData component
    console.log("Adding product structured data for:", product.name);
  };

  const addBreadcrumbStructuredData = (breadcrumbs: any[]) => {
    console.log("Adding breadcrumb structured data:", breadcrumbs);
  };

  return {
    addProductStructuredData,
    addBreadcrumbStructuredData,
  };
}
