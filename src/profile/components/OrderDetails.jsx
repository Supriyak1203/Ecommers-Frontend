import { useEffect, useState } from "react";

/* ✅ Global Backend URL */
import BASE_URL from "../../config/api";

export default function OrderDetails({ orderId, back }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setOrder)
      .catch(console.error);
  }, [orderId]);

  if (!orderId) return <p className="text-red-600">Order ID missing</p>;
  if (!order) return <p>Loading...</p>;

  return (
    <div>
      {/* BACK */}
      <button
        onClick={back}
        className="text-pink-600 mb-6 font-semibold"
      >
        ← Back to Orders
      </button>

      <h2 className="text-2xl font-semibold mb-6">
        Order Details
      </h2>

      {/* TOP CARD */}
      <div className="border rounded-xl p-6 bg-white mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">
            Order #{order.id}
          </p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium
              ${
                order.status === "Completed"
                  ? "bg-green-100 text-green-600"
                  : order.status === "Pending" || order.status === "PLACED"
                  ? "bg-yellow-100 text-yellow-600"
                  : order.status === "Shipped" || order.status === "SHIPPED"
                  ? "bg-blue-100 text-blue-600"
                  : order.status === "Paid" || order.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
          >
            {order.status}
          </span>
        </div>

        <div className="flex gap-5">
          {/* PRODUCT IMAGE */}
          <img
            src={order.imageUrl || "https://via.placeholder.com/100"}
            alt={order.productName}
            className="w-24 h-24 rounded border object-cover"
          />

          <div className="flex-1">
            <p className="font-semibold">
              {order.productName}
            </p>

            <p className="text-sm text-gray-500">
              Quantity: {order.quantity}
            </p>

            <p className="mt-2 font-semibold text-lg">
              ₹{order.totalPrice}
            </p>

            <p className="text-sm text-gray-500">
              Payment: {order.paymentOption || "Online"}
            </p>
          </div>
        </div>
      </div>

      {/* DELIVERY */}
      <div className="border rounded-xl p-6 bg-white">
        <h3 className="font-semibold mb-3">
          Delivery Address
        </h3>

        <p className="text-gray-700">
          {order.address || "Address not available"}
        </p>

        <p className="mt-2 text-sm">
          Expected Delivery:{" "}
          <span className="font-semibold">
            {order.expectedDelivery || "To be updated"}
          </span>
        </p>
      </div>
    </div>
  );
}
