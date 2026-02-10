import { useState, useEffect } from 'react';

function DealsPage() {
    const [deals, setDeals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAmazonDeals();
    }, []);

    const fetchAmazonDeals = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/deals`);

            if (!response.ok) {
                throw new Error('Failed to fetch deals');
            }

            const data = await response.json();
            setDeals(data.deals || []);
        } catch (err) {
            console.error('Error fetching Amazon deals:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#1d3d53] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading amazing deals...</p>
                </div>
            </div>
        );
    }

    // Error State - Show Coming Soon
    if (error || deals.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-2xl w-full text-center">
                    {/* Coming Soon Icon */}
                    <div className="text-8xl mb-6">🚀</div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Coming Soon!
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-600 mb-8">
                        We're working hard to bring you amazing deals. Stay tuned for more!
                    </p>

                    {/* Additional Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <p className="text-gray-700">
                            In the meantime, check out our <strong>Curated Deals</strong> on the homepage for handpicked products and exclusive offers.
                        </p>
                    </div>

                    {/* Back Button */}
                    <a
                        href="/"
                        className="inline-block bg-[#1d3d53] hover:bg-[#162f40] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        );
    }

    // Success State - Show Deals
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">🛒 Amazon Deals</h1>
                    <p className="text-gray-600">Discover amazing deals updated regularly</p>
                </div>

                {/* Deals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {deals.map((deal) => (
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DealsPage;
