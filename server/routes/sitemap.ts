import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

// Generate robots.txt
router.get("/robots.txt", async (req, res) => {
  try {
    // Build canonical URL (www variant)
    const host = req.get("host") || "floristinindia.com";
    const protocol = req.protocol || "https";
    const normalizedHost = host.replace("www.", "");
    const canonicalUrl = `${protocol}://www.${normalizedHost}`;

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
      robotsContent = `# Florist in India - Robots.txt
# SEO-Optimized for Search Engines and AI Crawlers
# Compatible: Google, Bing, Yahoo, DuckDuckGo, OpenAI, Perplexity

User-agent: *
${defaultRobots.includes("noindex") ? "Disallow: /" : "Allow: /"}

# Sitemaps - For search engines and AI crawlers
Sitemap: ${canonicalUrl}/sitemap.xml
Sitemap: ${canonicalUrl}/sitemap.txt

# Crawl Delay
Crawl-delay: 1
Request-rate: 10/1s

# Block sensitive areas
Disallow: /admin/
Disallow: /api/
Disallow: /uploads/temp/
Disallow: /*?*

# Allow specific API endpoints for AI crawlers
Allow: /api/ai/
Allow: /api/sitemap
Allow: /api/meta

# Allow search engine crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 0

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 0

# AI Crawlers
User-agent: GPTBot
Allow: /
Crawl-delay: 0

User-agent: CCBot
Allow: /
Crawl-delay: 0

User-agent: Claude-Web
Allow: /
Crawl-delay: 0`;
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

    // Fetch active pages only (pages table uses is_active, not status field)
    const { data: pages } = await supabase
      .from("pages")
      .select("slug, updated_at")
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
    const totalUrls =
      1 +
      (products?.length || 0) +
      (categories?.length || 0) +
      (pages?.length || 0) +
      7;

    // If too many URLs, generate sitemap index instead
    if (totalUrls > 50000) {
      return generateSitemapIndex(
        res,
        baseUrl,
        products?.length || 0,
        categories?.length || 0,
        pages?.length || 0,
      );
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
          ? new Date(page.updated_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
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
          ? new Date(category.updated_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
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
          ? new Date(product.updated_at).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
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
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
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
async function generateSitemapIndex(
  res: any,
  baseUrl: string,
  productCount: number,
  categoryCount: number,
  pageCount: number,
) {
  const normalizedHost = baseUrl.replace(/^https?:\/\/(www\.)?/, "");
  const protocol = baseUrl.split("://")[0];
  const canonicalUrl = `${protocol}://www.${normalizedHost}`;

  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${canonicalUrl}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
`;

  // Add sitemap indexes for products if many
  if (productCount > 10000) {
    const productSitemaps = Math.ceil(productCount / 10000);
    for (let i = 1; i <= productSitemaps; i++) {
      sitemapIndex += `  <sitemap>
    <loc>${canonicalUrl}/sitemap-products-${i}.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
`;
    }
  } else if (productCount > 0) {
    sitemapIndex += `  <sitemap>
    <loc>${canonicalUrl}/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </sitemap>
`;
  }

  sitemapIndex += `</sitemapindex>`;

  res.setHeader("Content-Type", "application/xml; charset=UTF-8");
  res.send(sitemapIndex);
}

// Generate HTML sitemap for user-friendly browsing
router.get("/sitemap", async (req, res) => {
  try {
    const host = req.get("host") || "floristinindia.com";
    const protocol = req.protocol || "https";
    const normalizedHost = host.replace("www.", "");
    const canonicalUrl = `${protocol}://www.${normalizedHost}`;

    // Fetch active products
    const { data: products } = await supabase
      .from("products")
      .select("slug, name")
      .eq("is_active", true)
      .order("name", { ascending: true });

    // Fetch active categories
    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug, name")
      .eq("is_active", true)
      .order("name", { ascending: true });

    // Fetch published pages
    const { data: pages } = await supabase
      .from("pages")
      .select("slug, title")
      .eq("status", "published")
      .eq("is_active", true)
      .order("title", { ascending: true });

    const currentYear = new Date().getFullYear();

    const htmlSitemap = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap | Florist in India</title>
    <meta name="description" content="Complete sitemap of Florist in India - Browse all products, categories, and pages">
    <meta name="robots" content="index, follow">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.1em;
            opacity: 0.95;
        }
        main {
            padding: 40px;
        }
        .sitemap-section {
            margin-bottom: 50px;
        }
        .sitemap-section h2 {
            font-size: 1.8em;
            color: #667eea;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #667eea;
        }
        .sitemap-section ul {
            list-style: none;
        }
        .sitemap-section li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .sitemap-section li:last-child {
            border-bottom: none;
        }
        .sitemap-section a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
            display: inline-flex;
            align-items: center;
        }
        .sitemap-section a:hover {
            color: #764ba2;
            text-decoration: underline;
        }
        .sitemap-section a::before {
            content: "→";
            margin-right: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .sitemap-section a:hover::before {
            opacity: 1;
        }
        .count {
            display: inline-block;
            background: #f0f0f0;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
            margin-left: 10px;
            color: #666;
        }
        footer {
            background: #f8f9fa;
            padding: 20px 40px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #eee;
        }
        .xml-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            text-decoration: none;
            margin-top: 20px;
            margin-bottom: 30px;
            font-weight: 500;
            transition: background 0.3s ease;
        }
        .xml-link:hover {
            background: #764ba2;
        }
        @media (max-width: 768px) {
            header h1 {
                font-size: 1.8em;
            }
            main {
                padding: 20px;
            }
            .sitemap-section h2 {
                font-size: 1.3em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Sitemap</h1>
            <p>Complete directory of Florist in India</p>
        </header>
        <main>
            <a href="${canonicalUrl}/sitemap.xml" class="xml-link" target="_blank">📄 View XML Sitemap</a>

            <!-- Homepage Section -->
            <div class="sitemap-section">
                <h2>Core Pages</h2>
                <ul>
                    <li><a href="${canonicalUrl}/">Home</a></li>
                    <li><a href="${canonicalUrl}/about">About Us</a></li>
                    <li><a href="${canonicalUrl}/contact">Contact Us</a></li>
                    <li><a href="${canonicalUrl}/delivery-info">Delivery Information</a></li>
                </ul>
            </div>

            <!-- Legal Pages Section -->
            <div class="sitemap-section">
                <h2>Legal & Policies</h2>
                <ul>
                    <li><a href="${canonicalUrl}/privacy-policy">Privacy Policy</a></li>
                    <li><a href="${canonicalUrl}/terms-and-conditions">Terms & Conditions</a></li>
                    <li><a href="${canonicalUrl}/refund-policy">Refund Policy</a></li>
                </ul>
            </div>

            ${
              categories && categories.length > 0
                ? `
            <!-- Categories Section -->
            <div class="sitemap-section">
                <h2>Product Categories <span class="count">${categories.length} categories</span></h2>
                <ul>
                    ${categories.map((cat) => `<li><a href="${canonicalUrl}/category/${cat.slug}">${cat.name}</a></li>`).join("\n                    ")}
                </ul>
            </div>
            `
                : ""
            }

            ${
              products && products.length > 0
                ? `
            <!-- Products Section -->
            <div class="sitemap-section">
                <h2>Products <span class="count">${products.length} products</span></h2>
                <ul>
                    ${products.map((prod) => `<li><a href="${canonicalUrl}/product/${prod.slug}">${prod.name}</a></li>`).join("\n                    ")}
                </ul>
            </div>
            `
                : ""
            }

            ${
              pages && pages.length > 0
                ? `
            <!-- Dynamic Pages Section -->
            <div class="sitemap-section">
                <h2>Pages <span class="count">${pages.length} pages</span></h2>
                <ul>
                    ${pages.map((page) => `<li><a href="${canonicalUrl}/pages/${page.slug}">${page.title}</a></li>`).join("\n                    ")}
                </ul>
            </div>
            `
                : ""
            }
        </main>
        <footer>
            <p>&copy; ${currentYear} Florist in India. All rights reserved. | Sitemap updated: ${new Date().toLocaleDateString()}</p>
        </footer>
    </div>
</body>
</html>`;

    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.send(htmlSitemap);
  } catch (error) {
    console.error("Error generating HTML sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Generate text sitemap for simple AI parsing
router.get("/sitemap.txt", async (req, res) => {
  try {
    const host = req.get("host") || "floristinindia.com";
    const protocol = req.protocol || "https";
    const normalizedHost = host.replace("www.", "");
    const canonicalUrl = `${protocol}://www.${normalizedHost}`;

    // Set headers for AI systems
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("X-Content-Source", "real-time-database");
    res.setHeader("X-Admin-Configurable", "true");
    res.setHeader("X-Generated-At", new Date().toISOString());
    res.setHeader("Content-Type", "text/plain; charset=UTF-8");

    // Fetch active products, categories, and published pages
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true)
      .order("slug", { ascending: true });

    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug")
      .eq("is_active", true)
      .order("slug", { ascending: true });

    const { data: pages } = await supabase
      .from("pages")
      .select("slug")
      .eq("status", "published")
      .eq("is_active", true)
      .order("slug", { ascending: true });

    // Fetch additional sitemap URLs from settings
    const { data: settings } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "additional_sitemap_urls")
      .single();

    let content = `# Florist in India - URL Sitemap
# Generated: ${new Date().toISOString()}
# Total URLs: ${1 + (products?.length || 0) + (categories?.length || 0) + (pages?.length || 0) + 7}
# For search engines and AI crawlers

# Core Pages
${canonicalUrl}
${canonicalUrl}/about
${canonicalUrl}/contact
${canonicalUrl}/delivery-info

# Legal & Policies
${canonicalUrl}/privacy-policy
${canonicalUrl}/terms-and-conditions
${canonicalUrl}/refund-policy

`;

    // Add category URLs
    if (categories && categories.length > 0) {
      content += `# Product Categories (${categories.length})\n`;
      categories.forEach((category) => {
        content += `${canonicalUrl}/category/${category.slug}\n`;
      });
      content += "\n";
    }

    // Add product URLs
    if (products && products.length > 0) {
      content += `# Products (${products.length})\n`;
      products.forEach((product) => {
        content += `${canonicalUrl}/product/${product.slug}\n`;
      });
      content += "\n";
    }

    // Add page URLs
    if (pages && pages.length > 0) {
      content += `# Dynamic Pages (${pages.length})\n`;
      pages.forEach((page) => {
        content += `${canonicalUrl}/pages/${page.slug}\n`;
      });
      content += "\n";
    }

    // Add additional admin-configured URLs
    if (settings?.value) {
      const additionalUrls = settings.value
        .split("\n")
        .filter((url) => url.trim());
      if (additionalUrls.length > 0) {
        content += `# Admin Configured URLs\n`;
        additionalUrls.forEach((url) => {
          const cleanUrl = url.trim();
          if (cleanUrl) {
            const fullUrl = cleanUrl.startsWith("http")
              ? cleanUrl
              : `${canonicalUrl}${cleanUrl.startsWith("/") ? "" : "/"}${cleanUrl}`;
            content += `${fullUrl}\n`;
          }
        });
      }
    }

    res.send(content);
  } catch (error) {
    console.error("Error generating text sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Admin API endpoint to verify and get sitemap stats
router.post("/api/sitemap/verify", async (req, res) => {
  try {
    // Verify admin authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.substring(7);
    const { data: session, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !session?.user) {
      return res.status(401).json({ error: "Invalid authentication" });
    }

    // Verify user is admin
    const { data: userData } = await supabase
      .from("sub_users")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (userData?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    // Collect sitemap stats
    const { data: products } = await supabase
      .from("products")
      .select("id")
      .eq("is_active", true);

    const { data: categories } = await supabase
      .from("product_categories")
      .select("id")
      .eq("is_active", true);

    const { data: pages } = await supabase
      .from("pages")
      .select("id")
      .eq("status", "published")
      .eq("is_active", true);

    const stats = {
      timestamp: new Date().toISOString(),
      urls: {
        homepage: 1,
        staticPages: 7, // about, contact, privacy, terms, refund, delivery-info, plus root
        categories: categories?.length || 0,
        products: products?.length || 0,
        dynamicPages: pages?.length || 0,
      },
      totalUrls:
        1 +
        7 +
        (products?.length || 0) +
        (categories?.length || 0) +
        (pages?.length || 0),
      sitemapUrls: {
        xml: "/sitemap.xml",
        html: "/sitemap",
        txt: "/sitemap.txt",
        robots: "/robots.txt",
      },
      status: "active",
      cacheEnabled: true,
      cacheMaxAge: "3600 seconds (1 hour)",
      aiCrawlerSupport: {
        googleBot: true,
        openAiCrawler: true,
        bingBot: true,
        perplexity: true,
        otherAi: true,
      },
      lastGenerated: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: "Sitemap verification successful",
      data: stats,
    });
  } catch (error) {
    console.error("Error verifying sitemap:", error);
    res.status(500).json({
      success: false,
      error: "Failed to verify sitemap",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Admin endpoint to get sitemap configuration
router.get("/api/sitemap/config", async (req, res) => {
  try {
    const { data: settings } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["sitemap_enabled", "additional_sitemap_urls"]);

    const config =
      settings?.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    res.json({
      enabled: config.sitemap_enabled !== "false",
      additionalUrls: config.additional_sitemap_urls
        ? config.additional_sitemap_urls.split("\n").filter((url) => url.trim())
        : [],
      changefreqSettings: {
        homepage: "daily",
        categories: "daily",
        products: "weekly",
        pages: "weekly",
        staticPages: "daily",
      },
      prioritySettings: {
        homepage: 1.0,
        categories: 0.9,
        products: 0.8,
        pages: 0.7,
        staticPages: 0.5,
      },
      aiSupport: {
        jsonLd: true,
        structuredData: true,
        googleBotSupport: true,
        openAiSupport: true,
      },
    });
  } catch (error) {
    console.error("Error getting sitemap config:", error);
    res.status(500).json({ error: "Failed to get configuration" });
  }
});

export default router;
