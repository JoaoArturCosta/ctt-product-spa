import { ApiResponse, ApiError } from "@/features/products/types";

const API_BASE_URL = "http://localhost:3001";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiClient {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getCacheKey(endpoint: string, method: string, data?: any): string {
    return `${method}:${endpoint}:${data ? JSON.stringify(data) : ""}`;
  }

  private isCacheValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retryCount: number = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retryCount >= MAX_RETRIES) {
        throw error;
      }

      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      await this.delay(delay);
      return this.retryWithBackoff(fn, retryCount + 1);
    }
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    data?: any,
    operationName?: string
  ): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, method, data);

    // Check cache for GET requests
    if (method === "GET") {
      const cached = this.cache.get(cacheKey);
      if (cached && this.isCacheValid(cached)) {
        return {
          data: cached.data,
          timestamp: cached.timestamp,
          status: "success",
        };
      }
    }

    // Check for pending requests
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const opName = operationName || `${method} ${endpoint}`;

    const requestPromise = this.retryWithBackoff(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
          let errorMsg = response.statusText;
          try {
            const errorBody = await response.json();
            errorMsg = errorBody.message || errorMsg;
          } catch (e) {
            // Ignore if response body isn't valid JSON
          }

          const error: ApiError = {
            code: response.status.toString(),
            message: `Failed to ${opName}: ${response.status} ${errorMsg}`,
            retryable: response.status >= 500,
            timestamp: Date.now(),
          };

          throw error;
        }

        if (method === "DELETE" && response.status === 204) {
          return {
            data: null as T,
            timestamp: Date.now(),
            status: "success" as const,
          };
        }

        const responseData = await response.json();
        const result: ApiResponse<T> = {
          data: responseData,
          timestamp: Date.now(),
          status: "success",
        };

        // Cache successful GET responses
        if (method === "GET") {
          this.cache.set(cacheKey, {
            data: responseData,
            timestamp: result.timestamp,
          });
        }

        return result;
      } catch (error) {
        console.error(`Error during ${opName}:`, error);
        throw error;
      }
    });

    this.pendingRequests.set(cacheKey, requestPromise);

    try {
      const result = await requestPromise;
      this.pendingRequests.delete(cacheKey);
      return result;
    } catch (error) {
      this.pendingRequests.delete(cacheKey);
      throw error;
    }
  }

  async get<T>(
    endpoint: string,
    operationName?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", undefined, operationName);
  }

  async post<T>(
    endpoint: string,
    data: any,
    operationName?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", data, operationName);
  }

  async patch<T>(
    endpoint: string,
    data: any,
    operationName?: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", data, operationName);
  }

  async delete(
    endpoint: string,
    operationName?: string
  ): Promise<ApiResponse<void>> {
    return this.request<void>(endpoint, "DELETE", undefined, operationName);
  }

  clearCache(): void {
    this.cache.clear();
  }

  invalidateCache(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

export const apiClient = new ApiClient();
