import { createStore, Store, Dispatch } from "redux";
import rootReducer, { RootState } from "./reducer";
import { ProductActionTypes } from "@/features/products/productSlice";

// We can add middleware here if needed later (e.g., for logging)
// import { composeWithDevTools } from 'redux-devtools-extension'; // Example for Redux DevTools
// const enhancer = composeWithDevTools(applyMiddleware(...middleware));

// Combine all action types if more features are added
type AppAction = ProductActionTypes; // | OtherFeatureActionTypes etc.

const configureStore = (): Store<RootState, AppAction> => {
  // Note: No middleware like thunk is applied as per requirements
  const store = createStore(
    rootReducer
    // Add enhancers here if needed (e.g., for Redux DevTools extension)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

const store = configureStore();

// Define AppDispatch explicitly based on the AppAction type
export type AppDispatch = Dispatch<AppAction>;

export default store;
