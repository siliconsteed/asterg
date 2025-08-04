'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export const metadata = {
  title: "Payment | AistroGPT - Buy Astrology Chat Session",
  description: "Purchase an AI astrology chat session with AistroGPT. Secure payment and instant access to personalized readings.",
  keywords: ["payment", "buy chat", "AI astrology", "AistroGPT", "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CHAT_PACKAGE = {
  id: 'standard',
  name: 'AI Chat Session',
  price: 99,
  duration: '10 minutes',
  features: [
    'One-on-one chat with AI',
    'Personalized responses',
    'Chat history access',
    'Instant answers to your questions'
  ]
};

export default function PaymentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const initializePayment = async (packageDetails: typeof CHAT_PACKAGE) => {
    try {
      setIsLoading(true);
      setError('');

      // Create order
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: packageDetails.price }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const data = await response.json();

      // Initialize Razorpay
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Astro GPT',
        description: `${packageDetails.name} - ${packageDetails.duration}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment signature
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyData.verified) {
              throw new Error('Payment verification failed');
            }

            // Save verified payment details
            setPaymentId(response.razorpay_payment_id);
            localStorage.setItem('payment', JSON.stringify({
              orderId: data.orderId,
              paymentId: response.razorpay_payment_id,
              amount: packageDetails.price,
              duration: packageDetails.duration,
              timestamp: new Date().toISOString(),
              verified: true,
            }));
            
            router.push('/chat');
          } catch (error) {
            console.error('Payment verification error:', error);
            setError('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6366F1'
        }
      };

      // Start 5-minute countdown
      setCountdown(300);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // Clear payment if not completed in 5 minutes
      const timeoutId = setTimeout(() => {
        if (!paymentId) {
          razorpay.close();
          setError('Payment session expired. Please try again.');
          setCountdown(null);
        }
      }, 300000);
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 via-pink-300 via-purple-400 to-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Chat Package</h1>
            <p className="mt-4 text-xl text-gray-600">
              Select a package that suits your needs
            </p>
          </div>

          {error && (
            <div className="mt-8 max-w-md mx-auto bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
              {error}
            </div>
          )}

          {countdown && (
            <div className="mt-4 text-center text-lg font-medium text-gray-600">
              Payment session expires in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </div>
          )}

          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900">{CHAT_PACKAGE.name}</h2>
                <p className="mt-4 text-4xl font-bold text-indigo-600">
                  ₹{CHAT_PACKAGE.price}
                  <span className="text-lg font-normal text-gray-500">
                    /{CHAT_PACKAGE.duration}
                  </span>
                </p>
                <ul className="mt-8 space-y-4">
                  {CHAT_PACKAGE.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => initializePayment(CHAT_PACKAGE)}
                  disabled={isLoading}
                  className="mt-8 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Start Chat Now'}
                </button>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
