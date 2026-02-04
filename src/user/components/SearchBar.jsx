// src/components/SearchBar.jsx
const SearchBar = () => {
  return (
    <div className="my-6 flex justify-center">
      <input
        type="text"
        placeholder="Search products..."
        className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default SearchBar; // <-- default export
