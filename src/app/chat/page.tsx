'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chat from '@/components/Chat';
import UserDetailsForm from '@/components/UserDetailsForm';
import { useState } from 'react';

export default function ChatPage() {
  const [userDetails, setUserDetails] = useState<any>(null);
  const [detailsSet, setDetailsSet] = useState(false);
  const router = useRouter();

  const handleEndChat = () => {
    router.push('/');
  };

  const handleSetData = (details: any) => {
    setUserDetails(details);
    setDetailsSet(true);
  };

  return (
    <main className="min-h-screen py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-primary mb-8">
          AIstroGPT chat
        </h1>
        <div className="flex flex-row gap-8 justify-center items-start">
          <UserDetailsForm onSetData={handleSetData} disabled={detailsSet} />
          <div className="flex-1 min-w-[400px]">
            <Chat onEndChat={handleEndChat} userDetails={userDetails} disabled={!detailsSet} />
          </div>
        </div>
      </div>
    </main>
  );
}
