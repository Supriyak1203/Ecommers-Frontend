import { useState } from "react";

export default function Signup({ setPage }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [mobileError, setMobileError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email & Password are required");
      return;
    }

    // NAME VALIDATION
    const nameRegex = /^([A-Z][a-zA-Z]+)\s+([A-Z][a-zA-Z]+)\s+([A-Z][a-zA-Z]+)$/;
    if (!nameRegex.test(name)) {
      setNameError("Name must be First Middle Last & each must start with capital letter");
      return;
    }

    // EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Incorrect email format");
      return;
    }

    // MOBILE VALIDATION
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      setMobileError("Mobile must be 10 digits & start with 6,7,8 or 9");
      return;
    }

    // PASSWORD VALIDATION
    const passRegex = /^(?=.*[!@#$%^&*])[A-Z][A-Za-z0-9!@#$%^&*]{7,}$/;
    if (!passRegex.test(password)) {
      setPassError("Starts with capital, 8+ chars, 1 special character required");
      return;
    }

    if (password !== confirm) {
      alert("Password & Confirm Password do not match");
      return;
    }

    // 🔹 BACKEND API CALL
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: name,
          email: email,
          mobileNumber: mobile,
          password: password,
          confirmPassword: confirm,
          role: "USER"
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || "Signup failed");
      }

      alert("Signup Successful 🎉");
      setPage("signin");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen pt-24">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-pink-100">

        <div className="text-center mb-6">
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-rose-500 
            flex items-center justify-center shadow-xl ring-4 ring-pink-200 mx-auto mb-3">
            <span className="absolute text-white text-3xl font-extrabold -translate-x-2">G</span>
            <span className="absolute text-white text-3xl font-extrabold translate-x-2">C</span>
          </div>

          <h1 className="text-3xl font-extrabold text-pink-600">GlowCosmetic</h1>
          <p className="text-gray-500 text-sm mt-1">Create your beauty account ✨</p>
        </div>

        <form className="space-y-4" onSubmit={handleSignup}>

          <Input label="Full Name" value={name} onChange={(e)=>{ setName(e.target.value); setNameError(""); }} />
          {nameError && <p className="text-red-500 text-xs">{nameError}</p>}

          <Input label="Email Address" type="email" value={email} onChange={(e)=>{ setEmail(e.target.value); setEmailError(""); }} />
          {emailError && <p className="text-red-500 text-xs">{emailError}</p>}

          <Input label="Mobile Number" value={mobile} onChange={(e)=>{ setMobile(e.target.value); setMobileError(""); }} />
          {mobileError && <p className="text-red-500 text-xs">{mobileError}</p>}

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>{ setPassword(e.target.value); setPassError(""); }}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
              />
              <span className="absolute right-3 top-2 cursor-pointer text-sm" onClick={()=>setShowPassword(!showPassword)}>
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>
          {passError && <p className="text-red-500 text-xs">{passError}</p>}

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
              />
              <span className="absolute right-3 top-2 cursor-pointer text-sm" onClick={()=>setShowConfirm(!showConfirm)}>
                {showConfirm ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button className="w-full bg-pink-600 text-white py-2.5 rounded-xl font-semibold hover:bg-pink-700">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?
          <button onClick={() => setPage("signin")} className="text-pink-600 font-semibold hover:underline">
            {" "}Sign In
          </button>
        </p>

      </div>
    </section>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}
