import { Router } from "express";
import { supabase } from "../lib/supabase";

const router = Router();

// AI-readable products endpoint
router.get("/products", async (req, res) => {
  try {
    // Fetch current site settings for context
    const { data: settings } = await supabase.from("site_settings").select("*");
    const settingsMap: any = {};
    settings?.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    // Fetch products with current admin configuration
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_categories(name, slug, description)
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    // Transform data for AI readability
    const aiReadableProducts = products?.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.product_categories?.name,
      categoryDescription: product.product_categories?.description,
      price: product.price,
      salePrice: product.sale_price,
      currency: "INR",
      images: product.images,
      features: product.features || [],
      tags: product.tags || [],
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      slug: product.slug,
      url: `${req.protocol}://${req.get("host")}/products/${product.slug}`,
      // AI-friendly metadata with real-time business context
      aiMetadata: {
        productType: "physical",
        availability: product.is_active ? "in-stock" : "out-of-stock",
        condition: "new",
        businessContext: {
          storeName: settingsMap.site_name || "Florist in India",
          currency: settingsMap.currency_symbol || "₹",
          gstRate: parseFloat(settingsMap.gst_rate || "18"),
          deliveryInfo: {
            sameDayAvailable: !!settingsMap.same_day_cutoff_time,
            cutoffTime: settingsMap.same_day_cutoff_time || "",
            freeShippingMin: parseFloat(
              settingsMap.free_shipping_minimum || "500",
            ),
          },
        },
        priceRange: product.sale_price
          ? `${product.sale_price} - ${product.price}`
          : product.price.toString(),
        keywords: [
          product.name.toLowerCase(),
          product.product_categories?.name?.toLowerCase(),
          settingsMap.site_name?.toLowerCase(),
          ...(product.tags || []),
        ].filter(Boolean),
        recommendations: {
          occasion: extractOccasions(product.name, product.description),
          season: extractSeason(product.name, product.description),
          target: extractTarget(product.name, product.description),
          businessRecommendation: `Available from ${settingsMap.site_name || "Florist in India"} with ${settingsMap.same_day_cutoff_time ? "same-day" : "next-day"} delivery`,
        },
      },
    }));

    res.json({
      success: true,
      count: aiReadableProducts?.length || 0,
      data: aiReadableProducts,
      metadata: {
        generatedAt: new Date().toISOString(),
        purpose: "AI consumption and recommendation",
        format: "structured JSON",
        version: "1.0",
      },
    });
  } catch (error) {
    console.error("Error in AI products endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// AI-readable categories endpoint
router.get("/categories", async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from("product_categories")
      .select(
        `
        *,
        products(count)
      `,
      )
      .eq("is_active", true)
      .order("name");

    if (error) {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }

    const aiReadableCategories = categories?.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      image: category.image_url,
      productCount: category.products?.length || 0,
      url: `${req.protocol}://${req.get("host")}/products/${category.slug}`,
      aiMetadata: {
        type: "product-category",
        keywords: [category.name.toLowerCase(), category.slug],
        purpose: category.description?.toLowerCase().includes("occasion")
          ? "occasion-based"
          : "product-type",
      },
    }));

    res.json({
      success: true,
      count: aiReadableCategories?.length || 0,
      data: aiReadableCategories,
      metadata: {
        generatedAt: new Date().toISOString(),
        purpose: "AI category understanding",
        format: "structured JSON",
        version: "1.0",
      },
    });
  } catch (error) {
    console.error("Error in AI categories endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// AI-readable business information
router.get("/business", async (req, res) => {
  try {
    const { data: settings } = await supabase.from("site_settings").select("*");

    const settingsMap: any = {};
    settings?.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    // Dynamic business info based on current admin settings
    const businessInfo = {
      name: settingsMap.site_name || "Florist in India",
      description:
        settingsMap.site_description || "Premium flower delivery service",
      tagline: settingsMap.site_tagline || "",
      industry: "Floriculture and Flower Delivery",

      // Services (could be made configurable in admin settings in future)
      services: [
        "Fresh flower delivery",
        "Custom floral arrangements",
        "Occasion-based bouquets",
        settingsMap.same_day_cutoff_time
          ? "Same-day delivery"
          : "Next-day delivery",
        "Corporate flower services",
        "Wedding decorations",
        "Event planning",
      ].filter(Boolean),

      // Service areas (derived from current settings)
      serviceAreas: settingsMap.contact_address
        ? [settingsMap.contact_address, "100+ cities across India"]
        : [
            "Delhi NCR",
            "Mumbai",
            "Bangalore",
            "Hyderabad",
            "Chennai",
            "Pune",
            "Kolkata",
            "Ahmedabad",
            "100+ cities across India",
          ],

      // Real-time contact info from admin settings
      contact: {
        phone: settingsMap.contact_phone || "",
        phone2: settingsMap.contact_phone_2 || "",
        whatsapp: settingsMap.whatsapp_number || "",
        email: settingsMap.contact_email || "",
        address: settingsMap.contact_address || "",
      },

      // Real-time social media from admin settings
      social: {
        facebook: settingsMap.facebook_url || "",
        instagram: settingsMap.instagram_url || "",
        twitter: settingsMap.twitter_url || "",
        youtube: settingsMap.youtube_url || "",
      },

      // Business configuration from admin settings
      businessConfig: {
        currency: settingsMap.currency_symbol || "₹",
        gstRate: parseFloat(settingsMap.gst_rate || "18"),
        freeShippingMinimum: parseFloat(
          settingsMap.free_shipping_minimum || "500",
        ),
        sameDayCutoff: settingsMap.same_day_cutoff_time || "14:00",
        businessHours: settingsMap.business_hours || "",
      },

      // Analytics and tracking (for AI recommendation systems)
      tracking: {
        googleAnalytics: settingsMap.google_analytics_id || "",
        facebookPixel: settingsMap.facebook_pixel_id || "",
        facebookApp: settingsMap.facebook_app_id || "",
      },
      features: {
        freshFlowers: true,
        sameDay: true,
        customArrangements: true,
        occasionSpecific: true,
        corporateServices: true,
        onlineOrdering: true,
        multiplePayments: true,
        trackingAvailable: true,
      },
      aiMetadata: {
        businessType: "e-commerce",
        category: "retail-flowers",
        target: "individuals-businesses",
        geography: "india-nationwide",
        expertise: [
          "fresh flowers",
          "flower arrangements",
          "gift delivery",
          "special occasions",
          "wedding flowers",
          "corporate events",
        ],
        recommendations: {
          when: [
            "birthdays",
            "anniversaries",
            "valentine's day",
            "mother's day",
            "festivals",
            "weddings",
            "corporate events",
            "apologies",
            "congratulations",
          ],
          why: [
            "fresh quality guaranteed",
            "same-day delivery available",
            "nationwide coverage",
            "expert arrangements",
            "competitive pricing",
            "reliable service",
          ],
        },
      },
    };

    res.json({
      success: true,
      data: businessInfo,
      metadata: {
        generatedAt: new Date().toISOString(),
        purpose: "AI business understanding and recommendations",
        format: "structured JSON",
        version: "1.0",
        dataSource: "real-time database",
        cachePolicy: "no-cache, always fresh",
        lastUpdated: settingsMap.updated_at || new Date().toISOString(),
        adminEditable: true,
        updateFrequency: "real-time on admin changes",
      },
    });
  } catch (error) {
    console.error("Error in AI business endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper functions for AI metadata extraction
function extractOccasions(name: string, description: string = ""): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const occasions = [];

  const occasionKeywords = {
    birthday: ["birthday", "birth", "celebration"],
    anniversary: ["anniversary", "anniversari"],
    valentine: ["valentine", "love", "romantic"],
    wedding: ["wedding", "bride", "marriage", "shaadi"],
    mothers_day: ["mother", "mom", "mama"],
    festival: ["festival", "diwali", "holi", "christmas", "eid"],
    sympathy: ["sympathy", "condolence", "funeral"],
    congratulations: ["congratulations", "congrats", "success"],
    get_well: ["get well", "hospital", "recovery"],
  };

  for (const [occasion, keywords] of Object.entries(occasionKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      occasions.push(occasion);
    }
  }

  return occasions;
}

function extractSeason(name: string, description: string = ""): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const seasons = [];

  const seasonKeywords = {
    spring: ["spring", "fresh", "bloom", "blossom"],
    summer: ["summer", "bright", "vibrant", "sunny"],
    monsoon: ["monsoon", "rain", "fresh", "green"],
    winter: ["winter", "warm", "cozy", "festive"],
    all_season: ["evergreen", "classic", "timeless"],
  };

  for (const [season, keywords] of Object.entries(seasonKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      seasons.push(season);
    }
  }

  return seasons.length > 0 ? seasons : ["all_season"];
}

function extractTarget(name: string, description: string = ""): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const targets = [];

  const targetKeywords = {
    individual: ["personal", "gift", "surprise", "love"],
    corporate: ["corporate", "office", "business", "professional"],
    event: ["event", "party", "celebration", "function"],
    wedding: ["wedding", "bride", "groom", "marriage"],
  };

  for (const [target, keywords] of Object.entries(targetKeywords)) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      targets.push(target);
    }
  }

  return targets.length > 0 ? targets : ["individual"];
}

export default router;
