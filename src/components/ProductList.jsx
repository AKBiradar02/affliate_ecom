import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getAffiliateLinks } from '../utils/affiliateUtils';

function ProductList({ maxItems, category }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const all = await getAffiliateLinks();
      const filtered = category && category !== 'All'
        ? all.filter(p => p.category === category)
        : all;
      setProducts(maxItems ? filtered.slice(0, maxItems) : filtered);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold mb-3">No Products Found</h2>
        <p className="text-gray-600 mb-6">Add your first Amazon affiliate product to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Amazon Affiliate Products</h2>
        <button
          className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={loadProducts}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
