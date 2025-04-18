import {
  productsReducer,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  ProductsState,
  Product,
} from "./productSlice";

// Mock Product Data for testing
const mockProducts: Product[] = [
  {
    id: "1",
    description: "Test Product 1",
    price: 10,
    stock: 5,
    categories: ["cat1"],
  },
  {
    id: "2",
    description: "Test Product 2",
    price: 20,
    stock: 10,
    categories: ["cat2"],
  },
];

// Initial State for reference
const initialState: ProductsState = {
  items: [],
  isLoading: false,
  error: null,
};

describe("productsReducer", () => {
  it("should return the initial state", () => {
    // Use an empty object for action type for initial state check
    expect(productsReducer(undefined, {} as any)).toEqual(initialState);
  });

  it("should handle fetchProductsStart", () => {
    const previousState: ProductsState = {
      ...initialState,
      error: "Previous error",
    };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: true,
      error: null,
    };
    expect(productsReducer(previousState, fetchProductsStart())).toEqual(
      expectedState
    );
  });

  it("should handle fetchProductsSuccess", () => {
    const previousState: ProductsState = { ...initialState, isLoading: true };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: false,
      items: mockProducts,
    };
    expect(
      productsReducer(previousState, fetchProductsSuccess(mockProducts))
    ).toEqual(expectedState);
  });

  it("should handle fetchProductsFailure", () => {
    const previousState: ProductsState = { ...initialState, isLoading: true };
    const errorMsg = "Failed to fetch";
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: false,
      error: errorMsg,
    };
    expect(
      productsReducer(previousState, fetchProductsFailure(errorMsg))
    ).toEqual(expectedState);
  });
});
