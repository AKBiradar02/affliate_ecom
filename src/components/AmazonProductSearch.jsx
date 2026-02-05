import { useState } from 'react';
import { getAuth } from 'firebase/auth';

function AmazonProductSearch({ onProductSelect }) {
    const [keywords, setKeywords] = useState('');
    const [category, setCategory] = useState('All');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const auth = getAuth();

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
            const token = await user.getIdToken();

            const res = await fetch('https://searchamazonproducts-fpqz4j4kvq-uc.a.run.app', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ keywords, category }),
            });

            if (!res.ok) {
                throw new Error('Failed to search products');
            }

            const data = await res.json();
            setSearchResults(data.products || []);
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
                price: product.price
            });
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Amazon Products</h2>
            <p className="text-gray-600 mb-6">
                Search for products on Amazon and import them automatically
            </p>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

            <form onSubmit={handleSearch} className="mb-6">
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
                            <option value="HomeAndKitchen">Home & Kitchen</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Searching...' : 'Search Amazon'}
                </button>
            </form>

            {searchResults.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-3">Search Results</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {searchResults.map((product, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded p-3 flex gap-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectProduct(product)}
                            >
                                {product.imageUrl && (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm line-clamp-2">{product.title}</h4>
                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">{product.description}</p>
                                    {product.price && (
                                        <p className="text-sm font-semibold text-green-600 mt-1">{product.price}</p>
                                    )}
                                </div>
                                <button
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 self-start"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectProduct(product);
                                    }}
                                >
                                    Import
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AmazonProductSearch;
