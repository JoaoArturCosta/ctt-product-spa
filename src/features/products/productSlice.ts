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
export const ADD_PRODUCT_START = "products/addStart";
export const ADD_PRODUCT_SUCCESS = "products/addSuccess";
export const ADD_PRODUCT_FAILURE = "products/addFailure";
export const UPDATE_PRODUCT_START = "products/updateStart";
export const UPDATE_PRODUCT_SUCCESS = "products/updateSuccess";
export const UPDATE_PRODUCT_FAILURE = "products/updateFailure";
// Add action types for DELETE later

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

// Add Product Actions
interface AddProductStartAction extends Action<typeof ADD_PRODUCT_START> {}
interface AddProductSuccessAction extends Action<typeof ADD_PRODUCT_SUCCESS> {
  payload: Product; // Payload is the newly added product with its ID
}
interface AddProductFailureAction extends Action<typeof ADD_PRODUCT_FAILURE> {
  payload: string;
}

// Update Product Actions
interface UpdateProductStartAction
  extends Action<typeof UPDATE_PRODUCT_START> {}
interface UpdateProductSuccessAction
  extends Action<typeof UPDATE_PRODUCT_SUCCESS> {
  payload: Product; // Payload is the updated product
}
interface UpdateProductFailureAction
  extends Action<typeof UPDATE_PRODUCT_FAILURE> {
  payload: { productId: string; error: string }; // Include ID for context
}

export type ProductActionTypes =
  | FetchProductsStartAction
  | FetchProductsSuccessAction
  | FetchProductsFailureAction
  | AddProductStartAction
  | AddProductSuccessAction
  | AddProductFailureAction
  | UpdateProductStartAction
  | UpdateProductSuccessAction
  | UpdateProductFailureAction;
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

// Add Product Action Creators
export const addProductStart = (): AddProductStartAction => ({
  type: ADD_PRODUCT_START,
});

export const addProductSuccess = (
  product: Product
): AddProductSuccessAction => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
});

export const addProductFailure = (error: string): AddProductFailureAction => ({
  type: ADD_PRODUCT_FAILURE,
  payload: error,
});

// Update Product Action Creators
export const updateProductStart = (): UpdateProductStartAction => ({
  type: UPDATE_PRODUCT_START,
});

export const updateProductSuccess = (
  product: Product
): UpdateProductSuccessAction => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
});

export const updateProductFailure = (
  productId: string,
  error: string
): UpdateProductFailureAction => ({
  type: UPDATE_PRODUCT_FAILURE,
  payload: { productId, error },
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
  action: ProductActionTypes
): ProductsState => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return { ...state, isLoading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, isLoading: false, items: action.payload, error: null };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    // Add cases
    case ADD_PRODUCT_START:
      return { ...state, isLoading: true, error: null };
    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: [...state.items, action.payload],
        error: null,
      };
    case ADD_PRODUCT_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    // Update cases
    case UPDATE_PRODUCT_START:
      return { ...state, isLoading: true, error: null };
    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        error: null,
      };
    case UPDATE_PRODUCT_FAILURE:
      return { ...state, isLoading: false, error: action.payload.error };

    // Add cases for DELETE later
    default:
      return state;
  }
};

// 6. Define Selectors (Optional but recommended)
// Example selector (can be expanded in a separate selectors file if needed)
// import { RootState } from '@/store/reducer';
// export const selectAllProducts = (state: RootState) => state.products.items;
