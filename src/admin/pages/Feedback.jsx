import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";// ✅ Deployment API Base URL

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Show only first 10 initially
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

  // ✅ Date formatter
  const formatDate = (createdAt) => {
    if (!createdAt) return "-";
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) return "-";
    return d.toISOString().split("T")[0];
  };

  // ✅ Fix category issues like: Eye / eye / Lep / Lip
  const normalizeCategory = (cat) => {
    if (!cat) return "n/a";

    let c = String(cat).trim().toLowerCase();

    // Fix backend spelling mistakes
    if (c === "lep") c = "lip";
    if (c === "lips") c = "lip";
    if (c === "eyes") c = "eye";

    return c;
  };

  // ✅ Normalize feedback object
  const normalizeFeedback = (f) => {
    return {
      id: f.id ?? f.feedbackId ?? "",
      userId: f.user_id ?? f.userId ?? f.user?.id ?? "N/A",
      productId: f.product_id ?? f.productId ?? f.product?.id ?? "N/A",
      category: normalizeCategory(f.category),
      rating: Number(f.rating ?? 0),
      comment: f.comment ?? "",
      date: f.created_at ?? f.createdAt ?? f.date ?? null,
    };
  };

  // ✅ Fetch all feedbacks
  const fetchAllFeedbacks = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("⚠️ Token not found. Please login again.");
        setFeedbacks([]);
        return;
      }

      const res = await fetch(`${BASE_URL}/api/feedback`, {
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
        throw new Error("Server error while fetching feedbacks");
      }

      const data = await res.json();
      const normalized = (data || []).map(normalizeFeedback);

      // ✅ Sort latest first
      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

      setFeedbacks(normalized);
      setVisibleCount(10);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search feedbacks by Product ID
  const fetchSearchFeedbacks = async (productId) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setError("⚠️ Token not found. Please login again.");
        setFeedbacks([]);
        return;
      }

      const res = await fetch(
        `${BASE_URL}/api/feedback/search?productId=${encodeURIComponent(
          productId
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
        throw new Error("Server error while searching feedbacks");
      }

      const data = await res.json();
      const normalized = (data || []).map(normalizeFeedback);

      // ✅ Sort latest first
      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));

      setFeedbacks(normalized);
      setVisibleCount(10);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load feedbacks on first render
  useEffect(() => {
    fetchAllFeedbacks();
  }, []);

  // ✅ Search API call (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        fetchAllFeedbacks();
      } else {
        fetchSearchFeedbacks(search.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ Filters (frontend)
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchCategory =
      category === "all" || normalizeCategory(f.category) === category;

    const matchSearch = String(f.productId)
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // ✅ Show only visibleCount feedbacks
  const visibleFeedbacks = filteredFeedbacks.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleCount(10);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-pink-700 mb-1">
          Customer Feedback
        </h1>
        <p className="text-gray-500 text-sm">
          Showing {Math.min(visibleCount, filteredFeedbacks.length)} of{" "}
          {filteredFeedbacks.length} feedbacks
        </p>
      </div>

      {/* FILTER CARD */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="eye">Eye</option>
          <option value="lip">Lip</option>
          <option value="face">Face</option>
          <option value="skin">Skin</option>
          <option value="nails">Nails</option>
        </select>

        <input
          type="text"
          placeholder="Search by Product ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-md px-3 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg shadow">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="bg-pink-50 text-pink-700 px-4 py-3 rounded-lg shadow">
          ⏳ Loading feedbacks...
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Product ID</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-center">Rating</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {visibleFeedbacks.map((f) => (
              <tr key={f.id} className="border-t hover:bg-pink-50 transition">
                <td className="px-4 py-3 font-medium">{f.userId}</td>

                <td className="px-4 py-3 font-semibold text-pink-600">
                  {f.productId}
                </td>

                <td className="px-4 py-3 capitalize">
                  <span className="px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-700">
                    {f.category}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <span className="text-yellow-500">
                    {"★".repeat(Math.max(0, f.rating))}
                  </span>
                  <span className="text-gray-400 ml-1">({f.rating})</span>
                </td>

                <td className="px-4 py-3 max-w-xs truncate text-gray-700">
                  {f.comment}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {formatDate(f.date)}
                </td>
              </tr>
            ))}

            {!loading && visibleFeedbacks.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No feedback found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* SHOW MORE BUTTON */}
      {!loading && filteredFeedbacks.length > 10 && (
        <div className="flex justify-center gap-4">
          {visibleCount < filteredFeedbacks.length ? (
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
