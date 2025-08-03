'use client';

import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Hero() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

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
    <div className="relative overflow-hidden bg-gradient-to-br from-coffee-50 via-purple-50 to-indigo-50 py-8 sm:py-12 min-h-[90vh] flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20 animate-pulse"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-coffee-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-coffee-300 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-coffee-50 to-transparent"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {/* Enhanced Logo Display */}
          <div className="mb-8 flex justify-center" data-aos="zoom-in" data-aos-delay="200">
            <div className="relative rounded-full p-3 bg-white bg-opacity-30 backdrop-blur-sm shadow-2xl ring-2 ring-coffee-200 hover:ring-coffee-300 transition-all duration-300 transform hover:scale-110">
              <img
                src="/assets/sundial.jpg"
                alt="Aistrogpt Logo"
                className="h-24 w-24 object-cover rounded-full"
                width={96}
                height={96}
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-coffee-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-dark sm:text-6xl mb-6" data-aos="fade-up" data-aos-delay="400">
            AI-Powered Astrology Readings
            <span className="block text-coffee-300 bg-gradient-to-r from-coffee-300 to-purple-400 bg-clip-text text-transparent">
              Your Personal Cosmic Guide
            </span>
          </h1>
          
          <p className="mt-6 text-lg leading-8 text-gray-700 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="600">
            Get instant, personalized birth chart analysis and astrology insights 
            powered by advanced AI technology. Discover your cosmic path with precision 
            and ancient wisdom combined.
          </p>
          
          <div className="mt-8 flex items-center justify-center gap-x-6" data-aos="fade-up" data-aos-delay="800">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-coffee-400 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <button
                onClick={handleGetStarted}
                className="relative px-8 py-4 bg-gradient-to-r from-coffee-200 to-purple-200 text-dark font-semibold rounded-xl leading-none flex items-center divide-x divide-gray-600 hover:from-coffee-300 hover:to-purple-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                aria-label="Start Your Free Reading"
              >
                <span className="pr-6 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Your Free Reading
                </span>
                <span className="pl-6">→</span>
              </button>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-600" data-aos="fade-up" data-aos-delay="1000">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>100% Free to Start</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Accuracy</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
