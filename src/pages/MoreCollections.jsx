import { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../utils/affiliateUtils';
import DealModal from '../components/DealModal';

function MoreCollections() {
    const [products, setProducts] = useState([]);
    const [selectedType, setSelectedType] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const types = ['All', 'Single Product', 'Collection'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await getAffiliateLinks();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter products based on selected type
    const filteredProducts = products.filter(product => {
        const typeMatch = selectedType === 'All' || product.productType === selectedType;
        return typeMatch;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8 w-full">
            <div className="w-full px-4 md:px-8">
                {/* Header */}
                <div className="mb-8 bg-[#D68E9A] rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200  text-center">
                    <h1 className="text-4xl text-gray-800 font-bold mb-2">🛍️ More Collections</h1>
                    <p className="text-gray-800">Curated products and collections</p>
                </div>

                {/* Filters */}
                {/* Filters */}
                <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                            <span className="text-xl">🔍</span> Filter Products
                        </h2>
                        <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200">
                            {filteredProducts.length} Results
                        </span>
                    </div>

                    <div className="p-6">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-1 h-4 bg-teal-500 rounded-full"></span>
                                Type
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {types.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${selectedType === type
                                            ? 'bg-[#1d3d53] text-gray-300 border-[#1d3d53] shadow-md transform scale-105'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Products Grid */}
                {!isLoading && !error && (
                    <>
                        <div className="mb-6 text-sm text-gray-600 font-medium">
                            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg shadow">
                                <h2 className="text-2xl font-semibold mb-3">No products found</h2>
                                <p className="text-gray-600">Try selecting different filters or check back later</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => {
                                            setSelectedDeal(product);
                                            setIsModalOpen(true);
                                        }}
                                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 relative flex flex-col cursor-pointer"
                                    >
                                        {/* Type Badge Only */}
                                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                            {product.productType && (
                                                <span className="bg-[#1d3d53] text-gray-300 px-2 py-1 rounded text-xs font-semibold shadow">
                                                    {product.productType === 'Collection' ? '📦 Collection' : '🛍️ Product'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Image */}
                                        {product.imageUrl && (
                                            <div className="relative h-56 bg-gray-100 flex items-center justify-center p-4">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.title}
                                                    className="max-h-full max-w-full object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {/* Product Info - flex-grow pushes button to bottom */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem]">
                                                {product.title}
                                            </h3>

                                            {/* Category */}
                                            {product.category && (
                                                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mb-3">
                                                    {product.category}
                                                </span>
                                            )}

                                            {/* Description */}
                                            {product.description && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}

                                            {/* View Details Button - mt-auto pushes to bottom */}
                                            <button
                                                className="block w-full bg-[#1d3d53] hover:bg-[#162f40] text-gray-300 text-center py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg mt-auto"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Deal Modal */}
                <DealModal
                    deal={selectedDeal}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
}

export default MoreCollections;
