export interface Product {
  id: string;
  stock: number;
  description: string;
  categories: string[];
  price: number;
  lastModified?: number;
  isDeleting?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  lastAttempt?: number;
}

export interface ErrorState {
  message: string;
  code?: string;
  retryable: boolean;
  timestamp: number;
}

export interface ProductsState {
  byId: Record<string, Product>;
  allIds: string[];
  status: {
    fetch: LoadingState;
    add: LoadingState;
    update: Record<string, LoadingState>;
    delete: Record<string, LoadingState>;
  };
  error: ErrorState | null;
  lastUpdated: number;
  cache: {
    isValid: boolean;
    expiresAt: number;
  };
}

export type NewProductData = Omit<Product, "id" | "lastModified">;
export type UpdateProductData = Partial<Omit<Product, "id" | "lastModified">>;

// API Response types
export interface ApiResponse<T> {
  data: T;
  timestamp: number;
  status: "success" | "error";
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
  timestamp: number;
}
