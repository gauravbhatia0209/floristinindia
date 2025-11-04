import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

// Generate robots.txt
router.get("/robots.txt", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Fetch robots.txt content from site settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["robots_txt_content", "defaultRobots"]);

    const settingsMap =
      settings?.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    let robotsContent = settingsMap.robots_txt_content;

    // If no custom robots.txt content, generate default
    if (!robotsContent || robotsContent.trim() === "") {
      const defaultRobots = settingsMap.defaultRobots || "index, follow";
      robotsContent = `User-agent: *
${defaultRobots.includes("noindex") ? "Disallow: /" : "Allow: /"}

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

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
Allow: /api/meta`;
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "public, max-age=86400"); // 24 hours
    res.send(robotsContent);
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    res.status(500).send("Error generating robots.txt");
  }
});

// Generate XML sitemap
router.get("/sitemap.xml", async (req, res) => {
  try {
    // Build base URL handling both domain variants
    const host = req.get("host") || "floristinindia.com";
    const protocol = req.protocol || "https";
    const baseUrl = `${protocol}://${host}`;
    const normalizedHost = host.replace("www.", "");
    const canonicalUrl = `${protocol}://www.${normalizedHost}`;

    // Set cache headers for AI crawlers
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour cache
    res.setHeader("X-Content-Source", "real-time-database");
    res.setHeader("X-Admin-Configurable", "true");
    res.setHeader("X-Generated-At", new Date().toISOString());

    // Fetch active products with latest updates
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    // Fetch active categories with latest updates
    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    // Fetch published pages only
    const { data: pages } = await supabase
      .from("pages")
      .select("slug, updated_at")
      .eq("status", "published")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    // Fetch site settings and additional sitemap URLs
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value, updated_at")
      .in("key", ["additional_sitemap_urls", "sitemap_enabled"])
      .order("updated_at", { ascending: false });

    const settingsMap =
      settings?.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    // Check if sitemap is enabled
    if (settingsMap.sitemap_enabled === "false") {
      return res.status(404).send("Sitemap disabled");
    }

    // Count total URLs for sitemap index decision
    const totalUrls = 1 + (products?.length || 0) + (categories?.length || 0) + (pages?.length || 0) + 7;

    // If too many URLs, generate sitemap index instead
    if (totalUrls > 50000) {
      return generateSitemapIndex(res, baseUrl, products?.length || 0, categories?.length || 0, pages?.length || 0);
    }

    // Generate sitemap XML with SEO-optimized metadata
    const lastSettingsUpdate =
      settings?.[0]?.updated_at || new Date().toISOString();

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<!-- SEO-Optimized Sitemap for Search Engines & AI Crawlers -->
<!-- Compatible: Google, Bing, Yahoo, DuckDuckGo, OpenAI, Perplexity -->
<!-- Last Updated: ${new Date().toISOString()} -->
<!-- Total URLs: ${totalUrls} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Homepage - Daily updates, highest priority -->
  <url>
    <loc>${canonicalUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages - Daily updates, medium-high priority -->
  <url>
    <loc>${canonicalUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${canonicalUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${canonicalUrl}/privacy-policy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${canonicalUrl}/terms-and-conditions</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${canonicalUrl}/refund-policy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>${canonicalUrl}/delivery-info</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

`;

    // Add admin-created dynamic pages (published only)
    if (pages && pages.length > 0) {
      pages.forEach((page) => {
        const lastmod = page.updated_at
          ? new Date(page.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        sitemap += `  <!-- Dynamic Page: ${page.slug} -->
  <url>
    <loc>${canonicalUrl}/pages/${page.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      });
    }

    // Add category pages - Daily updates, high priority
    if (categories && categories.length > 0) {
      categories.forEach((category) => {
        const lastmod = category.updated_at
          ? new Date(category.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        sitemap += `  <!-- Category: ${category.slug} -->
  <url>
    <loc>${canonicalUrl}/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`;
      });
    }

    // Add product pages - Weekly updates, medium priority
    if (products && products.length > 0) {
      products.forEach((product) => {
        const lastmod = product.updated_at
          ? new Date(product.updated_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        sitemap += `  <!-- Product: ${product.slug} -->
  <url>
    <loc>${canonicalUrl}/product/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
    }

    // Add additional admin-configured URLs
    const additionalUrls = settingsMap.additional_sitemap_urls;
    if (additionalUrls && additionalUrls.trim()) {
      const urls = additionalUrls.split("\n").filter((url) => url.trim());
      urls.forEach((url) => {
        const cleanUrl = url.trim();
        if (cleanUrl) {
          const fullUrl = cleanUrl.startsWith("http")
            ? cleanUrl
            : `${canonicalUrl}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
          sitemap += `  <!-- Admin Configured URL -->
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
        }
      });
    }

    sitemap += "</urlset>";

    res.setHeader("Content-Type", "application/xml; charset=UTF-8");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Helper function to generate sitemap index for large sitemaps
async function generateSitemapIndex(res: any, baseUrl: string, productCount: number, categoryCount: number, pageCount: number) {
  const normalizedHost = baseUrl.replace(/^https?:\/\/(www\.)?/, "");
  const protocol = baseUrl.split("://")[0];
  const canonicalUrl = `${protocol}://www.${normalizedHost}`;

  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${canonicalUrl}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
`;

  // Add sitemap indexes for products if many
  if (productCount > 10000) {
    const productSitemaps = Math.ceil(productCount / 10000);
    for (let i = 1; i <= productSitemaps; i++) {
      sitemapIndex += `  <sitemap>
    <loc>${canonicalUrl}/sitemap-products-${i}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
`;
    }
  } else if (productCount > 0) {
    sitemapIndex += `  <sitemap>
    <loc>${canonicalUrl}/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
`;
  }

  sitemapIndex += `</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml; charset=UTF-8");
  res.send(sitemapIndex);
}

// Generate text sitemap for simple AI parsing
router.get("/sitemap.txt", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Set headers for AI systems
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Content-Source", "real-time-database");
    res.setHeader("X-Admin-Configurable", "true");
    res.setHeader("X-Generated-At", new Date().toISOString());

    // Fetch active products, categories, and pages
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true);

    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug")
      .eq("is_active", true);

    const { data: pages } = await supabase
      .from("pages")
      .select("slug")
      .eq("is_active", true);

    // Fetch additional sitemap URLs from settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "additional_sitemap_urls")
      .single();

    let urls = [
      baseUrl,
      `${baseUrl}/about`,
      `${baseUrl}/contact`,
      `${baseUrl}/cart`,
    ];

    // Add page URLs
    if (pages) {
      pages.forEach((page) => {
        urls.push(`${baseUrl}/pages/${page.slug}`);
      });
    }

    // Add category URLs
    if (categories) {
      categories.forEach((category) => {
        urls.push(`${baseUrl}/category/${category.slug}`);
      });
    }

    // Add product URLs
    if (products) {
      products.forEach((product) => {
        urls.push(`${baseUrl}/product/${product.slug}`);
      });
    }

    // Add additional admin-configured URLs
    if (settings?.value) {
      const additionalUrls = settings.value
        .split("\n")
        .filter((url) => url.trim());
      additionalUrls.forEach((url) => {
        const cleanUrl = url.trim();
        if (cleanUrl) {
          const fullUrl = cleanUrl.startsWith("http")
            ? cleanUrl
            : `${baseUrl}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
          urls.push(fullUrl);
        }
      });
    }

    res.setHeader("Content-Type", "text/plain");
    res.send(urls.join("\n"));
  } catch (error) {
    console.error("Error generating text sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
