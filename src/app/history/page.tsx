'use client';

import { useState } from 'react';
import Chat from '@/components/Chat';

import { useEffect } from 'react';

export default function HistoryPage() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const stored = localStorage.getItem('user');
  if (stored) setUser(JSON.parse(stored));
}, []);

if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Please log in to view your chat history.</h2>
        <a href="/login" className="text-indigo-600 underline">Go to Login</a>
      </div>
    </div>
  );
}

return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-orange-200 via-pink-300 via-purple-400 to-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">Chat History</h1>
          <p className="mt-2 text-sm text-gray-600">View and continue your past conversations with AIstroGPT</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Past Sessions</h2>
              <a 
                href="/payment"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Chat
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedSessionId ? (
              <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-sm">
                <Chat
                  userDetails={user}
                  onEndChat={() => setSelectedSessionId(null)}
                />
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-2xl shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Chat Session</h3>
                <p className="text-gray-500 mb-6">
                  Choose a session from your history to view the conversation
                </p>
                <a 
                  href="/payment"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start New Conversation
                  <span className="ml-2 text-sm opacity-75">(₹99)</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
