'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const metadata = {
  title: "Privacy Policy | AistroGPT - Data Protection",
  description: "Read the privacy policy for AistroGPT. Learn how we protect your data and ensure your privacy on our AI astrology platform.",
  keywords: ["privacy policy", "data protection", "AistroGPT", "AI astrology", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
};

export default function PrivacyPolicyPage() {
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
            Privacy
            <span className="block text-coffee-300 bg-gradient-to-r from-coffee-300 to-purple-400 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            This Privacy Policy explains how we collect, use, and protect your information when you use our website. 
            Please review this page regularly for updates.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Overview Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-coffee-400 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Your Privacy Matters</h2>
            </div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              We respect your privacy and are committed to safeguarding your birth details and chat history. 
              Your personal information is treated with the utmost care and security.
            </p>
          </div>

          {/* Data Collection Section */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Data Collection</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-coffee-700 mb-2">Birth Information</h3>
                <p className="text-sm text-gray-600">Date, time, and location of birth for accurate astrological readings.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-purple-700 mb-2">Chat History</h3>
                <p className="text-sm text-gray-600">Conversations with our AI astrologer for personalized insights.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-pink-700 mb-2">Account Details</h3>
                <p className="text-sm text-gray-600">Email address and basic account information for service delivery.</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4 border border-white/30">
                <h3 className="font-semibold text-indigo-700 mb-2">Usage Analytics</h3>
                <p className="text-sm text-gray-600">Anonymous usage data to improve our services.</p>
              </div>
            </div>
          </div>

          {/* Privacy Commitments */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="600">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Our Privacy Commitments</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">We do not sell or share your personal data with third parties.</p>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">Your birth details and chat history are encrypted and securely stored.</p>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">You have full control over your data and can request deletion at any time.</p>
              </div>
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">We use industry-standard security measures to protect your information.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="800">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Questions About Privacy?</h2>
            </div>
            
            <div className="bg-white/50 rounded-xl p-4 border border-white/30">
              <p className="text-gray-700 mb-3">
                If you have any questions about our privacy practices or would like to exercise your data rights, 
                please contact us at:
              </p>
              <a 
                href="mailto:silliconsteed@gmail.com" 
                className="text-coffee-600 hover:text-coffee-700 underline font-medium"
              >
                silliconsteed@gmail.com
              </a>
            </div>
          </div>

          {/* Policy Updates */}
          <div className="glass rounded-2xl shadow-2xl border border-white/20 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="1000">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-dark">Policy Updates</h2>
            </div>
            
            <p className="text-gray-700">
              This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              We encourage you to review this Privacy Policy periodically.
            </p>
            
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-white/30">
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-600" data-aos="fade-up" data-aos-delay="1200">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Data Protected</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Encrypted Storage</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>No Data Sharing</span>
          </div>
        </div>
      </div>
    </main>
  );
}
