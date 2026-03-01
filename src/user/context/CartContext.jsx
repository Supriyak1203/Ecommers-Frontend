import { createContext, useContext, useEffect, useState } from "react";
import BASE_URL from "../../config/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [total, setTotal] = useState(0);

  /* 🔐 Always read latest auth */
  const getAuth = () => ({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  });

  /* 🛒 CART COUNT */
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  /* 🔁 LOAD CART */
  const fetchCart = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    try {
      const res = await fetch(`${BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId,
        },
      });

      if (res.status === 401) {
        localStorage.clear();
        window.location.href = "/signin";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();

      setCart(data.items || []);
      setSubtotal(data.subTotal || 0);
      setGst(data.gst || 0);
      setTotal(data.grandTotal || 0);
    } catch (err) {
      console.error("Fetch cart error:", err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ➕ ADD TO CART */
  const addToCart = async (product) => {
    const { token, userId } = getAuth();
    if (!token || !userId || !product?.id) return;

    try {
      const res = await fetch(`${BASE_URL}/cart/add/${product.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userId,
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.productName,
          imageUrl: product.imageUrl,
          quantity: 1,
          price: product.price,
          totalPrice: product.price,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to add item");
      }

      const data = await res.json();

      setCart(data.items || []);
      setSubtotal(data.subTotal || 0);
      setGst(data.gst || 0);
      setTotal(data.grandTotal || 0);
    } catch (err) {
      console.error("Add cart error:", err.message);
    }
  };

  /* 🔢 UPDATE QUANTITY */
  const updateQty = async (cartId, qty) => {
    const { token, userId } = getAuth();
    if (!token || !userId || qty < 1) return;

    try {
      const res = await fetch(
        `${BASE_URL}/cart/update/${cartId}?quantity=${qty}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            userId,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to update cart");

      const data = await res.json();

      setCart(data.items || []);
      setSubtotal(data.subTotal || 0);
      setGst(data.gst || 0);
      setTotal(data.grandTotal || 0);
    } catch (err) {
      console.error("Update cart error:", err.message);
    }
  };

  /* ❌ REMOVE FROM CART */
  const removeFromCart = async (cartId) => {
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    try {
      const res = await fetch(`${BASE_URL}/cart/remove/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          userId,
        },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      const data = await res.json();

      setCart(data.items || []);
      setSubtotal(data.subTotal || 0);
      setGst(data.gst || 0);
      setTotal(data.grandTotal || 0);
    } catch (err) {
      console.error("Remove cart error:", err.message);
    }
  };

  /* 🧹 CLEAR CART */
  const clearCart = async () => {
    const { token, userId } = getAuth();
    if (!token || !userId) return;

    try {
      await fetch(`${BASE_URL}/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          userId,
        },
      });

      setCart([]);
      setSubtotal(0);
      setGst(0);
      setTotal(0);
    } catch (err) {
      console.error("Clear cart error:", err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        fetchCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
        gst,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
