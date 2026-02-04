import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // ================= SEND OTP =================
  const sendOtp = async () => {

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter email first");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/auth/forgot-password/send/${cleanEmail}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "This email is not registered!");
        return;
      }

      alert("OTP sent to your email 📧");

    } catch {
      alert("Server error while sending OTP");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {

    const cleanEmail = email.trim().toLowerCase();

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/auth/forgot-password/verify?email=${cleanEmail}&otp=${otp}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Invalid OTP");
        return;
      }

      setOtpVerified(true);
      alert("OTP Verified Successfully!");

    } catch {
      alert("Server error while verifying OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!otpVerified) {
      alert("Please verify OTP first");
      return;
    }

    if (!newPass || !confirmPass) {
      alert("Enter both password fields");
      return;
    }

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

    try {
      const res = await fetch(
        `http://localhost:8080/auth/forgot-password/reset/${cleanEmail}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: newPass,
            repeatPassword: confirmPass
          })
        }
      );

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || "Password reset failed");
        return;
      }

      alert("Password Reset Successful 🎉");
      navigate("/signin");

    } catch {
      alert("Server error while resetting password");
    }
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

          <PasswordInput
            label="New Password"
            value={newPass}
            onChange={setNewPass}
            show={showNewPass}
            setShow={setShowNewPass}
            disabled={!otpVerified}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPass}
            onChange={setConfirmPass}
            show={showConfirmPass}
            setShow={setShowConfirmPass}
            disabled={!otpVerified}
          />

          <button className="w-full bg-pink-600 text-white py-2.5 rounded-xl">
            Reset Password
          </button>

        </form>

        <p className="text-center mt-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-pink-600 font-semibold hover:underline"
          >
            Back to Sign In
          </button>
        </p>

      </div>
    </section>
  );
}

/* ---------- UI Components ---------- */

function Header() {
  return (
    <div className="text-center mb-6">
      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br 
        from-pink-500 via-pink-600 to-rose-500 
        flex items-center justify-center shadow-xl ring-4 ring-pink-200 mx-auto mb-3">

        <span className="absolute text-white text-3xl font-extrabold -translate-x-2">
          G
        </span>
        <span className="absolute text-white text-3xl font-extrabold translate-x-2">
          C
        </span>
      </div>

      <h1 className="text-2xl font-bold text-pink-600">
        Forgot Password
      </h1>
    </div>
  );
}

function Input({ label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
}

function PasswordInput({ label, value, onChange, show, setShow, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400 disabled:bg-gray-200"
        />

        <span
          className="absolute right-3 top-2 cursor-pointer text-sm"
          onClick={() => setShow(!show)}
        >
          {show ? "👁️" : "🙈"}
        </span>
      </div>
    </div>
  );
}
