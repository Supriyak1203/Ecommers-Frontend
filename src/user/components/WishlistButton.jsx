import { Heart } from "lucide-react";
import { useWishlistContext } from "../context/WishlistContext";

const WishlistButton = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useWishlistContext();

  return (
    <button onClick={() => toggleWishlist(product)}>
      <Heart
        className={`w-6 h-6 transition ${
          isInWishlist(product.id)
            ? "fill-pink-600 text-pink-600"
            : "text-gray-400 hover:text-pink-600"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
