import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetailModal from "../modals/ProductDetailModal";

const ProductGrid = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* OPEN PRODUCT MODAL */
  const openModal = (product) => {
    if (!product) return;
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  /* CLOSE PRODUCT MODAL */
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            openDetail={openModal}
          />
        ))}
      </div>

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default ProductGrid;
