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
import ProductItemSkeleton from "./components/ProductItemSkeleton";
import styles from "./ProductList.module.css";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select specific state parts needed
  const allIds = useAppSelector((state) => state.products.allIds);
  const byId = useAppSelector((state) => state.products.byId);
  const fetchStatus = useAppSelector((state) => state.products.status.fetch);
  const cache = useAppSelector((state) => state.products.cache);

  const { isLoading, error: fetchError } = fetchStatus;

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

    // Check cache only on mount
    const now = Date.now();
    const isCacheValid =
      cache.isValid && cache.expiresAt && cache.expiresAt > now;

    // Fetch only on mount if cache is not valid
    if (!isCacheValid) {
      loadProducts();
    }
    // If cache is valid, we don't need to do anything. The existing data is used.
  }, [dispatch]); // Run only on mount (or when dispatch changes, which is stable)

  const renderSkeletons = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <ProductItemSkeleton key={`skeleton-${index}`} />
    ));
  };

  if (isLoading && products.length === 0) {
    // Show loading skeletons if loading and no products are available yet
    return (
      <div>
        <h2 className={styles.listTitle}>Product List</h2>
        <ul className={styles.productList}>{renderSkeletons(5)}</ul>
      </div>
    );
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
