/**
 * Utility functions for handling the base path in different environments.
 * In production (GitHub Pages), the base path is "/open-donate/".
 * In development, the base path is "/".
 */

/**
 * Gets the base path from Vite's environment.
 * This matches the base path configured in vite.config.ts.
 */
export const getBasePath = (): string => {
  // Vite exposes the base path via import.meta.env.BASE_URL
  return import.meta.env.BASE_URL;
};

/**
 * Gets the base path without trailing slash (for React Router basename).
 * React Router expects basename without trailing slash.
 */
export const getBasePathForRouter = (): string => {
  const basePath = getBasePath();
  // Remove trailing slash for React Router basename
  return basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;
};

/**
 * Constructs a full URL with the base path.
 * Useful for OAuth redirects and other absolute URLs.
 */
export const getFullUrl = (path: string): string => {
  const basePath = getBasePath();
  // Ensure path starts with /
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // Remove duplicate slashes
  const fullPath = `${basePath}${normalizedPath}`.replace(/([^:]\/)\/+/g, "$1");
  return `${window.location.origin}${fullPath}`;
};
