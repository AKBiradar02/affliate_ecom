import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About AffiliStore</h3>
            <p className="text-sm mb-4">
              Your trusted destination for the best deals and curated collections.
              Save big on electronics, fashion, beauty, and more!
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-white transition-colors">
                  Deals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home & Kitchen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Beauty & Personal Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sports & Fitness
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} AffiliStore. All rights reserved. | As an Amazon Associate I earn from qualifying purchases.
            </div>

            {/* Hidden Dashboard Link */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
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