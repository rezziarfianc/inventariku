import type { ApiError, ApiResponse } from "~/types/api";
import { logoutUser } from "./authApi";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error('API_BASE_URL environment variable is not set');
}

// 1. Make the interface Generic so 'data' can be typed dynamically
// Custom Error class to carry API status and data
export class ApiRequestError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiRequestError';
  }
}

class ApiService {
  private static async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const fullUrl = `${baseUrl}${url}`;

    const token = localStorage.getItem('authToken');
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    };

    try {
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Unknown error occurred',
          errors: null // Ensure consistent structure
        }));

        if (response.status === 401 && !url.includes('login') && !url.includes('logout')) {
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }

        // Throw custom error with status and full data
        throw new ApiRequestError(
          errorData.message || `HTTP Error: ${response.status}`,
          response.status,
          errorData
        );
      }

      const jsonResponse = await response.json();

      // 4. Now 'ApiResponse<T>' refers to the Interface, not the Generic
      const result: ApiResponse<T> = {
        success: jsonResponse.success as boolean,
        message: jsonResponse.message as string,
        // Cast the data to T
        data: jsonResponse?.data as T,
        meta: jsonResponse?.meta as object | undefined | null
      }

      return result;

    } catch (error) {
      // Re-throw if it's already our custom error
      if (error instanceof ApiRequestError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new Error(`${error.message}`);
      }
      throw new Error('Unknown API error occurred');
    }
  }

  static async get<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  static async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export default ApiService;