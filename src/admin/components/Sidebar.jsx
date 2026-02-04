import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  MessageSquare
} from "lucide-react";

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const menu = [
    { id: "dashboard", label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { id: "crm", label: "CRM", path: "/admin/crm", icon: Users },
    { id: "inventory", label: "Inventory", path: "/admin/inventory", icon: Package },
    { id: "orders", label: "Orders", path: "/admin/orders", icon: ShoppingCart },
    { id: "payments", label: "Payments", path: "/admin/payments", icon: CreditCard },
    { id: "feedback", label: "Feedback", path: "/admin/feedback", icon: MessageSquare },
  ];

  return (
    <aside
      className={`bg-white shadow-xl h-screen transition-all duration-300
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}
      `}
    >
      <ul className="mt-6 space-y-1 px-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname === item.path;

          return (
            <li
              key={item.id}
              onClick={() => navigate(item.path)} // ✅ Navigate instead of setPage
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
                ${
                  isActive
                    ? "bg-pink-100 text-pink-600 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <Icon
                size={20}
                className={isActive ? "text-pink-600" : "text-gray-500"}
              />
              <span className="text-sm">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
