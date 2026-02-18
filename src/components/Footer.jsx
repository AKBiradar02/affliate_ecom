import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About AffiliStore</h3>
            <p className="text-sm mb-4 text-gray-400">
              Your trusted destination for the best deals and curated collections.
              Save big on electronics, fashion, beauty, and more!
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/abhaykb02/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors hover:scale-110 transform"
              >
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors text-gray-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors text-gray-400">
                  Deals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors text-gray-400">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors text-gray-400">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors text-gray-400">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-gray-400">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-gray-400">
                  Home &amp; Kitchen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-gray-400">
                  Beauty &amp; Personal Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors text-gray-400">
                  Sports &amp; Fitness
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} AffiliStore. All rights reserved. | As an Amazon Associate I earn from qualifying purchases.
            </div>

            {/* Hidden Dashboard Link */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors text-gray-400">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors text-gray-400">
                Cookie Policy
              </a>
              <Link to="/dashboard" className="hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;