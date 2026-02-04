import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useWishlistContext } from "../context/WishlistContext";
import ProductDetailModal from "../modals/ProductDetailModal";

const Wishlist = () => {
  // ✅ NEW backend-driven wishlist
  const { wishlist } = useWishlistContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  /* 🔹 Fetch all products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  /* 🔹 Map wishlist productIds → real products */
  const wishlistProducts = products.filter((p) =>
    wishlist.some((w) => w.productId === p.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-100 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* BACK BUTTON */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white bg-pink-600 hover:bg-pink-700 transition shadow-md rounded-full px-5 py-2 font-semibold"
          >
            <ChevronLeft size={18} />
            Back to Home
          </button>
        </div>

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-10 text-center tracking-wide">
          Your Wishlist
        </h2>

        {/* EMPTY STATE */}
        {wishlistProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg md:text-xl">
            Your wishlist is empty. Start adding your favorite products to see them here!
          </p>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group relative transform hover:scale-105 transition duration-500"
              >
                <ProductCard
                  product={product}
                  openDetail={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT DETAIL MODAL */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            isOpen={true}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
