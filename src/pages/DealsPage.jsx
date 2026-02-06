import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [cacheInfo, setCacheInfo] = useState(null);

    const categories = [
        'All',
        'Home & Kitchen',
        'Fashion',
        'Electronics',
        'Sports',
        'Beauty & Daily Needs',
        'Grooming & Wellness'
    ];

    useEffect(() => {
        fetchDeals();
    }, [selectedCategory]);

    const fetchDeals = async (refresh = false) => {
        setIsLoading(true);
        setError('');

        try {
            const url = selectedCategory === 'All'
                ? `${API_URL}/api/deals${refresh ? '?refresh=true' : ''}`
                : `${API_URL}/api/deals/${selectedCategory}${refresh ? '?refresh=true' : ''}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch deals');
            }

            const data = await response.json();
            setDeals(data.deals || []);
            setCacheInfo(data.cached_at);
        } catch (err) {
            console.error('Error fetching deals:', err);
            setError('Failed to load deals. Make sure the Python backend is running on port 8000.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchDeals(true);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4">
            <div className="w-full px-4 md:px-8">
                {/* Header */}
                <div className="mb-8 bg-[#D68E9A] rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200  text-center">
                    <h1 className="text-4xl text-gray-800 font-bold mb-2">🔥 Today's Best Deals</h1>
                    <p className="text-gray-800">Automatically updated hourly from Amazon</p>
                </div>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-3 items-center">
                    <span className="font-medium">Filter by:</span>
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category
                                ? 'bg-[#1d3d53] text-gray-300'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                    <button
                        onClick={handleRefresh}
                        className="ml-auto px-4 py-2 bg-[#1d3d53] text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        🔄 Refresh Deals
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-[#1d3d53] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Deals Grid */}
                {!isLoading && !error && (
                    <>
                        <div className="mb-4 text-sm text-gray-600">
                            Found {deals.length} deals
                            {cacheInfo && <span className="ml-2">(Last updated: {new Date(Object.values(cacheInfo)[0]).toLocaleTimeString()})</span>}
                        </div>

                        {deals.length === 0 ? (
                            <div className="text-center py-20">
                                <h2 className="text-2xl font-semibold mb-3">No deals found</h2>
                                <p className="text-gray-600">Try selecting a different category or refresh the deals</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                                {deals.map((deal) => (
                                    <div
                                        key={deal.asin}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        {/* Deal Badge */}
                                        {deal.discount_percent > 0 && (
                                            <div className="absolute top-2 right-2 bg-[#1d3d53] text-white px-3 py-1 rounded-full font-bold text-sm z-10">
                                                {deal.discount_percent}% OFF
                                            </div>
                                        )}

                                        {/* Product Image */}
                                        {deal.image_url && (
                                            <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
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

                                            {/* Category Badge */}
                                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mb-2">
                                                {deal.category}
                                            </span>

                                            {/* Price */}
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-[#1d3d53]">
                                                        {deal.price}
                                                    </span>
                                                    {deal.original_price && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {deal.original_price}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Features */}
                                            {deal.features && deal.features.length > 0 && (
                                                <ul className="text-xs text-gray-600 mb-3 space-y-1">
                                                    {deal.features.slice(0, 2).map((feature, idx) => (
                                                        <li key={idx} className="line-clamp-1">• {feature}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            {/* Buy Button */}
                                            <a
                                                href={deal.detail_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full bg-[#1d3d53] hover:bg-[#162f40] text-gray-300 text-center py-2 rounded-lg font-medium transition-colors"
                                            >
                                                View Deal on Amazon
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default DealsPage;
