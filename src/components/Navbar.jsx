import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
            AffiliStore
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Products
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Blog
          </Link>
          <Link 
            to="/products" 
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-fade-in">
          <div className="flex flex-col p-4 space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/products" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors text-center"
              onClick={() => setMenuOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;