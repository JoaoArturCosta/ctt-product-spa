import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store"; // Use redux-mock-store
import AddProductForm from "./AddProductForm";
import * as api from "../api"; // Mock the api module
import {
  addProductStart,
  addProductSuccess,
  addProductFailure,
} from "../productSlice";

// Mock the API module
jest.mock("../api");
const mockAddProduct = api.addProduct as jest.MockedFunction<
  typeof api.addProduct
>;

// Configure mock Redux store
const mockStore = configureStore([]);

// Provide a minimal initial state if needed by hooks/selectors (not strictly necessary here)
const initialState = { products: { items: [], isLoading: false, error: null } };

describe("AddProductForm", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn(); // Mock dispatch function
    mockAddProduct.mockClear(); // Clear mock calls before each test
  });

  test("renders the form correctly", () => {
    render(
      <Provider store={store}>
        <AddProductForm />
      </Provider>
    );

    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/stock/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add product/i })
    ).toBeInTheDocument();
  });

  test("updates input values on change", () => {
    render(
      <Provider store={store}>
        <AddProductForm />
      </Provider>
    );

    const descriptionInput = screen.getByLabelText(/description/i);
    const priceInput = screen.getByLabelText(/price/i);
    const stockInput = screen.getByLabelText(/stock/i);

    fireEvent.change(descriptionInput, { target: { value: "Test Product" } });
    fireEvent.change(priceInput, { target: { value: "99.99" } });
    fireEvent.change(stockInput, { target: { value: "10" } });

    expect(descriptionInput).toHaveValue("Test Product");
    expect(priceInput).toHaveValue(99.99);
    expect(stockInput).toHaveValue(10);
  });

  test("shows validation error for invalid input", async () => {
    render(
      <Provider store={store}>
        <AddProductForm />
      </Provider>
    );

    const submitButton = screen.getByRole("button", { name: /add product/i });

    // Submit without filling description
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        /Description must be filled, Price and Stock must be valid non-negative numbers./i
      )
    ).toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockAddProduct).not.toHaveBeenCalled();
  });

  test("dispatches actions and calls api on valid submission", async () => {
    const newProductData = {
      description: "Test Product",
      price: 50,
      stock: 5,
      categories: [],
    };
    const addedProduct = { ...newProductData, id: "test-id-123" };
    mockAddProduct.mockResolvedValueOnce(addedProduct);

    render(
      <Provider store={store}>
        <AddProductForm />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/stock/i), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    // Check that start action is dispatched
    expect(store.dispatch).toHaveBeenCalledWith(addProductStart());

    // Check that API is called with correct data
    expect(mockAddProduct).toHaveBeenCalledTimes(1);
    expect(mockAddProduct).toHaveBeenCalledWith(newProductData);

    // Wait for async operations and check success action
    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        addProductSuccess(addedProduct)
      );
    });

    // Check form reset
    expect(screen.getByLabelText(/description/i)).toHaveValue("");
    expect(screen.getByLabelText(/price/i)).toHaveValue(0);
    expect(screen.getByLabelText(/stock/i)).toHaveValue(0);
  });

  test("dispatches failure action on api error", async () => {
    const error = new Error("API Error");
    mockAddProduct.mockRejectedValueOnce(error);

    render(
      <Provider store={store}>
        <AddProductForm />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Fail Product" },
    });
    fireEvent.change(screen.getByLabelText(/price/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/stock/i), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add product/i }));

    expect(store.dispatch).toHaveBeenCalledWith(addProductStart());
    expect(mockAddProduct).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        addProductFailure(error.message)
      );
    });

    // Check that local error message is shown
    expect(
      await screen.findByText(/Failed to add product: API Error/i)
    ).toBeInTheDocument();

    // Form should not reset on error
    expect(screen.getByLabelText(/description/i)).toHaveValue("Fail Product");
  });
});
