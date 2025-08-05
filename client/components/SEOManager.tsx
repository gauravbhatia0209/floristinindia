import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  site_description?: string;
  defaultMetaTitle?: string;
  defaultMetaDescription?: string;
  default_meta_title?: string;
  default_meta_description?: string;
  meta_title?: string;
  meta_description?: string;
  meta_title_template?: string;
  og_image_url?: string;
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  facebook_app_id?: string;
}

/**
 * SEOManager component that handles global SEO meta tags
 * Updates meta tags based on admin panel settings
 */
export default function SEOManager() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({});
  const location = useLocation();

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    if (Object.keys(siteSettings).length > 0) {
      updateGlobalMetaTags();
    }
  }, [siteSettings, location.pathname]);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", [
          "site_name",
          "site_tagline",
          "site_description",
          "defaultMetaTitle",
          "defaultMetaDescription",
          "default_meta_title",
          "default_meta_description",
          "meta_title",
          "meta_description",
          "meta_title_template",
          "og_image_url",
          "google_analytics_id",
          "facebook_pixel_id",
          "facebook_app_id",
        ]);

      if (data) {
        const settings: SiteSettings = {};
        data.forEach((setting) => {
          if (setting.value && setting.value.trim()) {
            settings[setting.key as keyof SiteSettings] = setting.value.trim();
          }
        });
        setSiteSettings(settings);
        console.log("✅ SEO settings loaded:", settings);
      }
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
    }
  };

  const updateGlobalMetaTags = () => {
    const isHomePage = location.pathname === "/";

    // Update document title based on current page
    let pageTitle = "";

    if (isHomePage) {
      // Homepage: Use admin meta title, or site name + tagline, or fallback
      pageTitle =
        siteSettings.defaultMetaTitle ||
        siteSettings.default_meta_title ||
        siteSettings.meta_title ||
        (siteSettings.site_tagline
          ? `${siteSettings.site_name || "Florist in India"} - ${siteSettings.site_tagline}`
          : `${siteSettings.site_name || "Florist in India"} - Fresh Flowers Delivered Daily`);
    } else {
      // Other pages: Keep existing title if set, or use template
      const currentTitle = document.title;
      if (
        !currentTitle ||
        currentTitle.includes(
          "Florist in India - Fresh Flowers Delivered Daily",
        )
      ) {
        pageTitle = `${siteSettings.site_name || "Florist in India"}`;
      } else {
        // Apply meta title template if available
        if (siteSettings.meta_title_template) {
          const template = siteSettings.meta_title_template;
          pageTitle = template
            .replace("%title%", getPageTitle())
            .replace(
              "%sitename%",
              siteSettings.site_name || "Florist in India",
            );
        }
      }
    }

    if (pageTitle) {
      document.title = pageTitle;
    }

    // Update meta description for homepage
    if (isHomePage) {
      const metaDescription =
        siteSettings.defaultMetaDescription ||
        siteSettings.default_meta_description ||
        siteSettings.meta_description ||
        siteSettings.site_description ||
        "Premium flower delivery service across India. Same-day delivery available in 100+ cities. Fresh flowers for all occasions with 100% freshness guarantee.";

      updateMetaTag("description", metaDescription);
    }

    // Update Open Graph tags
    updateMetaTag("og:title", document.title, "property");
    updateMetaTag(
      "og:site_name",
      siteSettings.site_name || "Florist in India",
      "property",
    );
    updateMetaTag("og:url", window.location.href, "property");

    if (siteSettings.og_image_url) {
      updateMetaTag("og:image", siteSettings.og_image_url, "property");
    }

    // Update Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image", "name");
    updateMetaTag("twitter:title", document.title, "name");

    if (
      isHomePage &&
      (siteSettings.default_meta_description || siteSettings.site_description)
    ) {
      updateMetaTag(
        "twitter:description",
        siteSettings.default_meta_description ||
          siteSettings.site_description ||
          "",
        "name",
      );
    }

    // Facebook App ID
    if (siteSettings.facebook_app_id) {
      updateMetaTag("fb:app_id", siteSettings.facebook_app_id, "property");
    }

    console.log("✅ Global SEO meta tags updated");
  };

  const getPageTitle = () => {
    // Extract page title from current pathname
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/products") return "Products";
    if (path === "/about") return "About Us";
    if (path === "/contact") return "Contact";
    if (path.startsWith("/product/")) return "Product";
    if (path.startsWith("/category/")) return "Category";

    // Convert path to title case
    return path
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
  };

  const updateMetaTag = (
    name: string,
    content: string,
    attributeName = "name",
  ) => {
    if (!content) return;

    // Remove existing meta tag
    const existingTag = document.querySelector(
      `meta[${attributeName}="${name}"]`,
    );
    if (existingTag) {
      existingTag.remove();
    }

    // Create new meta tag
    const metaTag = document.createElement("meta");
    metaTag.setAttribute(attributeName, name);
    metaTag.setAttribute("content", content);
    document.head.appendChild(metaTag);
  };

  // Listen for real-time updates to site settings
  useEffect(() => {
    const subscription = supabase
      .channel("seo_settings_updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "site_settings",
          filter:
            "key=in.(site_name,site_tagline,site_description,default_meta_title,default_meta_description,meta_title,meta_description,meta_title_template,og_image_url)",
        },
        (payload) => {
          console.log("SEO setting updated:", payload);
          fetchSiteSettings(); // Refetch all settings when any SEO setting changes
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // This component doesn't render anything, it just manages SEO
  return null;
}
