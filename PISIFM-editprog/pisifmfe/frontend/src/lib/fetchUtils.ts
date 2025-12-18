// frontend/src/lib/fetchUtils.ts
/**
 * Fetch wrapper with cache busting and no-cache headers
 * Prevents browser from caching API responses
 */
export async function fetchNoCacheWithTimestamp(
  url: string,
  options?: RequestInit
): Promise<Response> {
  // Add timestamp to URL for cache busting
  const separator = url.includes("?") ? "&" : "?";
  const urlWithTimestamp = `${url}${separator}_t=${Date.now()}`;

  // Merge no-cache headers with any existing headers
  const headers = new Headers(options?.headers || {});
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  headers.set("Pragma", "no-cache");

  return fetch(urlWithTimestamp, {
    ...options,
    cache: "no-store",
    headers,
  });
}
