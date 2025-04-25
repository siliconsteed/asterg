'use client';

import Link from 'next/link';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <Hero />
      <Features />
      <section id="chat-section" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started</h2>
              <div className="space-y-4">
                <Link 
                  href="/chat" 
                  className="block w-full py-2.5 px-4 border border-indigo-600 rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Chat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
