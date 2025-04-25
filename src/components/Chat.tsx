import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

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
}

interface ChatProps {
  onEndChat: () => void;
  userDetails?: UserDetails;
  disabled?: boolean;
}

// Set to 1 to show the Test Astro API button
const apiTest = 1;

export default function Chat({ onEndChat, userDetails, disabled }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      content: '', // We'll render a structured message below
      sender: 'system',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const router = useRouter();

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    if (!chatStarted) {
      setChatStarted(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (!userDetails) {
      return;
    }
    const { dob, tob, pob, lat, lon } = userDetails;

    // Check for missing fields
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

    setIsTyping(true);
    try {
      const payload = {
        dob: dob.replace(/\//g, '-'),
        tob,
        pob,
        lat,
        lon,
      };
      const res = await fetch('/api/kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      let reply = '';
      if (data.output) {
        // FreeAstrologyAPI returns planetary positions as data.output
        reply = 'Kundli generated! Here are some planetary positions:';
        const planets = data.output[1];
        reply += '\n';
        for (const planet in planets) {
          const p = planets[planet];
          reply += `\n${planet}: ${p.fullDegree?.toFixed(2)}°, Sign ${p.current_sign}`;
        }
      } else if (data.planet_positions) {
        reply = 'Kundli generated! Planetary positions:';
        for (const [planet, pos] of Object.entries(data.planet_positions)) {
          reply += `\n${planet}: ${pos}°`;
        }
      } else if (data.error) {
        reply = 'Error: ' + data.error;
      } else {
        reply = 'Received response: ' + JSON.stringify(data);
      }
      let openaiResult = '';
try {
  const openaiRes = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: reply }),
  });
  const openaiData = await openaiRes.json();
  if (openaiData.result) {
    openaiResult = openaiData.result;
  } else if (openaiData.error) {
    openaiResult = 'OpenAI error: ' + openaiData.error;
  } else {
    openaiResult = 'Unexpected OpenAI response.';
  }
} catch (err) {
  openaiResult = 'Sorry, there was a problem processing the response with OpenAI.';
}
setMessages((prev) => [
  ...prev,
  {
    id: (Date.now() + 3).toString(),
    content: openaiResult,
    sender: 'system',
    timestamp: new Date(),
  },
]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, there was a problem generating your kundli. Please try again.',
        sender: 'system',
        timestamp: new Date(),
      }]);
    }
    setIsTyping(false);
  };

  // (other hooks or declarations can be here)

  return (
    <div className="flex flex-col h-[80vh] max-w-3xl mx-auto p-6 bg-gradient-to-b from-indigo-50 via-white to-white rounded-2xl shadow-xl border border-indigo-100">
      <div className="flex justify-between items-center mb-6 p-4 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-sm">
        <span className="text-xl font-bold text-indigo-800">AstroGPT Chat</span>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to end this chat session?')) {
              onEndChat();
            }
          }}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 border border-red-200"
        >
          <XMarkIcon className="w-5 h-5 mr-1" />
          End Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 rounded-xl p-4 bg-white/80 backdrop-blur-sm border border-indigo-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${message.sender === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-indigo-100 text-gray-900'
              }`}
            >
              <p className="text-[15px] leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
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
          placeholder={isTyping ? 'AstroGPT is thinking...' : 'Type your message...'}
          className="flex-1 p-4 bg-white border border-indigo-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          disabled={isTyping}
        />

      </form>
      {apiTest === 1 && (
        <div className="flex justify-center mt-4">
          <button
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition-all duration-200 font-medium"
            onClick={async () => {
              setIsTyping(true);
              setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                content: '[Test] Sending test data to Astro API...',
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
                const payload = {
                  dob: userDetails.dob,
                  tob: userDetails.tob,
                  pob: userDetails.pob,
                  lat: userDetails.lat,
                  lon: userDetails.lon
                };
                const res = await fetch('/api/kundli', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                const data = await res.json();
                let reply = '';
                let rawApiResponse = '';
                if (data.output) {
                  reply = '[Test API] Kundli generated! Here are some planetary positions:';
                  const planets = data.output[1];
                  reply += '\n';
                  for (const planet in planets) {
                    const p = planets[planet];
                    reply += `\n${planet}: ${p.fullDegree?.toFixed(2)}°, Sign ${p.current_sign}`;
                  }
                  rawApiResponse = JSON.stringify(data, null, 2);
                } else if (data.planet_positions) {
                  reply = '[Test API] Kundli generated! Planetary positions:';
                  for (const [planet, pos] of Object.entries(data.planet_positions)) {
                    reply += `\n${planet}: ${pos}°`;
                  }
                  rawApiResponse = JSON.stringify(data, null, 2);
                } else if (data.error) {
                  reply = '[Test API] Error: ' + data.error;
                  rawApiResponse = JSON.stringify(data, null, 2);
                } else {
                  reply = '[Test API] Received response: ' + JSON.stringify(data);
                  rawApiResponse = JSON.stringify(data, null, 2);
                }

                let openaiResult = '';
                try {
                  const openaiRes = await fetch('/api/openai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: reply }),
                  });
                  const openaiData = await openaiRes.json();
                  if (openaiData.result) {
                    openaiResult = openaiData.result;
                  } else if (openaiData.error) {
                    openaiResult = '[Test API] OpenAI error: ' + openaiData.error;
                  } else {
                    openaiResult = '[Test API] Unexpected OpenAI response.';
                  }
                } catch (err) {
                  openaiResult = '[Test API] Sorry, there was a problem processing the response with OpenAI.';
                }
                setMessages((prev) => [
                  ...prev,
                  {
                    id: (Date.now() + 3).toString(),
                    content: openaiResult,
                    sender: 'system',
                    timestamp: new Date(),
                  },
                ]);
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
            Test Astro API
          </button>
        </div>
      )}
    </div>
  );
}

