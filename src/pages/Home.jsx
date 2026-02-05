import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-x-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Find the best <br />
            <span className="text-blue-600">Amazon products</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Discover our carefully selected Amazon products that provide value 
            and quality. Every purchase supports our website through the Amazon 
            Associates Program.
          </p>

          <button>
            <Link to="/blog" className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300">
              Blogs
            </Link>
          </button>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ProductList maxItems={3} />
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
                src="https://img.freepik.com/premium-photo/full-length-woman-using-phone_1048944-13877822.jpg?ga=GA1.1.575653788.1738306651&semt=ais_hybrid&w=740" 
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