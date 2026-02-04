import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

/* ================= AUTH ================= */
import ForgotPassword from "./pages/ForgotPassword";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

/* ================= ADMIN ================= */
import AdminNavbar from "./admin/components/Navbar";
import Sidebar from "./admin/components/Sidebar";

import AdminProfile from "./admin/pages/AdminProfile";
import CRM from "./admin/pages/CRM";
import Dashboard from "./admin/pages/Dashboard";
import Feedback from "./admin/pages/Feedback";
import Inventory from "./admin/pages/Inventory";
import Orders from "./admin/pages/Orders";
import Payments from "./admin/pages/Payments";

/* ================= USER ================= */
import Footer from "./user/components/Footer";
import UserNavbar from "./user/components/Navbar";
import ScrollToTop from "./user/components/ScrollToTop";

import Checkout from "./user/pages/Checkout";
import Home from "./user/pages/Home";
import ProductDetails from "./user/pages/ProductDetails";
import Wishlist from "./user/pages/Wishlist";

/* ================= PROFILE ================= */
import ProfilePage from "./profile/pages/ProfilePage";

import AuthModal from "./user/modals/AuthModal";
import CartSidebar from "./user/modals/CartSidebar";
import CheckoutModal from "./user/modals/CheckoutModal";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [category, setCategory] = useState("All");

  const isProfilePage = location.pathname.startsWith("/profile");

  /* ================= AUTH CHECK ================= */

  useEffect(() => {
    const name = localStorage.getItem("fullName");
    const savedRole = localStorage.getItem("role");

    const publicRoutes = ["/signin", "/signup", "/forgot"];

    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    if (name && savedRole) {
      setFullName(name);
      setRole(savedRole);
    } else {
      navigate("/signin");
    }
  }, [navigate, location.pathname]);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.clear();
    setFullName("");
    setRole("");
    navigate("/signin");
  };

  /* ================= ADMIN VIEW ================= */

  if (role === "ADMIN") {
    return (
      <div className="h-screen bg-gray-100 flex flex-col">
        <AdminNavbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} />

          <div className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/admin" element={<Dashboard />} />
              <Route path="/admin/crm" element={<CRM />} />
              <Route path="/admin/inventory" element={<Inventory />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/payments" element={<Payments />} />
              <Route path="/admin/feedback" element={<Feedback />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Routes>
          </div>
        </div>
      </div>
    );
  }

  /* ================= PUBLIC + USER VIEW ================= */

  return (
    <div className="bg-pink-50 min-h-screen">

      {/* 🔓 PUBLIC NAVBAR */}
      {!role && (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
          <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                GC
              </div>
              <span className="text-xl font-extrabold text-pink-600">
                GlowCosmetic
              </span>
            </div>

            <div className="space-x-6">
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-gray-700 hover:text-pink-600"
              >
                Signup
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="font-semibold text-gray-700 hover:text-pink-600"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* 👤 USER NAVBAR */}
      {role === "USER" && !isProfilePage && (
        <UserNavbar
          openCart={() => setShowCart(true)}
          openAuth={() => setShowAuth(true)}
          onSearch={setSearchText}
          onSort={setSortOrder}
          onCategory={setCategory}
          fullName={fullName}
          onLogout={handleLogout}
        />
      )}

      <main className={isProfilePage ? "pt-0" : "pt-20"}>
        <ScrollToTop />

        {/* 🔐 AUTH ROUTES */}
        {!role && (
          <Routes>
            <Route
              path="/signin"
              element={<Signin setRole={setRole} setFullName={setFullName} />}
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route
              path="*"
              element={<Signin setRole={setRole} setFullName={setFullName} />}
            />
          </Routes>
        )}

        {/* 🛍️ USER ROUTES */}
        {role === "USER" && (
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  openCheckout={() => setShowCheckout(true)}
                  searchText={searchText}
                  sortOrder={sortOrder}
                  category={category}
                />
              }
            />

            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* 👤 PROFILE */}
            <Route
              path="/profile"
              element={<ProfilePage onLogout={handleLogout} />}
            />
          </Routes>
        )}
      </main>

      {/* 👇 FOOTER */}
      {role === "USER" && !isProfilePage && <Footer />}

      {role === "USER" && (
        <>
          <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
          {showCheckout && (
            <CheckoutModal close={() => setShowCheckout(false)} />
          )}
          {showAuth && <AuthModal close={() => setShowAuth(false)} />}
        </>
      )}
    </div>
  );
}
