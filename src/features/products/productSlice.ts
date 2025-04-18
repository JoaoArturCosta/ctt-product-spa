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
export const DELETE_PRODUCT_START = "products/deleteStart";
export const DELETE_PRODUCT_SUCCESS = "products/deleteSuccess";
export const DELETE_PRODUCT_FAILURE = "products/deleteFailure";

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

// Delete Product Actions
interface DeleteProductStartAction extends Action<typeof DELETE_PRODUCT_START> {
  // Optionally include productId in meta if needed for optimistic UI
  // meta: { productId: string };
}
interface DeleteProductSuccessAction
  extends Action<typeof DELETE_PRODUCT_SUCCESS> {
  payload: { productId: string }; // Send ID of deleted product
}
interface DeleteProductFailureAction
  extends Action<typeof DELETE_PRODUCT_FAILURE> {
  payload: { productId: string; error: string };
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
  | UpdateProductFailureAction
  | DeleteProductStartAction
  | DeleteProductSuccessAction
  | DeleteProductFailureAction;
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

// Delete Product Action Creators
export const deleteProductStart =
  (/* productId?: string */): DeleteProductStartAction => ({
    type: DELETE_PRODUCT_START,
    // meta: { productId }, // If using meta for optimistic UI
  });

export const deleteProductSuccess = (
  productId: string
): DeleteProductSuccessAction => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: { productId },
});

export const deleteProductFailure = (
  productId: string,
  error: string
): DeleteProductFailureAction => ({
  type: DELETE_PRODUCT_FAILURE,
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

    // Delete cases
    case DELETE_PRODUCT_START:
      // Optionally indicate loading specific to an item, or just global loading
      // Can also optionally remove item optimistically here using action.meta.productId
      return { ...state, isLoading: true, error: null };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        // Filter out the deleted item
        items: state.items.filter(
          (item) => item.id !== action.payload.productId
        ),
        error: null,
      };
    case DELETE_PRODUCT_FAILURE:
      // Store error, potentially relating it to the specific product ID if needed
      // If optimistic delete was done in START, need to add item back here
      return { ...state, isLoading: false, error: action.payload.error };

    default:
      return state;
  }
};

// 6. Define Selectors (Optional but recommended)
// Example selector (can be expanded in a separate selectors file if needed)
// import { RootState } from '@/store/reducer';
// export const selectAllProducts = (state: RootState) => state.products.items;
