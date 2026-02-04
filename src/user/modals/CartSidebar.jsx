import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQty,
    clearCart,
    subtotal,
    gst,
    total,
  } = useCartContext();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="bg-white w-96 h-full p-6 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm flex-1">
            Your cart is empty.
          </p>
        ) : (
          <>
            {/* CART ITEMS */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b pb-3"
                >
                  {/* IMAGE */}
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 rounded object-cover cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${item.productId}`);
                    }}
                  />

                  {/* DETAILS */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onClose();
                      navigate(`/product/${item.productId}`);
                    }}
                  >
                    <h3 className="text-sm font-semibold">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.price}
                    </p>

                    {/* QTY CONTROLS */}
                    <div className="flex items-center mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(item.id, item.quantity - 1);
                        }}
                        className="px-2 bg-gray-200"
                      >
                        -
                      </button>

                      <span className="px-3">{item.quantity}</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQty(item.id, item.quantity + 1);
                        }}
                        className="px-2 bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate("/checkout");
                }}
                className="w-full bg-pink-600 text-white py-2 rounded mt-2"
              >
                Checkout
              </button>

              <button
                onClick={clearCart}
                className="w-full border py-2 rounded"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
