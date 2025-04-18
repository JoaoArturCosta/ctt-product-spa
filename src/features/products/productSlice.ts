import { Action } from "redux";

// 1. Define Types/Interfaces
export interface Product {
  id: string; // uuid
  stock: number;
  description: string;
  categories: string[]; // Array of category IDs
  price: number;
}

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

// 2. Define Action Types
export const FETCH_PRODUCTS_START = "products/fetchStart";
export const FETCH_PRODUCTS_SUCCESS = "products/fetchSuccess";
export const FETCH_PRODUCTS_FAILURE = "products/fetchFailure";
// Add action types for CRUD operations later (ADD, UPDATE, DELETE)

// 3. Define Action Creators
interface FetchProductsStartAction
  extends Action<typeof FETCH_PRODUCTS_START> {}
interface FetchProductsSuccessAction
  extends Action<typeof FETCH_PRODUCTS_SUCCESS> {
  payload: Product[];
}
interface FetchProductsFailureAction
  extends Action<typeof FETCH_PRODUCTS_FAILURE> {
  payload: string;
}

export type ProductActionTypes =
  | FetchProductsStartAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction;
// Add other action types here

export const fetchProductsStart = (): FetchProductsStartAction => ({
  type: FETCH_PRODUCTS_START,
});

export const fetchProductsSuccess = (
  products: Product[]
): FetchProductsSuccessAction => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (
  error: string
): FetchProductsFailureAction => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

// 4. Define Initial State
const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
};

// 5. Define Reducer
export const productsReducer = (
  state = initialState,
  // Revert back to specific action types for this reducer
  action: ProductActionTypes
): ProductsState => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return { ...state, isLoading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      // No need to cast now, action is already typed correctly
      return { ...state, isLoading: false, items: action.payload, error: null };
    case FETCH_PRODUCTS_FAILURE:
      // No need to cast now
      return { ...state, isLoading: false, error: action.payload };
    // Add cases for CRUD operations later
    default:
      // Optional: Add exhaustive check for action types if needed
      // const _exhaustiveCheck: never = action;
      return state;
  }
};

// 6. Define Selectors (Optional but recommended)
// Example selector (can be expanded in a separate selectors file if needed)
// import { RootState } from '@/store/reducer';
// export const selectAllProducts = (state: RootState) => state.products.items;
