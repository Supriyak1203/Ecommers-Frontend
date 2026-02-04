import { Eye, Heart, ShoppingCart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";

const ProductCard = ({ product, openDetail }) => {
  const { addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden relative">
      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={product.imageUrl}   // ✅ FIXED — matches API
          alt={product.productName}
          className="h-full w-full object-cover cursor-pointer group-hover:scale-110 transition duration-500"
          loading="lazy"
          onClick={() => openDetail?.(product)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://dummyimage.com/400x400/e5e7eb/000000&text=No+Image";
          }}
        />

        {/* HOVER ACTIONS */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <button
            onClick={() => openDetail?.(product)}
            className="bg-white p-3 rounded-full"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => addToCart(product)}
            className="bg-white p-3 rounded-full"
          >
            <ShoppingCart size={18} />
          </button>

          <button
            onClick={() => {
              addToCart(product);
              navigate("/checkout");
            }}
            className="bg-white p-3 rounded-full"
          >
            <Zap size={18} />
          </button>
        </div>

        {/* WISHLIST */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
        >
          <Heart
            size={18}
            className={
              isInWishlist(product.id)
                ? "fill-pink-600 text-pink-600"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 text-center">
        <h3 className="font-semibold text-sm">
          {product.productName}
        </h3>

        <p className="text-pink-600 font-bold text-lg mt-2">
          ₹{product.price}
        </p>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
