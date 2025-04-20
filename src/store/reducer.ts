/**
 * Root Reducer Configuration
 * This file sets up the root reducer that combines all feature reducers
 * and defines the global state shape of our Redux store.
 */

import { combineReducers } from "redux";
// Import feature reducers here as they are created
import { productsReducer } from "@/features/products/productSlice";
import { ProductsState } from "@/features/products/types";
import { ProductActionTypes } from "@/features/products/productSlice";

/**
 * RootState Interface
 * Defines the shape of the global Redux state.
 * Each property corresponds to a feature slice of the store.
 * When adding new features, extend this interface with new state properties.
 */
export interface RootState {
  products: ProductsState;
}

/**
 * Root Reducer
 * Combines all feature reducers into a single reducer function.
 * Each key in the object corresponds to a slice of the state.
 * The type is automatically inferred from the reducers passed to combineReducers.
 */
export const rootReducer = combineReducers({
  products: productsReducer,
  // Add other reducers here
  // placeholder: (state = {}) => state, // Add a placeholder if needed initially
});
