import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import ProductManager from '../components/Dashboard/ProductManager';
import AddProductForm from '../components/AddProductForm';
import AddBlogForm from '../components/Dashboard/AddBlogForm';
import AmazonProductSearch from '../components/AmazonProductSearch';
import { getAffiliateLinks } from '../utils/affiliateUtils';

function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('manage');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmazonProduct, setSelectedAmazonProduct] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (user) {
        loadProducts();
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const affiliateLinks = await getAffiliateLinks();
      setProducts(affiliateLinks);
    } catch (err) {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Incorrect email or password');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (err) {
      setError('Failed to log out');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
          <input
            type="email"
            placeholder="Enter admin email"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter admin password"
            className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your Amazon affiliate products and tech blogs</p>
            </div>
            <button
              onClick={handleLogout}
              className="py-2 px-4 rounded bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <div className="font-medium text-gray-500 mb-1">Total Products</div>
              <div className="text-3xl font-bold">{totalProducts}</div>
              <div className="text-sm text-gray-500 mt-1">Amazon Affiliate Links</div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <div className="font-medium text-gray-500 mb-1">Total Clicks</div>
              <div className="text-3xl font-bold">{totalClicks}</div>
              <div className="text-sm text-gray-500 mt-1">Redirects to Amazon</div>
            </div>
            <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
              <div className="font-medium text-gray-500 mb-1">Avg. Clicks per Product</div>
              <div className="text-3xl font-bold">{avgClicks}</div>
              <div className="text-sm text-gray-500 mt-1">Engagement Rate</div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'manage'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab('manage')}
                >
                  Manage Products
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'search'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab('search')}
                >
                  Amazon Search
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab('add')}
                >
                  Add New Product
                </button>
                <button
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'addBlog'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab('addBlog')}
                >
                  Add Blog Post
                </button>
              </nav>
            </div>
            <div className="p-6">
              {activeTab === 'manage' && <ProductManager key={refreshTrigger} />}
              {activeTab === 'search' && (
                <AmazonProductSearch onProductSelect={handleAmazonProductSelect} />
              )}
              {activeTab === 'add' && (
                <AddProductForm
                  onSuccess={handleProductAdded}
                  initialData={selectedAmazonProduct}
                />
              )}
              {activeTab === 'addBlog' && <AddBlogForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;