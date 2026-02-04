import {
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";



const Navbar = ({
  openCart = () => {},
  openAuth = () => {},
  onSearch = () => {},
  onSort = () => {},
  onCategory = () => {},
  onLogout // 👈 ADD THIS
}) => {

  const navigate = useNavigate();
  const { wishlist = [] } = useWishlistContext(); // ✅ default empty array
  const { cartCount } = useCartContext();
              // ✅ default empty array

  const [shopOpen, setShopOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const shopRef = useRef(null);
  const sortRef = useRef(null);
  const profileRef = useRef(null);

 

  /* 🔍 CALL onSearch when user types */
  useEffect(() => {
    onSearch(searchInput);
  }, [searchInput, onSearch]);

  /* ❌ CLOSE DROPDOWNS WHEN CLICKING OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-6">

        {/* LOGO */}
        <h1
          className="text-2xl font-bold text-pink-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          GlowIn
        </h1>

        {/* SEARCH */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">

          {/* SHOP */}
          <div ref={shopRef} className="relative">
            <button
              onClick={() => {
                setShopOpen(!shopOpen);
                setSortOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1 font-medium hover:text-pink-600"
            >
              Shop <ChevronDown size={16} />
            </button>

            {shopOpen && (
              <div className="absolute top-8 left-0 bg-white shadow-lg rounded-lg w-44 p-3 z-50">
                {["All", "Eyes", "Lips", "Face", "Nails", "Skin"].map(
                  (cat) => (
                    <p
                      key={cat}
                      onClick={() => {
                        onCategory(cat);
                        navigate("/");
                        setShopOpen(false);
                      }}
                      className="text-sm py-1 cursor-pointer hover:text-pink-600"
                    >
                      {cat}
                    </p>
                  )
                )}
              </div>
            )}
          </div>

          {/* SORT */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => {
                setSortOpen(!sortOpen);
                setShopOpen(false);
                setProfileOpen(false);
              }}
              className="flex items-center gap-1 font-medium hover:text-pink-600"
            >
              Sort Price <ChevronDown size={16} />
            </button>

            {sortOpen && (
              <div className="absolute top-8 left-0 bg-white shadow-lg rounded-lg w-44 p-3 z-50">
                <p
                  onClick={() => {
                    onSort("low");
                    navigate("/");
                    setSortOpen(false);
                  }}
                  className="text-sm py-1 cursor-pointer hover:text-pink-600"
                >
                  Low → High
                </p>
                <p
                  onClick={() => {
                    onSort("high");
                    navigate("/");
                    setSortOpen(false);
                  }}
                  className="text-sm py-1 cursor-pointer hover:text-pink-600"
                >
                  High → Low
                </p>
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative"
          >
            <Heart className="w-6 h-6" />
            {wishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* CART */}
          <button onClick={openCart} className="relative">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* PROFILE DROPDOWN */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setShopOpen(false);
                setSortOpen(false);
              }}
            >
              <User className="w-6 h-6" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg w-40 py-2 z-50">
                <p
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </p>
                <p
                  onClick={() => {
                    navigate("/settings");
                    setProfileOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  Settings
                </p>
                <p
  onClick={() => {
    onLogout();          // 🔥 CALL APP LOGOUT
    setProfileOpen(false);
  }}
  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer text-red-500"
>
  Logout
</p>

              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
