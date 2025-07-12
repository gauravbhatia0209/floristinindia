import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

// Generate XML sitemap
router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Fetch active products
    const { data: products } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true);

    // Fetch active categories
    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug, updated_at")
      .eq("is_active", true);

    // Generate sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Products page -->
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Static pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- AI data endpoints -->
  <url>
    <loc>${baseUrl}/api/ai/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>${baseUrl}/api/ai/categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${baseUrl}/api/ai/business</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

`;

    // Add category pages
    if (categories) {
      categories.forEach((category) => {
        const lastmod = category.updated_at
          ? new Date(category.updated_at).toISOString()
          : new Date().toISOString();
        sitemap += `  <url>
    <loc>${baseUrl}/products/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      });
    }

    // Add product pages
    if (products) {
      products.forEach((product) => {
        const lastmod = product.updated_at
          ? new Date(product.updated_at).toISOString()
          : new Date().toISOString();
        sitemap += `  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
      });
    }

    sitemap += "</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Generate text sitemap for simple AI parsing
router.get("/sitemap.txt", async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Fetch active products and categories
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true);

    const { data: categories } = await supabase
      .from("product_categories")
      .select("slug")
      .eq("is_active", true);

    let urls = [
      baseUrl,
      `${baseUrl}/products`,
      `${baseUrl}/about`,
      `${baseUrl}/contact`,
      `${baseUrl}/api/ai/products`,
      `${baseUrl}/api/ai/categories`,
      `${baseUrl}/api/ai/business`,
    ];

    // Add category URLs
    if (categories) {
      categories.forEach((category) => {
        urls.push(`${baseUrl}/products/${category.slug}`);
      });
    }

    // Add product URLs
    if (products) {
      products.forEach((product) => {
        urls.push(`${baseUrl}/products/${product.slug}`);
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
