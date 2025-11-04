import express from "express";
import { supabase } from "@/server/lib/supabase";

const router = express.Router();

interface DateRange {
  startDate: Date;
  endDate: Date;
}

function getDateRange(rangeType: string): DateRange {
  const endDate = new Date();
  let startDate = new Date();

  switch (rangeType) {
    case "1d":
      startDate.setDate(endDate.getDate() - 1);
      break;
    case "7d":
      startDate.setDate(endDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(endDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(endDate.getDate() - 90);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }

  return { startDate, endDate };
}

router.get("/analytics", async (req, res) => {
  try {
    const { dateRange = "7d" } = req.query;
    const { startDate, endDate } = getDateRange(String(dateRange));

    // Get unique visitors
    const { data: uniqueVisitors, error: visitorError } = await supabase
      .from("visitor_sessions")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (visitorError) {
      console.error("Error fetching visitors:", visitorError);
      return res.status(500).json({ error: "Failed to fetch visitor data" });
    }

    // Get page views
    const { data: pageViewsData, error: pageViewError } = await supabase
      .from("page_views")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (pageViewError) {
      console.error("Error fetching page views:", pageViewError);
      return res.status(500).json({ error: "Failed to fetch page view data" });
    }

    const totalVisitors = new Set(
      uniqueVisitors?.map((v: any) => v.session_id) || []
    ).size;
    const totalPageViews = pageViewsData?.length || 0;

    // Calculate device type distribution
    const deviceTypeCount: { [key: string]: number } = {};
    uniqueVisitors?.forEach((visitor: any) => {
      deviceTypeCount[visitor.device_type] =
        (deviceTypeCount[visitor.device_type] || 0) + 1;
    });

    // Calculate referrer distribution
    const referrerCount: { [key: string]: number } = {};
    uniqueVisitors?.forEach((visitor: any) => {
      const source = visitor.referrer_source || "direct";
      referrerCount[source] = (referrerCount[source] || 0) + 1;
    });

    // Get top pages
    const pageUrlCount: { [key: string]: number } = {};
    pageViewsData?.forEach((view: any) => {
      pageUrlCount[view.page_url] = (pageUrlCount[view.page_url] || 0) + 1;
    });

    const topPages = Object.entries(pageUrlCount)
      .map(([page, count]) => ({ page, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate average time on site
    let totalTimeOnSite = 0;
    let validTimeCount = 0;

    pageViewsData?.forEach((view: any) => {
      if (view.time_on_page > 0) {
        totalTimeOnSite += view.time_on_page;
        validTimeCount++;
      }
    });

    const avgTimeOnSite =
      validTimeCount > 0 ? Math.round(totalTimeOnSite / validTimeCount) : 0;

    // Calculate bounce rate (sessions with only 1 page view)
    const sessionPageCounts: { [key: string]: number } = {};
    pageViewsData?.forEach((view: any) => {
      sessionPageCounts[view.session_id] =
        (sessionPageCounts[view.session_id] || 0) + 1;
    });

    const bouncedSessions = Object.values(sessionPageCounts).filter(
      (count) => count === 1
    ).length;
    const bounceRate =
      totalVisitors > 0 ? Math.round((bouncedSessions / totalVisitors) * 100) : 0;

    // Get devices array
    const devices = Object.entries(deviceTypeCount)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    // Get referrers array
    const referrers = Object.entries(referrerCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      total: totalVisitors,
      unique: totalVisitors,
      pageViews: totalPageViews,
      bounceRate,
      avgTimeOnSite,
      topPages,
      devices,
      referrers,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

router.get("/page-metrics", async (req, res) => {
  try {
    const { dateRange = "7d" } = req.query;
    const { startDate, endDate } = getDateRange(String(dateRange));

    const { data: pageViews, error } = await supabase
      .from("page_views")
      .select("*")
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (error) {
      console.error("Error fetching page metrics:", error);
      return res.status(500).json({ error: "Failed to fetch page metrics" });
    }

    const pageMetrics: {
      [key: string]: { views: number; avgTime: number; bounceCount: number };
    } = {};

    pageViews?.forEach((view: any) => {
      if (!pageMetrics[view.page_url]) {
        pageMetrics[view.page_url] = {
          views: 0,
          avgTime: 0,
          bounceCount: 0,
        };
      }
      pageMetrics[view.page_url].views++;
      pageMetrics[view.page_url].avgTime += view.time_on_page;
      if (view.is_bounce) {
        pageMetrics[view.page_url].bounceCount++;
      }
    });

    const metrics = Object.entries(pageMetrics)
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgTime: Math.round(data.avgTime / data.views),
        bounceRate: Math.round((data.bounceCount / data.views) * 100),
      }))
      .sort((a, b) => b.views - a.views);

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching page metrics:", error);
    res.status(500).json({ error: "Failed to fetch page metrics" });
  }
});

export default router;
