import { useEffect, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
} from "lucide-react";

// ✅ Import BASE_URL
import BASE_URL from "../../config/api"; // adjust path if needed

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get token from localStorage
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("TOKEN") ||
    localStorage.getItem("authToken") ||
    "";

  // ✅ Normalize orders properly
  const normalizeOrders = (data = []) => {
    return (data || []).map((o) => ({
      orderId: o.orderId ?? o.order_id ?? o.id ?? "—",
      customer:
        o.customer ??
        o.full_name ??
        o.fullName ??
        o.username ??
        o.name ??
        "—",
      status: o.status ?? "Pending",
      amount: o.amount ?? o.total ?? o.total_price ?? 0,
    }));
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!token) {
          setError("⚠️ Token not found. Please login again.");
          setLoading(false);
          return;
        }

        // ✅ 1) DASHBOARD STATS API
        const statsRes = await fetch(
          `${BASE_URL}/api/admin/dashboard`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!statsRes.ok) {
          throw new Error("Dashboard API failed: " + statsRes.status);
        }

        const statsData = await statsRes.json();
        setStats(statsData);

        // ✅ 2) RECENT ORDERS API
        const ordersRes = await fetch(
          `${BASE_URL}/api/admin/recent-orders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!ordersRes.ok) {
          throw new Error("Recent Orders API failed: " + ordersRes.status);
        }

        const ordersData = await ordersRes.json();
        console.log("✅ Recent Orders API Response:", ordersData);

        setOrders(normalizeOrders(ordersData));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-pink-700">
          Dashboard Overview
        </h1>

        <span className="px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
          Live Stats
        </span>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Customers", value: stats.totalCustomers, icon: Users },
          { title: "Products", value: stats.totalProducts, icon: Package },
          { title: "Orders", value: stats.totalOrders, icon: ShoppingCart },
          {
            title: "Revenue",
            value: `₹${stats.totalRevenue}`,
            icon: IndianRupee,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total {item.title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                  {item.value}
                </h2>
              </div>

              <div className="p-4 rounded-xl bg-pink-100 text-pink-600">
                <item.icon size={28} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-sm">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-gray-500">Updated live</span>
            </div>
          </div>
        ))}
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3">Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 font-medium">{order.orderId}</td>

                  <td className="font-medium text-gray-700">
                    {order.customer}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="font-semibold">₹{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {orders.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No recent orders found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
