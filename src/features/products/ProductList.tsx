import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "./productSlice";
import { fetchProducts } from "./api";
import { ErrorState } from "./types";
import ProductItem from "./components/ProductItem";
import styles from "./ProductList.module.css";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    byId,
    allIds,
    status,
    error: globalError,
    cache,
  } = useAppSelector((state) => state.products);
  const { isLoading, error: fetchError } = status.fetch;

  // Derive products array
  const products = allIds.map((id) => byId[id]);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart());
      try {
        const data = await fetchProducts();
        dispatch(fetchProductsSuccess(data));
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const errorPayload: ErrorState = {
          message: errorMessage,
          retryable: true,
          timestamp: Date.now(),
        };
        dispatch(fetchProductsFailure(errorPayload));
      }
    };

    // Check cache before fetching
    const now = Date.now();
    const isCacheValid =
      cache.isValid && cache.expiresAt && cache.expiresAt > now;

    // Fetch only if cache is not valid or if currently loading (e.g., initial load or failed retry)
    if (!isCacheValid || isLoading) {
      // Only fetch if not already loading to prevent redundant fetches
      if (!isLoading) {
        loadProducts();
      }
    }
    // If cache is valid, we don't need to do anything. The existing data is used.
  }, [dispatch, cache.isValid, cache.expiresAt, isLoading]); // Add cache and isLoading to dependency array

  if (isLoading && products.length === 0) {
    // Show loading only if there are no products to display yet
    return <div className={styles.loadingMessage}>Loading products...</div>;
  }

  if (fetchError) {
    return (
      <div className={styles.errorMessage}>
        <strong>Error:</strong> {fetchError || "Unknown fetch error"}
      </div>
    );
  }

  if (products.length === 0) {
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
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
