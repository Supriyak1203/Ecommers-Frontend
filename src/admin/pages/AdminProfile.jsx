import { UserCircle } from "lucide-react";

export default function AdminProfile() {
  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email") || "Not available";
  const mobile = localStorage.getItem("mobile") || "Not available";

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

      <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>

      {/* TOP CARD */}
      <div className="flex items-center gap-6 border-b pb-6">
        <UserCircle size={80} className="text-gray-500" />

        <div>
          <h3 className="text-xl font-semibold">{fullName}</h3>
          <p className="text-sm text-gray-500">{role}</p>
          <p className="text-sm text-gray-600 mt-1">{email}</p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
        <div>
          <p className="text-gray-500">Full Name</p>
          <p className="font-medium">{fullName}</p>
        </div>

        <div>
          <p className="text-gray-500">Role</p>
          <p className="font-medium">{role}</p>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{email}</p>
        </div>

        <div>
          <p className="text-gray-500">Mobile Number</p>
          <p className="font-medium">{mobile}</p>
        </div>

        <div>
          <p className="text-gray-500">Account Status</p>
          <p className="font-medium text-green-600">Active</p>
        </div>
      </div>

      {/* ACTION */}
      <div className="mt-8">
        <button className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
