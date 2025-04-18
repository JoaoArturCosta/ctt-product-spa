import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "./productSlice";
import { fetchProducts } from "./api";
import ProductItem from "./components/ProductItem";
import styles from "./ProductList.module.css";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: products,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(fetchProductsStart());
      try {
        const data = await fetchProducts();
        dispatch(fetchProductsSuccess(data));
      } catch (err: any) {
        // Ensure error is stringified for the state
        const errorMessage = err instanceof Error ? err.message : String(err);
        dispatch(fetchProductsFailure(errorMessage));
      }
    };

    loadProducts();
  }, [dispatch]);

  if (isLoading) {
    return <div className={styles.loadingMessage}>Loading products...</div>;
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        <strong>Error:</strong> {error}
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
