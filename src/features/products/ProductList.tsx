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
import styles from "./ProductList.module.css"; // Import CSS Module

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
    // Style loading message
    return <div className={styles.loadingMessage}>Loading products...</div>;
  }

  if (error) {
    // Style error message
    return (
      <div className={styles.errorMessage}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (products.length === 0) {
    // Style no products message
    return (
      <div className={styles.noProductsMessage}>
        No products found. Add one using the form above!
      </div>
    );
  }

  return (
    <div>
      <h2 className={styles.listTitle}>Product List</h2>
      <ul className={styles.productList}>
        {products.map((product) => (
          // Render ProductItem component instead of inline details
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
