import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-3 px-4 shadow-md sticky top-0 z-50 w-full">
      <div className="w-full px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-gray-800 tracking-wide">
            AffiliStore
          </Link>
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-800 hover:text-blue-100 transition-colors">Home</Link>
          <Link to="/deals" className="text-gray-800 hover:text-blue-100 transition-colors">Deals</Link>
          <Link to="/collections" className="text-gray-800 hover:text-blue-100 transition-colors">More Collections</Link>
          <Link to="/blog" className="text-gray-800 hover:text-blue-100 transition-colors">Blog</Link>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-gray-800 rounded shadow-lg flex flex-col gap-2 px-4 py-3 animate-fade-in">
          <Link to="/" className="text-white py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/deals" className="text-white py-1" onClick={() => setMenuOpen(false)}>Deals</Link>
          <Link to="/collections" className="text-white py-1" onClick={() => setMenuOpen(false)}>More Collections</Link>
          <Link to="/blog" className="text-white py-1" onClick={() => setMenuOpen(false)}>Blog</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;