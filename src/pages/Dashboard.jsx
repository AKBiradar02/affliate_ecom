import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductManager from '../components/Dashboard/ProductManager';
import AddProductForm from '../components/AddProductForm';
import AddBlogForm from '../components/Dashboard/AddBlogForm';
import AmazonProductSearch from '../components/AmazonProductSearch';
import { getAffiliateLinks } from '../utils/affiliateUtils';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('manage');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmazonProduct, setSelectedAmazonProduct] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const affiliateLinks = await getAffiliateLinks();
      setProducts(affiliateLinks);
    } catch (err) {
      console.error('loadProducts: Error:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    loadProducts();
    setSelectedAmazonProduct(null);
  };

  const handleAmazonProductSelect = (productData) => {
    setSelectedAmazonProduct(productData);
    setActiveTab('add');
  };

  const totalProducts = products.length;
  const clickData = JSON.parse(localStorage.getItem('clickData') || '{}');
  const totalClicks = Object.values(clickData).reduce((sum, clicks) => sum + clicks, 0);
  const avgClicks = totalProducts > 0 ? (totalClicks / totalProducts).toFixed(1) : '0';

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-[#1d3d53] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your affiliate products and content</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-medium">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="font-medium text-gray-500 mb-1">Total Products</div>
          <div className="text-3xl font-bold">{totalProducts}</div>
          <div className="text-sm text-gray-500 mt-1">Affiliate Links</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="font-medium text-gray-500 mb-1">Total Clicks</div>
          <div className="text-3xl font-bold">{totalClicks}</div>
          <div className="text-sm text-gray-500 mt-1">Redirects</div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
          <div className="font-medium text-gray-500 mb-1">Avg. Clicks per Product</div>
          <div className="text-3xl font-bold">{avgClicks}</div>
          <div className="text-sm text-gray-500 mt-1">Engagement Rate</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'manage'
                ? 'border-[#1d3d53] text-[#1d3d53]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('manage')}
            >
              Manage Products
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'search'
                ? 'border-[#1d3d53] text-[#1d3d53]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('search')}
            >
              Amazon Search
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'add'
                ? 'border-[#1d3d53] text-[#1d3d53]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('add')}
            >
              Add Product
            </button>
            <button
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'blog'
                ? 'border-[#1d3d53] text-[#1d3d53]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              onClick={() => setActiveTab('blog')}
            >
              Add Blog
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'manage' && (
            <ProductManager
              products={products}
              refreshTrigger={refreshTrigger}
              onProductsChange={loadProducts}
            />
          )}
          {activeTab === 'search' && (
            <AmazonProductSearch onProductSelect={handleAmazonProductSelect} />
          )}
          {activeTab === 'add' && (
            <AddProductForm
              onSuccess={handleProductAdded}
              initialData={selectedAmazonProduct}
            />
          )}
          {activeTab === 'blog' && <AddBlogForm />}
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}

export default Dashboard;