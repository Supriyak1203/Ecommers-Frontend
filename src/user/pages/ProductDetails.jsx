import axios from "axios";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";
import BASE_URL from "../../config/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    );
  }

  const isInCart = cart.some((item) => item.productId === product.id);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6 grid md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="relative">
          <img
            src={
              product.imageUrl?.startsWith("data:")
                ? product.imageUrl
                : `data:image/jpeg;base64,${product.imageUrl}`
            }
            alt={product.productName}
            className="w-full h-[450px] object-cover rounded-xl"
          />

          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 bg-white p-3 rounded-full shadow"
          >
            <Heart
              size={22}
              className={
                isInWishlist(product.id)
                  ? "fill-pink-600 text-pink-600"
                  : "text-gray-400"
              }
            />
          </button>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold">{product.productName}</h1>
          <p className="text-gray-500 mt-2">Category: {product.category}</p>
          <p className="text-pink-600 text-2xl font-bold mt-4">
            ₹{product.price}
          </p>
          <p className="text-gray-700 mt-6">{product.description}</p>

          {isInCart ? (
            <p className="mt-4 text-green-600 font-semibold">
              ✔ Already added to cart
            </p>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800"
            >
              Add to Cart
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-3 border rounded-full hover:bg-gray-100"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
