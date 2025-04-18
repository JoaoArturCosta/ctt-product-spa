import React, { useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "./productSlice";
import { addProduct, NewProductData } from "./api";

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.products);

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

    dispatch(addProductStart());
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
      dispatch(addProductFailure(errorMessage));
    }
  };

  return (
    <div>
      <h3>Add New Product</h3>
      {/* Display add-specific error if needed */}
      {error && <p style={{ color: "red" }}>Add Error: {error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="stock">Stock:</label>
          <input
            id="stock"
            type="number"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="categories">Categories (comma-separated):</label>
          <input
            id="categories"
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
