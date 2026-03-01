import { useEffect, useState } from "react";

/* ✅ Global Backend URL */
import BASE_URL from "../../config/api";

export default function TrackOrder({ orderId, back }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Track fetch failed");
        }
        return res.json();
      })
      .then((data) => {
        console.log("TRACK ORDER:", data);
        setOrder(data);
      })
      .catch((err) => console.error("TRACK ERROR:", err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (!orderId) {
    return (
      <p className="text-red-600">
        Order ID missing
      </p>
    );
  }

  if (loading) {
    return <p>Loading tracking details...</p>;
  }

  if (!order) {
    return <p>No order data found.</p>;
  }

  return (
    <div>
      {/* BACK */}
      <button
        onClick={back}
        className="text-pink-600 mb-4 font-semibold"
      >
        ← Back to Orders
      </button>

      <h2 className="text-2xl font-semibold mb-6">
        Track Order
      </h2>

      {/* TRACK CARD */}
      <div className="border rounded-xl p-6 bg-white space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">
            Order #{order.id}
          </p>

          <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs">
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-semibold">Courier:</span>{" "}
            {order.shippingPartner || "Not assigned yet"}
          </p>

          <p>
            <span className="font-semibold">Contact:</span>{" "}
            {order.partnerContact || "Pending"}
          </p>

          <p>
            <span className="font-semibold">
              Expected Delivery:
            </span>{" "}
            {order.expectedDelivery || "To be updated"}
          </p>
        </div>
      </div>
    </div>
  );
}
