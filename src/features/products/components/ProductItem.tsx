import React, { useState, ChangeEvent } from "react";
import { Product } from "../productSlice"; // Import Product type
import { useAppDispatch } from "@/store/hooks";
import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
} from "../productSlice";
import { updateProduct, UpdateProductData } from "../api";

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

  return (
    <li
      style={{
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid #ccc",
      }}
    >
      {isEditing ? (
        <div>
          <input
            type="text"
            name="description"
            value={editData.description ?? ""}
            onChange={handleInputChange}
            placeholder="Description"
            required
          />
          <input
            type="number"
            name="price"
            step="0.01"
            value={editData.price ?? ""}
            onChange={handleInputChange}
            placeholder="Price"
            required
          />
          <input
            type="number"
            name="stock"
            step="1"
            value={editData.stock ?? ""}
            onChange={handleInputChange}
            placeholder="Stock"
            required
          />
          {/* Add input for categories if needed */}
          <button onClick={handleSave} style={{ marginLeft: "5px" }}>
            Save
          </button>
          <button onClick={handleEditToggle} style={{ marginLeft: "5px" }}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <span>{product.description}</span>
          <span> - Price: ${product.price.toFixed(2)}</span>
          <span> - Stock: {product.stock}</span>
          {/* Display categories if needed */}
          {/* <span> - Categories: {product.categories.join(', ')}</span> */}
          <button onClick={handleEditToggle} style={{ marginLeft: "10px" }}>
            Edit
          </button>
          {/* Add Delete button here later */}
        </div>
      )}
    </li>
  );
};

export default ProductItem;
