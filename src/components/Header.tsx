// src/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/assets/sundial.jpg"
            alt="Aistrogpt Logo"
            width={40}
            height={40}
            className="rounded-md"
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
          <span className="text-xl font-bold text-gray-800">AIstroGPT</span>
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium">Contact</Link>
          {/* Add more navigation links as needed */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
