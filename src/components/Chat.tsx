import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Added for Supabase integration

const responses = [
  'the stars indicate a period of growth and opportunity ahead.',
  'your ruling planet suggests focusing on personal relationships.',
  'the current planetary alignment favors creative endeavors.',
  'this is an excellent time for self-reflection and meditation.',
  'you might experience unexpected but positive changes soon.',
  'your intuition is particularly strong during this period.',
  'the cosmos suggests taking a balanced approach to challenges.',
  'your energy levels are aligned with your aspirations.',
];

const generateAstrologicalResponse = () => {
  return responses[Math.floor(Math.random() * responses.length)];
};

interface UserDetails {
  email: string;
  dob: string;
  tob: string;
  pob: string;
  lat: number;
  lon: number;
  timezone: number;
}

interface ChatProps {
  onEndChat: () => void;
  userDetails?: UserDetails;
  disabled?: boolean;
}

// Set to 1 to show the Test Astro API button
const apiTest = 1; // Only used for the lower button beside End Chat

export default function Chat({ onEndChat, userDetails, disabled }: ChatProps) {
  // ...state hooks...

  // Reset chat (clears localStorage and state)
  const resetChat = () => {
    localStorage.removeItem('astroData');
    localStorage.removeItem('threadId');
    setAstroData(null);
    setThreadId(null);
    setAstrologyApiMessage(null);
    setMessages([]);
    setInput('');
    setChatStarted(false);
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [astrologyApiMessage, setAstrologyApiMessage] = useState<ChatMessage | null>(null);
  const [astroData, setAstroData] = useState<any | null>(null); // Persisted astrology data
  const [threadId, setThreadId] = useState<string | null>(null); // New state for Thread ID
  const router = useRouter();

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Restore astroData and threadId from localStorage on mount
  useEffect(() => {
    const storedAstro = localStorage.getItem('astroData');
    const storedThreadId = localStorage.getItem('threadId');
    if (storedAstro) setAstroData(JSON.parse(storedAstro));
    if (storedThreadId) setThreadId(storedThreadId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    if (!chatStarted) {
      setChatStarted(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input, // content will be taken from currentInput later
      sender: 'user',
      timestamp: new Date(),
    };
    // Store current input *before* clearing and adding user message to UI
    const currentInput = input; 
    setMessages((prev) => [...prev, { ...userMessage, content: currentInput }]); // Use currentInput for UI
    setInput('');
    setIsTyping(true);

    // If we already have astrology data and threadId, skip astrology API and go straight to OpenAI
    if (astroData && threadId) {
      try {
        const assistantRes = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userQuery: currentInput,
            threadId: threadId, // Send existing thread ID
          }),
        });
        const assistantData = await assistantRes.json();
        let assistantResult = '';
        if (assistantRes.ok && assistantData.result) {
          assistantResult = assistantData.result;
        } else if (assistantData.error) {
          assistantResult = 'AI Assistant Error: ' + assistantData.error;
        } else {
          assistantResult = 'Unexpected response from AI Assistant.';
        }
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + .1).toString(), // Unique ID
            content: assistantResult,
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        console.error('Error calling /api/assistant (subsequent message):', err);
        setMessages((prev) => [...prev, {
          id: (Date.now() + .2).toString(),
          content: 'Sorry, there was a problem communicating with the AI Assistant. ' + (err instanceof Error ? err.message : ''),
          sender: 'system',
          timestamp: new Date(),
        }]);
      }
      setIsTyping(false);
      return;
    }

    // First message: fetch astrology API, store result, send to OpenAI, get thread_id
    if (!astroData) {
      if (!userDetails) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          content: 'User details are not available. Cannot fetch astrology data.',
          sender: 'system',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        return;
      }
      const { dob, tob, pob, lat, lon } = userDetails;
      if (!dob || !tob || !pob || !lat || !lon) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 2).toString(),
          content: 'Please fill in all required details (Date, Time, Place, Latitude, Longitude) before starting the chat.',
          sender: 'system',
          timestamp: new Date(),
        }]);
        setIsTyping(false);
        return;
      }
      try {
        const [yearStr, monthStr, dateStr] = dob.replace(/-/g, '/').split('/');
        const [hoursStr, minutesStr] = tob.split(':');

        const payload = {
          year: parseInt(yearStr, 10),
          month: parseInt(monthStr, 10),
          date: parseInt(dateStr, 10),
          hours: parseInt(hoursStr, 10),
          minutes: parseInt(minutesStr, 10),
          latitude: lat,
          longitude: lon,
          timezone: userDetails.timezone,
        };

        // Show a message that astrology data is being fetched
        setMessages((prev) => [...prev, {
          id: (Date.now() + .1).toString(), // Unique ID
          content: 'Fetching astrological insights...',
          sender: 'system',
          timestamp: new Date(),
        }]);

        const astroRes = await fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        // --- START: Improved Error Handling ---
        if (!astroRes.ok) {
          const errorText = await astroRes.text(); // Get the HTML error page content
          console.error('--- ASTROLOGY API FAILED ---');
          console.error('Status:', astroRes.status, astroRes.statusText);
          console.error('Response Body (HTML):', errorText);
          // Create a new error to be caught by the catch block below
          throw new Error(`Astrology API request failed with status ${astroRes.status}. Check the browser console for the full HTML error response.`);
        }

        const astroDataResp = await astroRes.json(); // This will only run if astroRes.ok is true
        // --- END: Improved Error Handling ---

        if (astroRes.ok) { // This check is now slightly redundant but harmless
          setAstroData(astroDataResp);
          localStorage.setItem('astroData', JSON.stringify(astroDataResp));
          const astroConfirmationMsg: ChatMessage = {
            id: (Date.now() + .2).toString(),
            content: 'Astrology data fetched. Initializing AI Assistant...',
            sender: 'system',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, astroConfirmationMsg]);
          setAstrologyApiMessage(astroConfirmationMsg);

          // Now send astrology result + user message to the Assistant API endpoint
          const assistantRes = await fetch('/api/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              astrologyData: astroDataResp,
              userQuery: currentInput,
            }),
          });
          const assistantData = await assistantRes.json();

          if (assistantRes.ok && assistantData.result && assistantData.thread_id) {
            setThreadId(assistantData.thread_id);
            localStorage.setItem('threadId', assistantData.thread_id);

            setMessages((prev) => [
              ...prev,
              {
                id: (Date.now() + .3).toString(),
                content: assistantData.result,
                sender: 'assistant',
                timestamp: new Date(),
              },
            ]);
          } else {
            const errorMsg = assistantData.error || 'Unexpected response from AI Assistant.';
            setMessages((prev) => [...prev, {
              id: (Date.now() + .3).toString(),
              content: `AI Assistant Error: ${errorMsg}`,
              sender: 'system',
              timestamp: new Date(),
            }]);
          }
        }
      } catch (err) {
        console.error('Error during first message processing:', err);
        setMessages((prev) => [...prev, {
          id: (Date.now() + .4).toString(),
          content: 'Sorry, there was a problem processing your first message. ' + (err instanceof Error ? err.message : String(err)),
          sender: 'system',
          timestamp: new Date(),
        }]);
      }
      setIsTyping(false);
      return;
    }
    setIsTyping(false);
  };


  // (other hooks or declarations can be here)

  return (
    <div className="flex flex-col flex-grow p-6 bg-gradient-to-b from-indigo-50 via-white to-white rounded-2xl shadow-xl border border-indigo-100">
      <div className="flex items-center mb-4 p-4 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-sm">
        <span className="text-xl font-semibold text-indigo-700">AIstroGPT Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 rounded-xl p-4 bg-white/80 backdrop-blur-sm border border-indigo-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] relative p-3 mb-2 rounded-xl shadow-md transition-all duration-200
                ${message.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 border border-gray-200'}
              `}
            >
              <span className="absolute top-3 left-[-12px] w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100 hidden md:block" style={{ display: message.sender === 'user' ? 'none' : 'block' }} />
              <span className="absolute top-3 right-[-12px] w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-indigo-600 hidden md:block" style={{ display: message.sender === 'user' ? 'block' : 'none' }} />
              <p className="text-[16px] leading-relaxed whitespace-pre-line">{message.content}</p>
              <p className={`text-xs font-medium ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-600'} mt-1`}>
                {message.sender === 'user' ? 'You' : message.sender === 'system' ? 'AIstroGPT' : message.sender}
              </p>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-300' : 'text-gray-500'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 p-4 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isTyping ? 'AIstroGPT is thinking...' : 'Type your message...'}
          className="flex-1 p-3 bg-white border border-indigo-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
          disabled={isTyping || !input.trim()}
        >
          Send
        </button>
      </form>
      {apiTest === 1 && (
        <div className="flex justify-center gap-3 mt-4">
          <button
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition-all duration-200 font-medium"
            onClick={async () => {
              setIsTyping(true);
              setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                content: 'Sending data to Astro API...',
                sender: 'user',
                timestamp: new Date(),
              }]);
              try {
                if (!userDetails) {
                  setIsTyping(false);
                  setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    content: 'Please set your details in the form before sending.',
                    sender: 'system',
                    timestamp: new Date(),
                  }]);
                  return;
                }
                const [yearStr, monthStr, dateStr] = userDetails.dob.replace(/-/g, '/').split('/');
                const [hoursStr, minutesStr] = userDetails.tob.split(':');

                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10);
                const date = parseInt(dateStr, 10);
                const hours = parseInt(hoursStr, 10);
                const minutes = parseInt(minutesStr, 10);

                if (isNaN(year) || isNaN(month) || isNaN(date) || isNaN(hours) || isNaN(minutes) || 
                    String(yearStr).length !== 4 || month < 1 || month > 12 || date < 1 || date > 31 || // Basic validation
                    hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                  setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    content: `Error: Invalid Date of Birth or Time of Birth. Please ensure DOB is YYYY/MM/DD and TOB is HH:MM. Received DOB: '${userDetails.dob}', TOB: '${userDetails.tob}'`,
                    sender: 'system',
                    timestamp: new Date(),
                  }]);
                  setIsTyping(false);
                  return;
                }

                const payload = {
                  year,
                  month,
                  date,
                  hours,
                  minutes,
                  latitude: userDetails.lat,
                  longitude: userDetails.lon,
                  timezone: userDetails.timezone,
                };

                const res = await fetch('/api/astrology', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });

                const data = await res.json();
                let reply = '';
                let rawApiResponse = ''; // Keep this if you want to log raw response elsewhere

                if (res.ok) {
                  reply = 'Astrology API Response:\n' + JSON.stringify(data, null, 2);
                  rawApiResponse = JSON.stringify(data, null, 2);
                } else if (data.error) {
                  reply = 'Astrology API Error: ' + (data.details || data.error);
                  rawApiResponse = JSON.stringify(data, null, 2);
                } else {
                  reply = 'Received an unexpected response from Astrology API: ' + JSON.stringify(data, null, 2);
                  rawApiResponse = JSON.stringify(data, null, 2);
                }

                // If astrology API call was successful, 'reply' contains the astrology data string.
                // 'data' here is the JSON object from /api/astrology.
                if (res.ok) {
                  try {
                    setMessages((prevMessages) => [
                      ...prevMessages,
                      {
                        id: (Date.now() + 2).toString(),
                        content: 'Sending astrology data to AI Assistant ...',
                        sender: 'system',
                        timestamp: new Date(),
                      },
                    ]);
                    // For the test button, let's assume there's no separate 'userQuery' like the main chat input.
                    // We'll send a generic query or just the astrology data.
                    // For consistency, let's define a userQuery for the test button scenario.
                    const testButtonUserQuery = 'Provide insights based on the following astrology data.';

                    const assistantRes = await fetch('/api/assistant', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        astrologyData: data, // 'data' is the JSON object from /api/astrology
                        userQuery: testButtonUserQuery, 
                      }),
                    });
                    const assistantData = await assistantRes.json();
                    let assistantResult = '';
                    if (assistantRes.ok && assistantData.result) {
                      assistantResult = assistantData.result;
                    } else if (assistantData.error) {
                      assistantResult = 'AI Assistant Error (Test Button): ' + assistantData.error;
                    } else {
                      assistantResult = 'Unexpected response from AI Assistant (Test Button).';
                    }
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: (Date.now() + 3).toString(),
                        content: assistantResult,
                        sender: 'system',
                        timestamp: new Date(),
                      },
                    ]);
                  } catch (err) {
                    console.error('Error calling /api/assistant (Test Button):', err);
                    setMessages((prev) => [...prev, {
                      id: (Date.now() + 4).toString(),
                      content: 'Sorry, there was a problem communicating with the AI Assistant (Test Button). ' + (err instanceof Error ? err.message : ''),
                      sender: 'system',
                      timestamp: new Date(),
                    }]);
                  }
                } else {
                   // If astrology API call itself failed, the error message is already in 'reply'
                   // and will be displayed by the existing logic.
                   setMessages((prev) => [...prev, {
                    id: (Date.now() + 1).toString(), // Ensure unique ID
                    content: reply, // This already contains the error from astrology API
                    sender: 'system',
                    timestamp: new Date(),
                  }]);
                  console.log('Skipping Assistant API call (Test Button) due to Astrology API error.');
                }
              } catch (err) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: (Date.now() + 4).toString(),
                    content: '[Test API] An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)),
                    sender: 'system',
                    timestamp: new Date(),
                  },
                ]);
              } finally {
                setIsTyping(false);
              }
            }}
            disabled={isTyping}
          >
            Start/Send
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to end this chat session?')) {
                onEndChat();
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-200 font-medium text-sm flex items-center"
          >
            <XMarkIcon className="w-4 h-4 mr-1" />
            End Chat
          </button>
        </div>
      )}
    </div>
  );
}
