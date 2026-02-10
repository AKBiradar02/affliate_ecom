import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../utils/affiliateUtils';
import DealModal from '../components/DealModal';

function Home() {
  const [manualDeals, setManualDeals] = useState([]);
  const [isLoadingManual, setIsLoadingManual] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchManualDeals();
  }, []);

  const fetchManualDeals = async () => {
    setIsLoadingManual(true);
    try {
      const links = await getAffiliateLinks();
      // Show only first 8 manual deals on homepage
      setManualDeals(links.slice(0, 8));
    } catch (err) {
      console.error('Error fetching manual deals:', err);
    } finally {
      setIsLoadingManual(false);
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className=" bg-gradient-to-r from-[#D68E9A] to-[#015A8A]  text-white py-12 px-4 w-full">
        <div className="w-full px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Today's Best Deals
          </h1>
          <p className="text-xl mb-8">
            Discover amazing deals curated just for you. Save big on your favorite products!
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/deals"
              className="bg-white text-[#015A8A] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Deals
            </Link>
            <Link
              to="/collections"
              className="bg-white text-[#015A8A] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Collections
            </Link>
            <Link
              to="/blog"
              className="bg-white text-[#015A8A] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Deals Section - Full Width */}
      <section className="w-full px-4 md:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Manual Deals Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📝 Curated Deals</h2>
              <Link to="/collections" className="text-[#015A8A] hover:text-[#162f40] font-medium text-sm">
                See All →
              </Link>
            </div>

            {/* Loading State */}
            {isLoadingManual && (
              <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-[#1d3d53] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Manual Deals Grid */}
            {!isLoadingManual && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {manualDeals.length === 0 ? (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No curated deals yet
                  </div>
                ) : (
                  manualDeals.map((deal) => (
                    <div
                      key={deal.id}
                      onClick={() => {
                        setSelectedDeal(deal);
                        setIsModalOpen(true);
                      }}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    >
                      {/* Product Image */}
                      {deal.imageUrl && (
                        <div className="relative h-40 bg-gray-100 flex items-center justify-center p-4">
                          <img
                            src={deal.imageUrl}
                            alt={deal.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10">
                          {deal.title}
                        </h3>

                        {/* Category Badge Only */}
                        <div className="mb-2 flex gap-2 flex-wrap">
                          {deal.category && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {deal.category}
                            </span>
                          )}
                        </div>

                        {/* View Details Button */}
                        <button
                          className="block w-full bg-[#1d3d53] hover:bg-[#955e3e] text-white text-center py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose AffiliStore?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Daily Updates</h3>
              <p className="text-gray-600">Fresh deals curated daily</p>
            </div>
            <div>
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Curated deals with maximum discounts</p>
            </div>
            <div>
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold mb-2">Multiple Categories</h3>
              <p className="text-gray-600">Electronics, Fashion, Beauty, and more</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deal Modal */}
      <DealModal
        deal={selectedDeal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Home;