import { Product } from "./productSlice";

// Base URL for the mock API (running via json-server)
// Note: In a real app, this would likely come from an environment variable
const API_BASE_URL = "http://localhost:3001"; // Matches mock:api script in package.json

/**
 * Fetches the list of products from the mock API.
 * @returns A promise that resolves to an array of Product objects.
 * @throws An error if the network response is not ok.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);

    if (!response.ok) {
      // Attempt to get error message from response body, otherwise use status text
      let errorMsg = response.statusText;
      try {
        const errorBody = await response.json();
        errorMsg = errorBody.message || errorMsg; // Use message field if present
      } catch (e) {
        // Ignore if response body isn't valid JSON
      }
      throw new Error(
        `Failed to fetch products: ${response.status} ${errorMsg}`
      );
    }

    const data: Product[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Re-throw the error to be handled by the caller (e.g., in the component)
    throw error;
  }
};

// Add functions for addProduct, updateProduct, deleteProduct later in Phase 3
