import { useState } from 'react';
import { saveAffiliateLink } from '../utils/affiliateUtils';

function AddProductForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !affiliateUrl || !category) {
      setError('Title, Category and Amazon affiliate link are required');
      return;
    }

    if (!affiliateUrl.includes('amazon.com') && !affiliateUrl.includes('amzn.to')) {
      setError('Please enter a valid Amazon affiliate link');
      return;
    }

    setIsLoading(true);

    try {
      const newProduct = await saveAffiliateLink(title, description, affiliateUrl, category);
      setTitle('');
      setDescription('');
      setAffiliateUrl('');
      setCategory('');
      setSuccess('Product has been added successfully');
      if (onSuccess) onSuccess(newProduct);
    } catch (error) {
      setError('Failed to add product');
      console.error(error);
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
