import axios from "axios";
import { useEffect, useState } from "react";
import BASE_URL from "../../config/api"; // ✅ Global Backend URL

export default function Profile() {

  const USER_ID = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!USER_ID || !token) return;
    loadAll();
  }, []);

  const loadAll = async () => {
    await fetchUser();
    await fetchProfile();
  };

  // ================= USER =================

  const fetchUser = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/users/${USER_ID}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const u = res.data;

    setName(u.fullName || "");
    setEmail(u.email || "");
    setMobile(u.mobileNumber || "");
  };

  // ================= PROFILE =================

  const fetchProfile = async () => {
    const res = await axios.get(
      `${BASE_URL}/api/profile/${USER_ID}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const p = res.data;

    setGender(p?.gender || "");
    setAge(p?.age || "");
    setImage(p?.imageUrl || null);

    // ✅ sync sidebar image
    if (p?.imageUrl) {
      localStorage.setItem("profileImage", p.imageUrl);
    }
  };

  // ================= SAVE =================

  const saveProfile = async () => {
    try {

      // 🔥 UPDATE USERS
      await axios.put(
        `${BASE_URL}/api/users/${USER_ID}`,
        {
          fullName: name,
          email,
          mobileNumber: mobile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🔥 UPDATE PROFILE
      await axios.post(
        `${BASE_URL}/api/profile/save`,
        {
          userId: USER_ID,
          gender,
          age,
          imageUrl: image,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ STORE IMAGE FOR SIDEBAR
      if (image) {
        localStorage.setItem("profileImage", image);
      }

      // 🔥 TRIGGER SIDEBAR REFRESH
      window.dispatchEvent(new Event("profileUpdated"));

      alert("Profile updated successfully ✅");

      loadAll();

    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Update failed ❌");
    }
  };

  // ================= IMAGE =================

  const uploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ================= UI =================

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

      {/* IMAGE */}
      <div className="text-center mb-6">
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">

          {image ? (
            <img src={image} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-bold text-gray-600">
              {name?.[0] || "U"}
            </span>
          )}

        </div>

        <label className="text-blue-600 cursor-pointer mt-2 inline-block">
          Upload Photo
          <input type="file" hidden onChange={uploadPhoto} />
        </label>
      </div>

      {/* FORM */}
      <div className="border rounded-xl p-5 space-y-4 bg-white">

        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />

        <input
          value={mobile}
          onChange={e => setMobile(e.target.value)}
          placeholder="Mobile"
          className="w-full border p-2 rounded"
        />

        <select
          value={gender}
          onChange={e => setGender(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="Age"
          className="w-full border p-2 rounded"
        />

        <button
          onClick={saveProfile}
          className="bg-rose-600 text-white px-6 py-2 rounded hover:bg-rose-700"
        >
          Save Profile
        </button>

      </div>
    </>
  );
}
