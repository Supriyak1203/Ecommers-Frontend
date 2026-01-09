import { useState } from "react";

export default function Signin({ setPage }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        // backend should return 401 for invalid login
        setEmailError("Incorrect Email or Password!");
        setPasswordError("Incorrect Email or Password!");
        return;
      }

      const data = await response.json();

      // ✅ Save auth data (NO CHANGE)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullName", data.fullName);

      alert("Login Successful 🎉");

      // ✅ RECOMMENDED CHANGE (redirect to welcome)
      setPage("welcome");

      // 🔒 keep this for future role-based routing
      /*
      if (data.role === "USER") {
        setPage("home");
      } else if (data.role === "ADMIN") {
        setPage("admin");
      }
      */

    } catch (error) {
      alert("Server error. Please try again later.");
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen pt-24">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-pink-100">

        <Header title="Sign In" />

        <form className="space-y-4" onSubmit={handleSignin}>
          
          {/* EMAIL */}
          <Input 
            label="Email Address" 
            type="email"
            value={email}
            onChange={(e)=>{
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
          
          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e)=>{
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
              />

              <span
                className="absolute right-3 top-2 cursor-pointer text-sm"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>

            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>

          <button className="w-full bg-pink-600 text-white py-2.5 rounded-xl font-semibold">
            Sign In
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <button onClick={() => setPage("forgot")} className="text-pink-600 hover:underline">
            Forgot Password?
          </button>

          <button onClick={() => setPage("signup")} className="text-pink-600 hover:underline">
            Create Account
          </button>
        </div>

      </div>
    </section>
  );
}

function Header({ title }) {
  return (
    <div className="text-center mb-6">
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-rose-500 
        flex items-center justify-center shadow-xl ring-4 ring-pink-200 mx-auto mb-3">
        <span className="absolute text-white text-3xl font-extrabold -translate-x-2">G</span>
        <span className="absolute text-white text-3xl font-extrabold translate-x-2">C</span>
      </div>
      <h1 className="text-3xl font-extrabold text-pink-600">{title}</h1>
    </div>
  );
}

function Input({ label, type, value, onChange }) {
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
