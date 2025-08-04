'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 via-pink-300 via-purple-400 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-coffee-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 relative">
        {/* Enhanced Header */}
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-down">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative rounded-full p-3 sm:p-4 bg-white bg-opacity-30 backdrop-blur-sm shadow-2xl ring-2 ring-coffee-200 hover:ring-coffee-300 transition-all duration-300 transform hover:scale-110">
              <img
                src="/assets/sundial.jpg"
                alt="Aistrogpt Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 object-cover rounded-full"
                width={64}
                height={64}
              />
              <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-coffee-400 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-dark mb-4 sm:mb-6">
            About
            <span className="block text-coffee-300 bg-gradient-to-r from-coffee-300 to-purple-400 bg-clip-text text-transparent">
              AIstroGPT
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind our AI-powered astrology platform and our mission to bring cosmic wisdom to everyone.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
          {/* Mission Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-coffee-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Our Mission</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We are dedicated to bridging the ancient wisdom of astrology with cutting-edge artificial intelligence technology. 
              Our mission is to make personalized astrological insights accessible to everyone, providing accurate, 
              detailed readings that help you understand your cosmic journey and make informed life decisions.
            </p>
          </div>

          {/* Vision Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Our Vision</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              To become the world's leading AI-powered astrology platform, combining traditional astrological principles 
              with advanced computational analysis. We envision a future where everyone has access to personalized 
              cosmic guidance that enhances their understanding of themselves and their relationships.
            </p>
          </div>

          {/* Values Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="600">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-coffee-700 mb-2">Accuracy</h3>
                <p className="text-sm text-gray-600">We prioritize precise calculations and reliable astrological interpretations.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-purple-700 mb-2">Privacy</h3>
                <p className="text-sm text-gray-600">Your personal data and birth details are protected with the highest security standards.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-pink-700 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">We continuously advance our AI technology to provide better insights.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-indigo-700 mb-2">Accessibility</h3>
                <p className="text-sm text-gray-600">Making astrological wisdom available to everyone, everywhere.</p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="800">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Our Team</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Our team combines expertise in astrology, artificial intelligence, and user experience design. 
              We're passionate about creating a platform that delivers meaningful insights while maintaining 
              the highest standards of accuracy and user privacy.
            </p>
            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
              <p className="text-sm text-gray-600">
                <strong>Contact us:</strong> For any questions or feedback, reach out to us at{' '}
                <a href="mailto:silliconsteed@gmail.com" className="text-coffee-600 hover:text-coffee-700 underline">
                  silliconsteed@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-600" data-aos="fade-up" data-aos-delay="1000">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>AI-Powered Insights</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>24/7 Available</span>
          </div>
        </div>
      </div>
    </main>
  );
}
