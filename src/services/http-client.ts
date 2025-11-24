/**
 * HTTP Client - Axios Instance & Interceptors
 * 
 * This file provides a configured axios instance for all API calls.
 * Features:
 * - Base URL configuration
 * - Credentials/cookies handling
 * - Global error handling
 * - Request/response interceptors
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import config from '../config';

const API_BASE_URL = config.apiBaseUrl;

// ==================== AXIOS INSTANCE ====================

/**
 * Pre-configured axios instance
 * - Includes credentials (cookies) in all requests
 * - Sets default Content-Type to application/json
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== ERROR INTERCEPTOR ====================

/**
 * Global error handler for all API requests
 * Standardizes error messages from different API response formats
 */
apiClient.interceptors.response.use(
  (response) => response, // Pass through successful responses (2xx status)
  (error: AxiosError) => {
    // Handle failed responses (non-2xx status)
    let errorMessage = 'An unexpected error occurred';

    if (error.response) {
      // Server returned an error response
      const errorData = error.response.data as { message?: string; title?: string };

      if (typeof error.response.data === 'string' && error.response.data) {
        errorMessage = error.response.data;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.title) {
        // .NET Core validation error format
        errorMessage = errorData.title;
      }
    } else if (error.request) {
      // Request was sent but no response received (network error)
      errorMessage = 'Network error or server is not responding';
    } else {
      // Error in request configuration
      errorMessage = error.message || 'Request configuration error';
    }

    // Reject with formatted error message
    return Promise.reject(new Error(errorMessage));
  }
);

// ==================== HELPER FUNCTIONS ====================

/**
 * Format Date object to API-compatible string (YYYY-MM-DD)
 * @param date - Date object or null
 * @returns Formatted date string or empty string if null
 */
export const formatDateForAPI = (date: Date | null): string => {
  if (!date) return '';

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ==================== EXPORTS ====================

export default apiClient;
