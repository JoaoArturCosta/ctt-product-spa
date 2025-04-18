import React, { useState, ChangeEvent } from "react";
import { Product } from "../productSlice"; // Import Product type
import { useAppDispatch } from "@/store/hooks";
import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
} from "../productSlice";
import { updateProduct, UpdateProductData, deleteProduct } from "../api";
import styles from "./ProductItem.module.css"; // Import CSS Module

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  // Local state for edited values
  const [editData, setEditData] = useState<UpdateProductData>({});

  const handleEditToggle = () => {
    if (!isEditing) {
      // Reset editData when entering edit mode, prefill with current product data
      setEditData({
        description: product.description,
        price: product.price,
        stock: product.stock,
        categories: product.categories, // Keep categories simple for now
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue: string | number | string[] = value;

    // Convert price/stock back to numbers
    if (name === "price") {
      processedValue = value === "" ? "" : parseFloat(value);
    } else if (name === "stock") {
      processedValue = value === "" ? "" : parseInt(value, 10);
    } // Categories could be handled here if editable

    setEditData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSave = async () => {
    // Basic validation: check if required fields are present and valid in editData
    if (
      !editData.description || // Check description is not empty
      editData.price === undefined ||
      isNaN(Number(editData.price)) ||
      Number(editData.price) < 0 || // Check price is a non-negative number
      editData.stock === undefined ||
      !Number.isInteger(editData.stock) ||
      Number(editData.stock) < 0 // Check stock is a non-negative integer
    ) {
      alert(
        "Description must be filled, Price and Stock must be valid non-negative numbers."
      );
      return;
    }

    // Filter out any fields that weren't actually changed
    const changes: UpdateProductData = {};
    if (editData.description !== product.description)
      changes.description = editData.description;
    // Ensure we compare numbers after converting editData value
    if (Number(editData.price) !== product.price)
      changes.price = Number(editData.price);
    if (Number(editData.stock) !== product.stock)
      changes.stock = Number(editData.stock);
    // Add categories changes if implemented

    if (Object.keys(changes).length === 0) {
      setIsEditing(false); // No changes, just exit edit mode
      return;
    }

    dispatch(updateProductStart());
    try {
      // Pass only the changed data to the API
      const updated = await updateProduct(product.id, changes);
      dispatch(updateProductSuccess(updated));
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      dispatch(updateProductFailure(product.id, errorMessage));
      // Optionally revert local state or show error locally
      // For now, global error state is handled by ProductList
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Are you sure you want to delete ${product.description}?`)
    ) {
      return;
    }

    dispatch(deleteProductStart());
    try {
      await deleteProduct(product.id);
      dispatch(deleteProductSuccess(product.id));
      // No need to update local state as the item will be removed from the list
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      dispatch(deleteProductFailure(product.id, errorMessage));
      // Global error is handled by ProductList
    }
  };

  return (
    <li className={styles.listItem}>
      {isEditing ? (
        <div className={styles.editModeContainer}>
          <input
            type="text"
            name="description"
            value={editData.description ?? ""}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className={styles.editInput} // Apply base input style
          />
          <div className={styles.editRow}>
            {" "}
            {/* Row for price/stock */}
            <input
              type="number"
              name="price"
              step="0.01"
              value={editData.price ?? ""}
              onChange={handleInputChange}
              placeholder="Price"
              required
              className={`${styles.editInput} ${styles.editInputFlex}`} // Combine classes
            />
            <input
              type="number"
              name="stock"
              step="1"
              value={editData.stock ?? ""}
              onChange={handleInputChange}
              placeholder="Stock"
              required
              className={`${styles.editInput} ${styles.editInputFlex}`} // Combine classes
            />
          </div>
          <div className={styles.buttonRow}>
            {" "}
            {/* Buttons row */}
            <button
              onClick={handleSave}
              className={`${styles.button} ${styles.saveButton}`}
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.viewModeContainer}>
          <div className={styles.details}>
            <strong className={styles.description}>
              {product.description}
            </strong>
            <span>Price: ${product.price.toFixed(2)}</span>
            <span className={styles.stock}>Stock: {product.stock}</span>
            {/* Display categories if needed */}
            {/* <span style={{ marginLeft: '15px' }}> - Categories: {product.categories.join(', ')}</span> */}
          </div>
          <div className={styles.buttonRow}>
            <button onClick={handleEditToggle} className={styles.button}>
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ProductItem;
