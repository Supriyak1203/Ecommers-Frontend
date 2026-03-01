import { useEffect, useState } from "react";

// ✅ Import BASE_URL
import BASE_URL from "../../config/api";

/*
  CRM = Customer Relationship Management
  Shows registered customers from backend (Admin Protected)
*/

export default function CRM() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  // ✅ Common fetch helper
  const fetchWithAuth = async (url) => {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    // Unauthorized
    if (res.status === 401) {
      throw new Error("Unauthorized (401). Please login as Admin again.");
    }

    // Other server error
    if (!res.ok) {
      throw new Error(`Server Error: ${res.status}`);
    }

    // Safe JSON parse
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  };

  // ✅ Fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const data = await fetchWithAuth(
        `${BASE_URL}/api/admin/crm/customers`
      );

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Search customers (backend)
  const searchCustomers = async (keyword) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const url = keyword
        ? `${BASE_URL}/api/admin/crm/search?keyword=${encodeURIComponent(
            keyword
          )}`
        : `${BASE_URL}/api/admin/crm/customers`;

      const data = await fetchWithAuth(url);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomers([]);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Search handler
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    searchCustomers(value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-pink-700 mb-4">
        CRM – Customer Records
      </h1>

      {/* ERROR MESSAGE */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300">
          {errorMsg}
        </div>
      )}

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={handleSearch}
        className="mb-4 w-80 px-3 py-2 border border-pink-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-pink-400"
      />

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Gender</th>
              <th className="px-4 py-3">Age</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b hover:bg-pink-50 transition"
                >
                  <td className="px-4 py-2">{c.id ?? "-"}</td>
                  <td className="px-4 py-2">{c.userId ?? "-"}</td>
                  <td className="px-4 py-2 font-medium">
                    {c.fullName ?? "-"}
                  </td>
                  <td className="px-4 py-2">{c.email ?? "-"}</td>
                  <td className="px-4 py-2">{c.mobile ?? "-"}</td>
                  <td className="px-4 py-2">{c.address || "-"}</td>
                  <td className="px-4 py-2">{c.gender || "-"}</td>
                  <td className="px-4 py-2">{c.age || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
