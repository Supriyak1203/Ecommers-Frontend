import axios from "axios";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";
import BASE_URL from "../../config/api";

const ProductDetailModal = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const availableStock = product?.stock ?? product?.quantity ?? 0;

  const images =
    product?.images && product.images.length > 0
      ? product.images
      : [product?.imageUrl];

  const [activeImage, setActiveImage] = useState(images[0]);
  const [ratingInput, setRatingInput] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  /* ================= LOAD REVIEWS ================= */

  useEffect(() => {
    if (isOpen && product?.id) {
      setActiveImage(images[0]);
      setRatingInput(0);
      setReviewText("");
      fetchReviews();
    }
  }, [isOpen, product]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/feedback/product/${product.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(res.data || []);
    } catch (err) {
      console.error("FETCH REVIEWS ERROR:", err);
    }
  };

  /* ================= CART ================= */

  const handleAddToCart = () => {
    if (availableStock <= 0) return;

    addToCart({
      id: product.id,
      productId: product.id,
      productName: product.productName,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      totalPrice: product.price,
      stock: product.stock,
    });

    onClose();
  };

  /* ================= POST REVIEW ================= */

  const handlePostReview = async () => {
    if (!reviewText.trim() || ratingInput === 0) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/feedback`,
        {
          userId: Number(userId),
          productId: product.id,
          category: product.category,
          rating: ratingInput,
          comment: reviewText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((prev) => [res.data, ...prev]);
      setRatingInput(0);
      setReviewText("");
    } catch (err) {
      console.error("POST REVIEW ERROR:", err);
      alert("Failed to submit review");
    }
  };

  /* ================= AVERAGE ================= */

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : product.rating?.toFixed(1) || "0.0";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="bg-white w-full max-w-4xl h-[85vh] rounded-xl flex overflow-hidden relative pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE */}
        <div className="w-2/5 bg-gray-100 p-3">
          <div className="relative h-[70%]">
            <img
              src={activeImage}
              alt={product.productName}
              className="w-full h-full object-cover rounded-lg"
            />

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

          {/* THUMBS */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    activeImage === img
                      ? "border-pink-600"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="w-3/5 p-6 overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50"
          >
            <X size={24} />
          </button>

          <p className="text-xs text-gray-500 uppercase">
            {product.category}
          </p>

          <h2 className="text-2xl font-semibold mt-1">
            {product.productName}
          </h2>

          <p
            className={`mt-1 text-sm font-medium ${
              availableStock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {availableStock > 0
              ? `Available: ${availableStock} in stock`
              : "Out of Stock"}
          </p>

          {/* STARS */}
          <div className="flex items-center mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`text-lg ${
                  i <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {averageRating} / 5
            </span>
          </div>

          <p className="text-rose-600 text-xl font-bold mt-3">
            ₹{product.price.toLocaleString()}
          </p>

          <p className="text-gray-600 text-sm mt-3">
            {product.description}
          </p>

          {/* CART */}
          <button
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className={`w-full mt-5 py-2 rounded font-semibold ${
              availableStock > 0
                ? "bg-pink-600 text-white"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>

          {/* HOW TO USE */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-sm text-rose-600">
              How to Use
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {product.usage ||
                product.howToUse ||
                product.instructions ||
                "No usage instructions provided."}
            </p>
          </div>

          {/* DETAILS */}
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-rose-600">
              Details
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {product.purpose ||
                product.details ||
                product.specification ||
                product.about ||
                "No additional details available."}
            </p>
          </div>

          {/* FEEDBACK */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-sm mb-2">
              Customer Feedback
            </h4>

            {/* INPUT */}
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRatingInput(i)}
                  className={`text-xl mr-1 cursor-pointer ${
                    i <= ratingInput
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded p-2 text-sm"
            />

            <button
              onClick={handlePostReview}
              className="mt-2 bg-pink-600 text-white px-4 py-2 rounded text-sm"
            >
              Post Review
            </button>

            {/* LIST */}
            <div className="mt-4 space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border rounded p-3 relative"
                >
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i <= r.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-700">
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
