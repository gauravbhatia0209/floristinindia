import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface FacebookPixelProps {
  pixelId: string;
}

// Declare fbq function for TypeScript
declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export default function FacebookPixel({ pixelId }: FacebookPixelProps) {
  const location = useLocation();

  useEffect(() => {
    if (!pixelId) return;

    // Facebook Pixel initialization script
    const script = document.createElement("script");
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
           src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />
    `;
    document.head.appendChild(noscript);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
      document.head.removeChild(noscript);
    };
  }, [pixelId]);

  // Track page views on route changes
  useEffect(() => {
    if (!pixelId || !window.fbq) return;

    window.fbq("track", "PageView");
  }, [location.pathname, pixelId]);

  return null; // This component doesn't render anything
}

// Hook for tracking Facebook Pixel events
export function useFacebookPixel() {
  const trackEvent = (event: string, parameters?: any) => {
    if (window.fbq) {
      window.fbq("track", event, parameters);
    }
  };

  const trackCustomEvent = (event: string, parameters?: any) => {
    if (window.fbq) {
      window.fbq("trackCustom", event, parameters);
    }
  };

  const trackViewContent = (
    contentName: string,
    contentCategory: string,
    value: number,
    currency: string = "INR",
  ) => {
    if (window.fbq) {
      window.fbq("track", "ViewContent", {
        content_name: contentName,
        content_category: contentCategory,
        value: value,
        currency: currency,
      });
    }
  };

  const trackAddToCart = (
    contentName: string,
    contentId: string,
    value: number,
    currency: string = "INR",
  ) => {
    if (window.fbq) {
      window.fbq("track", "AddToCart", {
        content_name: contentName,
        content_ids: [contentId],
        content_type: "product",
        value: value,
        currency: currency,
      });
    }
  };

  const trackPurchase = (
    value: number,
    currency: string = "INR",
    contentIds: string[] = [],
    numItems: number = 1,
  ) => {
    if (window.fbq) {
      window.fbq("track", "Purchase", {
        value: value,
        currency: currency,
        content_ids: contentIds,
        content_type: "product",
        num_items: numItems,
      });
    }
  };

  const trackInitiateCheckout = (
    value: number,
    currency: string = "INR",
    numItems: number = 1,
  ) => {
    if (window.fbq) {
      window.fbq("track", "InitiateCheckout", {
        value: value,
        currency: currency,
        num_items: numItems,
      });
    }
  };

  const trackAddPaymentInfo = () => {
    if (window.fbq) {
      window.fbq("track", "AddPaymentInfo");
    }
  };

  const trackSearch = (searchString: string) => {
    if (window.fbq) {
      window.fbq("track", "Search", {
        search_string: searchString,
      });
    }
  };

  const trackLead = (content?: any) => {
    if (window.fbq) {
      window.fbq("track", "Lead", content);
    }
  };

  const trackContact = () => {
    if (window.fbq) {
      window.fbq("track", "Contact");
    }
  };

  return {
    trackEvent,
    trackCustomEvent,
    trackViewContent,
    trackAddToCart,
    trackPurchase,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackSearch,
    trackLead,
    trackContact,
  };
}
