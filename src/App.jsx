import { useState, useEffect } from "react";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import Welcome from "./pages/Welcome";

export default function App() {
  const [page, setPage] = useState("signin");
  const [fullName, setFullName] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // 🔁 Check login on refresh
  useEffect(() => {
    const name = localStorage.getItem("fullName");
    if (name) {
      setFullName(name);
      setPage("welcome");
    }
  }, []);

  // 🔓 Logout
  const handleLogout = () => {
    localStorage.clear();
    setFullName("");
    setShowMenu(false);
    setPage("signup"); // redirect after logout
  };

  return (
    <div className="bg-pink-50 min-h-screen">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              if (fullName) setPage("welcome");
              else setPage("signup");
            }}
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br 
              from-pink-500 via-pink-600 to-rose-500 
              flex items-center justify-center shadow-lg ring-2 ring-pink-200">
              <span className="absolute text-white font-extrabold text-sm -translate-x-1">G</span>
              <span className="absolute text-white font-extrabold text-sm translate-x-1">C</span>
            </div>

            <span className="text-xl font-extrabold text-pink-600 tracking-wide">
              GlowCosmetic
            </span>
          </div>

          {/* RIGHT SIDE */}
          {!fullName ? (
            <div className="space-x-6">
              <button
                onClick={() => setPage("signup")}
                className="text-pink-600 font-semibold hover:underline"
              >
                Signup
              </button>
              <button
                onClick={() => setPage("signin")}
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-pink-600 font-semibold"
              >
                {fullName}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border shadow-lg rounded-xl">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-pink-50 rounded-xl"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </nav>

      {/* ================= PAGES ================= */}
      {page === "welcome" && <Welcome />}
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "signin" && <Signin setPage={setPage} />}
      {page === "forgot" && <ForgotPassword setPage={setPage} />}

    </div>
  );
}
