import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "../productSlice";
import { addProduct, NewProductData } from "../api";

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<Omit<NewProductData, "categories">>({
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

    // Basic validation
    if (
      !formData.description ||
      isNaN(formData.price) ||
      formData.price < 0 ||
      !Number.isInteger(formData.stock) ||
      formData.stock < 0
    ) {
      setError(
        "Description must be filled, Price and Stock must be valid non-negative numbers."
      );
      return;
    }

    setIsSubmitting(true);
    dispatch(addProductStart());

    try {
      // Add empty categories array for now, as per NewProductData requirement
      const newProductData: NewProductData = {
        ...formData,
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
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #eee",
      }}
    >
      <h3>Add New Product</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="description" style={{ marginRight: "5px" }}>
          Description:
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="price" style={{ marginRight: "5px" }}>
          Price:
        </label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label htmlFor="stock" style={{ marginRight: "5px" }}>
          Stock:
        </label>
        <input
          type="number"
          id="stock"
          name="stock"
          step="1"
          min="0"
          value={formData.stock}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
};

export default AddProductForm;
