import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * FaviconManager component that dynamically updates the favicon
 * based on the favicon_url setting from the database
 */
export default function FaviconManager() {
  const [faviconUrl, setFaviconUrl] = useState<string>("");

  useEffect(() => {
    fetchFaviconUrl();
  }, []);

  const fetchFaviconUrl = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "favicon_url")
        .single();

      if (data && data.value && data.value.trim()) {
        const newFaviconUrl = data.value.trim();
        setFaviconUrl(newFaviconUrl);
        updateFavicon(newFaviconUrl);
      }
    } catch (error) {
      console.error("Error fetching favicon URL:", error);
    }
  };

  const updateFavicon = (url: string) => {
    // Add cache-busting parameter to ensure favicon updates immediately
    const cacheBustUrl = `${url}?v=${Date.now()}`;

    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Create new favicon links for different sizes and types
    const faviconSizes = [
      { rel: "icon", type: "image/x-icon", href: cacheBustUrl },
      { rel: "icon", type: "image/png", sizes: "16x16", href: url },
      { rel: "icon", type: "image/png", sizes: "32x32", href: url },
      { rel: "icon", type: "image/png", sizes: "48x48", href: url },
      { rel: "icon", type: "image/png", sizes: "64x64", href: url },
      { rel: "apple-touch-icon", sizes: "180x180", href: url },
      { rel: "apple-touch-icon", sizes: "152x152", href: url },
      { rel: "apple-touch-icon", sizes: "144x144", href: url },
      { rel: "apple-touch-icon", sizes: "120x120", href: url },
      { rel: "apple-touch-icon", sizes: "114x114", href: url },
      { rel: "apple-touch-icon", sizes: "76x76", href: url },
      { rel: "apple-touch-icon", sizes: "72x72", href: url },
      { rel: "apple-touch-icon", sizes: "60x60", href: url },
      { rel: "apple-touch-icon", sizes: "57x57", href: url },
    ];

    // Add new favicon links
    faviconSizes.forEach(favicon => {
      const link = document.createElement("link");
      link.rel = favicon.rel;
      link.type = favicon.type || "";
      if (favicon.sizes) link.setAttribute("sizes", favicon.sizes);
      link.href = favicon.href;
      document.head.appendChild(link);
    });

    console.log("✅ Favicon updated to:", url);
  };

  // Listen for real-time updates to the favicon setting
  useEffect(() => {
    const subscription = supabase
      .channel("favicon_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_settings",
          filter: "key=eq.favicon_url",
        },
        (payload) => {
          console.log("Favicon setting updated:", payload);
          if (payload.new && payload.new.value && payload.new.value.trim()) {
            const newUrl = payload.new.value.trim();
            setFaviconUrl(newUrl);
            updateFavicon(newUrl);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // This component doesn't render anything, it just manages the favicon
  return null;
}
