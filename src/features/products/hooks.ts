import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/reducer";
import { AppDispatch } from "@/store/store";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
  invalidateCache,
} from "./productSlice";
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "./api";
import {
  Product,
  NewProductData,
  UpdateProductData,
  ErrorState,
} from "./types";

export const useProducts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    byId,
    allIds,
    status,
    error,
    cache: { isValid, expiresAt },
  } = useSelector((state: RootState) => state.products);

  const products = allIds.map((id) => byId[id]);

  const handleError = useCallback((error: any): ErrorState => {
    return {
      message: error.message || "An unexpected error occurred",
      code: error.code || "UNKNOWN_ERROR",
      retryable: error.retryable ?? true,
      timestamp: Date.now(),
    };
  }, []);

  const loadProducts = useCallback(async () => {
    // Check cache validity
    if (isValid && expiresAt > Date.now()) {
      return;
    }

    dispatch(fetchProductsStart());
    try {
      const products = await fetchProducts();
      dispatch(fetchProductsSuccess(products));
    } catch (error) {
      dispatch(fetchProductsFailure(handleError(error)));
    }
  }, [dispatch, handleError, isValid, expiresAt]);

  const createProduct = useCallback(
    async (productData: NewProductData) => {
      dispatch(addProductStart(productData));
      try {
        const product = await addProduct(productData);
        dispatch(addProductSuccess(product));
        return product;
      } catch (error) {
        dispatch(addProductFailure(handleError(error)));
        throw error;
      }
    },
    [dispatch, handleError]
  );

  const editProduct = useCallback(
    async (id: string, productData: UpdateProductData) => {
      dispatch(updateProductStart(id, productData));
      try {
        const product = await updateProduct(id, productData);
        dispatch(updateProductSuccess(product));
        return product;
      } catch (error) {
        dispatch(updateProductFailure(id, handleError(error)));
        throw error;
      }
    },
    [dispatch, handleError]
  );

  const removeProduct = useCallback(
    async (id: string) => {
      dispatch(deleteProductStart(id));
      try {
        await deleteProduct(id);
        dispatch(deleteProductSuccess(id));
      } catch (error) {
        dispatch(deleteProductFailure(id, handleError(error)));
        throw error;
      }
    },
    [dispatch, handleError]
  );

  const refreshProducts = useCallback(() => {
    dispatch(invalidateCache());
    return loadProducts();
  }, [dispatch, loadProducts]);

  return {
    products,
    isLoading: status.fetch.isLoading,
    error,
    loadProducts,
    createProduct,
    editProduct,
    removeProduct,
    refreshProducts,
    status: {
      fetch: status.fetch,
      add: status.add,
      update: status.update,
      delete: status.delete,
    },
  };
};
