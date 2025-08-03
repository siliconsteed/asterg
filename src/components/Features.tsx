import { useEffect } from 'react';
import { StarIcon, SparklesIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    name: 'Instant Birth Chart Analysis',
    description: 'Get detailed astrological readings tailored specifically to your birth chart. Our AI analyzes your sun, moon, and rising signs along with planetary positions to provide comprehensive insights into your personality, relationships, and life path.',
    icon: StarIcon,
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
    iconColor: 'text-yellow-500'
  },
  {
    name: 'AI-Enhanced Accuracy',
    description: 'Advanced artificial intelligence combines traditional astrology methods with modern computational precision. Our algorithms process thousands of astrological factors to deliver the most accurate readings possible.',
    icon: SparklesIcon,
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    iconColor: 'text-purple-500'
  },
  {
    name: '24/7 Astrology Chat',
    description: 'Ask questions and receive instant astrological guidance through our intuitive chat interface. Your personal AI astrologer is always available to provide insights about love, career, finances, and spiritual growth.',
    icon: ChatBubbleBottomCenterTextIcon,
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    iconColor: 'text-blue-500'
  },
]

export default function Features() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-light via-white to-light py-16 sm:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-coffee-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl lg:text-center" data-aos="fade-up">
          <h2 className="text-base font-semibold leading-7 text-coffee-400">Why Choose AistroGPT</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-dark sm:text-4xl">
            Why Choose AistroGPT for Your Astrology Readings?
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience the perfect fusion of traditional astrological wisdom and 
            cutting-edge artificial intelligence. Our AI astrologer provides accurate, 
            personalized readings based on your unique birth chart and current planetary positions.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className="flex flex-col group"
                data-aos="fade-up"
                data-aos-delay={200 * (index + 1)}
              >
                <div className={`relative p-6 rounded-2xl ${feature.bgColor} border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group-hover:border-gray-200`}>
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-dark mb-4">
                    <div className={`p-3 rounded-xl bg-white shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                      <feature.icon className={`h-6 w-6 flex-none ${feature.iconColor}`} aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                    <div className="mt-4 flex items-center text-sm text-coffee-600 group-hover:text-coffee-700 transition-colors duration-300">
                      <span>Learn more</span>
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
