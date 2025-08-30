import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface FacebookShopMetaProps {
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    sale_price?: number;
    images: string[];
    category_name?: string;
    slug: string;
  };
}

export default function FacebookShopMeta({ product }: FacebookShopMetaProps) {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState<any>({});

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    updateMetaTags();
  }, [product, siteSettings, location.pathname]);

  async function fetchSiteSettings() {
    try {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const settings: any = {};
        data.forEach((setting) => {
          settings[setting.key] = setting.value;
        });
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error("Error fetching site settings:", error);
    }
  }

  function updateMetaTags() {
    // Remove existing Facebook meta tags
    removeExistingMetaTags();

    // Add new meta tags based on current page
    if (product) {
      addProductMetaTags();
    } else {
      addGeneralMetaTags();
    }
  }

  function removeExistingMetaTags() {
    const existingTags = document.querySelectorAll(
      'meta[property^="og:"], meta[property^="fb:"], meta[property^="product:"]',
    );
    existingTags.forEach((tag) => tag.remove());
  }

  function addProductMetaTags() {
    if (!product) return;

    const metaTags = [
      // Open Graph Product Tags
      { property: "og:type", content: "product" },
      { property: "og:title", content: product.name },
      {
        property: "og:description",
        content: product.description
          ? String(product.description)
              .replace(/<[^>]*>/g, " ")
              .replace(/\s+/g, " ")
              .trim()
          : `Buy ${product.name} online`,
      },
      {
        property: "og:url",
        content: `${window.location.origin}/products/${product.slug}`,
      },
      { property: "og:site_name", content: siteSettings.site_name || "Shop" },

      // Product specific tags
      {
        property: "product:price:amount",
        content: (product.sale_price || product.price).toString(),
      },
      { property: "product:price:currency", content: "INR" },
      { property: "product:availability", content: "in stock" },
      { property: "product:condition", content: "new" },
      { property: "product:retailer_item_id", content: product.id },

      // Facebook App ID (if available)
      ...(siteSettings.facebook_app_id
        ? [{ property: "fb:app_id", content: siteSettings.facebook_app_id }]
        : []),
    ];

    // Add product images
    if (product.images && product.images.length > 0) {
      product.images.slice(0, 4).forEach((image) => {
        metaTags.push({ property: "og:image", content: image });
      });
    }

    // Add category if available
    if (product.category_name) {
      metaTags.push({
        property: "product:category",
        content: product.category_name,
      });
    }

    // Create and append meta tags
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  }

  function addGeneralMetaTags() {
    const metaTags = [
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: siteSettings.site_name || "Online Shop",
      },
      {
        property: "og:description",
        content:
          siteSettings.site_description || "Premium online shopping experience",
      },
      { property: "og:url", content: window.location.href },
      { property: "og:site_name", content: siteSettings.site_name || "Shop" },

      // Facebook App ID (if available)
      ...(siteSettings.facebook_app_id
        ? [{ property: "fb:app_id", content: siteSettings.facebook_app_id }]
        : []),
    ];

    // Add site logo if available
    if (siteSettings.logo_url) {
      metaTags.push({ property: "og:image", content: siteSettings.logo_url });
    }

    // Create and append meta tags
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  }

  return null; // This component doesn't render anything
}

// Facebook Shop Catalog Integration
export function useFacebookShop() {
  const syncProductToFacebook = async (product: any) => {
    // This would typically sync with Facebook Catalog API
    // For now, we'll just ensure proper meta tags are in place
    console.log("Syncing product to Facebook Shop:", product.name);
  };

  const syncCatalogToFacebook = async (products: any[]) => {
    // This would sync entire catalog to Facebook
    console.log(
      "Syncing catalog to Facebook Shop:",
      products.length,
      "products",
    );
  };

  return {
    syncProductToFacebook,
    syncCatalogToFacebook,
  };
}
