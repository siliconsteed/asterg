import Link from 'next/link';
import Image from 'next/image';

type FooterProps = {
  showBuyMeCoffee?: number; // Optional prop with default value (0: hidden, 1: shown)
};

export default function Footer({ showBuyMeCoffee = 1 }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-4 md:mb-0">
            <Image
              src="/assets/sundial.jpg"
              alt="Aistrogpt Logo"
              width={30}
              height={30}
              className="mr-2 rounded-sm"
              style={{ width: 'auto', height: 'auto' }}
            />
            <span className="text-lg font-semibold text-gray-700">AIstroGPT</span>
          </div>
          <div className="space-x-4">
            <Link href="/about" className="hover:text-indigo-600">About Us</Link>
            <Link href="/contact" className="hover:text-indigo-600">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600">Privacy Policy</Link>
            {/* Custom Buy Me A Coffee Button - conditionally rendered */}
            {showBuyMeCoffee > 0 && (
              <a 
                href="https://www.buymeacoffee.com/astrop" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 bg-[#FFDD00] hover:bg-[#ffce00] text-black text-sm font-bold rounded-md border border-[#000000] transition-colors"
                style={{ fontFamily: 'Bree, Arial, sans-serif' }}
              >
                <span role="img" aria-label="coffee" className="mr-1.5" style={{ fontSize: '16px' }}>☕</span>
                Buy me a coffee
              </a>
            )}
          </div>
        </div>
        <p className="text-sm text-center text-gray-600">&copy; {new Date().getFullYear()} Aistrogpt.com. All rights reserved.</p>
      </div>
    </footer>
  );
}
