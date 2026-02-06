import { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

function AddProductForm({ onSuccess, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [platform, setPlatform] = useState('Other');
  const [productType, setProductType] = useState('Single Product');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form when initialData changes (from Amazon search)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAffiliateUrl(initialData.affiliateUrl || '');
      setImageUrl(initialData.imageUrl || '');
      setPrice(initialData.price || '');
      setPlatform(initialData.platform || 'Other');
      setProductType(initialData.productType || 'Single Product');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !affiliateUrl || !category) {
      setError('❌ All required fields must be filled');
      return;
    }

    setIsLoading(true);

    try {
      // Add product directly to Firestore
      await addDoc(collection(db, 'products'), {
        title: title.trim(),
        description: description.trim(),
        affiliateUrl: affiliateUrl.trim(),
        category,
        imageUrl: imageUrl.trim(),
        price: price.trim(),
        platform,
        productType,
        createdAt: serverTimestamp(),
      });

      // Clear form
      setTitle('');
      setDescription('');
      setAffiliateUrl('');
      setCategory('');
      setImageUrl('');
      setPrice('');
      setPlatform('Other');
      setProductType('Single Product');
      setSuccess('✅ Product has been added successfully');

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Add Product Error:', err);
      setError(`❌ ${err.message || 'Failed to add product. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      <p className="text-gray-600 mb-6">
        Add products from Earnkaro, Myntra, Glamm, Clann, Wishlink, or other platforms
      </p>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Product Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select a category</option>
              <option value="Beauty & Makeup">Beauty & Makeup</option>
              <option value="Sports">Sports</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Optional - Will be auto-filled from Amazon search</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹999 or $29.99"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Optional - Will be auto-filled from Amazon search</p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Platform *</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="Earnkaro">Earnkaro</option>
              <option value="Myntra">Myntra</option>
              <option value="Wishlink">Wishlink</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Product Type *</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="Single Product">Single Product</option>
              <option value="Collection">Collection</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Collection = Multiple products in one link (e.g., Myntra store)
            </p>
          </div>

          <div>
            <label className="block mb-1 font-medium">Affiliate Link *</label>
            <input
              type="text"
              value={affiliateUrl}
              onChange={(e) => setAffiliateUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-gray-300 font-medium ${isLoading ? 'bg-[#1d3d53] opacity-70' : 'bg-[#1d3d53] hover:bg-[#162f40]'
              }`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProductForm;