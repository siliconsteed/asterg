'use client';

import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const metadata = {
  title: "Contact | AistroGPT - Get in Touch",
  description: "Contact AistroGPT for support, feedback, or inquiries about our AI-powered astrology platform.",
  keywords: ["contact", "support", "feedback", "AistroGPT", "AI astrology", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
};

export default function ContactPage() {
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
        <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300/40 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-300/35 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse"></div>
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
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            Contact
            <span className="block text-orange-300 bg-gradient-to-r from-orange-300 to-pink-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to us using any of the methods below.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Contact Information */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Get in Touch</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-orange-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-orange-300">Email</h3>
                </div>
                <a href="mailto:silliconsteed@gmail.com" className="text-gray-300 hover:text-orange-300 transition-colors">
                  silliconsteed@gmail.com
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-pink-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-pink-300">Response Time</h3>
                </div>
                <p className="text-gray-300">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8" data-aos="fade-up" data-aos-delay="400">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How We Can Help</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold text-orange-300 mb-2">Technical Support</h3>
                <p className="text-sm text-gray-300">Help with platform usage, account issues, and technical problems.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold text-pink-300 mb-2">Billing Questions</h3>
                <p className="text-sm text-gray-300">Assistance with payments, subscriptions, and billing inquiries.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold text-purple-300 mb-2">Feature Requests</h3>
                <p className="text-sm text-gray-300">Suggestions for new features or improvements to our platform.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h3 className="font-semibold text-indigo-300 mb-2">General Inquiries</h3>
                <p className="text-sm text-gray-300">Questions about our services, astrology readings, or company information.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-300" data-aos="fade-up" data-aos-delay="600">
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Quick Response</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure Communication</span>
          </div>
        </div>
      </div>
    </main>
  );
}
