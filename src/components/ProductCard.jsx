import { useNavigate } from 'react-router-dom';
import { redirectToAffiliate } from '../utils/affiliateUtils';

function ProductCard({ product }) {
  const { id, title, description, imageUrl, affiliateUrl } = product;
  const navigate = useNavigate();

  const handleClick = () => {
    redirectToAffiliate(id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'} 
          alt={title}
          className="h-48 w-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md">
          Amazon
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>
        
        <button 
          className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          onClick={handleClick}
        >
          View on Amazon
        </button>
      </div>
    </div>
  );
}

export default ProductCard; 