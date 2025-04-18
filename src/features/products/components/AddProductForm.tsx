import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "../productSlice";
import { addProduct, NewProductData } from "../api";
import { validateProductData, ProductFormData } from "../validation"; // Import validator
import InputField from "@/components/InputField/InputField"; // Import InputField
import styles from "./AddProductForm.module.css"; // Import CSS Module

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

    // Use the validation utility
    const validationError = validateProductData(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    dispatch(addProductStart());

    try {
      // Assert types here as validation has already passed
      const newProductData: NewProductData = {
        description: formData.description as string, // Assert description is a string
        price: formData.price as number, // Assert price is a number
        stock: formData.stock as number, // Assert stock is a number
        categories: [],
      };
      const addedProduct = await addProduct(newProductData);
      dispatch(addProductSuccess(addedProduct));
      // Reset form on success
      setFormData({ description: "", price: 0, stock: 0 });
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      dispatch(addProductFailure(errorMessage));
      setError(`Failed to add product: ${errorMessage}`); // Show error locally
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
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
