'use client';

import { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

export default function Home() {
  const [showArticles, setShowArticles] = useState(0); // 1 for displayed, 0 for hidden

  return (
    <main className="flex-grow bg-gradient-to-b from-indigo-50 via-white to-white">
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

      {/* Articles Section */}
      {showArticles === 1 && (
        <section id="articles-section" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for articles - you can map through your articles here */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Article Title 1</h3>
              <p className="text-gray-600 mb-4">A short summary of the article content goes here...</p>
              <Link href="/articles/article-1" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Read More &rarr;
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Article Title 2</h3>
              <p className="text-gray-600 mb-4">A short summary of the article content goes here...</p>
              <Link href="/articles/article-2" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Read More &rarr;
              </Link>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Article Title 3</h3>
              <p className="text-gray-600 mb-4">A short summary of the article content goes here...</p>
              <Link href="/articles/article-3" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Read More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}
    </main>
  );
}
