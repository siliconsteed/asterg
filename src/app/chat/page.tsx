'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import UserDetailsForm from '@/components/UserDetailsForm';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ChatPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [detailsSet, setDetailsSet] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);
  
  // Function to handle returning to details form when validation fails
  const handleReturnToDetails = () => {
    setDetailsSet(false);
  };

  const handleEndChat = () => {
    router.push('/');
  };

  const handleSetData = async (details: any) => {
    console.log('--- MARKER 1: handleSetData triggered ---');
    console.log('Received details object:', details);

    const correctedDetails = {
      ...details,
      timezone: parseFloat(details.timezone)
    };

    setUserDetails(correctedDetails);
    setDetailsSet(true);

    // ---- Send user details to Supabase ----
    try {
      const dataToInsert = {
        username: correctedDetails.email,
        dob: correctedDetails.dob,
        tob: correctedDetails.tob,
        pob: correctedDetails.pob,
        lat: Math.round(correctedDetails.lat),
        long: Math.round(correctedDetails.lon),
        timezone: correctedDetails.timezone,
      };

      console.log('--- MARKER 2: Attempting to insert the following data into Supabase ---');
      console.log(dataToInsert);

      const { data, error: supabaseError } = await supabase
        .from('Aistrogptuser')
        .insert([dataToInsert])
        .select(); // .select() will return the inserted data, which is useful for debugging

      if (supabaseError) {
        console.error('--- MARKER 3: Supabase returned an error ---', supabaseError);
      } else {
        console.log('--- MARKER 4: Supabase insert successful! ---');
        console.log('Data returned from Supabase:', data);
      }
    } catch (err) {
      console.error('--- MARKER 5: An exception was caught during the Supabase operation ---', err);
    }
    // ---- End Supabase ----
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 via-pink-300 via-purple-400 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-coffee-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 relative">
        {/* Enhanced Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8" data-aos="fade-down">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="relative rounded-full p-2 sm:p-3 bg-white bg-opacity-30 backdrop-blur-sm shadow-2xl ring-2 ring-coffee-200 hover:ring-coffee-300 transition-all duration-300 transform hover:scale-110">
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
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-dark sm:text-5xl mb-2 sm:mb-4">
            AIstroGPT
            <span className="block text-coffee-300 bg-gradient-to-r from-coffee-300 to-purple-400 bg-clip-text text-transparent">
              Chat Experience
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Connect with your personal AI astrologer and discover insights about your cosmic journey
          </p>
        </div>

        {/* Main Content - Mobile Optimized */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 justify-center items-start max-w-7xl mx-auto">
          {/* User Details Form */}
          <div className="w-full lg:w-1/3 order-2 lg:order-1" data-aos="fade-right" data-aos-delay="200">
            <div className="glass rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
              <UserDetailsForm onSetData={handleSetData} disabled={detailsSet} />
            </div>
          </div>

          {/* Chat Component */}
          <div className="w-full lg:w-2/3 order-1 lg:order-2" data-aos="fade-left" data-aos-delay="400">
            <Chat 
              onEndChat={handleEndChat} 
              onReturnToDetails={handleReturnToDetails}
              userDetails={userDetails} 
              disabled={!detailsSet} 
            />
          </div>
        </div>

        {/* Trust Indicators - Mobile Optimized */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-600" data-aos="fade-up" data-aos-delay="600">
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
            <span>Real-time Chat</span>
          </div>
        </div>
      </div>
    </main>
  );
}
