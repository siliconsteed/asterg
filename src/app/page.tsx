'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Script from 'next/script';

export default function Home() {
  const [showArticles, setShowArticles] = useState(0); // 1 for displayed, 0 for hidden
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      question: "How accurate are AI astrology readings?",
      answer: "Our AI astrology readings combine traditional astrological principles with advanced computational analysis. While astrology is interpretive by nature, our AI provides consistent, detailed analysis based on established astrological methods and your specific birth chart data."
    },
    {
      question: "What information do I need for a birth chart reading?",
      answer: "For the most accurate reading, you'll need your exact birth date, birth time (including hour and minute), and birth location (city and country). If you don't know your exact birth time, we can still provide valuable insights based on your birth date and location."
    },
    {
      question: "Is AistroGPT free to use?",
      answer: "We offer free basic astrology readings to get you started. Premium features include detailed birth chart analysis, compatibility reports, and unlimited chat with your AI astrologer. Check our pricing page for current options."
    }
  ];

  return (
    <main className="flex-grow bg-gradient-to-b from-orange-200 via-pink-300 via-purple-400 via-indigo-500 to-slate-700">
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqData.map(faq => ({
              '@type': 'Question',
              'name': faq.question,
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': faq.answer
              }
            }))
          })
        }}
      />
      <Hero />
      <Features />
      
      {/* Services Section */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-50/50 to-purple-50/50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:text-center" data-aos="fade-up">
            <h2 className="text-base font-semibold leading-7 text-coffee-400">Our Services</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Our AI Astrology Services
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover the power of AI-enhanced astrology with our comprehensive suite of services
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="group" data-aos="fade-up" data-aos-delay="200">
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark mb-4">Personalized Horoscope Readings</h3>
                    <p className="text-base leading-7 text-gray-600">
                      Receive daily, weekly, and monthly horoscopes customized to your specific 
                      birth chart. Unlike generic horoscopes, our AI creates predictions based 
                      on your individual astrological profile and current planetary transits.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group" data-aos="fade-up" data-aos-delay="400">
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark mb-4">Zodiac Compatibility Analysis</h3>
                    <p className="text-base leading-7 text-gray-600">
                      Discover your romantic and friendship compatibility with others through 
                      detailed synastry analysis. Our AI examines both birth charts to reveal 
                      relationship strengths, challenges, and growth opportunities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group" data-aos="fade-up" data-aos-delay="600">
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark mb-4">Career & Life Path Guidance</h3>
                    <p className="text-base leading-7 text-gray-600">
                      Unlock insights about your professional calling and life purpose through 
                      advanced astrological analysis. Learn about your natural talents, ideal 
                      career paths, and timing for major life decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-light via-white to-light relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-coffee-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:text-center" data-aos="fade-up">
            <h2 className="text-base font-semibold leading-7 text-coffee-400">Simple Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              How AistroGPT Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get your personalized astrology reading in just three simple steps
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="group" data-aos="fade-up" data-aos-delay="200">
                <div className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center gap-x-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-coffee-400 to-purple-500 text-white font-bold text-lg shadow-lg">
                      1
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark">Enter Your Birth Information</h3>
                  </div>
                  <p className="text-base leading-7 text-gray-600">
                    Provide your birth date, time, and location for accurate chart calculation.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-coffee-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Quick & Secure</span>
                  </div>
                </div>
              </div>
              
              <div className="group" data-aos="fade-up" data-aos-delay="400">
                <div className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center gap-x-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-coffee-400 to-purple-500 text-white font-bold text-lg shadow-lg">
                      2
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark">AI Analyzes Your Chart</h3>
                  </div>
                  <p className="text-base leading-7 text-gray-600">
                    Our advanced AI processes your birth chart and current planetary positions.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-coffee-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant Processing</span>
                  </div>
                </div>
              </div>
              
              <div className="group" data-aos="fade-up" data-aos-delay="600">
                <div className="relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center gap-x-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-coffee-400 to-purple-500 text-white font-bold text-lg shadow-lg">
                      3
                    </div>
                    <h3 className="text-lg font-semibold leading-7 text-dark">Receive Personalized Insights</h3>
                  </div>
                  <p className="text-base leading-7 text-gray-600">
                    Get detailed readings and engage in conversations with your AI astrologer.
                  </p>
                  <div className="mt-4 flex items-center text-sm text-coffee-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Interactive Chat</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coffee-50/30 to-purple-50/30"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:text-center" data-aos="fade-up">
            <h2 className="text-base font-semibold leading-7 text-coffee-400">Common Questions</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
              Frequently Asked Questions About AI Astrology
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Everything you need to know about our AI-powered astrology services
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="space-y-4">
              {faqData.map((faq, index) => {
                const isOpen = openFaqs.includes(index);
                const buttonId = `faq-question-${index}`;
                const panelId = `faq-answer-${index}`;
                return (
                  <div key={index} className="group" data-aos="fade-up" data-aos-delay={200 * (index + 1)}>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                      <button
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleFaq(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors duration-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-400"
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-coffee-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="text-lg font-semibold leading-7 text-dark">
                            {faq.question}
                          </h3>
                        </div>
                        <div className={`ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          <svg className="w-6 h-6 text-coffee-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-base leading-7 text-gray-800">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="chat-section" className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-white-50/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-md mx-auto glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden" data-aos="zoom-in">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-coffee-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
              <p className="text-gray-600 mb-8">Begin your personalized astrology experience today</p>
              <div className="space-y-4">
                <Link 
                  href="/chat" 
                  className="block w-full py-3 px-6 bg-gradient-to-r from-coffee-400 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-hover"
                >
                  Start Chatting Now
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

      {/* Floating Action Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-coffee-400 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-float"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Floating Chat Button */}
      <Link
        href="/chat"
        className="fixed bottom-8 left-8 z-50 w-14 h-14 bg-gradient-to-br from-coffee-400 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 animate-float flex items-center justify-center"
        aria-label="Start chat"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </Link>
    </main>
  );
}
