import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/")} className="text-gray-600 hover:text-roseDark">
          <ArrowLeft size={22} />
        </button>

        <h1 className="font-head text-3xl font-bold">
          Glow<span className="text-rose">&Co.</span>
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <i className="fas fa-home cursor-pointer text-lg" onClick={() => navigate("/")}></i>

        <button
          onClick={onLogout}   // 🔥 use App logout
          className="text-sm font-semibold text-roseDark border border-roseDark px-4 py-1.5 rounded-full hover:bg-roseDark hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
