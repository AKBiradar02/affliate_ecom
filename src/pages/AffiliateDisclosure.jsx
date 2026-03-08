import { Link } from 'react-router-dom';

function AffiliateDisclosure() {
  return (
    <div className="bg-[#f6f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <nav className="flex items-center gap-2 mb-10 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1152d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1152d4] font-bold">Affiliate Disclosure</span>
        </nav>

        <div className="bg-white rounded-2xl p-10 border border-slate-200 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Affiliate Disclosure</h1>
            <p className="text-slate-400 text-sm">Last updated: March 2025</p>
          </div>

          <div className="bg-[#1152d4]/5 border border-[#1152d4]/20 rounded-xl p-6">
            <p className="text-slate-700 font-semibold leading-relaxed text-sm">
              <span className="font-black text-[#1152d4]">In short:</span> Some links on AffiliStore are affiliate links. If you click one and make a purchase, we may earn a small commission — at no extra cost to you.
            </p>
          </div>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">What is an Affiliate Link?</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              An affiliate link is a special tracking URL that tells the retailer (e.g. Amazon, Flipkart, Myntra) that you arrived via AffiliStore. If you complete a purchase, we earn a small percentage of the sale price as a commission. This does not add any extra cost to your order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">Our Affiliate Partners</h2>
            <p className="text-slate-600 leading-relaxed text-sm mb-3">
              AffiliStore participates in affiliate programs operated by platforms including (but not limited to):
            </p>
            <ul className="list-disc list-inside text-slate-600 text-sm space-y-1 pl-2">
              <li>Amazon Associates India</li>
              <li>Flipkart Affiliate Program</li>
              <li>Myntra Affiliate Program</li>
              <li>Ajio, Nykaa, Meesho and other platforms via Earnkaro</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">Our Commitment to Honest Recommendations</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We only share products we genuinely believe offer value. Affiliate commissions do not influence which products we feature — our goal is always to help you find the best deal. We are transparent about our affiliate relationships and follow the guidelines set by our affiliate partners.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">Questions?</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              If you have any questions about our affiliate relationships, please{' '}
              <Link to="/contact" className="text-[#1152d4] font-semibold hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AffiliateDisclosure;
