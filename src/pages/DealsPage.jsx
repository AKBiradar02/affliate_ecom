import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAffiliateLinks } from '../utils/affiliateUtils';

const ALL_CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Beauty & Daily Needs',
  'Sports',
  'Grooming & Wellness',
  'Books',
  'Toys & Games',
  'General',
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

// Parse price string like "₹1,499" → 1499 for sorting
const parsePrice = (price) => {
  if (!price) return 0;
  return parseInt(price.replace(/[^\d]/g, ''), 10) || 0;
};

function DealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await getAffiliateLinks();
      setAllProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  // Filter by category + search
  const filtered = allProducts.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || (p.category || 'General') === activeCategory;
    const matchesSearch =
      !searchQuery ||
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return parsePrice(a.price) - parsePrice(b.price);
    if (sortBy === 'price_desc') return parsePrice(b.price) - parsePrice(a.price);
    return 0; // newest = Firebase insertion order
  });

  const pageTitle = activeCategory === 'All'
    ? (searchQuery ? `Search: "${searchQuery}"` : 'All Deals')
    : activeCategory;

  return (
    <div className="bg-[#f6f6f8] min-h-screen">
      <main className="max-w-7xl mx-auto w-full px-4 md:px-10 py-6">

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-[#1152d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">home</span>
            Home
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1152d4] font-bold">{pageTitle}</span>
        </nav>

        {/* Category Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              {pageTitle}
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {activeCategory === 'All'
                ? 'Discover our full collection of affiliate-curated products handpicked for quality and value.'
                : `Explore our curated selection of ${activeCategory} products — handpicked for quality and unbeatable affiliate prices.`}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm font-semibold text-slate-500">
              Showing {sorted.length} product{sorted.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-slate-200">

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 relative">
            <span className="material-symbols-outlined text-slate-500 text-lg">sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1152d4]"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1152d4] text-white shadow-lg shadow-[#1152d4]/25'
                    : 'bg-white border border-slate-200 hover:border-[#1152d4] text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-8 bg-slate-200 rounded mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sorted.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-[#1152d4]/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                    </div>
                  )}
                  {/* Category badge */}
                  {product.category && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#1152d4]">
                      {product.category}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#1152d4] transition-colors line-clamp-2 mb-1">
                    {product.title}
                  </h3>

                  {/* Coupon Code Badge */}
                  {product.couponCode && (
                    <div className="inline-flex items-center gap-1 mt-1 mb-2">
                      <span className="bg-orange-50 border border-dashed border-orange-400 text-orange-600 text-xs font-black px-2 py-0.5 rounded tracking-widest font-mono">
                        🏷️ {product.couponCode}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                    <div>
                      {product.price ? (
                        <span className="text-base font-black text-slate-900">{product.price}</span>
                      ) : (
                        <span className="text-sm text-slate-300">—</span>
                      )}
                    </div>
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1152d4] hover:bg-[#0e45b0] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#1152d4]/20 whitespace-nowrap"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-24">
            <span className="material-symbols-outlined text-7xl text-slate-300 mb-6 block">search_off</span>
            <h2 className="text-2xl font-black text-slate-700 mb-3">No products found</h2>
            <p className="text-slate-500 mb-8">
              {searchQuery
                ? `No results for "${searchQuery}" in ${activeCategory === 'All' ? 'all categories' : activeCategory}.`
                : `No products in ${activeCategory} yet.`}
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="bg-[#1152d4] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0e45b0] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default DealsPage;
