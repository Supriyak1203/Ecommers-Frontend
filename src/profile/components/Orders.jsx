import { useEffect, useState } from "react";

export default function Orders({ openDetails, openTrack }) {

  const [orders, setOrders] = useState([]);

  const handleReorder = (order) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(
      p => p.id === order.productId
    );

    if (existing) {
      existing.qty += order.quantity;
    } else {
      cart.push({
        id: order.productId,
        name: order.productName,
        qty: order.quantity,
        price: order.totalPrice / order.quantity,
        image: order.imageUrl,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart 🛒");

  };

  useEffect(() => {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/orders/my/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(console.error);

  }, []);

  return (
    <div>

      <h2 className="text-2xl font-semibold mb-6">
        My Orders
      </h2>

      {orders.map(o => (
        <div
          key={o.id}
          className="border rounded-xl bg-white p-5 mb-4 flex gap-4"
        >

          <img
            src={o.imageUrl || "https://via.placeholder.com/80"}
            className="w-20 h-20 object-cover rounded border"
          />

          <div className="flex-1">

            <div className="flex justify-between mb-2">
              <p className="font-semibold">
                Order {o.id}
              </p>

              <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                {o.status}
              </span>
            </div>

            <p className="font-semibold">
              {o.productName}
            </p>

            <p className="text-sm text-gray-500">
              Qty: {o.quantity}
            </p>

            <div className="flex justify-between mt-2">

              <div className="flex gap-6 text-sm text-pink-600 font-semibold">

                <button onClick={() => openDetails(o.id)}>
                  VIEW DETAILS
                </button>

                <button onClick={() => openTrack(o.id)}>
                  TRACK ORDER
                </button>

                <button
                  onClick={() => handleReorder(o)}
                >
                  REORDER
                </button>

              </div>

              <p className="font-bold">
                ₹{o.totalPrice}
              </p>

            </div>

          </div>
        </div>
      ))}

    </div>
  );
}
