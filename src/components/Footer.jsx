function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">AffiliStore</h3>
          <p className="text-gray-400">
            Your trusted source for curated Amazon products and honest recommendations.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a>
            </li>
            <li>
              <a href="/products" className="text-gray-400 hover:text-white transition-colors">Products</a>
            </li>
            <li>
              <a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Legal</h4>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AffiliStore. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;