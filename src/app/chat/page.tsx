'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import UserDetailsForm from '@/components/UserDetailsForm';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [detailsSet, setDetailsSet] = useState(false);
  const router = useRouter();
  
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
    <main className="min-h-screen py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          AIstroGPT chat
        </h1>
        <div className="flex flex-col gap-8 justify-center items-center">
          <UserDetailsForm onSetData={handleSetData} disabled={detailsSet} />
          <div className="flex-1 min-w-[400px]">
            <Chat 
              onEndChat={handleEndChat} 
              onReturnToDetails={handleReturnToDetails}
              userDetails={userDetails} 
              disabled={!detailsSet} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
