import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const BASE_URL = "http://localhost:8080/checkout";

const Checkout = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartContext();

  const [step, setStep] = useState(1);

  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);

  // ✅ FIXED: hook moved INSIDE component
  const [addressId, setAddressId] = useState(null);

  const [address, setAddress] = useState({
    line: "",
    city: "",
    state: "",
    pincode: "",
    mobile: "",
    altMobile: "",
  });

  const [paymentMode, setPaymentMode] = useState("");

  /* 🔐 AUTH */
  const getAuth = () => ({
    token: localStorage.getItem("token"),
    userId: localStorage.getItem("userId"),
  });

  /* 🔁 LOAD CHECKOUT SUMMARY */
  useEffect(() => {
    const fetchSummary = async () => {
      const { token, userId } = getAuth();

      try {
        const res = await fetch(`${BASE_URL}/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
            userId,
          },
        });

        if (!res.ok) throw new Error("Failed to load checkout");

        const data = await res.json();

        setSummary(data.priceDetails);
        setItems(data.items || []);
      } catch (err) {
        console.error("Checkout load error:", err);
      }
    };

    fetchSummary();
  }, []);

  const addressValid = Object.values(address).every(
    (v) => v.trim() !== ""
  );

  const paymentValid =
    paymentMode === "UPI" ||
    paymentMode === "CARD" ||
    paymentMode === "COD";

  /* ================= LOAD ADDRESS ================= */
  useEffect(() => {
    if (step !== 2) return;

    const loadAddress = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const res = await fetch(
          `http://localhost:8080/address/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.length > 0) {
          const latest = data[0];

          setAddressId(latest.id);

          setAddress((prev) => ({
            ...prev,
            line: latest.addressLine,
            city: latest.city,
            state: latest.state,
            pincode: latest.pincode,
          }));
        }

        const profRes = await fetch(
          `http://localhost:8080/api/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const prof = await profRes.json();

        setAddress((prev) => ({
          ...prev,
          mobile: prof.mobileNumber || "",
        }));
      } catch (err) {
        console.error("Address load error:", err);
      }
    };

    loadAddress();
  }, [step]);

  /* ================= SAVE ADDRESS ================= */
  const saveAddress = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const payload = {
      addressLine: address.line,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    };

    const url = addressId
      ? `http://localhost:8080/address/${addressId}`
      : "http://localhost:8080/address/add";

    const method = addressId ? "PUT" : "POST";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    if (!addressId) headers.userId = userId;

    await fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload),
    });
  };




  /* 🧾 PLACE ORDER */
  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("userId"));
    const firstItem = items[0];

    
    try {
      await saveAddress();

      /* ================= COD ================= */
      if (paymentMode === "COD") {
        const res = await fetch(
          "http://localhost:8080/api/orders/cod",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
  userId: Number(userId),
  productId: Number(firstItem.productId),
  quantity: Number(firstItem.quantity),
  productName: firstItem.productName,
  totalPrice: firstItem.price * firstItem.quantity
})

          }
        );

        if (!res.ok) throw new Error("COD order failed");

        alert("🎉 Order placed successfully!");
        await clearCart();
        navigate("/");
        return;
      }

      /* ================= ONLINE ================= */
      if (paymentMode === "UPI" || paymentMode === "CARD") {
        const orderRes = await fetch(
          "http://localhost:8080/api/payment/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
           body: JSON.stringify({
  userId: Number(userId),
  productId: Number(firstItem.productId),
  quantity: Number(firstItem.quantity),
  productName: firstItem.productName,
  totalPrice: summary.finalAmount,
})

          }
        );

        if (!orderRes.ok)
          throw new Error("Payment order creation failed");

        const data = await orderRes.json();

        const options = {
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          handler: async function (response) {
            await fetch(
              "http://localhost:8080/api/payment/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(response),
              }
            );

            alert("🎉 Payment successful!");
            await clearCart();
            navigate("/");
          },
        };

        const razor = new window.Razorpay(options);
        razor.open();
      }
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Checkout</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-pink-600 font-semibold"
          >
            ← Back
          </button>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-8 text-sm font-semibold">
          {["Price", "Address", "Payment", "Summary"].map((s, i) => (
            <span
              key={s}
              className={
                step >= i + 1
                  ? "text-pink-600"
                  : "text-gray-400"
              }
            >
              {s}
            </span>
          ))}
        </div>

        {/* ================= STEP 1: PRICE ================= */}
        {step === 1 && summary && (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between font-medium">
                  <span>
                    Product #{item.productId} × {item.quantity}
                  </span>
                  <span>₹{item.totalPrice}</span>
                </div>
              </div>
            ))}

            <div className="border-t pt-4 space-y-1 font-semibold">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{summary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹{summary.gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{summary.deliveryCharges}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span>₹{summary.finalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ADDRESS ================= */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Address Line", "line"],
              ["City", "city"],
              ["State", "state"],
              ["Pincode", "pincode"],
              ["Mobile", "mobile"],
              ["Alternate Mobile", "altMobile"],
            ].map(([label, key]) => (
              <input
                key={key}
                placeholder={label}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
                value={address[key]}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    [key]: e.target.value,
                  })
                }
              />
            ))}
          </div>
        )}

        {/* ================= STEP 3: PAYMENT ================= */}
        {step === 3 && (
          <div className="space-y-5">

            {[
              { id: "UPI", label: "UPI" },
              { id: "CARD", label: "Debit / Credit Card" },
              { id: "COD", label: "Cash on Delivery" },
            ].map((m) => (
              <label
                key={m.id}
                className={`border rounded-lg p-4 flex gap-3 cursor-pointer ${
                  paymentMode === m.id
                    ? "border-pink-600 bg-pink-50"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  checked={paymentMode === m.id}
                  onChange={() => {
                    setPaymentMode(m.id);
                    setUpiApp("");
                  }}
                />
                {m.label}
              </label>
            ))}

          </div>
        )}

        {/* ================= STEP 4: SUMMARY ================= */}
        {step === 4 && summary && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">
              Order Summary
            </h3>

            <p>Subtotal: ₹{summary.subtotal}</p>
            <p>GST: ₹{summary.gst}</p>
            <p>Delivery: ₹{summary.deliveryCharges}</p>
            <p className="font-bold text-lg">
              Total: ₹{summary.finalAmount}
            </p>

            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">
                Delivery Address
              </p>
              <p>
                {address.line}, {address.city}
              </p>
              <p>
                {address.state} - {address.pincode}
              </p>
              <p>
                📞 {address.mobile} / {address.altMobile}
              </p>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 border rounded-lg"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={async () => {
                if (step === 2) await saveAddress();
                setStep(step + 1);
              }}
              disabled={
                (step === 2 && !addressValid) ||
                (step === 3 && !paymentValid)
              }
              className="ml-auto px-6 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              onClick={placeOrder}
              className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
