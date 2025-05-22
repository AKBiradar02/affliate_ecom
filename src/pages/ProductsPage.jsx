import { useState } from 'react';
import ProductList from '../components/ProductList';

function ProductsPage() {
  const [category, setCategory] = useState('All');

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>

        {/* Category Dropdown Filter */}
        <div className="flex justify-center mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-2 rounded shadow-sm text-gray-700 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Beauty & Makeup">Beauty & Makeup</option>
            <option value="Sports">Sports</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Fashion">Fashion</option>
          </select>
        </div>

        {/* Product Grid */}
        <ProductList category={category} />
      </div>
    </div>
  );
}

export default ProductsPage;
