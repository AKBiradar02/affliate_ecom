import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

function SmartImport({ onSuccess }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleConvert = async () => {
        if (!url.trim()) {
            setError('Please enter a product URL');
            return;
        }

        setLoading(true);
        setError('');
        setProductData(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/earnkaro/convert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Conversion failed');
            }

            const data = await response.json();
            setProductData(data);
            setSuccess('✅ Product details fetched successfully!');
        } catch (err) {
            console.error('Conversion error:', err);
            setError(err.message || 'Failed to convert URL. Please check if the URL is valid and supported by Earnkaro.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!productData) return;

        setLoading(true);
        setError('');

        try {
            await addDoc(collection(db, 'products'), {
                title: productData.title,
                description: productData.description || '',
                affiliateUrl: productData.affiliateUrl,
                category: productData.category || '',
                imageUrl: productData.imageUrl,
                price: productData.price,
                platform: productData.platform,
                productType: 'Single Product',
                createdAt: serverTimestamp(),
            });

            setSuccess('✅ Product saved successfully!');
            setProductData(null);
            setUrl('');

            if (onSuccess) {
                onSuccess();
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Save error:', err);
            setError('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setUrl('');
        setProductData(null);
        setError('');
        setSuccess('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">🚀 Smart Import</h2>
                <p className="text-gray-600 text-sm">
                    Paste a Flipkart or other product URL to automatically convert it to your Earnkaro affiliate link and fetch product details.
                </p>
            </div>

            {/* Success Message */}
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {success}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* URL Input Section */}
            {!productData && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product URL
                        </label>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.flipkart.com/product/..."
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Supported: Flipkart, Amazon, and other Earnkaro-supported platforms
                        </p>
                    </div>

                    <button
                        onClick={handleConvert}
                        disabled={loading || !url.trim()}
                        className="w-full bg-[#1d3d53] hover:bg-[#162f40] text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Converting...
                            </>
                        ) : (
                            <>
                                🔄 Convert & Fetch Details
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Product Preview Section */}
            {productData && (
                <div className="space-y-6">
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold mb-4">📦 Product Preview</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Product Image */}
                            <div>
                                {productData.imageUrl ? (
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                                        <img
                                            src={productData.imageUrl}
                                            alt={productData.title}
                                            className="max-h-64 max-w-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {/* Product Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <p className="text-gray-900 font-semibold">
                                        {productData.title || 'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <p className="text-2xl font-bold text-green-600">
                                        {productData.price || 'Not available'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Platform
                                    </label>
                                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {productData.platform}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Affiliate Link
                                    </label>
                                    <p className="text-sm text-gray-600 break-all">
                                        {productData.affiliateUrl ? '✅ Converted successfully' : '❌ Conversion failed'}
                                    </p>
                                </div>

                                {productData.description && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <p className="text-sm text-gray-600 line-clamp-3">
                                            {productData.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : '✅ Save to Products'}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🔄 New Import
                        </button>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">💡 How it works</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Paste a product URL from Flipkart or other supported platforms</li>
                    <li>Click "Convert & Fetch Details" to get affiliate link and product info</li>
                    <li>Review the auto-filled details</li>
                    <li>Click "Save to Products" to add it to your collection</li>
                </ol>
            </div>
        </div>
    );
}

export default SmartImport;
