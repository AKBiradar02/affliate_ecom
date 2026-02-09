import { useState } from 'react';
import { FaStar, FaAmazon } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function AmazonProductSearch({ onProductSelect }) {
    const [keywords, setKeywords] = useState('');
    const [category, setCategory] = useState('All');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Advanced filters
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minRating: '',
        brand: '',
        primeOnly: false,
        sortBy: 'Relevance'
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [timestamp, setTimestamp] = useState(null);
    const [isCached, setIsCached] = useState(false);

    const handleSearch = async (e, loadMore = false) => {
        if (e) e.preventDefault();
        setError('');
        setIsLoading(true);

        const page = loadMore ? currentPage + 1 : 1;
        if (!loadMore) {
            setSearchResults([]);
            setCurrentPage(1);
        }

        try {
            // Convert prices to paise (₹100 = 10000 paise)
            const minPrice = filters.minPrice ? parseInt(filters.minPrice) * 100 : null;
            const maxPrice = filters.maxPrice ? parseInt(filters.maxPrice) * 100 : null;

            const res = await fetch(`${API_URL}/api/amazon/search-advanced`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keywords,
                    category: category !== 'All' ? category : null,
                    min_price: minPrice,
                    max_price: maxPrice,
                    min_rating: filters.minRating ? parseInt(filters.minRating) : null,
                    brand: filters.brand || null,
                    prime_only: filters.primeOnly,
                    sort_by: filters.sortBy !== 'Relevance' ? filters.sortBy : null,
                    page,
                    items_per_page: 10
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to search products');
            }

            const data = await res.json();

            if (loadMore) {
                setSearchResults(prev => [...prev, ...(data.products || [])]);
                setCurrentPage(page);
            } else {
                setSearchResults(data.products || []);
            }

            setTotalResults(data.totalResults || 0);
            setHasMore(data.hasMore || false);
            setTimestamp(data.timestamp);
            setIsCached(data.cached || false);
        } catch (err) {
            console.error('Search Error:', err);
            setError(`❌ ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectProduct = (product) => {
        if (onProductSelect) {
            onProductSelect({
                title: product.title,
                description: product.description,
                affiliateUrl: product.detailPageURL,
                imageUrl: product.imageUrl,
                price: product.price,
                platform: 'Amazon',
                productType: 'Single Product'
            });
        }
    };

    const clearFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            minRating: '',
            brand: '',
            primeOnly: false,
            sortBy: 'Relevance'
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaAmazon className="text-orange-500" />
                Search Amazon Products
            </h2>
            <p className="text-gray-600 mb-6">
                Search for products on Amazon with advanced filters
            </p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

            <form onSubmit={handleSearch} className="mb-6">
                {/* Main Search */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="Search keywords (e.g., wireless headphones)"
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        >
                            <option value="All">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Beauty">Beauty & Makeup</option>
                            <option value="Sports">Sports</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                        </select>
                    </div>
                </div>

                {/* Toggle Filters Button */}
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-blue-600 hover:text-blue-800 mb-4"
                >
                    {showFilters ? '▼ Hide Filters' : '▶ Show Advanced Filters'}
                </button>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    className="w-1/2 px-3 py-2 border rounded text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="w-1/2 px-3 py-2 border rounded text-sm"
                                />
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Min Rating</label>
                            <select
                                value={filters.minRating}
                                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            >
                                <option value="">All Ratings</option>
                                <option value="4">4+ Stars ⭐⭐⭐⭐</option>
                                <option value="3">3+ Stars ⭐⭐⭐</option>
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Brand</label>
                            <input
                                type="text"
                                placeholder="e.g. Sony, Apple"
                                value={filters.brand}
                                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            />
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Sort By</label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="w-full px-3 py-2 border rounded text-sm"
                            >
                                <option value="Relevance">Relevance</option>
                                <option value="Price:LowToHigh">Price: Low to High</option>
                                <option value="Price:HighToLow">Price: High to Low</option>
                                <option value="AvgCustomerReviews">Customer Reviews</option>
                                <option value="NewestArrivals">Newest</option>
                            </select>
                        </div>

                        {/* Prime Only */}
                        <div className="flex items-end">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.primeOnly}
                                    onChange={(e) => setFilters({ ...filters, primeOnly: e.target.checked })}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium">Prime Only</span>
                            </label>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-end">
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="w-full px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-[#1d3d53] opacity-70' : 'bg-[#1d3d53] hover:bg-[#162f40]'
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search Amazon'}
                </button>
            </form>

            {/* Results Info */}
            {totalResults > 0 && (
                <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">
                        Showing {searchResults.length} of {totalResults} results
                        {isCached && <span className="ml-2 text-blue-600">(Cached)</span>}
                    </div>
                    {timestamp && (
                        <div className="text-xs text-gray-500">
                            Prices as of {new Date(timestamp).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: 'Asia/Kolkata'
                            })} IST
                        </div>
                    )}
                </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="space-y-4">
                    {searchResults.map((product, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-4">
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-24 h-24 object-contain rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>
                                    {product.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-3 mb-2">
                                        {product.price && (
                                            <span className="text-lg font-bold text-green-600">
                                                {product.price}
                                            </span>
                                        )}
                                        {product.savingsPercent && (
                                            <span className="text-sm text-red-600 font-semibold">
                                                Save {product.savingsPercent}%
                                            </span>
                                        )}
                                        {product.isPrime && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                Prime
                                            </span>
                                        )}
                                    </div>
                                    {product.price && (
                                        <div className="text-xs text-gray-500 mb-2">
                                            Price and availability are subject to change.
                                            <a
                                                href={product.detailPageURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline ml-1"
                                            >
                                                Details
                                            </a>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleSelectProduct(product)}
                                        className="px-4 py-2 bg-[#1d3d53] text-white rounded hover:bg-[#162f40] text-sm"
                                    >
                                        Import Product
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Load More Button */}
                    {hasMore && (
                        <button
                            onClick={() => handleSearch(null, true)}
                            disabled={isLoading}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Loading...' : 'Load More Results'}
                        </button>
                    )}
                </div>
            )}

            {searchResults.length === 0 && !isLoading && keywords && (
                <div className="text-center text-gray-500 py-8">
                    No products found. Try different keywords or filters.
                </div>
            )}
        </div>
    );
}

export default AmazonProductSearch;
