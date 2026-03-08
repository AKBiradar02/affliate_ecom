import { Link } from 'react-router-dom';

function SupportPage() {
  return (
    <div className="bg-[#f6f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <nav className="flex items-center gap-2 mb-10 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1152d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1152d4] font-bold">Support</span>
        </nav>

        <h1 className="text-4xl font-black text-slate-900 mb-3">Support</h1>
        <p className="text-slate-500 text-lg mb-12">
          Find answers to common questions, or get in touch with our team.
        </p>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 mb-8">
          {[
            {
              q: 'Are the products on AffiliStore genuine?',
              a: 'Yes. All products link directly to trusted platforms like Amazon, Flipkart, Myntra, Nykaa, and Ajio. We do not sell products ourselves — we curate and link to the original seller.'
            },
            {
              q: 'Will I pay extra if I buy through an affiliate link?',
              a: 'No. Affiliate links do not change the price you pay. You pay exactly the same price as if you had searched for the product yourself — we simply earn a small commission from the retailer.'
            },
            {
              q: 'How do I get the coupon code discount?',
              a: 'Coupon codes shown on product cards can be applied at checkout on the retailer\'s website. Simply copy the code shown and paste it in the coupon/promo code field before paying.'
            },
            {
              q: 'I found a broken link or wrong product. What should I do?',
              a: 'Please contact us via WhatsApp or email and let us know the product name. We\'ll fix it as soon as possible.'
            },
            {
              q: 'How are products selected for the site?',
              a: 'Products are manually curated by our team. We look for quality, value for money, and genuine affiliate deals across popular Indian shopping platforms.'
            },
          ].map(({ q, a }) => (
            <div key={q} className="p-6">
              <p className="font-bold text-slate-900 mb-2 text-sm">{q}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="bg-[#1152d4] rounded-2xl p-8 text-white text-center">
          <span className="material-symbols-outlined text-4xl mb-3 block">support_agent</span>
          <h2 className="text-xl font-black mb-2">Still need help?</h2>
          <p className="text-white/80 text-sm mb-6">Our team is available on WhatsApp and email.</p>
          <Link
            to="/contact"
            className="inline-block bg-white text-[#1152d4] px-8 py-3 rounded-xl font-black text-sm hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
