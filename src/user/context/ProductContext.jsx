import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [sortType, setSortType] = useState(null);

  const sortByPrice = (type) => {
    setSortType(type); // "LOW_TO_HIGH" | "HIGH_TO_LOW"
  };

  return (
    <ProductContext.Provider value={{ sortType, sortByPrice }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
