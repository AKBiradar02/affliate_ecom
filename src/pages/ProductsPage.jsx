import ProductList from '../components/ProductList';

function ProductsPage() {
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-130px)] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">All Products</h1>
        <ProductList />
      </div>
    </div>
  );
}

export default ProductsPage; 