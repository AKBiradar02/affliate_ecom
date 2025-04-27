import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 py-3 px-4 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold text-white">
          <Link to="/">AffiliStore</Link>
        </div>
        
        <div className="flex gap-6">
          <Link 
            to="/" 
            className="text-white hover:text-blue-100 transition-colors"
          >
            Home
          </Link>
          
          <Link 
            to="/dashboard" 
            className="text-white hover:text-blue-100 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 