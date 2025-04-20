import {
  Product,
  ProductsState,
  ErrorState,
  NewProductData,
  UpdateProductData,
} from "./types";
import {
  productsReducer,
  initialState as actualInitialState,
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

// Use the actual initial state from the slice
const initialStateForTest = actualInitialState;

// Helper to create mock ErrorState
const createMockError = (message: string): ErrorState => ({
  message,
  retryable: false,
  timestamp: Date.now(),
});

const mockError = createMockError("Previous error");

const newProductData: NewProductData = {
  description: "New Test Product",
  price: 30,
  stock: 15,
  categories: ["cat1", "cat3"],
};
const newProduct: Product = {
  ...newProductData,
  id: "3", // ID would be assigned by the backend/json-server
};

const updateData: UpdateProductData = {
  description: "Updated Test Product 1",
  stock: 8,
};
const updatedProduct: Product = {
  ...mockProducts[0], // Base on the first mock product
  ...updateData,
};

describe("productsReducer", () => {
  it("should return the initial state", () => {
    // Use an empty object for action type for initial state check
    expect(productsReducer(undefined, {} as any)).toEqual(actualInitialState);
  });

  it("should handle fetchProductsStart", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      error: mockError,
      status: {
        ...initialStateForTest.status,
        fetch: {
          ...initialStateForTest.status.fetch,
          error: mockError.message,
        },
      },
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        fetch: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
      error: null,
    };
    expect(productsReducer(previousState, fetchProductsStart())).toEqual(
      expectedState
    );
  });

  it("should handle fetchProductsSuccess", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        fetch: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: {
        "1": mockProducts[0],
        "2": mockProducts[1],
      },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        fetch: { isLoading: false, error: null, retryCount: 0 },
      },
      lastUpdated: expect.any(Number),
      cache: {
        isValid: true,
        expiresAt: expect.any(Number),
      },
    };
    expect(
      productsReducer(previousState, fetchProductsSuccess(mockProducts))
    ).toEqual(expectedState);
  });

  it("should handle fetchProductsFailure", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        fetch: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
    };
    const errorPayload = createMockError("Failed to fetch");
    const expectedState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        fetch: {
          isLoading: false,
          error: errorPayload.message,
          retryCount: 1,
          lastAttempt: expect.any(Number),
        },
      },
      error: errorPayload,
    };
    expect(
      productsReducer(previousState, fetchProductsFailure(errorPayload))
    ).toEqual(expectedState);
  });

  it("should handle addProductStart", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      error: mockError,
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        add: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
      error: null,
    };
    expect(
      productsReducer(previousState, addProductStart(newProductData))
    ).toEqual(expectedState);
  });

  it("should handle addProductSuccess", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        add: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: {
        "1": mockProducts[0],
        "2": mockProducts[1],
        "3": newProduct,
      },
      allIds: ["1", "2", "3"],
      status: {
        ...initialStateForTest.status,
        add: { isLoading: false, error: null, retryCount: 0 },
      },
      lastUpdated: expect.any(Number),
    };
    expect(
      productsReducer(previousState, addProductSuccess(newProduct))
    ).toEqual(expectedState);
  });

  it("should handle addProductFailure", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        add: {
          isLoading: true,
          error: null,
          retryCount: 0,
          lastAttempt: expect.any(Number),
        },
      },
    };
    const errorPayload = createMockError("Failed to add");
    const expectedState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        add: {
          isLoading: false,
          error: errorPayload.message,
          retryCount: 1,
          lastAttempt: expect.any(Number),
        },
      },
      error: errorPayload,
    };
    expect(
      productsReducer(previousState, addProductFailure(errorPayload))
    ).toEqual(expectedState);
  });

  it("should handle updateProductStart", () => {
    const previousState: ProductsState = {
      ...initialStateForTest,
      error: mockError,
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      status: {
        ...initialStateForTest.status,
        update: {
          [mockProducts[0].id]: {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
      error: null,
    };
    expect(
      productsReducer(
        previousState,
        updateProductStart(mockProducts[0].id, updateData)
      )
    ).toEqual(expectedState);
  });

  it("should handle updateProductSuccess", () => {
    // State contains both original mock products
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        update: {
          "1": {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": updatedProduct, "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        update: {},
      },
      lastUpdated: expect.any(Number),
    };
    expect(
      productsReducer(previousState, updateProductSuccess(updatedProduct))
    ).toEqual(expectedState);
  });

  it("should handle updateProductFailure", () => {
    const productIdToFail = mockProducts[0].id;
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        update: {
          [productIdToFail]: {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
    };
    const errorPayload = createMockError("Failed to update");
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        update: {
          [productIdToFail]: {
            isLoading: false,
            error: errorPayload.message,
            retryCount: 1,
            lastAttempt: expect.any(Number),
          },
        },
      },
      error: errorPayload,
    };
    expect(
      productsReducer(
        previousState,
        updateProductFailure(productIdToFail, errorPayload)
      )
    ).toEqual(expectedState);
  });

  it("should handle deleteProductStart", () => {
    const productIdToDelete = mockProducts[0].id;
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      error: mockError,
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        delete: {
          [productIdToDelete]: {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
      error: null,
    };
    expect(
      productsReducer(previousState, deleteProductStart(productIdToDelete))
    ).toEqual(expectedState);
  });

  it("should handle deleteProductSuccess", () => {
    const productIdToDelete = mockProducts[0].id;
    // State contains both original mock products
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        delete: {
          [productIdToDelete]: {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
    };
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: { "2": mockProducts[1] },
      allIds: ["2"],
      status: {
        ...initialStateForTest.status,
        delete: {},
      },
      lastUpdated: expect.any(Number),
    };
    expect(
      productsReducer(previousState, deleteProductSuccess(productIdToDelete))
    ).toEqual(expectedState);
  });

  it("should handle deleteProductFailure", () => {
    const productIdToFail = mockProducts[0].id;
    const previousState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        delete: {
          [productIdToFail]: {
            isLoading: true,
            error: null,
            retryCount: 0,
            lastAttempt: expect.any(Number),
          },
        },
      },
    };
    const errorPayload = createMockError("Failed to delete");
    const expectedState: ProductsState = {
      ...initialStateForTest,
      byId: { "1": mockProducts[0], "2": mockProducts[1] },
      allIds: ["1", "2"],
      status: {
        ...initialStateForTest.status,
        delete: {
          [productIdToFail]: {
            isLoading: false,
            error: errorPayload.message,
            retryCount: 1,
            lastAttempt: expect.any(Number),
          },
        },
      },
      error: errorPayload,
    };
    expect(
      productsReducer(
        previousState,
        deleteProductFailure(productIdToFail, errorPayload)
      )
    ).toEqual(expectedState);
  });
});
