import { useState } from 'react';

function DealModal({ deal, isOpen, onClose }) {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!isOpen || !deal) return null;

  // Extract coupon code from description if exists
  const extractCouponCode = (description) => {
    if (!description) return null;
    
    // Look for patterns like "code: SAVE50" or "CODE: SAVE50" or "use SAVE50"
    const patterns = [
      /code[:\s]+([A-Z0-9]+)/i,
      /coupon[:\s]+([A-Z0-9]+)/i,
      /use[:\s]+([A-Z0-9]+)/i,
    ];
    
    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const couponCode = extractCouponCode(deal.description);

  const handleCopyCoupon = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2000);
    }
  };

  const handleVisitStore = () => {
    window.open(deal.affiliateUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-md"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Product Image */}
          {deal.imageUrl && (
            <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
              <img
                src={deal.imageUrl}
                alt={deal.title}
                className="max-h-full max-w-full object-contain"
              />
              
              {/* Discount Badge */}
              {deal.discount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {deal.discount}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {deal.title}
            </h2>

            {/* Category Badge */}
            {deal.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  {deal.category}
                </span>
              </div>
            )}

            {/* Price */}
            {deal.price && (
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{deal.price}
                  </span>
                  {deal.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ₹{deal.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {deal.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {deal.description}
                </p>
              </div>
            )}

            {/* Coupon Code Section */}
            {couponCode && (
              <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Coupon Code</p>
                    <p className="text-2xl font-bold text-orange-600 font-mono tracking-wider">
                      {couponCode}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyCoupon}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      copiedCoupon
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {copiedCoupon ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Code
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleVisitStore}
                className="flex-1 bg-[#1d3d53] hover:bg-[#955e3e] text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Visit Store
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealModal;
