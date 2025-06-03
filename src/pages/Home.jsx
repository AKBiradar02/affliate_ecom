import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Discover Amazing <br />
            <span className="text-yellow-400">Amazon Products</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Explore our handpicked selection of high-quality Amazon products. 
            Every purchase supports our mission to bring you the best deals.
          </p>
          <div className="space-x-4">
            <Link 
              to="/products" 
              className="bg-white text-blue-600 py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-blue-50 transition duration-300"
            >
              Browse Products
            </Link>
            <Link 
              to="/blog" 
              className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full bg-gray-50 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-selected products that offer the best value for your money
            </p>
          </div>
          <ProductList maxItems={3} />
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Why Shop With Us?</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">✓</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                    <p className="text-gray-600">We carefully review and select only the best products from Amazon.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">💰</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Best Deals</h3>
                    <p className="text-gray-600">Get access to competitive prices and exclusive offers.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">🛡️</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
                    <p className="text-gray-600">Shop with confidence through Amazon's secure platform.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Online Shopping Experience"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;