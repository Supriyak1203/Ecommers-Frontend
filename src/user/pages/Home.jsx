import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import ProductGrid from "../components/ProductGrid";

/* ✅ IMPORT BASE URL */
import BASE_URL from "../../config/api";

const Home = ({ searchText, sortOrder, category }) => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 📦 FETCH PRODUCTS FROM BACKEND */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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

  // SORT LOW TO HIGH
  if (sortOrder === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  // SORT HIGH TO LOW
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
