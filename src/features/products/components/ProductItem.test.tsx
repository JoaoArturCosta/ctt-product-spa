import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import ProductItem from "./ProductItem";
import { Product } from "../productSlice";
import * as api from "../api"; // Mock the api module
import {
  updateProductStart,
  updateProductSuccess,
  updateProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  deleteProductFailure,
} from "../productSlice";

// Mock the API module
jest.mock("../api");
const mockUpdateProduct = api.updateProduct as jest.MockedFunction<
  typeof api.updateProduct
>;
const mockDeleteProduct = api.deleteProduct as jest.MockedFunction<
  typeof api.deleteProduct
>;

// Configure mock Redux store
const mockStore = configureStore([]);
const initialState = { products: { items: [], isLoading: false, error: null } }; // Minimal state

const mockProduct: Product = {
  id: "prod-1",
  description: "Mock Item 1",
  price: 19.99,
  stock: 50,
  categories: ["mock-cat"],
};

describe("ProductItem", () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
    mockUpdateProduct.mockClear();
    mockDeleteProduct.mockClear();
    // Mock window.confirm for delete tests
    window.confirm = jest.fn(() => true); // Default to confirming deletion
  });

  test("renders product details correctly in view mode", () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(
      screen.getByText(`Price: $${mockProduct.price.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Stock: ${mockProduct.stock}`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  test("switches to edit mode when Edit button is clicked", () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toHaveValue(
      mockProduct.description
    );
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toHaveValue(
      mockProduct.price
    );
    expect(screen.getByPlaceholderText(/stock/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/stock/i)).toHaveValue(
      mockProduct.stock
    );
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("updates input fields in edit mode", () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    const descriptionInput = screen.getByPlaceholderText(/description/i);
    const priceInput = screen.getByPlaceholderText(/price/i);
    const stockInput = screen.getByPlaceholderText(/stock/i);

    fireEvent.change(descriptionInput, { target: { value: "Updated Desc" } });
    fireEvent.change(priceInput, { target: { value: "123.45" } });
    fireEvent.change(stockInput, { target: { value: "99" } });

    expect(descriptionInput).toHaveValue("Updated Desc");
    expect(priceInput).toHaveValue(123.45);
    expect(stockInput).toHaveValue(99);
  });

  test("cancels edit mode without saving", () => {
    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Change a value
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Temporary Change" },
    });

    // Click Cancel
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // Should be back in view mode with original details
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/description/i)
    ).not.toBeInTheDocument();
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockUpdateProduct).not.toHaveBeenCalled();
  });

  test("saves changes and dispatches actions on Save click", async () => {
    const updatedData = { description: "Updated Desc", price: 100, stock: 10 };
    const expectedApiPayload = {
      description: "Updated Desc",
      price: 100,
      stock: 10,
    }; // Assuming all changed
    const updatedFullProduct = { ...mockProduct, ...updatedData };
    mockUpdateProduct.mockResolvedValueOnce(updatedFullProduct);

    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Make changes
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: updatedData.description },
    });
    fireEvent.change(screen.getByPlaceholderText(/price/i), {
      target: { value: updatedData.price.toString() },
    });
    fireEvent.change(screen.getByPlaceholderText(/stock/i), {
      target: { value: updatedData.stock.toString() },
    });

    // Click Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Check actions and API call
    expect(store.dispatch).toHaveBeenCalledWith(updateProductStart());
    expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
    expect(mockUpdateProduct).toHaveBeenCalledWith(
      mockProduct.id,
      expectedApiPayload
    );

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateProductSuccess(updatedFullProduct)
      );
    });

    // Should switch back to view mode
    expect(
      screen.queryByRole("button", { name: /save/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText(updatedData.description)).toBeInTheDocument(); // Check if updated description is shown
  });

  test("handles save failure", async () => {
    const error = new Error("Update failed");
    mockUpdateProduct.mockRejectedValueOnce(error);

    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));

    // Make a change
    fireEvent.change(screen.getByPlaceholderText(/description/i), {
      target: { value: "Will Fail Update" },
    });

    // Click Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(store.dispatch).toHaveBeenCalledWith(updateProductStart());
    expect(mockUpdateProduct).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        updateProductFailure(mockProduct.id, error.message)
      );
    });

    // Should remain in edit mode on failure (current implementation)
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  test("calls delete handler and dispatches actions on Delete click", async () => {
    mockDeleteProduct.mockResolvedValueOnce(undefined); // Successful delete returns void/undefined

    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    // Click Delete
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    // Check confirmation was called
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith(
      `Are you sure you want to delete ${mockProduct.description}?`
    );

    // Check actions and API call
    expect(store.dispatch).toHaveBeenCalledWith(deleteProductStart());
    expect(mockDeleteProduct).toHaveBeenCalledTimes(1);
    expect(mockDeleteProduct).toHaveBeenCalledWith(mockProduct.id);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        deleteProductSuccess(mockProduct.id)
      );
    });
  });

  test("does not delete if confirmation is cancelled", () => {
    (window.confirm as jest.Mock).mockImplementationOnce(() => false); // Simulate cancelling confirm

    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(mockDeleteProduct).not.toHaveBeenCalled();
  });

  test("handles delete failure", async () => {
    const error = new Error("Delete failed");
    mockDeleteProduct.mockRejectedValueOnce(error);

    render(
      <Provider store={store}>
        <ProductItem product={mockProduct} />
      </Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(deleteProductStart());
    expect(mockDeleteProduct).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        deleteProductFailure(mockProduct.id, error.message)
      );
    });
  });
});
