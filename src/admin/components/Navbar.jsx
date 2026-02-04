import { Menu, UserCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar({ toggleSidebar, setPage }) {
  const [open, setOpen] = useState(false);

  // Admin name from localStorage
  const adminName = localStorage.getItem("fullName") || "Admin";

  const handleLogout = () => {
    // Remove auth related keys only
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("role");

    sessionStorage.clear();

    setOpen(false);

    // Force redirect to signin (strongest method)
    window.location.href = "/signin";

    // If NOT using routing, comment above line and use:
    // setPage("signin");
  };

  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6 relative">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Menu size={22} />
        </button>

        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => setPage("dashboard")}
        >
          Admin Dashboard
        </h1>
      </div>

      {/* RIGHT */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
        >
          <UserCircle size={26} />
          <span className="text-gray-700 font-medium">
            {adminName}
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded shadow-lg border z-50">
            <button
              onClick={() => {
                setPage("profile");
                setOpen(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Settings
            </button>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
