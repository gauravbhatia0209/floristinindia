import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

function extractOccasions(name: string, description: string = ""): string[] {
  const text = `${name} ${description}`.toLowerCase();
  const occasions: string[] = [];

  const occasionKeywords = {
    birthday: ["birthday", "bday", "celebration"],
    anniversary: ["anniversary", "years", "together"],
    wedding: ["wedding", "marriage", "bride", "groom"],
    valentines: ["valentine", "love", "romance"],
    mothers_day: ["mother", "mom", "mummy"],
    fathers_day: ["father", "dad", "daddy"],
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
  const seasons: string[] = [];

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
  const targets: string[] = [];

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

// AI-readable products endpoint
router.get("/products", async (req, res) => {
  try {
    // Fetch current site settings for context
    const { data: settings } = await supabase.from("site_settings").select("*");
    const settingsMap: { [key: string]: any } = {};
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
          occasions: extractOccasions(product.name, product.description),
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
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
