import React from "react";
import ProductList from "@/features/products/ProductList";
import AddProductForm from "@/features/products/components/AddProductForm";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Management SPA</h1>
      <hr className={styles.separator} />
      <AddProductForm />
      <hr className={styles.separator} />
      <ProductList />
    </div>
  );
};

export default App;
