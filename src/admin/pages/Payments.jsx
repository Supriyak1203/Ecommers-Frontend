import { useEffect, useState } from "react";
import BASE_URL from "../../config/api"; // adjust path if needed

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Show only first 10 payments initially
  const [visibleCount, setVisibleCount] = useState(10);

  // ✅ Get token from localStorage
  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("TOKEN") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  // ✅ Format date: 2026-01-10T11:16:15 => 2026-01-10
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toISOString().split("T")[0];
  };

  // ✅ Normalize backend payment data
  const normalizePayment = (p) => {
    return {
      id: p.paymentId ?? p.id ?? "N/A",
      orderId: String(p.orderId ?? "N/A"),
      userId: String(p.userId ?? "N/A"),
      amount: p.amount ?? 0,
      method: p.method ?? "N/A",
      status: p.status ?? "N/A",
      date: p.date ?? null,
    };
  };

  // ✅ Fetch All Payments
  const fetchAllPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("⚠️ Token not found. Please login again.");
        setPayments([]);
        setLoading(false);
        return;
      }

     const res = await fetch(`${BASE_URL}/api/admin/payments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("401 Unauthorized ❌ Please login again.");
      }

      if (!res.ok) {
        throw new Error("Server error while fetching payments");
      }

      const data = await res.json();
      const normalized = (data || []).map(normalizePayment);

      // ✅ Latest first
      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

      setPayments(normalized);
      setVisibleCount(10); // reset to top 10
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search Payments by orderId keyword
  const fetchSearchPayments = async (keyword) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("⚠️ Token not found. Please login again.");
        setPayments([]);
        setLoading(false);
        return;
      }

       const res = await fetch(
        `${BASE_URL}/api/admin/payments/search?keyword=${encodeURIComponent(
          keyword
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        throw new Error("401 Unauthorized ❌ Please login again.");
      }

      if (!res.ok) {
        throw new Error("Server error while searching payments");
      }

      const data = await res.json();
      const normalized = (data || []).map(normalizePayment);

      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

      setPayments(normalized);
      setVisibleCount(10); // reset to top 10 on search
    } catch (err) {
      setError(err.message || "Something went wrong");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load payments on first render
  useEffect(() => {
    fetchAllPayments();
  }, []);

  // ✅ Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        fetchAllPayments();
      } else {
        fetchSearchPayments(search.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ Show only visible payments
  const visiblePayments = payments.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleCount(10);
  };

  return (
    <div className="p-6">
      {/* TITLE */}
      <h1 className="text-2xl font-semibold text-pink-700 mb-2">
        Payments – Transaction History
      </h1>

      <p className="text-gray-500 text-sm mb-4">
        Showing {Math.min(visibleCount, payments.length)} of {payments.length}{" "}
        payments
      </p>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by Order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-80 px-3 py-2 border border-pink-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow mb-4">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-pink-50 text-pink-700 px-4 py-3 rounded-lg shadow mb-4">
          ⏳ Loading payments...
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {!loading && visiblePayments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              visiblePayments.map((p, index) => (
                <tr key={index} className="border-b hover:bg-pink-50">
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2 font-medium">{p.orderId}</td>
                  <td className="px-4 py-2">{p.userId}</td>
                  <td className="px-4 py-2">₹{p.amount}</td>
                  <td className="px-4 py-2">{p.method}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          p.status === "PAID" || p.status === "Paid"
                            ? "bg-green-100 text-green-600"
                            : p.status === "PENDING" ||
                              p.status === "Pending" ||
                              p.status === "CREATED"
                            ? "bg-yellow-100 text-yellow-600"
                            : p.status === "FAILED" || p.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }
                      `}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">{formatDate(p.date)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SHOW MORE BUTTON */}
      {!loading && payments.length > 10 && (
        <div className="flex justify-center gap-4 mt-5">
          {visibleCount < payments.length ? (
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition"
            >
              Show More
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}
