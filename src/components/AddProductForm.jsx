import { useState } from 'react';
import { getAuth } from 'firebase/auth';

function AddProductForm({ onSuccess, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliateUrl || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth();

  // Update form when initialData changes (from Amazon search)
  useState(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAffiliateUrl(initialData.affiliateUrl || '');
      setImageUrl(initialData.imageUrl || '');
      setPrice(initialData.price || '');
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

    if (!affiliateUrl.includes('amazon.com') && !affiliateUrl.includes('amzn.to')) {
      setError('❌ Please enter a valid Amazon affiliate link');
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const token = await user.getIdToken();

      const res = await fetch('https://addproduct-fpqz4j4kvq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          affiliateUrl: affiliateUrl.trim(),
          category,
          imageUrl: imageUrl.trim(),
          price: price.trim(),
        }),
      });

      const isJson = res.headers.get('content-type')?.includes('application/json');

      if (!res.ok) {
        const errorMessage = isJson ? (await res.json()).message : await res.text();
        throw new Error(errorMessage || 'Failed to add product');
      }

      const data = isJson ? await res.json() : {};

      setTitle('');
      setDescription('');
      setAffiliateUrl('');
      setCategory('');
      setImageUrl('');
      setPrice('');
      setSuccess('✅ Product has been added successfully');

      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error('Add Product Error:', err);
      setError(`❌ ${err.message || 'Failed to add product. Check authentication or function setup.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Amazon Product</h2>
      <p className="text-gray-600 mb-6">
        Add your Amazon affiliate products to showcase on your site
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
            <label className="block mb-1 font-medium">Amazon Affiliate Link *</label>
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
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
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