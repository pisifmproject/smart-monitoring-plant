// frontend/src/composables/useCachedData.ts
import { ref, Ref } from "vue";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

/**
 * Composable for managing cached data with automatic expiration
 * This helps reduce unnecessary API calls and improves loading performance
 */
export function useCachedData<T>(cacheKey: string, ttl: number = 30000) {
  const cache = new Map<string, CacheEntry<T>>();
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Fetch data with caching support
   * @param fetcher - Function that fetches the data
   * @param forceRefresh - Force refresh even if cached data exists
   */
  async function fetchData(
    fetcher: () => Promise<T>,
    forceRefresh: boolean = false
  ): Promise<T | null> {
    const now = Date.now();
    const cached = cache.get(cacheKey);

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && now - cached.timestamp < cached.expiresIn) {
      data.value = cached.data;
      return cached.data;
    }

    // Fetch fresh data
    loading.value = true;
    error.value = null;

    try {
      const result = await fetcher();
      data.value = result;

      // Update cache
      cache.set(cacheKey, {
        data: result,
        timestamp: now,
        expiresIn: ttl,
      });

      return result;
    } catch (err) {
      error.value = err as Error;
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clear cached data for this key
   */
  function clearCache() {
    cache.delete(cacheKey);
    data.value = null;
  }

  /**
   * Clear all cached data
   */
  function clearAllCache() {
    cache.clear();
  }

  return {
    data,
    loading,
    error,
    fetchData,
    clearCache,
    clearAllCache,
  };
}
