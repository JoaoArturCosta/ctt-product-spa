import { Product } from "./productSlice";

// Base URL for the mock API (running via json-server)
// Note: In a real app, this would likely come from an environment variable
const API_BASE_URL = "http://localhost:3001"; // Matches mock:api script in package.json

/**
 * Generic request helper function to handle fetch, response checking, and errors.
 * @param endpoint - The API endpoint path (e.g., '/products', '/products/123').
 * @param method - The HTTP method (e.g., 'GET', 'POST', 'PATCH', 'DELETE').
 * @param data - Optional data to send in the request body (will be JSON.stringify'd).
 * @param operationName - A descriptive name for the operation (for error messages).
 * @returns A promise resolving to the parsed JSON response, or void for methods like DELETE.
 * @throws An error with details if the request fails.
 */
async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  data?: any,
  operationName?: string
): Promise<T> {
  const config: RequestInit = {
    method: method,
    headers: {},
  };

  if (data) {
    config.headers = { "Content-Type": "application/json" };
    config.body = JSON.stringify(data);
  }

  // Construct operation name for error messages if not provided
  const opName = operationName || `${method} ${endpoint}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        // Attempt to parse JSON error body
        const errorBody = await response.json();
        errorMsg = errorBody.message || errorMsg;
      } catch (e) {
        // Ignore if response body isn't valid JSON or parsing fails
      }
      throw new Error(`Failed to ${opName}: ${response.status} ${errorMsg}`);
    }

    // Handle successful DELETE (no content expected)
    if (method === "DELETE" && response.status === 200) {
      // json-server might return {} on delete, handle appropriately
      // If we expect truly no content (204), this check might need adjustment
      return undefined as T; // Cast to T, which should be void for DELETE calls
    }

    // For other successful requests, parse and return JSON
    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    // Log the specific error before re-throwing
    console.error(`Error during ${opName}:`, error);
    // Re-throw the error to be handled by the caller (e.g., Redux action dispatch)
    throw error;
  }
}

/**
 * Fetches the list of products from the mock API.
 * @returns A promise that resolves to an array of Product objects.
 * @throws An error if the network response is not ok.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  return request<Product[]>("/products", "GET", undefined, "fetch products");
};

// Add functions for addProduct, updateProduct, deleteProduct later in Phase 3

// Define the type for the data needed to create a product (omit id)
export type NewProductData = Omit<Product, "id">;

/**
 * Adds a new product via the mock API.
 * @param productData - The data for the new product (description, price, stock, categories).
 * @returns A promise that resolves to the newly created Product object (including id).
 * @throws An error if the network response is not ok.
 */
export const addProduct = async (
  productData: NewProductData
): Promise<Product> => {
  return request<Product>("/products", "POST", productData, "add product");
};

// Add functions for updateProduct, deleteProduct later in Phase 3

// Define the type for the data needed to update a product (can be partial)
export type UpdateProductData = Partial<Omit<Product, "id">>;

/**
 * Updates an existing product via the mock API.
 * @param productId - The ID of the product to update.
 * @param productData - The partial data to update the product with.
 * @returns A promise that resolves to the updated Product object.
 * @throws An error if the network response is not ok.
 */
export const updateProduct = async (
  productId: string,
  productData: UpdateProductData
): Promise<Product> => {
  return request<Product>(
    `/products/${productId}`,
    "PATCH",
    productData,
    `update product ${productId}`
  );
};

// Add function for deleteProduct later

/**
 * Deletes a product via the mock API.
 * @param productId - The ID of the product to delete.
 * @returns A promise that resolves when the deletion is successful.
 * @throws An error if the network response is not ok.
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  // Expect void return type for DELETE
  return request<void>(
    `/products/${productId}`,
    "DELETE",
    undefined,
    `delete product ${productId}`
  );
};
