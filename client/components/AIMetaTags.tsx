import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface AIMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  product?: any;
  category?: any;
  page?: "home" | "products" | "product" | "category" | "about" | "contact";
}

export default function AIMetaTags({
  title,
  description,
  keywords = [],
  product,
  category,
  page = "home",
}: AIMetaTagsProps) {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<any>({});

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (siteSettings.site_name) {
      updateMetaTags();
    }
  }, [
    title,
    description,
    keywords,
    product,
    category,
    page,
    location.pathname,
    siteSettings, // Re-run when admin settings change
  ]);

  // Auto-refresh settings for AI systems when admin might have updated
  useEffect(() => {
    const refreshInterval = setInterval(
      () => {
        fetchSiteSettings();
      },
      10 * 60 * 1000,
    ); // Every 10 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  async function fetchSiteSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const settings: any = {};
        data.forEach((setting) => {
          settings[setting.key] = setting.value;
        });
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  }

  function updateMetaTags() {
    // Generate AI-optimized meta content
    const metaData = generateMetaData();

    // Update document title
    document.title = metaData.title;

    // Update or create meta tags
    updateMetaTag("description", metaData.description);
    updateMetaTag("keywords", metaData.keywords.join(", "));
    updateMetaTag("robots", metaData.robots);
    updateMetaTag("author", siteSettings.site_name);
    updateMetaTag("language", "English, Hindi");

    // AI-specific meta tags
    updateMetaTag("ai:purpose", metaData.aiPurpose);
    updateMetaTag("ai:content-type", metaData.contentType);
    updateMetaTag("ai:category", metaData.category);
    updateMetaTag("ai:target-audience", metaData.targetAudience);
    updateMetaTag("ai:intent", metaData.intent);
    updateMetaTag("ai:context", metaData.context);
    updateMetaTag("ai:data-freshness", "real-time");
    updateMetaTag("ai:admin-configurable", "true");
    updateMetaTag("ai:last-updated", new Date().toISOString());

    // Business-specific meta tags from admin settings
    updateMetaTag("business:industry", "floriculture");
    updateMetaTag("business:type", "e-commerce");
    updateMetaTag(
      "business:service-area",
      siteSettings.contact_address || "India",
    );
    updateMetaTag(
      "business:name",
      siteSettings.site_name || "Florist in India",
    );
    updateMetaTag("business:currency", siteSettings.currency_symbol || "₹");
    updateMetaTag("business:gst-rate", siteSettings.gst_rate || "18");
    updateMetaTag(
      "business:delivery-cutoff",
      siteSettings.same_day_cutoff_time || "",
    );
    updateMetaTag(
      "business:free-shipping-min",
      siteSettings.free_shipping_minimum || "",
    );

    // Open Graph tags for AI systems
    updateMetaTag("og:title", metaData.title, "property");
    updateMetaTag("og:description", metaData.description, "property");
    updateMetaTag("og:type", metaData.ogType, "property");
    updateMetaTag("og:url", window.location.href, "property");
    updateMetaTag("og:site_name", siteSettings.site_name, "property");

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", metaData.title, "name");
    updateMetaTag("twitter:description", metaData.description, "name");

    // AI recommendation tags
    if (product) {
      updateMetaTag("ai:product-id", product.id);
      updateMetaTag("ai:product-category", product.category_name);
      updateMetaTag(
        "ai:price-range",
        `${product.sale_price || product.price}-INR`,
      );
      updateMetaTag(
        "ai:availability",
        product.is_active ? "in-stock" : "out-of-stock",
      );
    }
  }

  function generateMetaData() {
    let metaTitle = title;
    let metaDescription = description;
    let metaKeywords = [...keywords];
    let aiPurpose = "information";
    let contentType = "webpage";
    let ogType = "website";
    let category = "general";
    let targetAudience = "general";
    let intent = "browse";
    let context = "website";

    const siteName = siteSettings.site_name || "Florist in India";
    const baseKeywords = [
      "flowers",
      "flower delivery",
      "bouquets",
      "fresh flowers",
      "online flower shop",
      "india",
    ];

    switch (page) {
      case "home":
        // Use admin settings first, then fallback to defaults
        const adminMetaTitle =
          siteSettings.default_meta_title || siteSettings.meta_title;
        const adminMetaDescription =
          siteSettings.default_meta_description ||
          siteSettings.meta_description;
        const siteTagline = siteSettings.site_tagline;

        metaTitle =
          metaTitle ||
          adminMetaTitle ||
          (siteTagline
            ? `${siteName} - ${siteTagline}`
            : `${siteName} - Premium Fresh Flower Delivery Across India`);

        metaDescription =
          metaDescription ||
          adminMetaDescription ||
          siteSettings.site_description ||
          `Order fresh flowers online for same-day delivery across India. Premium flower arrangements for all occasions with 100% freshness guarantee. Available in 100+ cities.`;
        metaKeywords = [
          ...baseKeywords,
          "same-day delivery",
          "fresh flowers",
          "flower arrangements",
          "occasions",
          "gifts",
        ];
        aiPurpose = "brand-introduction";
        category = "homepage";
        intent = "discover";
        context = "flower-delivery-service";
        break;

      case "products":
        metaTitle = metaTitle || `Flower Collections - ${siteName}`;
        metaDescription =
          metaDescription ||
          `Browse our extensive collection of fresh flowers, bouquets, and arrangements. Perfect for birthdays, anniversaries, weddings, and special occasions.`;
        metaKeywords = [
          ...baseKeywords,
          "flower collections",
          "categories",
          "occasions",
          "birthday flowers",
          "anniversary flowers",
        ];
        aiPurpose = "product-catalog";
        contentType = "product-listing";
        category = "product-catalog";
        intent = "shop";
        context = "flower-shopping";
        break;

      case "product":
        if (product) {
          metaTitle = `${product.name} - Buy Online | ${siteName}`;
          metaDescription = `${product.description || `Beautiful ${product.name} available for online delivery.`} Starting from ₹${product.sale_price || product.price}. Same-day delivery available.`;
          metaKeywords = [
            ...baseKeywords,
            product.name.toLowerCase(),
            product.category_name?.toLowerCase(),
            "buy online",
            "delivery",
          ];
          aiPurpose = "product-purchase";
          contentType = "product-detail";
          ogType = "product";
          category = product.category_name?.toLowerCase() || "flowers";
          targetAudience = "flower-buyers";
          intent = "purchase";
          context = `${product.category_name?.toLowerCase()}-flowers`;
        }
        break;

      case "category":
        if (category) {
          const categoryObj =
            typeof category === "string"
              ? { name: category, slug: category, description: "" }
              : category;
          metaTitle = `${categoryObj.name} - ${siteName}`;
          metaDescription = `${categoryObj.description || `Beautiful ${categoryObj.name.toLowerCase()} for all occasions.`} Fresh flowers with same-day delivery across India.`;
          metaKeywords = [
            ...baseKeywords,
            categoryObj.name.toLowerCase(),
            categoryObj.slug,
            "category",
          ];
          aiPurpose = "category-browse";
          contentType = "category-listing";
          const categorySlug = categoryObj.slug;
          intent = "browse-category";
          context = `${categorySlug}-flowers`;
        }
        break;

      case "about":
        metaTitle = metaTitle || `About Us - ${siteName}`;
        metaDescription =
          metaDescription ||
          `Learn about ${siteName}, India's premium flower delivery service. Fresh flowers, expert arrangements, and reliable delivery across 100+ cities.`;
        metaKeywords = [
          ...baseKeywords,
          "about us",
          "flower company",
          "fresh flowers",
          "delivery service",
        ];
        aiPurpose = "company-information";
        category = "about";
        intent = "learn";
        context = "company-profile";
        break;

      case "contact":
        metaTitle = metaTitle || `Contact Us - ${siteName}`;
        metaDescription =
          metaDescription ||
          `Get in touch with ${siteName} for fresh flower delivery, custom arrangements, and bulk orders. Available 24/7 for your flower delivery needs.`;
        metaKeywords = [
          ...baseKeywords,
          "contact",
          "customer service",
          "flower delivery help",
          "bulk orders",
        ];
        aiPurpose = "contact-information";
        category = "contact";
        intent = "contact";
        context = "customer-service";
        break;
    }

    return {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      aiPurpose,
      contentType,
      ogType,
      category,
      targetAudience,
      intent,
      context,
    };
  }

  function updateMetaTag(
    name: string,
    content: string,
    attribute: "name" | "property" = "name",
  ) {
    if (!content) return;

    let existingTag = document.querySelector(
      `meta[${attribute}="${name}"]`,
    ) as HTMLMetaElement;

    if (existingTag) {
      existingTag.content = content;
    } else {
      const meta = document.createElement("meta");
      meta.setAttribute(attribute, name);
      meta.content = content;
      document.head.appendChild(meta);
    }
  }

  return null; // This component doesn't render anything
}

// Hook for AI-optimized meta management
export function useAIMetaTags() {
  const setPageMeta = (
    title: string,
    description: string,
    keywords: string[] = [],
  ) => {
    console.log("Setting AI-optimized meta tags:", {
      title,
      description,
      keywords,
    });
  };

  const setProductMeta = (product: any) => {
    console.log("Setting product meta for AI:", product.name);
  };

  const setCategoryMeta = (category: any) => {
    console.log("Setting category meta for AI:", category.name);
  };

  return {
    setPageMeta,
    setProductMeta,
    setCategoryMeta,
  };
}
