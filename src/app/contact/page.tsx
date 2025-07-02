'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [showBillingInfo, setShowBillingInfo] = useState(0);
  
  return (
    <main className="min-h-screen bg-white py-16 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="max-w-2xl w-full space-y-8">
        <p className="text-lg text-gray-700 text-center mb-8">
          Have questions or feedback? Reach out to us using the form below or email us at <a href="mailto:silliconsteed@gmail.com" className="text-indigo-600 underline">silliconsteed@gmail.com</a>.
        </p>
        <p><span className="font-medium">Billing Name:</span> Astrogpt / Aistrogpt</p>
        {showBillingInfo === 1 && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Billing Information</h2>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">Billing Address:</span> T3, Zion appts, VGP selva nagar extn, Chennai, India.</p>
              <p><span className="font-medium">Pincode:</span> 600042</p>
            </div>
          </div>
        )}
        
        {/* You can add a contact form here later */}
      </div>
    </main>
  );
}
