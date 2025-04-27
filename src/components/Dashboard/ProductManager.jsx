import { useState, useEffect } from 'react';
import { FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import { getAffiliateLinks, deleteAffiliateLink } from '../../utils/affiliateUtils';

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [clickData, setClickData] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    loadClickData();
    // eslint-disable-next-line
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const affiliateLinks = await getAffiliateLinks();
      setProducts(affiliateLinks);
    } catch (error) {
      setMessage({ text: 'Error loading products', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const loadClickData = () => {
    const data = localStorage.getItem('clickData');
    setClickData(data ? JSON.parse(data) : {});
  };

  const handleDelete = async (id) => {
    try {
      await deleteAffiliateLink(id);
      loadProducts();
      setMessage({ text: 'Product deleted', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Error deleting product', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <button 
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={loadProducts}
        >
          Refresh
        </button>
      </div>

      {message.text && (
        <div className={`p-3 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No products added yet
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr 
                key={product.id} 
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3 whitespace-nowrap w-20">
                  <img
                    src={product.imageUrl || 'https://via.placeholder.com/50x50?text=No+Image'}
                    alt={product.title}
                    className="h-12 w-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-2">
                    {product.title}
                  </p>
                </td>
                <td className="px-4 py-3 max-w-xs truncate">
                  <a 
                    href={product.affiliateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    {product.affiliateUrl.substring(0, 30)}...
                    <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                  </a>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {clickData[product.id] || 0}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-red-600 hover:text-red-900 p-1"
                    onClick={() => handleDelete(product.id)}
                    aria-label="Delete product"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManager; 