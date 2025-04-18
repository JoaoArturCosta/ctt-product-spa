import React from "react";
import ProductList from "@/features/products/ProductList"; // Import ProductList

const App: React.FC = () => {
  return (
    <div>
      <h1>Product Management SPA</h1>
      <ProductList />
    </div>
  );
};

export default App;
