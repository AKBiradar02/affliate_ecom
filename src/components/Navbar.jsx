import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    // Listen for changes in localStorage (e.g., logout)
    const onStorage = () => setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <nav className="bg-blue-600 py-3 px-4 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-white">
          <Link to="/">AffiliStore</Link>
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
          {isAdmin && (
            <Link
              to="/dashboard"
              className={`ml-2 px-4 py-2 rounded bg-white text-blue-600 font-semibold hover:bg-blue-100 transition-colors ${location.pathname === '/dashboard' ? 'ring-2 ring-blue-400' : ''}`}
            >
              Manage Products
            </Link>
          )}
        </div>
      </div>
      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 bg-blue-600 rounded shadow-lg flex flex-col gap-2 px-4 py-3 animate-fade-in">
          <Link to="/" className="text-white py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="text-white py-1" onClick={() => setMenuOpen(false)}>Products</Link>
          {isAdmin && (
            <Link
              to="/dashboard"
              className="text-blue-600 bg-white rounded px-4 py-2 font-semibold text-center"
              onClick={() => setMenuOpen(false)}
            >
              Manage Products
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar; 