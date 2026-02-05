import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600 py-3 px-4 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-white tracking-wide">
            AffiliStore
          </Link>
        </div>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-white hover:text-blue-100 transition-colors">Home</Link>
          <Link to="/products" className="text-white hover:text-blue-100 transition-colors">Products</Link>
          <Link to="/blog" className="text-white hover:text-blue-100 transition-colors">Blog</Link>
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-blue-600 rounded shadow-lg flex flex-col gap-2 px-4 py-3 animate-fade-in">
          <Link to="/" className="text-white py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-white py-1" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/blog" className="text-white py-1" onClick={() => setMenuOpen(false)}>Blog</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar; 