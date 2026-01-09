export default function Input({ label, type = "text", ...props }) {
return (
<div>
<label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
<input type={type} {...props} className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400" />
</div>
);
}