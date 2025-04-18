import React from "react";
import ProductList from "@/features/products/ProductList"; // Import ProductList
import AddProductForm from "@/features/products/AddProductForm"; // Import AddProductForm

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      {" "}
      {/* Add some basic padding */}
      <h1>Product Management SPA</h1>
      <hr /> {/* Add a separator */}
      <AddProductForm /> {/* Render AddProductForm */}
      <hr /> {/* Add a separator */}
      <ProductList />
    </div>
  );
};

export default App;
