import { useEffect, useState } from "react";

const images = [
  "/src/assets/products/home.jpg",
  "/src/assets/products/home2.jpg",
  "/src/assets/products/home3.jpg",
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden">
      {/* Background Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out
            ${index === current ? "opacity-100 scale-105" : "opacity-0 scale-100"}
          `}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl animate-fadeUp">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Discover Your <span className="text-pink-500">Beauty</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Premium beauty products crafted to enhance your natural glow.
          </p>

          <div className="flex justify-center gap-4">
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full text-sm font-medium transition">
              Shop Now
            </button>
            <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full text-sm font-medium transition">
              Explore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
