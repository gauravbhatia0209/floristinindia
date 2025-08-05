import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface SiteSettingsData {
  // Site Identity
  site_name: string;
  site_tagline: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;

  // Meta Tags & SEO
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;

  // Business Information
  businessName: string;
  phone: string;
  contact_email: string;

  // Business Address
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  countryCode: string;

  // Business Operations
  openingHours: string;
  serviceArea: string;

  // Social Media
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
}

const defaultSettings: SiteSettingsData = {
  site_name: "Florist in India",
  site_tagline: "Fresh Flowers Delivered Daily",
  site_description: "Premium flower delivery service across India",
  logo_url: "",
  favicon_url: "",
  defaultMetaTitle: "Florist in India - Fresh Flowers Delivered Daily",
  defaultMetaDescription:
    "Premium flower delivery service across India. Same-day delivery available in 100+ cities. Fresh flowers for all occasions with 100% freshness guarantee.",
  defaultOgImage: "",
  businessName: "Florist in India",
  phone: "",
  contact_email: "",
  streetAddress: "",
  locality: "",
  region: "",
  postalCode: "",
  countryCode: "IN",
  openingHours: "",
  serviceArea: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  youtube_url: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsData>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");

      if (error) {
        throw error;
      }

      if (data) {
        const settingsObject: Record<string, string> = {};
        data.forEach((setting) => {
          settingsObject[setting.key] = setting.value;
        });

        // Map database keys to our interface, handling both new and legacy field names
        const mappedSettings: SiteSettingsData = {
          site_name: settingsObject.site_name || defaultSettings.site_name,
          site_tagline:
            settingsObject.site_tagline || defaultSettings.site_tagline,
          site_description:
            settingsObject.site_description || defaultSettings.site_description,
          logo_url: settingsObject.logo_url || defaultSettings.logo_url,
          favicon_url:
            settingsObject.favicon_url || defaultSettings.favicon_url,

          // New structured meta fields with fallbacks to legacy fields
          defaultMetaTitle:
            settingsObject.defaultMetaTitle ||
            settingsObject.default_meta_title ||
            defaultSettings.defaultMetaTitle,
          defaultMetaDescription:
            settingsObject.defaultMetaDescription ||
            settingsObject.default_meta_description ||
            defaultSettings.defaultMetaDescription,
          defaultOgImage:
            settingsObject.defaultOgImage ||
            settingsObject.og_image_url ||
            defaultSettings.defaultOgImage,

          // Business information with fallbacks
          businessName:
            settingsObject.businessName ||
            settingsObject.site_name ||
            defaultSettings.businessName,
          phone:
            settingsObject.phone ||
            settingsObject.contact_phone ||
            defaultSettings.phone,
          contact_email:
            settingsObject.contact_email || defaultSettings.contact_email,

          // Address information
          streetAddress:
            settingsObject.streetAddress ||
            settingsObject.contact_address ||
            defaultSettings.streetAddress,
          locality: settingsObject.locality || defaultSettings.locality,
          region: settingsObject.region || defaultSettings.region,
          postalCode: settingsObject.postalCode || defaultSettings.postalCode,
          countryCode:
            settingsObject.countryCode || defaultSettings.countryCode,

          // Operations
          openingHours:
            settingsObject.openingHours ||
            settingsObject.business_hours ||
            defaultSettings.openingHours,
          serviceArea:
            settingsObject.serviceArea || defaultSettings.serviceArea,

          // Social media
          facebook_url:
            settingsObject.facebook_url || defaultSettings.facebook_url,
          instagram_url:
            settingsObject.instagram_url || defaultSettings.instagram_url,
          twitter_url:
            settingsObject.twitter_url || defaultSettings.twitter_url,
          youtube_url:
            settingsObject.youtube_url || defaultSettings.youtube_url,
        };

        setSettings(mappedSettings);
      }
    } catch (err) {
      console.error("Failed to fetch site settings:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  }

  // Generate structured data for Schema.org
  function generateOrganizationSchema() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: settings.businessName || settings.site_name,
      description: settings.site_description,
      url: window.location.origin,
      logo: settings.logo_url
        ? `${window.location.origin}${settings.logo_url}`
        : undefined,
      image: settings.defaultOgImage
        ? `${window.location.origin}${settings.defaultOgImage}`
        : undefined,
      telephone: settings.phone || undefined,
      email: settings.contact_email || undefined,
      address:
        settings.streetAddress || settings.locality
          ? {
              "@type": "PostalAddress",
              streetAddress: settings.streetAddress || undefined,
              addressLocality: settings.locality || undefined,
              addressRegion: settings.region || undefined,
              postalCode: settings.postalCode || undefined,
              addressCountry: settings.countryCode || "IN",
            }
          : undefined,
      openingHours: settings.openingHours || undefined,
      areaServed: settings.serviceArea
        ? settings.serviceArea.split(",").map((area) => area.trim())
        : undefined,
      sameAs: [
        settings.facebook_url,
        settings.instagram_url,
        settings.twitter_url,
        settings.youtube_url,
      ].filter(Boolean),
    };

    // Remove undefined properties
    return JSON.parse(JSON.stringify(schema));
  }

  // Generate meta tag object for dynamic injection
  function generateMetaTags(
    pageTitle?: string,
    pageDescription?: string,
    pageImage?: string,
  ) {
    return {
      title: pageTitle || settings.defaultMetaTitle,
      description: pageDescription || settings.defaultMetaDescription,
      ogTitle: pageTitle || settings.defaultMetaTitle,
      ogDescription: pageDescription || settings.defaultMetaDescription,
      ogImage: pageImage || settings.defaultOgImage,
      ogUrl: window.location.href,
      twitterCard: "summary_large_image",
      twitterTitle: pageTitle || settings.defaultMetaTitle,
      twitterDescription: pageDescription || settings.defaultMetaDescription,
      twitterImage: pageImage || settings.defaultOgImage,
    };
  }

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
    generateOrganizationSchema,
    generateMetaTags,
  };
}
