// src/components/Header.tsx
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link href="/" legacyBehavior>
          <a className="flex items-center text-decoration-none"> {/* Using a class for potential future styling */}
            <Image
              src="/assets/sundial.jpg" // You updated this to .jpg
              alt="Site Logo"
              width={100} // Slightly adjusted, feel free to change
              height={35}  // Slightly adjusted, feel free to change
              priority
            />
            {/* Optional: Add site title next to the logo */}
            {/* <span className="ml-3 text-xl font-semibold text-gray-700">AIstroGPT</span> */}
          </a>
        </Link>
        {/* Navigation links can go here, aligned to the right */}
        {/* <nav className="ml-auto">
          <Link href="/about" legacyBehavior><a className="text-gray-600 hover:text-gray-900 px-3 py-2">About</a></Link>
          <Link href="/services" legacyBehavior><a className="text-gray-600 hover:text-gray-900 px-3 py-2">Services</a></Link>
          <Link href="/contact" legacyBehavior><a className="text-gray-600 hover:text-gray-900 px-3 py-2">Contact</a></Link>
        </nav> */}
      </div>
    </header>
  );
};

export default Header;
