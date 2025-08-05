import { Request, Response } from "express";
import { supabase } from "../lib/supabase.js";
import fs from "fs";
import path from "path";
import {
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateWebsiteSchema,
  SiteSettings
} from "../lib/schema-generator.js";

interface MetaData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  robots?: string;
  structuredData?: any[];
}

// Cache for meta data to reduce database calls
const metaCache = new Map<string, { data: MetaData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", [
        "site_name",
        "site_tagline",
        "site_description",
        "default_meta_title",
        "default_meta_description",
        "defaultMetaTitle",
        "defaultMetaDescription",
        "defaultOgImage",
        "defaultRobots",
        "meta_title",
        "meta_description",
        "og_image_url",
        "businessName",
        "phone",
        "contact_email",
        "streetAddress",
        "locality",
        "region",
        "postalCode",
        "countryCode",
        "openingHours",
        "serviceArea",
        "facebook_url",
        "instagram_url",
        "twitter_url",
        "youtube_url",
        "logo_url",
      ]);

    if (error) {
      console.error("Error fetching site settings:", error);
      return {};
    }

    const settings: Record<string, string> = {};
    data.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    return settings;
  } catch (error) {
    console.error("Error in getSiteSettings:", error);
    return {};
  }
}

async function getPageMeta(slug: string): Promise<MetaData | null> {
  try {
    const { data, error } = await supabase
      .from("pages")
      .select("title, meta_title, meta_description, og_image, robots")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      title: data.meta_title || data.title,
      description: data.meta_description || "",
      ogImage: data.og_image || "",
      robots: data.robots || "",
    };
  } catch (error) {
    console.error("Error fetching page meta:", error);
    return null;
  }
}

async function getCategoryMeta(slug: string): Promise<MetaData | null> {
  try {
    const { data, error } = await supabase
      .from("product_categories")
      .select("name, meta_title, meta_description, og_image, robots")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      title: data.meta_title || data.name,
      description: data.meta_description || "",
      ogImage: data.og_image || "",
      robots: data.robots || "",
    };
  } catch (error) {
    console.error("Error fetching category meta:", error);
    return null;
  }
}

async function getProductMeta(slug: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        name,
        slug,
        description,
        short_description,
        meta_title,
        meta_description,
        og_image,
        robots,
        price,
        sale_price,
        sku,
        stock_quantity,
        images,
        tags,
        weight,
        category_id,
        product_categories(name)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      ...data,
      category_name: (data as any).product_categories?.name
    };
  } catch (error) {
    console.error("Error fetching product meta:", error);
    return null;
  }
}

export async function generateMetaData(pathname: string): Promise<MetaData> {
  const cacheKey = pathname;
  const cached = metaCache.get(cacheKey);

  // Return cached data if valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const siteSettings = await getSiteSettings();
  const siteName = siteSettings.site_name || "Florist in India";
  const siteTagline = siteSettings.site_tagline;

  let metaData: MetaData;

  // Default fallbacks
  const defaultTitle =
    siteSettings.defaultMetaTitle ||
    siteSettings.default_meta_title ||
    siteSettings.meta_title ||
    (siteTagline
      ? `${siteName} - ${siteTagline}`
      : `${siteName} - Fresh Flowers Delivered Daily`);

  const defaultDescription =
    siteSettings.defaultMetaDescription ||
    siteSettings.default_meta_description ||
    siteSettings.meta_description ||
    siteSettings.site_description ||
    "Premium flower delivery service across India. Same-day delivery available in 100+ cities. Fresh flowers for all occasions with 100% freshness guarantee.";

  const defaultOgImage =
    siteSettings.defaultOgImage || siteSettings.og_image_url || "";

  const defaultRobots =
    siteSettings.defaultRobots || "index, follow";

  // Homepage
  if (pathname === "/" || pathname === "") {
    const baseUrl = process.env.VITE_SITE_URL || "https://floristinindia.com";

    metaData = {
      title: defaultTitle,
      description: defaultDescription,
      ogImage: defaultOgImage,
      robots: defaultRobots,
      structuredData: [
        generateLocalBusinessSchema(siteSettings, baseUrl),
        generateWebsiteSchema(siteSettings, baseUrl)
      ]
    };
  }
  // Page routes
  else if (pathname.startsWith("/pages/")) {
    const slug = pathname.replace("/pages/", "");
    const pageMeta = await getPageMeta(slug);

    const baseUrl = process.env.VITE_SITE_URL || "https://floristinindia.com";

    if (pageMeta) {
      const pageTitle = pageMeta.title;
      const finalTitle = pageTitle ? `${pageTitle} | ${siteName}` : defaultTitle;

      metaData = {
        title: finalTitle,
        description: pageMeta.description || defaultDescription,
        ogImage: pageMeta.ogImage || defaultOgImage,
        robots: pageMeta.robots || defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, pageTitle, baseUrl)
        ]
      };
    } else {
      metaData = {
        title: defaultTitle,
        description: defaultDescription,
        ogImage: defaultOgImage,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, "Page", baseUrl)
        ]
      };
    }
  }
  // Category routes
  else if (pathname.startsWith("/category/")) {
    const slug = pathname.replace("/category/", "");
    const categoryMeta = await getCategoryMeta(slug);

    const baseUrl = process.env.VITE_SITE_URL || "https://floristinindia.com";

    if (categoryMeta) {
      const categoryTitle = categoryMeta.title;
      const finalTitle = categoryTitle ? `${categoryTitle} | ${siteName}` : defaultTitle;

      metaData = {
        title: finalTitle,
        description: categoryMeta.description || defaultDescription,
        ogImage: categoryMeta.ogImage || defaultOgImage,
        robots: categoryMeta.robots || defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, categoryTitle, baseUrl)
        ]
      };
    } else {
      metaData = {
        title: defaultTitle,
        description: defaultDescription,
        ogImage: defaultOgImage,
        robots: defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, "Category", baseUrl)
        ]
      };
    }
  }
  // Product routes
  else if (pathname.startsWith("/product/")) {
    const slug = pathname.replace("/product/", "");
    const productMeta = await getProductMeta(slug);

    const baseUrl = process.env.VITE_SITE_URL || "https://floristinindia.com";

    if (productMeta) {
      const productTitle = productMeta.meta_title || productMeta.name;
      const finalTitle = productTitle ? `${productTitle} | ${siteName}` : defaultTitle;

      metaData = {
        title: finalTitle,
        description: productMeta.meta_description || productMeta.short_description || defaultDescription,
        ogImage: productMeta.og_image || defaultOgImage,
        robots: productMeta.robots || defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, productTitle, baseUrl),
          generateProductSchema(productMeta, baseUrl, siteSettings)
        ]
      };
    } else {
      metaData = {
        title: defaultTitle,
        description: defaultDescription,
        ogImage: defaultOgImage,
        robots: defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, "Product", baseUrl)
        ]
      };
    }
  }
  // Static pages
  else {
    const pageMapping: Record<string, { title: string; description: string }> =
      {
        "/about": {
          title: "About Us",
          description:
            "Learn about our commitment to delivering fresh, beautiful flowers across India with same-day delivery service.",
        },
        "/contact": {
          title: "Contact Us",
          description:
            "Get in touch with our flower delivery experts. We're here to help with your floral needs across India.",
        },
        "/cart": {
          title: "Shopping Cart",
          description:
            "Review your selected flowers and complete your order for fresh flower delivery.",
        },
        "/checkout": {
          title: "Checkout",
          description:
            "Complete your flower delivery order with secure payment and same-day delivery options.",
        },
        "/account": {
          title: "My Account",
          description:
            "Manage your flower delivery orders, addresses, and account preferences.",
        },
      };

    const pageInfo = pageMapping[pathname];
    const baseUrl = process.env.VITE_SITE_URL || "https://floristinindia.com";

    if (pageInfo) {
      metaData = {
        title: `${pageInfo.title} | ${siteName}`,
        description: pageInfo.description,
        ogImage: defaultOgImage,
        robots: defaultRobots,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, pageInfo.title, baseUrl)
        ]
      };
    } else {
      metaData = {
        title: defaultTitle,
        description: defaultDescription,
        ogImage: defaultOgImage,
        structuredData: [
          generateLocalBusinessSchema(siteSettings, baseUrl),
          generateBreadcrumbSchema(pathname, "Page", baseUrl)
        ]
      };
    }
  }

  // Set Open Graph data
  metaData.ogTitle = metaData.title;
  metaData.ogDescription = metaData.description;
  metaData.canonical = `${process.env.VITE_SITE_URL || "https://floristinindia.com"}${pathname}`;

  // Cache the result
  metaCache.set(cacheKey, { data: metaData, timestamp: Date.now() });

  return metaData;
}

export function clearMetaCache(pathname?: string) {
  if (pathname) {
    metaCache.delete(pathname);
  } else {
    metaCache.clear();
  }
}

// Middleware function to inject meta tags into HTML
export async function injectMetaTags(
  req: Request,
  res: Response,
  next: Function,
) {
  try {
    // Only process HTML requests
    if (
      !req.path ||
      req.path.startsWith("/api/") ||
      req.path.startsWith("/uploads/")
    ) {
      return next();
    }

    // Get the pathname from the request
    const pathname = req.path === "/" ? "/" : req.path;

    // Generate meta data for this path
    const metaData = await generateMetaData(pathname);

    // Store meta data in res.locals for use in template
    res.locals.metaData = metaData;

    next();
  } catch (error) {
    console.error("Error in meta injection middleware:", error);
    next(); // Continue even if meta injection fails
  }
}

// API endpoint to get meta data (for testing/debugging)
export async function getMetaDataHandler(req: Request, res: Response) {
  try {
    const { pathname } = req.query;

    if (!pathname || typeof pathname !== "string") {
      return res
        .status(400)
        .json({ error: "pathname query parameter is required" });
    }

    const metaData = await generateMetaData(pathname);
    res.json(metaData);
  } catch (error) {
    console.error("Error in getMetaDataHandler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// API endpoint to clear cache
export function clearCacheHandler(req: Request, res: Response) {
  try {
    const { pathname } = req.query;
    clearMetaCache(pathname as string);
    res.json({
      success: true,
      message: pathname ? `Cache cleared for ${pathname}` : "All cache cleared",
    });
  } catch (error) {
    console.error("Error in clearCacheHandler:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
