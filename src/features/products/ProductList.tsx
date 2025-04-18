import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux"; // Remove plain hooks import
import { useAppSelector, useAppDispatch } from "@/store/hooks"; // Import typed hooks
// import { RootState } from "@/store/reducer"; // No longer needed as RootState is inferred by useAppSelector
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "./productSlice";
import { fetchProducts } from "./api";
// Import ProductItem component
import ProductItem from "./components/ProductItem";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch(); // Use typed dispatch
  const {
    items: products,
    isLoading,
    error,
  } = useAppSelector((state) => state.products); // Use typed selector (RootState inferred)

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart()); // dispatch types should now be correct
      try {
        const data = await fetchProducts();
        dispatch(fetchProductsSuccess(data)); // dispatch types should now be correct
      } catch (err: any) {
        // Ensure error is stringified for the state
        const errorMessage = err instanceof Error ? err.message : String(err);
        dispatch(fetchProductsFailure(errorMessage)); // dispatch types should now be correct
      }
    };

    loadProducts();
    // Dependency array is empty to run only on mount
    // In a real app, might need dependencies if fetch depends on props/state
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    // Display error message above results as requested
    return (
      <div>
        <p style={{ color: "red" }}>Error: {error}</p>
        {/* Optionally still render part of the UI or a retry button */}
      </div>
    );
  }

  if (products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          // Render ProductItem component instead of inline details
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
