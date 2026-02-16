// API Configuration
// Uses environment variable or falls back to production URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

// Helper function to construct API URLs
export const getApiUrl = (path: string): string => {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}
