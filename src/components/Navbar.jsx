import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f6f6f8]/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1152d4] text-3xl">diamond</span>
            <span className="text-xl font-black tracking-tighter uppercase text-slate-900">AffiliStore</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
            <Link to="/deals?category=Electronics" className="hover:text-[#1152d4] transition-colors text-slate-700">Electronics</Link>
            <Link to="/deals?category=Fashion" className="hover:text-[#1152d4] transition-colors text-slate-700">Fashion</Link>
            <Link to="/deals?category=Home & Kitchen" className="hover:text-[#1152d4] transition-colors text-slate-700">Home</Link>
            <Link to="/deals" className="hover:text-[#1152d4] transition-colors text-[#1152d4]">All Deals</Link>
          </nav>
        </div>

        {/* Search + Account */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
            />
          </form>

          <Link to="/blog" className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block" title="Blog">
            <span className="material-symbols-outlined text-slate-600">article</span>
          </Link>

          <Link to="/collections" className="p-2 hover:bg-slate-100 rounded-full transition-colors hidden md:block" title="Collections">
            <span className="material-symbols-outlined text-slate-600">grid_view</span>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-slate-700">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
            />
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold py-1">Home</Link>
          <Link to="/deals" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold py-1">All Deals</Link>
          <Link to="/collections" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold py-1">Collections</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="text-slate-700 font-semibold py-1">Blog</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;