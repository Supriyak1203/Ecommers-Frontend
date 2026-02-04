import { X } from "lucide-react";

const CheckoutModal = ({ isOpen, onClose, total }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Checkout</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea
              required
              placeholder="Enter your address"
              className="w-full border border-gray-300 rounded px-3 py-2 mt-1 resize-none"
            ></textarea>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded mt-2"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
