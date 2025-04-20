/**
 * Redux Store Configuration
 * This file sets up the Redux store with middleware and proper typing.
 * It exports the store instance and type definitions for use throughout the app.
 */

import { createStore, Store } from "redux";
import { rootReducer, RootState } from "./reducer";
import { ProductActionTypes } from "@/features/products/productSlice";

/**
 * Store Configuration
 * Creates the Redux store with the following setup:
 * - Root reducer combining all feature reducers
 * - Middleware for handling async actions and side effects
 * - Proper type inference through TypeScript
 */
const store = createStore(rootReducer);

/**
 * Type Definitions
 * These types are used throughout the application to ensure type safety:
 * - AppDispatch: Type for the store's dispatch function, inferred from the store
 * - AppStore: Type for the store instance, explicitly typed with RootState and ProductActionTypes
 */
export type AppDispatch = typeof store.dispatch;
export type AppStore = Store<RootState, ProductActionTypes>;

// Export the store instance for use in the app
export { store };
