import { Link } from 'react-router-dom';

function PrivacyPolicy() {
  return (
    <div className="bg-[#f6f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <nav className="flex items-center gap-2 mb-10 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1152d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1152d4] font-bold">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-2xl p-10 border border-slate-200 space-y-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: March 2025</p>
          </div>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">1. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              AffiliStore does not collect any personally identifiable information unless you voluntarily contact us (e.g. via WhatsApp or email). We do not require account registration to browse products on this platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">2. Cookies & Analytics</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We may use basic analytics tools (such as Firebase Analytics) to understand how visitors use our site. This data is anonymised and does not identify individual users. No cookies are used for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">3. Third-Party Links</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Our site contains affiliate links to third-party platforms such as Amazon, Flipkart, Myntra, and others. When you click these links, you are leaving our site. We are not responsible for the privacy practices of those platforms. Please review their respective privacy policies before making any purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">4. Data Security</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We take reasonable precautions to protect any information shared with us. Our platform is hosted on secure, industry-standard infrastructure (Firebase / Vercel).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">5. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              We reserve the right to update this Privacy Policy at any time. Changes will be reflected on this page with an updated date. Continued use of the site constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-slate-800 mb-3">6. Contact</h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              If you have any questions about this Privacy Policy, please{' '}
              <Link to="/contact" className="text-[#1152d4] font-semibold hover:underline">contact us</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
