import React from "react";
import ProductList from "@/features/products/ProductList"; // Import ProductList
import AddProductForm from "@/features/products/AddProductForm"; // Import AddProductForm
import styles from "./App.module.css"; // Import CSS Module

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Product Management SPA</h1>
      <hr className={styles.separator} /> {/* Add a separator */}
      <AddProductForm /> {/* Render AddProductForm */}
      <hr className={styles.separator} /> {/* Add a separator */}
      <ProductList />
    </div>
  );
};

export default App;
