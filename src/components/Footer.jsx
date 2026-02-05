

function Footer() {
  return (
    <footer className="bg-gray-100 py-4 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} AffiliStore. All rights reserved.
        </p>
        <p className="text-sm text-gray-600">
          As an Amazon Associate I earn from qualifying purchases.
        </p>
      </div>
    </footer>
  );
}

export default Footer;