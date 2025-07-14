/**
 * Image utilities for handling Supabase Storage URLs and fallbacks
 */
import React from "react";

export interface ImageConfig {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

/**
 * Checks if a URL is a Supabase Storage URL
 */
export function isSupabaseUrl(url: string): boolean {
  return (
    url.includes("supabase.co") && url.includes("/storage/v1/object/public/")
  );
}

/**
 * Checks if a URL is a legacy local upload URL
 */
export function isLegacyUploadUrl(url: string): boolean {
  return url.startsWith("/uploads/");
}

/**
 * Converts legacy upload URLs to proper format for static serving
 */
export function normalizeLegacyUrl(url: string): string {
  if (isLegacyUploadUrl(url)) {
    // Remove leading slash for proper static serving
    return url.startsWith("/uploads/") ? url : `/uploads/${url}`;
  }
  return url;
}

/**
 * Gets the best image URL, preferring Supabase Storage
 */
export function getBestImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's already a Supabase URL, use it directly
  if (isSupabaseUrl(url)) {
    return url;
  }

  // For legacy URLs, normalize them
  if (isLegacyUploadUrl(url)) {
    return normalizeLegacyUrl(url);
  }

  return url;
}

/**
 * Validates if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url) return false;

  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Gets multiple image URLs from various formats
 */
export function getImageUrls(images: any): string[] {
  if (!images) return [];

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.map(getBestImageUrl).filter(Boolean);
      }
    } catch {
      // Not JSON, treat as single URL
      return [getBestImageUrl(images)].filter(Boolean);
    }
  }

  if (Array.isArray(images)) {
    return images.map(getBestImageUrl).filter(Boolean);
  }

  return [];
}

/**
 * React hook for handling image loading with fallbacks
 */
export function useImageWithFallback(src: string, fallback?: string) {
  const [currentSrc, setCurrentSrc] = React.useState(getBestImageUrl(src));
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setCurrentSrc(getBestImageUrl(src));
    setIsError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  return {
    src: currentSrc,
    isError,
    isLoading,
    onError: handleError,
    onLoad: handleLoad,
  };
}

/**
 * Component for displaying images with automatic fallback handling
 */
export interface SmartImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  errorComponent?: React.ReactNode;
}

export function SmartImage({
  src,
  alt,
  fallback = "/placeholder.svg",
  errorComponent,
  onError,
  onLoad,
  ...props
}: SmartImageProps) {
  const imageProps = useImageWithFallback(src, fallback);

  if (imageProps.isError && errorComponent) {
    return errorComponent as React.ReactElement;
  }

  return React.createElement("img", {
    ...props,
    src: imageProps.src,
    alt: alt,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      imageProps.onError();
      onError?.(e);
    },
    onLoad: (e: React.SyntheticEvent<HTMLImageElement>) => {
      imageProps.onLoad();
      onLoad?.(e);
    },
  });
}
