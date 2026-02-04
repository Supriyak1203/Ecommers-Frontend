import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

const Home = ({ searchText, sortOrder, category }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📦 FETCH PRODUCTS FROM BACKEND */
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch products error:", err);
        setLoading(false);
      });
  }, []);

  /* ✅ HANDLE PRODUCT CLICK */
  const openDetail = (product) => {
    if (!product?.id) return;
    navigate(`/product/${product.id}`);
  };

  /* 🔍 FILTER + SORT */
  let filteredProducts = [...products];

  // SEARCH
  if (searchText?.trim()) {
    filteredProducts = filteredProducts.filter((p) =>
      (p.productName || "")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  // CATEGORY
  if (category && category !== "All") {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === category
    );
  }

  // SORT
  if (sortOrder === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOrder === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading products...
          </p>
        ) : (
          <ProductGrid
            products={filteredProducts}
            openDetail={openDetail}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
