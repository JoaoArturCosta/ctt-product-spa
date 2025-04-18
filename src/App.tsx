import React from "react";
import ProductList from "@/features/products/ProductList"; // Import ProductList
import AddProductForm from "@/features/products/AddProductForm"; // Import AddProductForm

const App: React.FC = () => {
  return (
    <div
      style={{
        maxWidth: "800px", // Limit max width
        margin: "20px auto", // Center the container
        padding: "20px",
        fontFamily: "sans-serif", // Basic font
      }}
    >
      <h1 style={{ textAlign: "center" }}>Product Management SPA</h1>
      <hr /> {/* Add a separator */}
      <AddProductForm /> {/* Render AddProductForm */}
      <hr /> {/* Add a separator */}
      <ProductList />
    </div>
  );
};

export default App;
