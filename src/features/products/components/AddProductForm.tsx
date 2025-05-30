import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "../productSlice";
import { addProduct } from "../api";
import { NewProductData, ErrorState } from "../types";
import { validateProductData, ProductFormData } from "../validation";
import InputField from "@/components/InputField/InputField";
import styles from "./AddProductForm.module.css";

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<ProductFormData>({
    description: "",
    price: 0,
    stock: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Handle number conversion for price and stock
      [name]:
        name === "price"
          ? parseFloat(value) || 0 // Default to 0 if parsing fails
          : name === "stock"
          ? parseInt(value, 10) || 0 // Default to 0 if parsing fails
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    const validationError = validateProductData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    // Construct the payload before dispatching
    const newProductData: NewProductData = {
      description: formData.description!, // Non-null assertion based on validation
      price: formData.price!, // Non-null assertion based on validation
      stock: formData.stock!, // Non-null assertion based on validation
      categories: [],
    };

    dispatch(addProductStart(newProductData));

    try {
      const addedProduct = await addProduct(newProductData);
      dispatch(addProductSuccess(addedProduct));
      // Reset form on success
      setFormData({ description: "", price: 0, stock: 0 });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // Construct ErrorState payload
      const errorPayload: ErrorState = {
        message: errorMessage,
        retryable: false, // Assume not retryable from UI
        timestamp: Date.now(),
      };
      dispatch(addProductFailure(errorPayload));
      setError(`Failed to add product: ${errorMessage}`); // Show error locally
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.formContainer}
      data-testid="add-product-form"
    >
      <h3 className={styles.formTitle}>Add New Product</h3>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <InputField
        id="description"
        name="description"
        label="Description:"
        value={formData.description}
        onChange={handleChange}
        required
        disabled={isSubmitting}
      />
      <InputField
        id="price"
        name="price"
        label="Price:"
        type="number"
        value={formData.price}
        onChange={handleChange}
        step="0.01"
        min="0"
        required
        disabled={isSubmitting}
      />
      <InputField
        id="stock"
        name="stock"
        label="Stock:"
        type="number"
        value={formData.stock}
        onChange={handleChange}
        step="1"
        min="0"
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
