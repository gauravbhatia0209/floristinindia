import { supabase } from "@/lib/supabase";

interface PageViewEvent {
  page_url: string;
  page_title: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
  user_id?: string;
  timestamp: string;
}

interface ProductViewEvent {
  product_id: string;
  product_name: string;
  category_id?: string;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

interface CartEvent {
  product_id: string;
  product_name: string;
  action: "add" | "remove" | "update";
  quantity: number;
  user_id?: string;
  session_id?: string;
  timestamp: string;
}

interface SessionData {
  session_id: string;
  user_id?: string;
  start_time: string;
  end_time?: string;
  page_count: number;
  device_type: string;
  browser: string;
  referrer?: string;
  ip_address?: string;
  location?: string;
}

class AnalyticsTracker {
  private sessionId: string;
  private sessionStartTime: string;
  private pageViews: number = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date().toISOString();
    this.initSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initSession() {
    if (typeof window !== "undefined") {
      // Start session tracking
      this.trackSession();

      // Track page unload
      window.addEventListener("beforeunload", () => {
        this.endSession();
      });
    }
  }

  private async trackSession() {
    try {
      const sessionData: SessionData = {
        session_id: this.sessionId,
        start_time: this.sessionStartTime,
        page_count: 0,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        referrer: document.referrer || undefined,
      };

      // Note: This would require creating an analytics_sessions table
      // await supabase.from("analytics_sessions").insert(sessionData);
      console.log("Session started:", sessionData);
    } catch (error) {
      console.error("Failed to track session:", error);
    }
  }

  private async endSession() {
    try {
      const endTime = new Date().toISOString();

      // Note: This would require updating the analytics_sessions table
      // await supabase
      //   .from("analytics_sessions")
      //   .update({
      //     end_time: endTime,
      //     page_count: this.pageViews
      //   })
      //   .eq("session_id", this.sessionId);

      console.log("Session ended:", {
        session_id: this.sessionId,
        end_time: endTime,
        page_count: this.pageViews,
      });
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  }

  public async trackPageView(pageUrl: string, pageTitle: string) {
    try {
      this.pageViews++;

      const pageViewEvent: PageViewEvent = {
        page_url: pageUrl,
        page_title: pageTitle,
        referrer: document.referrer || undefined,
        user_agent: navigator.userAgent,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      // Note: This would require creating an analytics_page_views table
      // await supabase.from("analytics_page_views").insert(pageViewEvent);
      console.log("Page view tracked:", pageViewEvent);
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }

  public async trackProductView(
    productId: string,
    productName: string,
    categoryId?: string,
  ) {
    try {
      const productViewEvent: ProductViewEvent = {
        product_id: productId,
        product_name: productName,
        category_id: categoryId,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      // Note: This would require creating an analytics_product_views table
      // await supabase.from("analytics_product_views").insert(productViewEvent);
      console.log("Product view tracked:", productViewEvent);
    } catch (error) {
      console.error("Failed to track product view:", error);
    }
  }

  public async trackCartEvent(
    productId: string,
    productName: string,
    action: "add" | "remove" | "update",
    quantity: number,
  ) {
    try {
      const cartEvent: CartEvent = {
        product_id: productId,
        product_name: productName,
        action,
        quantity,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
      };

      // Note: This would require creating an analytics_cart_events table
      // await supabase.from("analytics_cart_events").insert(cartEvent);
      console.log("Cart event tracked:", cartEvent);
    } catch (error) {
      console.error("Failed to track cart event:", error);
    }
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet";
    }
    if (
      /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
        userAgent,
      )
    ) {
      return "mobile";
    }
    return "desktop";
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Other";
  }
}

// Create analytics tables SQL
export const analyticsTableSQL = `
-- Analytics Sessions Table
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  page_count INTEGER DEFAULT 0,
  device_type TEXT NOT NULL,
  browser TEXT NOT NULL,
  referrer TEXT,
  ip_address INET,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Page Views Table
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  page_url TEXT NOT NULL,
  page_title TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Product Views Table
CREATE TABLE IF NOT EXISTS analytics_product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Cart Events Table
CREATE TABLE IF NOT EXISTS analytics_cart_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('add', 'remove', 'update')),
  quantity INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp ON analytics_page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_product_views_timestamp ON analytics_product_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_product_views_product_id ON analytics_product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_analytics_cart_events_timestamp ON analytics_cart_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_cart_events_product_id ON analytics_cart_events(product_id);
`;

// Initialize analytics tracker
let analytics: AnalyticsTracker | null = null;

export const initAnalytics = () => {
  if (typeof window !== "undefined" && !analytics) {
    analytics = new AnalyticsTracker();
  }
  return analytics;
};

export const getAnalytics = () => {
  return analytics || initAnalytics();
};

export default AnalyticsTracker;
