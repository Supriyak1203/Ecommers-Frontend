import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

const BASE_URL = "http://localhost:8080/wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]); // full objects from API

  /* 🔐 AUTH */
  const getAuth = () => ({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  });

  /* 🔁 LOAD WISHLIST FROM BACKEND */
  const fetchWishlist = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) {
      setWishlist([]);
      return;
    }

    try {
      const res = await fetch(BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();
      setWishlist(data || []);
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ❤️ TOGGLE WISHLIST */
  const toggleWishlist = async (product) => {
    const { token, userId } = getAuth();
    if (!token || !userId || !product?.id) return;

    const existing = wishlist.find(
      (item) => item.productId === product.id
    );

    try {
      if (existing) {
        // ❌ REMOVE
        const res = await fetch(
          `${BASE_URL}/${existing.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              userId,
            },
          }
        );

        if (!res.ok)
          throw new Error("Failed to remove wishlist");

        setWishlist((prev) =>
          prev.filter((item) => item.id !== existing.id)
        );
      } else {
        // ➕ ADD
        const res = await fetch(
          `${BASE_URL}/${product.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              userId,
            },
          }
        );

        if (!res.ok)
          throw new Error("Failed to add wishlist");

        const data = await res.json();

        setWishlist((prev) => [...prev, data.item]);
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    }
  };

  /* ❌ REMOVE DIRECTLY */
  const removeFromWishlist = async (wishlistId) => {
    const { token, userId } = getAuth();
    if (!token || !userId || !wishlistId) return;

    try {
      const res = await fetch(
        `${BASE_URL}/${wishlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            userId,
          },
        }
      );

      if (!res.ok)
        throw new Error("Failed to remove wishlist");

      setWishlist((prev) =>
        prev.filter((item) => item.id !== wishlistId)
      );
    } catch (err) {
      console.error("Wishlist remove error:", err);
    }
  };

  /* 🔍 CHECK */
  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => item.productId === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        fetchWishlist,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/* HOOK */
export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error(
      "useWishlistContext must be used inside WishlistProvider"
    );
  }
  return context;
};
