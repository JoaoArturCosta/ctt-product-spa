import React, { useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "./productSlice";
import { addProduct } from "./api";
import { NewProductData, ErrorState } from "./types";
import { validateProductData, type ProductFormData } from "./validation";
import InputField from "@/components/InputField/InputField";
import styles from "./AddProductForm.module.css";

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { status, error: globalError } = useAppSelector(
    (state) => state.products
  );
  const { isLoading, error: addError } = status.add;

  // Local state for form inputs
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState(""); // Simple comma-separated input

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Basic validation (can be enhanced)
    if (!description || !price || !stock) {
      alert("Please fill in description, price, and stock.");
      return;
    }

    const productData: NewProductData = {
      description,
      price: parseFloat(price), // Ensure price is a number
      stock: parseInt(stock, 10), // Ensure stock is an integer
      categories: categories
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat), // Split and trim categories
    };

    dispatch(addProductStart(productData));
    try {
      const newProduct = await addProduct(productData);
      dispatch(addProductSuccess(newProduct));
      // Clear form on success
      setDescription("");
      setPrice("");
      setStock("");
      setCategories("");
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorPayload: ErrorState = {
        message: errorMessage,
        retryable: false, // Assuming not retryable by default for UI errors
        timestamp: Date.now(),
      };
      dispatch(addProductFailure(errorPayload));
    }
  };

  return (
    <div>
      <h3>Add New Product</h3>
      {/* Display add-specific error if needed */}
      {addError && <p style={{ color: "red" }}>Add Error: {addError}</p>}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <InputField
          id="description"
          name="description"
          label="Description:"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isLoading}
        />
        <InputField
          id="price"
          name="price"
          label="Price:"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0"
          required
          disabled={isLoading}
        />
        <InputField
          id="stock"
          name="stock"
          label="Stock:"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          step="1"
          min="0"
          required
          disabled={isLoading}
        />
        <InputField
          id="categories"
          name="categories"
          label="Categories (comma-separated):"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
