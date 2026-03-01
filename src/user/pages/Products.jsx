import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";
import axios from "axios";
import BASE_URL from "../../config/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, cart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  const isInCart = (productId) =>
    cart.some((item) => item.productId === productId);

  return (
    <section className="min-h-screen px-6 py-16 bg-gray-50">
      <h2 className="text-4xl font-bold text-center mb-12">
        Our <span className="text-pink-600">Products</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 relative"
          >
            {/* IMAGE */}
            <img
              src={
                product.imageUrl?.startsWith("data:")
                  ? product.imageUrl
                  : `data:image/jpeg;base64,${product.imageUrl}`
              }
              alt={product.productName}
              className="h-56 w-full object-cover rounded-lg mb-4"
            />

            {/* WISHLIST BUTTON */}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
            >
              <Heart
                size={20}
                className={
                  isInWishlist(product.id)
                    ? "fill-pink-600 text-pink-600"
                    : "text-gray-400"
                }
              />
            </button>

            {/* NAME */}
            <h3 className="text-lg font-semibold">{product.productName}</h3>

            {/* DESCRIPTION */}
            <p className="text-gray-600 text-sm mt-1">
              {product.description}
            </p>

            {/* PRICE */}
            <p className="text-pink-600 font-bold mt-2">
              ₹{product.price}
            </p>

            {/* ADD TO CART BUTTON */}
            <button
              onClick={() => addToCart(product)}
              disabled={isInCart(product.id)}
              className={`mt-4 w-full py-2 rounded-full text-white font-semibold transition ${
                isInCart(product.id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-700"
              }`}
            >
              {isInCart(product.id)
                ? "Added to Cart"
                : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
