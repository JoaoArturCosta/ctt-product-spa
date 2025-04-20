import React, { useState, ChangeEvent } from "react";
import { Product, UpdateProductData } from "../types";
import { useAppDispatch } from "@/store/hooks";
import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
} from "../productSlice";
import { updateProduct, deleteProduct } from "../api";
import { ErrorState } from "../types";
import { validateProductData } from "../validation";
import InputField from "@/components/InputField/InputField";
import styles from "./ProductItem.module.css";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  // Use UpdateProductData which aligns with validation input type
  const [editData, setEditData] = useState<UpdateProductData>({});
  const [editError, setEditError] = useState<string | null>(null); // Local error state for edit form

  const handleEditToggle = () => {
    if (!isEditing) {
      // Pre-fill edit data when entering edit mode
      setEditData({
        description: product.description,
        price: product.price,
        stock: product.stock,
        // Exclude categories for now
      });
      setEditError(null); // Clear any previous edit errors
    } else {
      // reset changes if cancelling
      setEditData({});
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
    }

    setEditData((prev) => ({ ...prev, [name]: processedValue }));
    setEditError(null); // Clear error on input change
  };

  const handleSave = async () => {
    setEditError(null); // Clear previous errors

    // Validate the current editData
    const validationError = validateProductData(editData);
    if (validationError) {
      setEditError(validationError);
      return;
    }

    // Filter out any fields that weren't actually changed to send minimal payload
    const changes: UpdateProductData = {};
    if (editData.description !== product.description)
      changes.description = editData.description;
    if (
      editData.price !== undefined &&
      Number(editData.price) !== product.price
    )
      changes.price = Number(editData.price);
    if (
      editData.stock !== undefined &&
      Number(editData.stock) !== product.stock
    )
      changes.stock = Number(editData.stock);

    if (Object.keys(changes).length === 0) {
      setIsEditing(false); // No changes, just exit edit mode
      return;
    }

    dispatch(updateProductStart(product.id, changes));
    try {
      // Pass only the changed data to the API
      const updated = await updateProduct(product.id, changes);
      dispatch(updateProductSuccess(updated));
      setIsEditing(false); // Exit edit mode on success
      setEditError(null);
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorPayload: ErrorState = {
        message: errorMessage,
        retryable: false,
        timestamp: Date.now(),
      };
      dispatch(updateProductFailure(product.id, errorPayload));
      setEditError(`Save failed: ${errorMessage}`); // Show error locally in edit form
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Are you sure you want to delete ${product.description}?`)
    ) {
      return;
    }

    dispatch(deleteProductStart(product.id));
    try {
      await deleteProduct(product.id);
      dispatch(deleteProductSuccess(product.id));
      // No need to update local state as the item will be removed from the list
    } catch (err: any) {
      // Construct ErrorState for failure action
      const errorMessage = err instanceof Error ? err.message : String(err);
      const errorPayload: ErrorState = {
        message: errorMessage,
        retryable: false, // Or determine based on error
        timestamp: Date.now(),
      };
      dispatch(deleteProductFailure(product.id, errorPayload));
      // Global error is handled by ProductList
    }
  };

  return (
    <li className={styles.listItem}>
      {isEditing ? (
        <div className={styles.editModeContainer}>
          {/* Display edit error if present */}
          {editError && (
            <p style={{ color: "red", fontSize: "0.9em" }}>{editError}</p>
          )}
          {/* Use InputField for Description */}
          <InputField
            id={`description-${product.id}`} // Ensure unique ID for accessibility
            name="description"
            label="Description:"
            value={editData.description ?? ""}
            onChange={handleInputChange}
            required
            placeholder="Description"
            className={styles.editInput} // Pass specific class if needed, else rely on InputField's default
          />
          <div className={styles.editRow}>
            {/* Use InputField for Price */}
            <InputField
              id={`price-${product.id}`}
              name="price"
              label="Price:"
              type="number"
              value={editData.price ?? ""}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              placeholder="Price"
              className={styles.editInputFlex}
            />
            {/* Use InputField for Stock */}
            <InputField
              id={`stock-${product.id}`}
              name="stock"
              label="Stock:"
              type="number"
              value={editData.stock ?? ""}
              onChange={handleInputChange}
              step="1"
              min="0"
              required
              placeholder="Stock"
              className={styles.editInputFlex}
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

            {product.categories.length > 0 && (
              <span style={{ marginLeft: "15px" }}>
                - Categories: {product.categories.join(", ")}
              </span>
            )}
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
