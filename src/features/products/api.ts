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
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorBody = await response.json();
        errorMsg = errorBody.message || errorMsg;
      } catch (e) {
        /* Ignore */
      }
      throw new Error(`Failed to add product: ${response.status} ${errorMsg}`);
    }

    const newProduct: Product = await response.json();
    // json-server automatically assigns an id
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: "PATCH", // Use PATCH for partial updates
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      let errorMsg = response.statusText;
      try {
        const errorBody = await response.json();
        errorMsg = errorBody.message || errorMsg;
      } catch (e) {
        /* Ignore */
      }
      throw new Error(
        `Failed to update product ${productId}: ${response.status} ${errorMsg}`
      );
    }

    const updatedProduct: Product = await response.json();
    return updatedProduct;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error);
    throw error;
  }
};

// Add function for deleteProduct later
