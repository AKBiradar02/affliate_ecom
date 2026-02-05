import { redirectToAffiliate } from '../utils/affiliateUtils';

function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col h-full">
      {product.imageUrl && (
        <div className="mb-3 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center" style={{ height: '200px' }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.title}</h3>

      {product.category && (
        <div className="mb-2">
          <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      )}

      {product.price && (
        <p className="text-xl font-bold text-green-600 mb-2">{product.price}</p>
      )}

      {product.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
      )}

      <button
        onClick={() => redirectToAffiliate(product.affiliateUrl)}
        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
      >
        Buy Now
      </button>
    </div>
  );
}

export default ProductCard;
