import { combineReducers } from "redux";
// Import feature reducers here as they are created
import { productsReducer } from "@/features/products/productSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  // Add other reducers here
  // placeholder: (state = {}) => state, // Add a placeholder if needed initially
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
