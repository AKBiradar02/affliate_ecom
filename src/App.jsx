import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import './App.css';

function App() {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      console.error('Unhandled error:', event.error);
      setError(event.error.toString());
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="p-5 text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error occurred:</h1>
        <pre className="bg-gray-100 p-4 rounded">{error}</pre>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;