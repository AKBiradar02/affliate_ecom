import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Find the best <br />
            <span className="text-blue-600">Amazon products</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Discover our carefully selected Amazon products that provide value 
            and quality. Every purchase supports our website through the Amazon 
            Associates Program.
          </p>
          <Link 
            to="/dashboard" 
            className="inline-block px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Manage Products
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ProductList />
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Why Shop With Us?</h2>
              <p className="text-lg text-gray-600 mb-4">
                We carefully select and review the best products from Amazon to save you time.
              </p>
              <p className="text-lg text-gray-600">
                All our links are affiliate links, which means we earn a small commission on qualifying purchases at no extra cost to you.
              </p>
            </div>
            <div className="flex-1">
              <img 
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80" 
                alt="Shopping online"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home; 