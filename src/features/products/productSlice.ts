import { Action } from "redux";
import {
  Product,
  ProductsState,
  NewProductData,
  UpdateProductData,
  LoadingState,
  ErrorState,
} from "./types";

// Action Types
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
export const INVALIDATE_CACHE = "products/invalidateCache";

// Action Interfaces
export interface FetchProductsStartAction
  extends Action<typeof FETCH_PRODUCTS_START> {}
export interface FetchProductsSuccessAction
  extends Action<typeof FETCH_PRODUCTS_SUCCESS> {
  payload: Product[];
}
export interface FetchProductsFailureAction
  extends Action<typeof FETCH_PRODUCTS_FAILURE> {
  payload: ErrorState;
}

export interface AddProductStartAction
  extends Action<typeof ADD_PRODUCT_START> {
  payload: NewProductData;
}
export interface AddProductSuccessAction
  extends Action<typeof ADD_PRODUCT_SUCCESS> {
  payload: Product;
}
export interface AddProductFailureAction
  extends Action<typeof ADD_PRODUCT_FAILURE> {
  payload: ErrorState;
}

export interface UpdateProductStartAction
  extends Action<typeof UPDATE_PRODUCT_START> {
  payload: { id: string; data: UpdateProductData };
}
export interface UpdateProductSuccessAction
  extends Action<typeof UPDATE_PRODUCT_SUCCESS> {
  payload: Product;
}
export interface UpdateProductFailureAction
  extends Action<typeof UPDATE_PRODUCT_FAILURE> {
  payload: { id: string; error: ErrorState };
}

export interface DeleteProductStartAction
  extends Action<typeof DELETE_PRODUCT_START> {
  payload: string;
}
export interface DeleteProductSuccessAction
  extends Action<typeof DELETE_PRODUCT_SUCCESS> {
  payload: string;
}
export interface DeleteProductFailureAction
  extends Action<typeof DELETE_PRODUCT_FAILURE> {
  payload: { id: string; error: ErrorState };
}

export interface InvalidateCacheAction
  extends Action<typeof INVALIDATE_CACHE> {}

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
  | DeleteProductFailureAction
  | InvalidateCacheAction;

// Action Creators
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
  error: ErrorState
): FetchProductsFailureAction => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const addProductStart = (
  productData: NewProductData
): AddProductStartAction => ({
  type: ADD_PRODUCT_START,
  payload: productData,
});

export const addProductSuccess = (
  product: Product
): AddProductSuccessAction => ({
  type: ADD_PRODUCT_SUCCESS,
  payload: product,
});

export const addProductFailure = (
  error: ErrorState
): AddProductFailureAction => ({
  type: ADD_PRODUCT_FAILURE,
  payload: error,
});

export const updateProductStart = (
  id: string,
  data: UpdateProductData
): UpdateProductStartAction => ({
  type: UPDATE_PRODUCT_START,
  payload: { id, data },
});

export const updateProductSuccess = (
  product: Product
): UpdateProductSuccessAction => ({
  type: UPDATE_PRODUCT_SUCCESS,
  payload: product,
});

export const updateProductFailure = (
  id: string,
  error: ErrorState
): UpdateProductFailureAction => ({
  type: UPDATE_PRODUCT_FAILURE,
  payload: { id, error },
});

export const deleteProductStart = (
  productId: string
): DeleteProductStartAction => ({
  type: DELETE_PRODUCT_START,
  payload: productId,
});

export const deleteProductSuccess = (
  productId: string
): DeleteProductSuccessAction => ({
  type: DELETE_PRODUCT_SUCCESS,
  payload: productId,
});

export const deleteProductFailure = (
  id: string,
  error: ErrorState
): DeleteProductFailureAction => ({
  type: DELETE_PRODUCT_FAILURE,
  payload: { id, error },
});

export const invalidateCache = (): InvalidateCacheAction => ({
  type: INVALIDATE_CACHE,
});

// Initial State
export const initialState: ProductsState = {
  byId: {},
  allIds: [],
  status: {
    fetch: { isLoading: false, error: null, retryCount: 0 },
    add: { isLoading: false, error: null, retryCount: 0 },
    update: {},
    delete: {},
  },
  error: null,
  lastUpdated: 0,
  cache: {
    isValid: false,
    expiresAt: 0,
  },
};

// Helper Functions
const normalizeProducts = (products: Product[]): ProductsState["byId"] => {
  return products.reduce((acc, product) => {
    acc[product.id] = product;
    return acc;
  }, {} as ProductsState["byId"]);
};

const createLoadingState = (): LoadingState => ({
  isLoading: true,
  error: null,
  retryCount: 0,
  lastAttempt: Date.now(),
});

// Reducer
export const productsReducer = (
  state = initialState,
  action: ProductActionTypes
): ProductsState => {
  switch (action.type) {
    case FETCH_PRODUCTS_START:
      return {
        ...state,
        status: {
          ...state.status,
          fetch: createLoadingState(),
        },
        error: null,
      };

    case FETCH_PRODUCTS_SUCCESS:
      const normalizedProducts = normalizeProducts(action.payload);
      return {
        ...state,
        byId: normalizedProducts,
        allIds: action.payload.map((p) => p.id),
        status: {
          ...state.status,
          fetch: { isLoading: false, error: null, retryCount: 0 },
        },
        lastUpdated: Date.now(),
        cache: {
          isValid: true,
          expiresAt: Date.now() + 5 * 60 * 1000,
        },
        error: null,
      };

    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          fetch: {
            ...state.status.fetch,
            isLoading: false,
            error: action.payload.message,
            retryCount: state.status.fetch.retryCount + 1,
          },
        },
        error: action.payload,
      };

    case ADD_PRODUCT_START:
      return {
        ...state,
        status: {
          ...state.status,
          add: createLoadingState(),
        },
        error: null,
      };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
        allIds: [...state.allIds, action.payload.id],
        status: {
          ...state.status,
          add: { isLoading: false, error: null, retryCount: 0 },
        },
        lastUpdated: Date.now(),
        cache: {
          isValid: false,
          expiresAt: 0,
        },
        error: null,
      };

    case ADD_PRODUCT_FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          add: {
            ...state.status.add,
            isLoading: false,
            error: action.payload.message,
            retryCount: state.status.add.retryCount + 1,
          },
        },
        error: action.payload,
      };

    case UPDATE_PRODUCT_START:
      return {
        ...state,
        status: {
          ...state.status,
          update: {
            ...state.status.update,
            [action.payload.id]: createLoadingState(),
          },
        },
        error: null,
      };

    case UPDATE_PRODUCT_SUCCESS:
      const { [action.payload.id]: _, ...updateStatus } = state.status.update;
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: action.payload,
        },
        status: {
          ...state.status,
          update: updateStatus,
        },
        lastUpdated: Date.now(),
        cache: {
          isValid: false,
          expiresAt: 0,
        },
        error: null,
      };

    case UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          update: {
            ...state.status.update,
            [action.payload.id]: {
              ...state.status.update[action.payload.id],
              isLoading: false,
              error: action.payload.error.message,
              retryCount:
                (state.status.update[action.payload.id]?.retryCount || 0) + 1,
            },
          },
        },
        error: action.payload.error,
      };

    case DELETE_PRODUCT_START:
      return {
        ...state,
        status: {
          ...state.status,
          delete: {
            ...state.status.delete,
            [action.payload]: createLoadingState(),
          },
        },
        error: null,
      };

    case DELETE_PRODUCT_SUCCESS:
      const { [action.payload]: __, ...deleteStatus } = state.status.delete;
      const { [action.payload]: ___, ...remainingProducts } = state.byId;
      return {
        ...state,
        byId: remainingProducts,
        allIds: state.allIds.filter((id) => id !== action.payload),
        status: {
          ...state.status,
          delete: deleteStatus,
        },
        lastUpdated: Date.now(),
        cache: {
          isValid: false,
          expiresAt: 0,
        },
        error: null,
      };

    case DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        status: {
          ...state.status,
          delete: {
            ...state.status.delete,
            [action.payload.id]: {
              ...state.status.delete[action.payload.id],
              isLoading: false,
              error: action.payload.error.message,
              retryCount:
                (state.status.delete[action.payload.id]?.retryCount || 0) + 1,
            },
          },
        },
        error: action.payload.error,
      };

    case INVALIDATE_CACHE:
      return {
        ...state,
        cache: {
          isValid: false,
          expiresAt: 0,
        },
      };

    default:
      return state;
  }
};
