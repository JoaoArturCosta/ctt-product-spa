import { Product, NewProductData, UpdateProductData } from "./types";
import { apiClient } from "@/lib/api-client";

const PRODUCTS_ENDPOINT = "/products";

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(
    PRODUCTS_ENDPOINT,
    "fetch products"
  );
  return response.data;
};

export const addProduct = async (
  productData: NewProductData
): Promise<Product> => {
  const response = await apiClient.post<Product>(
    PRODUCTS_ENDPOINT,
    productData,
    "add product"
  );
  return response.data;
};

export const updateProduct = async (
  productId: string,
  productData: UpdateProductData
): Promise<Product> => {
  const response = await apiClient.patch<Product>(
    `${PRODUCTS_ENDPOINT}/${productId}`,
    productData,
    `update product ${productId}`
  );
  return response.data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(
    `${PRODUCTS_ENDPOINT}/${productId}`,
    `delete product ${productId}`
  );
};
