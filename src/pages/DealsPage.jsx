function DealsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                {/* Coming Soon Icon */}
                <div className="text-8xl mb-6">🚀</div>

                {/* Heading */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    Coming Soon!
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-8">
                    We're working hard to bring you amazing deals. Stay tuned for more!
                </p>

                {/* Additional Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <p className="text-gray-700">
                        In the meantime, check out our <strong>Curated Deals</strong> on the homepage for handpicked products and exclusive offers.
                    </p>
                </div>

                {/* Back Button */}
                <a
                    href="/"
                    className="inline-block bg-[#1d3d53] hover:bg-[#162f40] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                    ← Back to Home
                </a>
            </div>
        </div>
    );
}

export default DealsPage;
