import { useEffect, useState } from "react";
import BASE_URL from "../../config/api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const [form, setForm] = useState({
    productId: "",
    name: "",
    category: "",
    price: "",
    description: "",
    usage: "",
    details: "",
    quantity: "",
    images: [],
  });

  const token = localStorage.getItem("token");

  /* ================== LOAD PRODUCTS ================== */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) throw new Error("Unauthorized: Please login");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      const mapped = data.map((p) => ({
        id: p.id,
        productId: "P" + p.id,
        name: p.productName,
        category: p.category,
        price: p.price,
        description: p.description,
        usage: p.usage,
        details: p.details,
        quantity: p.quantity,
        createdAt: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : "",
        images: p.imageUrl ? [p.imageUrl] : [],
      }));

      setProducts(mapped);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================== TOKEN GUARD ================== */
  useEffect(() => {
    if (!token) {
      alert("Session expired. Please login again.");
      window.location.href = "/signin";
      return;
    }
    fetchProducts();
  }, [token]);

  /* ================== INPUT HANDLER ================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================== IMAGE UPLOAD ================== */
  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/products/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        alert("Image upload failed");
        return;
      }

      const data = await res.json();
      uploadedUrls.push(data.imageUrl);
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
  };

  /* ================== SAVE PRODUCT ================== */
  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert("Product Name & Price are required");
      return;
    }

    const payload = {
      productName: form.name,
      category: form.category,
      price: parseFloat(form.price),
      description: form.description,
      usage: form.usage,
      details: form.details,
      quantity: parseInt(form.quantity, 10),
      imageUrl: form.images[0] || "",
    };

    try {
      const res = await fetch(
        editId
          ? `${BASE_URL}/products/${editId}`
          : `${BASE_URL}/products/add`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.status === 401) throw new Error("Unauthorized: Please login");
      if (!res.ok) throw new Error("Failed to save product");

      await fetchProducts();

      setForm({
        productId: "",
        name: "",
        category: "",
        price: "",
        description: "",
        usage: "",
        details: "",
        quantity: "",
        images: [],
      });

      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================== EDIT ================== */
  const editProduct = (product) => {
    setForm({
      productId: product.productId,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      usage: product.usage,
      details: product.details,
      quantity: product.quantity,
      images: product.images || [],
    });

    setEditId(product.id);
    setShowForm(true);
  };

  /* ================== DELETE ================== */
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) throw new Error("Unauthorized: Please login");
      if (!res.ok) throw new Error("Failed to delete product");

      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================== FILTER & SEARCH ================== */
  const filteredProducts = products.filter(
    (p) =>
      p.productId.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  /* ================== RENDER ================== */
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-pink-700">Inventory</h1>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg shadow hover:bg-pink-700"
          >
            + Add Product
          </button>
        )}
      </div>

     

      {/* ================= FORM ================= */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-6xl mx-auto mt-6">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editId ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImages}
                className="w-full border border-gray-300 rounded-lg p-3
                           file:bg-pink-600 file:text-white file:border-0
                           file:px-5 file:py-2 file:rounded-lg
                           hover:file:bg-pink-700"
              />
            </div>

            {[
              { name: "productId", placeholder: "Product ID" },
              { name: "name", placeholder: "Product Name" },
              { name: "category", placeholder: "Category" },
              { name: "price", placeholder: "Price" },
              { name: "quantity", placeholder: "Quantity" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.placeholder}
                </label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 rounded-lg p-3
                             focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            ))}

            {[
              { name: "description", placeholder: "Product Description" },
              { name: "usage", placeholder: "Usage Instructions" },
              { name: "details", placeholder: "Additional Details" },
            ].map((field) => (
              <div key={field.name} className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  {field.placeholder}
                </label>
                <textarea
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg p-3
                             resize-none focus:outline-none
                             focus:ring-2 focus:ring-pink-400"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg border border-gray-300
                         text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-pink-600 text-white
                         hover:bg-pink-700 shadow-md"
            >
              Save Product
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      {!showForm && (
        <>
          <input
            type="text"
            placeholder="Search by Product ID, Name or Category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(10);
            }}
            className="w-full md:w-1/3 px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-pink-100 text-pink-800">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product ID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Usage</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-pink-50">
                    <td className="px-4 py-2">
                     
                  <img
  src={
    p.images?.[0] && p.images[0].startsWith("http")
      ? p.images[0]
      : "https://placehold.co/56x56?text=No+Image"
  }
  alt={p.name}
  className="w-14 h-14 rounded-lg object-cover"
/>
                    </td>
                    <td className="px-4 py-2">{p.productId}</td>
                    <td className="px-4 py-2 font-medium">{p.name}</td>
                    <td className="px-4 py-2">{p.category}</td>
                    <td className="px-4 py-2">₹{p.price}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{p.description}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{p.usage}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{p.details}</td>
                    <td className="px-4 py-2">{p.quantity}</td>
                    <td className="px-4 py-2">{p.createdAt}</td>
                    <td className="px-4 py-2 text-center space-x-3">
                      <button
                        onClick={() => editProduct(p)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="11" className="py-6 text-center text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredProducts.length > visibleCount && (
            <div className="text-center mt-4">
              <button
                onClick={() => setVisibleCount((v) => v + 10)}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
