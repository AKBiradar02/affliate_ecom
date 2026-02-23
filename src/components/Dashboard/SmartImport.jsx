import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

function SmartImport({ onSuccess }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [autoFillCount, setAutoFillCount] = useState(0);

    // Editable fields — user can always change these
    const [editTitle, setEditTitle]       = useState('');
    const [editPrice, setEditPrice]       = useState('');
    const [editImageUrl, setEditImageUrl] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editCategory, setEditCategory] = useState('');

    const CATEGORIES = [
        'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Daily Needs',
        'Sports', 'Grooming & Wellness', 'Books', 'Toys & Games', 'Grocery', 'General'
    ];

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Conversion failed');
            }

            const data = await response.json();
            setProductData(data);

            // Pre-fill editable fields with auto-fetched values
            setEditTitle(data.title || '');
            setEditPrice(data.price || '');
            setEditImageUrl(data.imageUrl || '');
            setEditDescription(data.description || '');
            setEditCategory(data.category || 'General');

            // Count how many fields were auto-filled
            const filled = [data.title, data.price, data.imageUrl, data.description].filter(Boolean).length;
            setAutoFillCount(filled);

        } catch (err) {
            console.error('Conversion error:', err);
            setError(err.message || 'Failed to convert URL. Please check if the URL is valid.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!productData) return;

        if (!editTitle.trim()) {
            setError('Please enter a product title before saving.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await addDoc(collection(db, 'products'), {
                title: editTitle.trim(),
                description: editDescription.trim(),
                affiliateUrl: productData.affiliateUrl,
                category: editCategory,
                imageUrl: editImageUrl.trim(),
                price: editPrice.trim(),
                platform: productData.platform,
                productType: 'Single Product',
                createdAt: serverTimestamp(),
            });

            setSuccess('✅ Product saved successfully!');
            setProductData(null);
            setUrl('');
            setEditTitle(''); setEditPrice(''); setEditImageUrl('');
            setEditDescription(''); setEditCategory('');

            if (onSuccess) onSuccess();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Save error:', err);
            setError('Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setUrl(''); setProductData(null); setError(''); setSuccess('');
        setEditTitle(''); setEditPrice(''); setEditImageUrl('');
        setEditDescription(''); setEditCategory('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleConvert();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">🚀 Smart Import</h2>
                <p className="text-gray-600 text-sm">
                    Paste any product URL to convert it to your Earnkaro affiliate link. Details auto-fill when available — you can always edit them manually.
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
                            onKeyDown={handleKeyDown}
                            placeholder="https://www.myntra.com/product/... or any supported URL"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Works with Flipkart, Myntra, Amazon, Ajio, Nykaa, and 150+ other platforms via Earnkaro
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
                                Converting & Fetching...
                            </>
                        ) : (
                            '🔄 Convert & Fetch Details'
                        )}
                    </button>
                </div>
            )}

            {/* Product Edit & Preview Section */}
            {productData && (
                <div className="space-y-6">

                    {/* Affiliate Link Status */}
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${productData.affiliateUrl ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        <span className="text-lg">{productData.affiliateUrl ? '✅' : '❌'}</span>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Affiliate Link</p>
                            <p className="text-xs text-gray-600 break-all">{productData.affiliateUrl || 'Conversion failed'}</p>
                        </div>
                    </div>

                    {/* Auto-fill status banner */}
                    {autoFillCount === 0 ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
                            <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
                            <div>
                                <p className="text-sm font-semibold text-amber-800">Auto-detection not available for this platform</p>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    The affiliate link was generated successfully. Please fill in the product details manually below.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-start gap-3">
                            <span className="text-blue-500 text-lg mt-0.5">✨</span>
                            <div>
                                <p className="text-sm font-semibold text-blue-800">{autoFillCount} field{autoFillCount > 1 ? 's' : ''} auto-filled</p>
                                <p className="text-xs text-blue-700 mt-0.5">Review and edit any details before saving.</p>
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold mb-4">📦 Product Details</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image preview + URL input */}
                            <div className="space-y-3">
                                {editImageUrl ? (
                                    <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-48">
                                        <img
                                            src={editImageUrl}
                                            alt="Product"
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-lg p-4 h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <span className="text-3xl">🖼️</span>
                                        <span className="text-sm">No image — paste URL below</span>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Image URL {!editImageUrl && <span className="text-amber-500 font-semibold">• Required</span>}
                                    </label>
                                    <input
                                        type="url"
                                        value={editImageUrl}
                                        onChange={(e) => setEditImageUrl(e.target.value)}
                                        placeholder="https://example.com/product-image.jpg"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Text fields */}
                            <div className="space-y-4">
                                {/* Title */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Title <span className="text-red-500">*</span>
                                        {editTitle && <span className="ml-2 text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Enter product title..."
                                        className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!editTitle ? 'border-amber-300 bg-amber-50' : 'border-gray-300'}`}
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Price
                                        {editPrice && <span className="ml-2 text-green-600">✓</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                        placeholder="e.g. ₹1,499"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                                    <select
                                        value={editCategory}
                                        onChange={(e) => setEditCategory(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Description
                                        {editDescription && <span className="ml-2 text-green-600">✓</span>}
                                    </label>
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Enter product description (optional)..."
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={loading || !editTitle.trim()}
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
            {!productData && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">💡 How it works</h4>
                    <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Paste any product URL — Myntra, Flipkart, Ajio, Amazon and more</li>
                        <li>Affiliate link is always generated — details auto-fill when possible</li>
                        <li>If details don't auto-fill, type them in manually (takes 30 seconds)</li>
                        <li>Click "Save to Products" — done!</li>
                    </ol>
                </div>
            )}
        </div>
    );
}

export default SmartImport;
