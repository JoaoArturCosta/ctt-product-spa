import {
  productsReducer,
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProductStart,
  addProductSuccess,
  addProductFailure,
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
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

const newProduct: Product = {
  id: "3", // ID would be assigned by the backend/json-server
  description: "New Test Product",
  price: 30,
  stock: 15,
  categories: ["cat1", "cat3"],
};

const updatedProduct: Product = {
  ...mockProducts[0], // Base on the first mock product
  description: "Updated Test Product 1",
  stock: 8,
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

  it("should handle addProductStart", () => {
    const previousState: ProductsState = {
      ...initialState,
      error: "Previous error",
    };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: true,
      error: null,
    };
    expect(productsReducer(previousState, addProductStart())).toEqual(
      expectedState
    );
  });

  it("should handle addProductSuccess", () => {
    const previousState: ProductsState = {
      ...initialState,
      items: mockProducts,
      isLoading: true,
    };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: false,
      items: [...mockProducts, newProduct],
    };
    expect(
      productsReducer(previousState, addProductSuccess(newProduct))
    ).toEqual(expectedState);
  });

  it("should handle addProductFailure", () => {
    const previousState: ProductsState = { ...initialState, isLoading: true };
    const errorMsg = "Failed to add";
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: false,
      error: errorMsg,
    };
    expect(productsReducer(previousState, addProductFailure(errorMsg))).toEqual(
      expectedState
    );
  });

  it("should handle updateProductStart", () => {
    const previousState: ProductsState = {
      ...initialState,
      error: "Previous error",
    };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: true,
      error: null,
    };
    expect(productsReducer(previousState, updateProductStart())).toEqual(
      expectedState
    );
  });

  it("should handle updateProductSuccess", () => {
    // State contains both original mock products
    const previousState: ProductsState = {
      ...initialState,
      items: mockProducts,
      isLoading: true,
    };
    const expectedState: ProductsState = {
      ...initialState,
      isLoading: false,
      // The first product should be replaced by updatedProduct
      items: [updatedProduct, mockProducts[1]],
    };
    expect(
      productsReducer(previousState, updateProductSuccess(updatedProduct))
    ).toEqual(expectedState);
  });

  it("should handle updateProductFailure", () => {
    const previousState: ProductsState = {
      ...initialState,
      items: mockProducts,
      isLoading: true,
    };
    const errorMsg = "Failed to update";
    const productIdToFail = mockProducts[0].id;
    const expectedState: ProductsState = {
      ...initialState,
      items: mockProducts,
      isLoading: false,
      error: errorMsg,
    };
    expect(
      productsReducer(
        previousState,
        updateProductFailure(productIdToFail, errorMsg)
      )
    ).toEqual(expectedState);
  });
});
