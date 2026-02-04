import { X } from "lucide-react";
import { useWishlistContext } from "../context/WishlistContext";

const WishlistSidebar = ({ close }) => {
  const { wishlist, removeFromWishlist } = useWishlistContext();

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg p-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Wishlist</h2>
          <button onClick={close}>
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        {wishlist.length === 0 ? (
          <p className="text-gray-500 text-sm">Wishlist is empty</p>
        ) : (
          <ul className="space-y-3">
            {wishlist.map((item) => (
              <li
                key={item.id}
                className="border p-2 rounded flex justify-between items-center"
              >
                {/* IMAGE + NAME + PRICE */}
                <div className="flex items-center gap-2">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-gray-500">₹{item.price}</p>
                  </div>
                </div>

                {/* REMOVE BUTTON */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-pink-600 text-xs font-semibold"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WishlistSidebar;
