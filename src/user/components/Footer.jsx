import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">GlowIn</h2>
          <p className="text-gray-400 text-sm">
            Premium beauty products crafted to enhance your natural glow. Discover your radiance with our curated collections.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="hover:text-pink-600 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-pink-600 transition cursor-pointer">About Us</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Contact</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Privacy Policy</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Terms of Service</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-pink-600 transition cursor-pointer">FAQs</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Shipping</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Returns</li>
            <li className="hover:text-pink-600 transition cursor-pointer">Order Status</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white mb-2">Subscribe</h3>
          <p className="text-gray-400 text-sm">
            Get the latest news, products, and special offers delivered to your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-2 rounded-l-full border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-600"
            />
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded-r-full font-medium transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-800">
        © {new Date().getFullYear()} GlowIn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
