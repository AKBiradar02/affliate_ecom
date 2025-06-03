import { redirectToAffiliate } from '../utils/affiliateUtils';

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="mb-4">
          {product.category && (
            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
              {product.category}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-gray-600 mb-6 line-clamp-3">
            {product.description}
          </p>
        )}

        <button
          onClick={() => redirectToAffiliate(product.affiliateUrl)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View on Amazon
        </button>
      </div>
    </div>
  );
}

export default ProductCard;