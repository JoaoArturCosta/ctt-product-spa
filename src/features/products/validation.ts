import { UpdateProductData } from "./api";

export type ProductFormData = Omit<UpdateProductData, "categories">; // Use Omit for clarity

/**
 * Validates product form data (description, price, stock).
 * @param data - The form data to validate.
 * @returns A string containing the error message if validation fails, otherwise null.
 */
export const validateProductData = (data: ProductFormData): string | null => {
  if (
    !data.description ||
    data.description.trim() === "" // Also check if description is just whitespace
  ) {
    return "Description must be filled.";
  }

  if (
    data.price === undefined ||
    isNaN(Number(data.price)) ||
    Number(data.price) < 0
  ) {
    return "Price must be a valid non-negative number.";
  }

  if (
    data.stock === undefined ||
    !Number.isInteger(data.stock) || // Ensures it's an integer
    Number(data.stock) < 0
  ) {
    return "Stock must be a valid non-negative integer.";
  }

  return null; // No errors found
};
