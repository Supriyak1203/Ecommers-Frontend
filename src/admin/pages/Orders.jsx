import { useEffect, useMemo, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // show only top 10 first
  const [visibleCount, setVisibleCount] = useState(10);

  const getToken = () => localStorage.getItem("token");

  // ✅ Convert yyyy-MM-dd -> dd-MM-yyyy (Backend expects this)
  const formatToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // ✅ Normalize backend order keys
  const normalizeOrders = (data = []) => {
    return (data || []).map((o) => ({
      ...o,

      id: o.id || o.orderId || o.order_id || o.orderID,

      total: o.total ?? o.total_price ?? o.totalPrice ?? 0,

      userId: o.userId ?? o.user_id ?? o.userID ?? "—",

      productId: o.productId ?? o.product_id ?? "—",
      productName: o.productName ?? o.product_name ?? "—",

      quantity: o.quantity ?? o.qty ?? 1,

      payment: o.payment ?? o.paymentMethod ?? o.method ?? "COD",

      address: o.address ?? o.address_line ?? o.shippingAddress ?? "—",

      status: o.status ?? "Pending",

      shippingPartner: o.shippingPartner ?? o.shipping_partner ?? "",
      partnerContact: o.partnerContact ?? o.partner_contact ?? "",

      // delivery date normalize
      expectedDelivery:
        o.expectedDelivery ?? o.expected_delivery ?? o.expectedDate ?? "",
    }));
  };

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await fetch("http://localhost:8080/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();
      setOrders(normalizeOrders(data));

      // reset view count
      setVisibleCount(10);
    } catch (err) {
      console.error("Error loading orders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Backend Search API
  const fetchSearchOrders = async (query) => {
    try {
      setLoading(true);
      const token = getToken();

      const res = await fetch(
        `http://localhost:8080/api/orders/search?query=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
      setOrders(normalizeOrders(data));

      // show top 10 of searched results also
      setVisibleCount(10);
    } catch (err) {
      console.error("Search error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounce search (wait 400ms then call API)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!search.trim()) {
        fetchOrders();
      } else {
        fetchSearchOrders(search.trim());
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Load orders first time
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🛠 Update local state
  const updateOrder = (id, field, value) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, [field]: value } : order
    );
    setOrders(updated);
  };

  // ✅ PUT API update ONLY shipping details
  const saveShippingDetails = async (order) => {
    if (!order?.id) {
      alert("❌ Order ID missing – cannot update");
      return;
    }

    try {
      const token = getToken();

      const payload = {
        shippingPartner: order.shippingPartner,
        partnerContact: order.partnerContact,

        // ✅ Convert date format before sending
        expectedDelivery: formatToDDMMYYYY(order.expectedDelivery),
      };

      const res = await fetch(
        `http://localhost:8080/api/orders/${order.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Update failed");
      }

      alert("✅ Shipping details updated successfully");
      fetchOrders();
    } catch (err) {
      console.error("Update failed:", err.message);
      alert("❌ Failed to update shipping details");
    }
  };

  // ✅ Show only top visibleCount orders
  const visibleOrders = useMemo(() => {
    return orders.slice(0, visibleCount);
  }, [orders, visibleCount]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-pink-700">
        Orders Management
      </h1>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Search by Order ID, User ID, Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-pink-300 rounded-lg
                     focus:ring-2 focus:ring-pink-500 outline-none"
        />

        <button
          onClick={() => {
            setSearch("");
            fetchOrders();
          }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Clear
        </button>

        <button
          onClick={fetchOrders}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
        >
          Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Product ID</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Total (₹)</th>
              <th className="px-4 py-3 text-center">Payment</th>
              <th className="px-4 py-3 text-left">Address</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Shipping Partner</th>
              <th className="px-4 py-3 text-left">Partner Contact</th>
              <th className="px-4 py-3 text-center">Delivery Date</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.userId}</td>
                <td className="px-4 py-3">{order.productName || "—"}</td>
                <td className="px-4 py-3 text-pink-600">{order.productId}</td>
                <td className="px-4 py-3 text-center">{order.quantity}</td>

                <td className="px-4 py-3 text-center font-semibold">
                  ₹{order.total}
                </td>

                <td className="px-4 py-3 text-center">{order.payment}</td>

                <td className="px-4 py-3 max-w-xs truncate">{order.address}</td>

                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                    {order.status}
                  </span>
                </td>

                {/* Shipping Partner */}
                <td className="px-4 py-3">
                  <input
                    value={order.shippingPartner}
                    onChange={(e) =>
                      updateOrder(order.id, "shippingPartner", e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="BlueDart / Delhivery..."
                  />
                </td>

                {/* Partner Contact */}
                <td className="px-4 py-3">
                  <input
                    value={order.partnerContact}
                    onChange={(e) =>
                      updateOrder(order.id, "partnerContact", e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-full"
                    placeholder="9876543210"
                  />
                </td>

                {/* Expected Delivery */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="date"
                    value={order.expectedDelivery || ""}
                    onChange={(e) =>
                      updateOrder(order.id, "expectedDelivery", e.target.value)
                    }
                    className="border rounded-lg px-2 py-1 text-sm"
                  />
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => saveShippingDetails(order)}
                    className="bg-pink-600 text-white px-4 py-1.5 rounded-lg hover:bg-pink-700"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}

            {/* EMPTY STATE */}
            {orders.length === 0 && !loading && (
              <tr>
                <td colSpan="13" className="px-4 py-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}

            {/* LOADING */}
            {loading && (
              <tr>
                <td colSpan="13" className="px-4 py-6 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SEE MORE BUTTONS */}
      {orders.length > 10 && (
        <div className="flex justify-center gap-3">
          {visibleCount < orders.length && (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              See More
            </button>
          )}

          {visibleCount > 10 && (
            <button
              onClick={() => setVisibleCount(10)}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
