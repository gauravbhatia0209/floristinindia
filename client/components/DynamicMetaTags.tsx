import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
}

export default function DynamicMetaTags({
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
}: DynamicMetaTagsProps) {
  const location = useLocation();
  const { settings, generateMetaTags, generateOrganizationSchema } =
    useSiteSettings();

  useEffect(() => {
    console.log("[DYNAMIC META DEBUG] DynamicMetaTags useEffect triggered");
    console.log("[DYNAMIC META DEBUG] Props:", { title, description, image });

    // Only update meta tags when specific props are provided
    // Let SEOManager handle global meta tag management when no props are passed
    if (!title && !description && !image) {
      console.log("[DYNAMIC META DEBUG] No props provided, returning early");
      return;
    }

    console.log("[DYNAMIC META DEBUG] Proceeding with meta tag generation");

    // Generate meta tags with fallbacks
    const metaTags = generateMetaTags(title, description, image);
    const currentUrl = `${window.location.origin}${location.pathname}`;

    // Update document title only if explicitly provided via props
    // Let SEOManager handle global title management when no title prop is passed
    if (title && metaTags.title) {
      console.log(
        "[DYNAMIC META DEBUG] Setting document.title to:",
        metaTags.title,
      );
      document.title = metaTags.title;
    } else {
      console.log(
        "[DYNAMIC META DEBUG] NOT setting document.title - title prop:",
        title,
        "metaTags.title:",
        metaTags.title,
      );
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (
      name: string,
      content: string,
      property?: boolean,
    ) => {
      if (!content) return;

      const attribute = property ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag("description", metaTags.description);
    updateMetaTag("robots", "index, follow");

    // Update Open Graph tags
    updateMetaTag("og:title", metaTags.ogTitle, true);
    updateMetaTag("og:description", metaTags.ogDescription, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:site_name", settings.site_name, true);

    if (metaTags.ogImage) {
      updateMetaTag(
        "og:image",
        metaTags.ogImage.startsWith("http")
          ? metaTags.ogImage
          : `${window.location.origin}${metaTags.ogImage}`,
        true,
      );
      updateMetaTag("og:image:alt", metaTags.ogTitle, true);
    }

    // Update Twitter Card tags
    updateMetaTag("twitter:card", metaTags.twitterCard);
    updateMetaTag("twitter:title", metaTags.twitterTitle);
    updateMetaTag("twitter:description", metaTags.twitterDescription);

    if (metaTags.twitterImage) {
      updateMetaTag(
        "twitter:image",
        metaTags.twitterImage.startsWith("http")
          ? metaTags.twitterImage
          : `${window.location.origin}${metaTags.twitterImage}`,
      );
    }

    // Add article-specific meta tags
    if (type === "article" && publishedTime) {
      updateMetaTag("article:published_time", publishedTime, true);
    }
    if (type === "article" && modifiedTime) {
      updateMetaTag("article:modified_time", modifiedTime, true);
    }

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute("href", currentUrl);
    } else {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      canonicalLink.setAttribute("href", currentUrl);
      document.head.appendChild(canonicalLink);
    }

    // Update or add structured data
    const structuredData = generateOrganizationSchema();
    let structuredDataScript = document.querySelector(
      'script[type="application/ld+json"]',
    );

    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(
        structuredData,
        null,
        2,
      );
    } else {
      structuredDataScript = document.createElement("script");
      structuredDataScript.type = "application/ld+json";
      structuredDataScript.textContent = JSON.stringify(
        structuredData,
        null,
        2,
      );
      document.head.appendChild(structuredDataScript);
    }
  }, [
    title,
    description,
    image,
    type,
    publishedTime,
    modifiedTime,
    location.pathname,
    settings,
  ]);

  return null; // This component doesn't render anything visible
}
