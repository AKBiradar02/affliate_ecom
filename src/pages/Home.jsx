import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../utils/affiliateUtils';

function Home() {
  const [amazonDeals, setAmazonDeals] = useState([]);
  const [manualDeals, setManualDeals] = useState([]);
  const [isLoadingAmazon, setIsLoadingAmazon] = useState(true);
  const [isLoadingManual, setIsLoadingManual] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAmazonDeals();
    fetchManualDeals();
  }, []);

  const fetchAmazonDeals = async () => {
    setIsLoadingAmazon(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/deals`);

      if (!response.ok) {
        throw new Error('Failed to fetch deals');
      }

      const data = await response.json();
      // Show only first 6 Amazon deals on homepage
      setAmazonDeals(data.deals?.slice(0, 6) || []);
    } catch (err) {
      console.error('Error fetching Amazon deals:', err);
      setError('Unable to load Amazon deals.');
    } finally {
      setIsLoadingAmazon(false);
    }
  };

  const fetchManualDeals = async () => {
    setIsLoadingManual(true);
    try {
      const links = await getAffiliateLinks();
      // Show only first 6 manual deals on homepage
      setManualDeals(links.slice(0, 6));
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
            Today's Best Amazon Deals
          </h1><p className="text-xl mb-8">
            Discover amazing deals updated hourly from Amazon. Save big on your favorite products!
          </p>
          <Link
            to="/deals"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Deals →
          </Link>
        </div>
      </section>

      {/* Deals Sections - Side by Side */}
      <section className="w-full px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {manualDeals.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-gray-500">
                    No manual deals yet
                  </div>
                ) : (
                  manualDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {/* Product Image */}
                      {deal.imageUrl && (
                        <div className="relative h-40 bg-gray-100 flex items-center justify-center p-4">
                          <img
                            src={deal.imageUrl}
                            alt={deal.productName}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      )}

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-2 h-10">
                          {deal.productName}
                        </h3>

                        {/* Platform Badge */}
                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {deal.platform}
                          </span>
                        </div>

                        {/* Buy Button */}
                        <a
                          href={deal.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-[#1d3d53] hover:bg-[#955e3e] text-white text-center py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          View Deal
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Amazon Deals Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🛒 Amazon Deals</h2>
              <Link to="/deals" className="text-[#015A8A] hover:text-[#162f40] font-medium text-sm">
                See All →
              </Link>
            </div>

            {/* Loading State */}
            {isLoadingAmazon && (
              <div className="flex justify-center py-10">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            {/* Amazon Deals Grid */}
            {!isLoadingAmazon && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amazonDeals.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-gray-500">
                    No Amazon deals available
                  </div>
                ) : (
                  amazonDeals.map((deal) => (
                    <div
                      key={deal.asin}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative"
                    >
                      {/* Discount Badge */}
                      {deal.discount_percent > 0 && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full font-bold text-xs z-10">
                          {deal.discount_percent}% OFF
                        </div>
                      )}

                      {/* Product Image */}
                      {deal.image_url && (
                        <div className="relative h-40 bg-gray-100 flex items-center justify-center p-4">
                          <img
                            src={deal.image_url}
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

                        {/* Price */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600">
                              {deal.price}
                            </span>
                            {deal.original_price && (
                              <span className="text-xs text-gray-500 line-through">
                                {deal.original_price}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Buy Button */}
                        <a
                          href={deal.detail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-[#1d3d53] hover:bg-[#955e3e] text-white text-center py-2 rounded-lg font-medium transition-colors text-sm"
                        >
                          View Deal
                        </a>
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
              <h3 className="font-semibold mb-2">Hourly Updates</h3>
              <p className="text-gray-600">Fresh deals updated every hour from Amazon</p>
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
    </div>
  );
}

export default Home;