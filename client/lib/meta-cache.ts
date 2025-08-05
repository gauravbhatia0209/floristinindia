// Utility functions for managing server-side meta cache

export async function clearMetaCache(pathname?: string) {
  try {
    const response = await fetch('/api/meta/clear-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pathname
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to clear cache: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Meta cache cleared:', result.message);
    return result;
  } catch (error) {
    console.error('Error clearing meta cache:', error);
    throw error;
  }
}

export async function getMetaData(pathname: string) {
  try {
    const response = await fetch(`/api/meta?pathname=${encodeURIComponent(pathname)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get meta data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting meta data:', error);
    throw error;
  }
}

// Hook for clearing cache when admin makes changes
export function useClearMetaCacheOnSave() {
  return {
    clearCacheForPath: (path: string) => clearMetaCache(path),
    clearAllCache: () => clearMetaCache(),
    // Clear cache for specific entity types
    clearCategoryCache: (slug: string) => clearMetaCache(`/category/${slug}`),
    clearProductCache: (slug: string) => clearMetaCache(`/product/${slug}`),
    clearPageCache: (slug: string) => clearMetaCache(`/pages/${slug}`),
    clearHomepageCache: () => clearMetaCache('/'),
  };
}
