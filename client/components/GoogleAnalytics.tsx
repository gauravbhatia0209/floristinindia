import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface GoogleAnalyticsProps {
  trackingId: string;
}

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics({ trackingId }: GoogleAnalyticsProps) {
  const location = useLocation();

  useEffect(() => {
    if (!trackingId) return;

    // Initialize Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_location: window.location.href,
        page_title: document.title,
      });
    `;
    document.head.appendChild(script2);

    // Cleanup function
    return () => {
      // Remove scripts when component unmounts
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [trackingId]);

  // Track page views on route changes
  useEffect(() => {
    if (!trackingId || !window.gtag) return;

    window.gtag("config", trackingId, {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location.pathname, trackingId]);

  return null; // This component doesn't render anything
}

// Hook for tracking custom events
export function useGoogleAnalytics() {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number,
  ) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackPurchase = (
    transactionId: string,
    value: number,
    items: any[],
  ) => {
    if (window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        value: value,
        currency: "INR",
        items: items,
      });
    }
  };

  const trackAddToCart = (itemId: string, itemName: string, price: number) => {
    if (window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "INR",
        value: price,
        items: [
          {
            item_id: itemId,
            item_name: itemName,
            price: price,
            quantity: 1,
          },
        ],
      });
    }
  };

  return { trackEvent, trackPurchase, trackAddToCart };
}
