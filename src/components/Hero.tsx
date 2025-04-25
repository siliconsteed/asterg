'use client';

import { useState } from 'react';

export default function Hero() {
  const [loading, setLoading] = useState(false);

  // Custom smooth scroll for a gentler effect
  function smoothScrollTo(targetY: number, duration: number = 900) {
    const startY = window.scrollY;
    let startTime: number | null = null;
    function scrollStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      window.scrollTo(0, startY + (targetY - startY) * ease);
      if (progress < 1) {
        window.requestAnimationFrame(scrollStep);
      }
    }
    window.requestAnimationFrame(scrollStep);
  }

  const handleGetStarted = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      const endY = chatSection.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(endY, 1200);
    }
  };


  return (
    <div className="relative overflow-hidden bg-coffee-50 py-16 sm:py-24">
      <div className="absolute inset-y-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-10"></div>
        <div className="absolute bottom-0 h-80 w-full bg-gradient-to-t from-coffee-50 to-transparent"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-dark sm:text-6xl">
            Your Personal
            <span className="block text-coffee-300">Astrology Guide</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Unlock the secrets of the stars and discover your cosmic path. Get personalized astrological insights powered by advanced AI technology.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-coffee-200 to-coffee-400 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-200"></div>
              <button
                onClick={handleGetStarted}
                className={"relative px-6 py-3 bg-coffee-200 text-dark font-semibold rounded-lg leading-none flex items-center divide-x divide-gray-600 hover:bg-coffee-300 transition-colors duration-300"}
                aria-label="Get Started with Astrology Guide"
              >
                <span className="pr-6">Get Started</span>
                <span className="pl-6">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
