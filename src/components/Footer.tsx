import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <div className="space-x-4 mb-4">
          <Link href="/about" className="hover:text-indigo-600">About Us</Link>
          <Link href="/contact" className="hover:text-indigo-600">Contact Us</Link>
          <Link href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</Link>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Aistrogpt.com. All rights reserved.</p>
        {/* Replace 'Your Website Name' with your actual site name */}
      </div>
    </footer>
  );
}
