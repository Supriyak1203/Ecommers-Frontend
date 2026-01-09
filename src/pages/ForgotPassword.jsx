import { useState } from "react";

export default function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const sendOtp = () => {
    const storedUser = JSON.parse(localStorage.getItem("signupUser"));

    if (!email) {
      alert("Please enter email first");
      return;
    }

    if (!storedUser) {
      alert("No user found! Please Signup first");
      setPage("signup");
      return;
    }

    if (email !== storedUser.email) {
      alert("This email is not registered!");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    localStorage.setItem(
      "forgotPasswordData",
      JSON.stringify({ email: email, otp: code })
    );

    alert("OTP Sent! (Check Console)");
    console.log("OTP:", code);
  };

  const verifyOtp = () => {
    if (otp === generatedOtp && otp !== "") {
      setOtpVerified(true);
      alert("OTP Verified Successfully!");
    } else {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (!newPass || !confirmPass) {
      alert("Enter both password fields");
      return;
    }

    // PASSWORD VALIDATION
    const passRegex = /^(?=.*[!@#$%^&*])[A-Z][A-Za-z0-9!@#$%^&*]{7,}$/;

    if (!passRegex.test(newPass)) {
      alert(
        "Password must:\n• Start with capital letter\n• Minimum 8 characters\n• At least 1 special character"
      );
      return;
    }

    if (newPass !== confirmPass) {
      alert("Password & Confirm Password do not match");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("signupUser"));
    storedUser.password = newPass;

    localStorage.setItem("signupUser", JSON.stringify(storedUser));

    alert("Password Reset Successful 🎉");
    setPage("signin");
  };

  return (
    <section className="flex items-center justify-center min-h-screen pt-24">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-pink-100">

        <Header />

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="button"
            onClick={sendOtp}
            className="w-full bg-pink-500 text-white py-2 rounded-xl"
          >
            Send OTP
          </button>

          <Input
            label="Enter OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="button"
            onClick={verifyOtp}
            className="w-full bg-green-500 text-white py-2 rounded-xl"
          >
            Verify OTP
          </button>

          {/* NEW PASSWORD WITH EYE ICON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                disabled={!otpVerified}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400 disabled:bg-gray-200"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-sm"
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD WITH EYE ICON */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                disabled={!otpVerified}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400 disabled:bg-gray-200"
              />
              <span
                className="absolute right-3 top-2 cursor-pointer text-sm"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
              >
                {showConfirmPass ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button className="w-full bg-pink-600 text-white py-2.5 rounded-xl">
            Reset Password
          </button>
        </form>

        <p className="text-center mt-4">
          <button onClick={() => setPage("signin")} className="text-pink-600 font-semibold">
            Back to Sign In
          </button>
        </p>

      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="text-center mb-6">
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-pink-600 to-rose-500 
        flex items-center justify-center shadow-xl ring-4 ring-pink-200 mx-auto mb-3">
        <span className="absolute text-white text-3xl font-extrabold -translate-x-2">G</span>
        <span className="absolute text-white text-3xl font-extrabold translate-x-2">C</span>
      </div>
      <h1 className="text-2xl font-bold text-pink-600">Forgot Password</h1>
    </div>
  );
}

function Input({ label, type, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400 disabled:bg-gray-200"
      />
    </div>
  );
}
