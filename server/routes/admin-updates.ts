import { Router } from "express";
import { supabase } from "../lib/supabase.js";

const router = Router();

// Endpoint to notify AI systems of admin updates
router.post("/notify-update", async (req, res) => {
  try {
    const { type, data, timestamp } = req.body;

    // Log the update for AI systems to track changes
    const updateLog = {
      update_type: type, // 'settings', 'products', 'categories'
      update_data: data,
      timestamp: timestamp || new Date().toISOString(),
      ai_cache_invalidate: true,
    };

    // Store update log in database for AI systems to check
    const { error } = await supabase.from("admin_update_log").insert(updateLog);

    if (error) {
      console.error("Error logging admin update:", error);
    }

    // Return cache invalidation instructions for AI systems
    res.json({
      success: true,
      message: "Admin update logged for AI systems",
      cacheInvalidation: {
        endpoints: [
          "/api/ai/products",
          "/api/ai/categories",
          "/api/ai/business",
          "/sitemap.xml",
          "/sitemap.txt",
        ],
        timestamp: updateLog.timestamp,
        updateType: type,
      },
      instructions: {
        forAI: "Please refresh cached data from the specified endpoints",
        reason: `Admin updated ${type} at ${updateLog.timestamp}`,
        dataFreshness: "real-time",
      },
    });
  } catch (error) {
    console.error("Error in admin update notification:", error);
    res.status(500).json({ error: "Failed to notify admin update" });
  }
});

// Endpoint for AI systems to check for recent updates
router.get("/recent-updates", async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since
      ? new Date(since as string)
      : new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    // Check for recent admin updates
    const { data: recentUpdates, error } = await supabase
      .from("admin_update_log")
      .select("*")
      .gte("timestamp", sinceDate.toISOString())
      .order("timestamp", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch recent updates" });
    }

    // Check site settings last modified
    const { data: settingsUpdate } = await supabase
      .from("site_settings")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);

    // Check products last modified
    const { data: productsUpdate } = await supabase
      .from("products")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);

    // Check categories last modified
    const { data: categoriesUpdate } = await supabase
      .from("product_categories")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);

    res.json({
      success: true,
      hasRecentUpdates: recentUpdates && recentUpdates.length > 0,
      updates: recentUpdates || [],
      lastModified: {
        settings: settingsUpdate?.[0]?.updated_at,
        products: productsUpdate?.[0]?.updated_at,
        categories: categoriesUpdate?.[0]?.updated_at,
      },
      recommendation: {
        forAI:
          recentUpdates && recentUpdates.length > 0
            ? "Cache invalidation recommended - fresh data available"
            : "No recent updates - cached data is current",
        checkAgain: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Check again in 1 hour
      },
      metadata: {
        sinceChecked: sinceDate.toISOString(),
        generatedAt: new Date().toISOString(),
        purpose: "AI cache management",
      },
    });
  } catch (error) {
    console.error("Error checking recent updates:", error);
    res.status(500).json({ error: "Failed to check recent updates" });
  }
});

// Endpoint to get current data freshness status
router.get("/data-freshness", async (req, res) => {
  try {
    // Get last update times for all major data types
    const [settingsResult, productsResult, categoriesResult] =
      await Promise.all([
        supabase
          .from("site_settings")
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase
          .from("products")
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase
          .from("product_categories")
          .select("updated_at")
          .order("updated_at", { ascending: false })
          .limit(1),
      ]);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const freshness = {
      settings: {
        lastUpdate: settingsResult.data?.[0]?.updated_at,
        isFresh: settingsResult.data?.[0]?.updated_at
          ? new Date(settingsResult.data[0].updated_at) > oneHourAgo
          : false,
      },
      products: {
        lastUpdate: productsResult.data?.[0]?.updated_at,
        isFresh: productsResult.data?.[0]?.updated_at
          ? new Date(productsResult.data[0].updated_at) > oneHourAgo
          : false,
      },
      categories: {
        lastUpdate: categoriesResult.data?.[0]?.updated_at,
        isFresh: categoriesResult.data?.[0]?.updated_at
          ? new Date(categoriesResult.data[0].updated_at) > oneHourAgo
          : false,
      },
    };

    res.json({
      success: true,
      dataFreshness: freshness,
      overallStatus: Object.values(freshness).every((item) => item.isFresh)
        ? "fresh"
        : "mixed",
      aiRecommendation: {
        cacheValidity: "1 hour",
        refreshFrequency: "Check every 30 minutes for optimal freshness",
        dataSource: "real-time admin-configurable database",
      },
      metadata: {
        checkedAt: now.toISOString(),
        threshold: "1 hour",
        purpose: "AI data freshness monitoring",
      },
    });
  } catch (error) {
    console.error("Error checking data freshness:", error);
    res.status(500).json({ error: "Failed to check data freshness" });
  }
});

export default router;
