import React from "react";
import { Product } from "../productSlice"; // Import Product type

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  // TODO: Add Edit/Delete buttons in Phase 3
  return (
    <li>
      <span>{product.description}</span>
      <span> - Price: ${product.price.toFixed(2)}</span>
      <span> - Stock: {product.stock}</span>
      {/* Display categories if needed */}
      {/* <span> - Categories: {product.categories.join(', ')}</span> */}
      {/* Add Edit/Delete buttons here */}
    </li>
  );
};

export default ProductItem;
