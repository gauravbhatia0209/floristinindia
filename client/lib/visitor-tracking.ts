import { supabase } from "./supabase";

interface VisitorTrackingData {
  sessionId: string;
  deviceType: "mobile" | "tablet" | "desktop";
  referrerSource: string;
  userAgent: string;
}

interface PageViewData {
  sessionId: string;
  pageUrl: string;
  pageTitle: string;
  timeOnPage: number;
  isBounce: boolean;
}

class VisitorTracker {
  private sessionId: string = "";
  private deviceType: "mobile" | "tablet" | "desktop" = "desktop";
  private referrerSource: string = "";
  private userAgent: string = "";
  private sessionStartTime: number = Date.now();
  private pageStartTime: number = Date.now();
  private currentPage: string = "";
  private sessionInitialized: boolean = false;

  constructor() {
    this.initializeSession();
    this.setupPageTracking();
  }

  private initializeSession() {
    // Get or create session ID
    let storedSessionId = localStorage.getItem("visitor_session_id");

    if (!storedSessionId) {
      storedSessionId = this.generateSessionId();
      localStorage.setItem("visitor_session_id", storedSessionId);
      this.sessionStartTime = Date.now();
    }

    this.sessionId = storedSessionId;
    this.userAgent = navigator.userAgent;
    this.deviceType = this.detectDeviceType();
    this.referrerSource = this.getReferrerSource();

    // Create or update session in database
    this.createOrUpdateSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectDeviceType(): "mobile" | "tablet" | "desktop" {
    const userAgent = navigator.userAgent.toLowerCase();

    if (
      /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent,
      )
    ) {
      return "mobile";
    } else if (
      /ipad|android|silk|tablet|playbook|bb10|nexus 7|nexus 10/i.test(userAgent)
    ) {
      return "tablet";
    }

    return "desktop";
  }

  private getReferrerSource(): string {
    const referrer = document.referrer;

    if (!referrer) {
      return "direct";
    }

    try {
      const referrerUrl = new URL(referrer);
      const hostname = referrerUrl.hostname;

      if (hostname.includes("google")) {
        return "google";
      } else if (hostname.includes("facebook")) {
        return "facebook";
      } else if (hostname.includes("twitter") || hostname.includes("x.com")) {
        return "twitter";
      } else if (hostname.includes("instagram")) {
        return "instagram";
      } else if (hostname.includes("linkedin")) {
        return "linkedin";
      }

      return hostname;
    } catch {
      return "direct";
    }
  }

  private async createOrUpdateSession() {
    try {
      const { data: existingSession, error: checkError } = await supabase
        .from("visitor_sessions")
        .select("*")
        .eq("session_id", this.sessionId)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error(
          "Error checking session:",
          checkError.message || JSON.stringify(checkError),
        );
        return;
      }

      if (existingSession) {
        // Update last activity
        await supabase
          .from("visitor_sessions")
          .update({ last_activity_at: new Date().toISOString() })
          .eq("session_id", this.sessionId);
      } else {
        // Create new session
        const { error: insertError } = await supabase
          .from("visitor_sessions")
          .insert({
            session_id: this.sessionId,
            device_type: this.deviceType,
            referrer_source: this.referrerSource,
            user_agent: this.userAgent,
          });

        if (insertError) {
          console.error(
            "Error creating session:",
            insertError.message || JSON.stringify(insertError),
          );
        }
      }

      this.sessionInitialized = true;
    } catch (error) {
      console.error("Error initializing session:", error);
    }
  }

  private setupPageTracking() {
    // Track initial page
    this.trackPageView();

    // Track page changes for SPA navigation
    window.addEventListener("popstate", () => {
      this.recordPageTime();
      this.trackPageView();
    });

    // Use MutationObserver to detect route changes in React
    const observeRouteChange = () => {
      const currentUrl = window.location.pathname + window.location.search;

      if (currentUrl !== this.currentPage) {
        if (this.currentPage) {
          this.recordPageTime();
        }
        this.trackPageView();
      }

      requestAnimationFrame(observeRouteChange);
    };

    requestAnimationFrame(observeRouteChange);

    // Record time on page before leaving
    window.addEventListener("beforeunload", () => {
      this.recordPageTime();
    });
  }

  private trackPageView() {
    this.currentPage = window.location.pathname + window.location.search;
    this.pageStartTime = Date.now();

    const pageTitle = document.title || "Unknown Page";

    this.recordPageView({
      sessionId: this.sessionId,
      pageUrl: this.currentPage,
      pageTitle,
      timeOnPage: 0,
      isBounce: false,
    });
  }

  private async recordPageView(data: PageViewData) {
    try {
      if (!this.sessionInitialized) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      const { error } = await supabase.from("page_views").insert({
        session_id: data.sessionId,
        page_url: data.pageUrl,
        page_title: data.pageTitle,
        time_on_page: data.timeOnPage,
        is_bounce: data.isBounce,
      });

      if (error) {
        console.error(
          "Error recording page view:",
          error.message || JSON.stringify(error),
        );
      }
    } catch (error) {
      console.error("Error in recordPageView:", error);
    }
  }

  private async recordPageTime() {
    try {
      const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000);

      // Only record if time on page is meaningful (at least 1 second)
      if (timeOnPage < 1 || !this.currentPage) {
        return;
      }

      // Silently skip if not initialized yet (avoid too many early requests)
      if (!this.sessionInitialized) {
        return;
      }

      try {
        // First fetch the latest page view record for this session and page
        const { data: pageViews, error: fetchError } = await supabase
          .from("page_views")
          .select("id, time_on_page")
          .eq("session_id", this.sessionId)
          .eq("page_url", this.currentPage)
          .order("created_at", { ascending: false })
          .limit(1);

        if (fetchError) {
          console.warn(
            "Warning fetching page view:",
            fetchError.message || "Unknown error",
          );
          return;
        }

        if (!pageViews || pageViews.length === 0) {
          return;
        }

        const pageView = pageViews[0];

        // Only update if time has increased
        if ((pageView.time_on_page || 0) >= timeOnPage) {
          return;
        }

        // Update the latest page view with time on page
        const { error: updateError } = await supabase
          .from("page_views")
          .update({ time_on_page: timeOnPage })
          .eq("id", pageView.id);

        if (updateError) {
          console.warn(
            "Warning updating page time:",
            updateError.message || "Unknown error",
          );
        }
      } catch (innerError) {
        // Silently fail on network errors - don't clutter console
        if (
          innerError instanceof TypeError &&
          innerError.message.includes("fetch")
        ) {
          // Network error - skip silently
          return;
        }
        console.warn("Warning in page time update:", innerError);
      }
    } catch (error) {
      console.warn("Warning in recordPageTime:", error);
    }
  }

  public getSessionInfo() {
    return {
      sessionId: this.sessionId,
      deviceType: this.deviceType,
      referrerSource: this.referrerSource,
    };
  }
}

// Initialize tracker when module loads
let trackerInstance: VisitorTracker | null = null;

export function initializeVisitorTracking() {
  if (!trackerInstance) {
    trackerInstance = new VisitorTracker();
  }
  return trackerInstance;
}

export function getVisitorTracker(): VisitorTracker | null {
  return trackerInstance;
}
