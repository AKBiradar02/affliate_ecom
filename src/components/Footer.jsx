import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1152d4] text-3xl">diamond</span>
              <span className="text-xl font-black tracking-tighter uppercase text-slate-900">AffiliStore</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              A curated affiliate store bringing you the best deals across electronics, fashion, beauty, and more — handpicked for quality and value.
            </p>
            <div className="flex gap-4">
              {/* Instagram */}
              <a href="https://www.instagram.com/abhaykb02/" target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white hover:scale-110 transition-transform shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-pink-500 transition-colors font-semibold">@abhaykb02</span>
              </a>

              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/abhay-biradar-aa05301b7/" target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:scale-110 transition-transform shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-[#0A66C2] transition-colors font-semibold">@abhay-biradar</span>
              </a>

              {/* Pinterest */}
              <a href="https://in.pinterest.com/abhaybusiness05/" target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E60023] text-white hover:scale-110 transition-transform shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-[#E60023] transition-colors font-semibold">@abhaybusiness05</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-6 text-slate-900">Shop</h5>
            <ul className="space-y-3 text-slate-500 font-medium text-sm">
              <li><Link to="/deals" className="hover:text-[#1152d4] transition-colors">All Deals</Link></li>
              <li><Link to="/deals?category=Electronics" className="hover:text-[#1152d4] transition-colors">Electronics</Link></li>
              <li><Link to="/deals?category=Fashion" className="hover:text-[#1152d4] transition-colors">Fashion</Link></li>
              <li><Link to="/deals?category=Home & Kitchen" className="hover:text-[#1152d4] transition-colors">Home &amp; Kitchen</Link></li>
              <li><Link to="/deals?category=Beauty & Daily Needs" className="hover:text-[#1152d4] transition-colors">Beauty &amp; Wellness</Link></li>
              <li><Link to="/blog" className="hover:text-[#1152d4] transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="font-black uppercase tracking-widest text-xs mb-6 text-slate-900">Support</h5>
            <ul className="space-y-3 text-slate-500 font-medium text-sm">
              <li><Link to="/contact" className="hover:text-[#1152d4] transition-colors">Contact Us</Link></li>
              <li><Link to="/support" className="hover:text-[#1152d4] transition-colors">Support</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#1152d4] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/affiliate-disclosure" className="hover:text-[#1152d4] transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 italic text-center sm:text-left max-w-xl">
            Affiliate Disclosure: Some links on this website are affiliate links. We may earn a commission at no extra cost to you. We only recommend products we genuinely believe in.
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">
            © {new Date().getFullYear()} AffiliStore
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;