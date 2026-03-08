import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../utils/affiliateUtils';
import DealModal from '../components/DealModal';

const CATEGORIES = [
  {
    name: 'Electronics',
    subtitle: 'Next-gen performance & design',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80',
    query: 'Electronics',
  },
  {
    name: 'Fashion',
    subtitle: 'Timeless styles for the modern soul',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    query: 'Fashion',
  },
  {
    name: 'Home & Kitchen',
    subtitle: 'Elevated living spaces',
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80',
    query: 'Home & Kitchen',
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const links = await getAffiliateLinks();
      setProducts(links.slice(0, 8));
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedDeal(product);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#f6f6f8] text-slate-900">

      {/* ── Editorial Hero ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 min-h-[560px] flex items-center">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80"
              alt="Premium shopping collection"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent"></div>
          </div>
          {/* Content */}
          <div className="relative z-10 px-10 lg:px-20 max-w-2xl">
            <span className="text-[#1152d4] font-bold tracking-widest uppercase mb-4 block text-sm">
              Handpicked Deals
            </span>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6">
              Curated Products for the Discerning Buyer
            </h2>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed font-light">
              Discover premium affiliate deals across electronics, fashion, beauty, and more — handpicked for quality and value.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/deals"
                className="bg-[#1152d4] hover:bg-[#0e45b0] text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
              >
                Shop All Deals
              </Link>
              <Link
                to="/collections"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition-all"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">Shop by Category</h3>
            <p className="text-slate-500 mt-2">Explore our curated departments</p>
          </div>
          <Link to="/deals" className="text-[#1152d4] font-bold flex items-center gap-2 hover:underline text-sm">
            Browse all <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/deals?category=${encodeURIComponent(cat.query)}`}
              className="group cursor-pointer relative aspect-[4/5] rounded-2xl overflow-hidden block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <h4 className="text-2xl font-bold text-white mb-1">{cat.name}</h4>
                <p className="text-slate-300 text-sm">{cat.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Handpicked Favorites (Live Firebase products) ── */}
      <section className="bg-[#1152d4]/5 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-black mb-4">Handpicked Favorites</h3>
            <p className="text-slate-500 max-w-xl mx-auto">
              Products personally tested and selected based on quality, utility, and value — brought to you via trusted affiliate partnerships.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white rounded-2xl p-4 group border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-50">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                    <button
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-slate-900 hover:text-[#1152d4] transition-colors shadow-sm"
                      onClick={(e) => { e.stopPropagation(); window.open(product.affiliateUrl, '_blank'); }}
                    >
                      <span className="material-symbols-outlined text-xl">open_in_new</span>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-1 flex-1">
                    {product.category && (
                      <span className="text-xs font-bold text-[#1152d4] uppercase tracking-widest">
                        {product.category}
                      </span>
                    )}
                    <h5 className="font-bold text-sm line-clamp-2 text-slate-900">{product.title}</h5>

                    {/* Coupon Badge */}
                    {product.couponCode && (
                      <div className="inline-flex items-center mt-1">
                        <span className="bg-orange-50 border border-dashed border-orange-400 text-orange-600 text-xs font-black px-2 py-0.5 rounded tracking-widest font-mono">
                          🏷️ {product.couponCode}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                      <span className="text-base font-black text-slate-900">
                        {product.price || '—'}
                      </span>
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#1152d4] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        Buy Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">inventory_2</span>
              <p className="text-slate-500 text-lg font-medium">No products yet</p>
              <p className="text-slate-400 text-sm mt-1">Add your first product via the Dashboard Smart Import</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/deals"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
              >
                View All Products <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── New Discoveries Editorial ── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold tracking-tight mb-12">New Discoveries</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80"
              alt="Fashion discovery"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-8 lg:pl-12">
            <div className="space-y-4">
              <span className="text-[#1152d4] font-bold uppercase tracking-widest text-sm">Trend Alert</span>
              <h4 className="text-4xl lg:text-5xl font-black leading-tight">
                The Best Deals, Curated Weekly
              </h4>
              <p className="text-slate-500 text-lg leading-relaxed">
                Our team continuously scouts the best affiliate offers across top Indian platforms — Myntra, Amazon, Flipkart, and more — and brings them to one clean, distraction-free space.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-100 rounded-2xl">
                <span className="material-symbols-outlined text-[#1152d4] mb-2 block">verified</span>
                <p className="font-bold text-sm">Verified Affiliate Links</p>
              </div>
              <div className="p-6 bg-slate-100 rounded-2xl">
                <span className="material-symbols-outlined text-[#1152d4] mb-2 block">savings</span>
                <p className="font-bold text-sm">Best Prices Guaranteed</p>
              </div>
            </div>
            <Link
              to="/deals"
              className="w-fit flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
            >
              Explore Deals <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>




      {/* Deal Modal */}
      {isModalOpen && selectedDeal && (
        <DealModal
          deal={selectedDeal}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedDeal(null); }}
        />
      )}
    </div>
  );
}

export default Home;