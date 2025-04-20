import React from "react";
import ProductList from "@/features/products/ProductList";
import AddProductForm from "@/features/products/components/AddProductForm";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <ErrorBoundary fallbackMessage="Application Error: Something went wrong in the main app.">
      <div className={styles.container}>
        <h1 className={styles.title}>Product Management SPA</h1>
        <hr className={styles.separator} />
        <AddProductForm />
        <hr className={styles.separator} />
        <ProductList />
      </div>
    </ErrorBoundary>
  );
};

export default App;
