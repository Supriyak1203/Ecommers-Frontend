export default function Button({ text }) {
return (
<button className="w-full bg-pink-600 text-white py-2.5 rounded-xl hover:bg-pink-700">
{text}
</button>
);
}