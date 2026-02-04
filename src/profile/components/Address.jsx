import axios from "axios";
import { useEffect, useState } from "react";

export default function Address() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [addr, setAddr] = useState({
    name: "",
    mobile: "",
    line: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [savedAddress, setSavedAddress] = useState(null);

  /* ================= LOAD USER + ADDRESS ================= */
  useEffect(() => {
    const loadUserAndAddress = async () => {
      try {
        // 🔵 FETCH USER TABLE
        const userRes = await axios.get(
          `http://localhost:8080/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("USER API RESPONSE:", userRes.data);

        // 🔵 FETCH ADDRESS TABLE
        const addrRes = await axios.get(
          `http://localhost:8080/address/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = userRes.data || {};
        const addresses = addrRes.data || [];

        const latest = addresses.length > 0 ? addresses[0] : null;

        // 🔥 SAFE FIELD MAPPING
        const fullName =
          user.fullName ||
          user.name ||
          user.username ||
          "";

        const mobile =
          user.mobileNumber ||
          user.mobile ||
          user.phone ||
          "";

        // 👉 autofill name + mobile
        setAddr({
          name: fullName,
          mobile: mobile,
          line: "",
          city: "",
          state: "",
          pincode: "",
        });

        // 👉 saved card
        if (latest) {
          setSavedAddress({
            name: fullName,
            mobile: mobile,
            line: latest.addressLine,
            city: latest.city,
            state: latest.state,
            pincode: latest.pincode,
          });
        }

      } catch (err) {
        console.error("Load address error:", err);
      }
    };

    if (userId && token) loadUserAndAddress();
  }, [userId, token]);

  /* ================= SAVE ADDRESS ================= */
  const saveAddress = async () => {
    if (!addr.line || !addr.city || !addr.state || !addr.pincode) {
      alert("Please fill required fields");
      return;
    }

    const payload = {
      addressLine: addr.line,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    };

    try {
      await axios.post("http://localhost:8080/address/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      });

      alert("✅ Address Saved Successfully");

      // reload latest address
      const addrRes = await axios.get(
        `http://localhost:8080/address/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const latest = addrRes.data[0];

      setSavedAddress({
        name: addr.name,
        mobile: addr.mobile,
        line: latest.addressLine,
        city: latest.city,
        state: latest.state,
        pincode: latest.pincode,
      });

      // clear only address inputs
      setAddr((prev) => ({
        ...prev,
        line: "",
        city: "",
        state: "",
        pincode: "",
      }));

    } catch (err) {
      console.error("Error saving address", err);
      alert("❌ Failed to save address");
    }
  };

  return (
    <>
      <h2 className="font-head text-2xl mb-6">Saved Address</h2>

      {/* SAVED ADDRESS CARD */}
      {savedAddress && (
        <div className="border rounded-lg p-4 mb-4">
          <strong>{savedAddress.name}</strong>
          <br />
          {savedAddress.line}
          <br />
          {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}
          <br />
          📞 {savedAddress.mobile}
        </div>
      )}

      {/* FORM */}
      <div className="border rounded-lg p-4 space-y-2">
        {Object.keys(addr).map((key) => (
          <input
            key={key}
            className="w-full border p-2 rounded"
            placeholder={key.toUpperCase()}
            value={addr[key]}
            onChange={(e) =>
              setAddr({ ...addr, [key]: e.target.value })
            }
          />
        ))}

        <button
          onClick={saveAddress}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full font-semibold w-full"
        >
          Save Address
        </button>
      </div>
    </>
  );
}
