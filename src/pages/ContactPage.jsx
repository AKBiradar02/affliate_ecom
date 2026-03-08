import { Link } from 'react-router-dom';

// ─── CHANGE THIS to your WhatsApp number or group link ───────────────────────
const WHATSAPP_NUMBER = '919999999999'; // e.g. 919876543210 (country code + number, no +)
const WHATSAPP_GROUP_LINK = ''; // paste group invite link here if you have one
// ─────────────────────────────────────────────────────────────────────────────

function ContactPage() {
  const waLink = WHATSAPP_GROUP_LINK || `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div className="bg-[#f6f6f8] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-10 text-sm text-slate-500">
          <Link to="/" className="hover:text-[#1152d4] flex items-center gap-1">
            <span className="material-symbols-outlined text-lg">home</span> Home
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-[#1152d4] font-bold">Contact Us</span>
        </nav>

        <h1 className="text-4xl font-black text-slate-900 mb-3">Contact Us</h1>
        <p className="text-slate-500 text-lg mb-12">
          Have a question, suggestion, or want to collaborate? Reach us directly on WhatsApp — we reply fast!
        </p>

        {/* WhatsApp Card */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-6 bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-green-300 transition-all group mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">WhatsApp</p>
            <p className="text-xl font-black text-slate-900 group-hover:text-green-600 transition-colors">
              {WHATSAPP_GROUP_LINK ? 'Join our WhatsApp Group' : 'Chat with us on WhatsApp'}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {WHATSAPP_GROUP_LINK ? 'Get exclusive deals, alerts and updates in our community group.' : 'We typically reply within a few hours.'}
            </p>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-green-400 transition-colors ml-auto">arrow_forward</span>
        </a>

        {/* Other contact info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h2 className="font-black text-slate-900 text-lg mb-4">Other Ways to Reach Us</h2>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1152d4]">mail</span>
              <a href="mailto:contact@affilistore.com" className="hover:text-[#1152d4] transition-colors">contact@affilistore.com</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1152d4]">schedule</span>
              <span>Response time: within 24 hours</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
