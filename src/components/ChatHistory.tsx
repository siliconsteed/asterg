import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Message {
  _id: string;
  content: string;
  isUserMessage: boolean;
  zodiacSign: string;
  sessionId: string;
  isPaidSession: boolean;
  createdAt: string;
}

interface ChatHistoryProps {
  userId: string;
  onSelectSession: (sessionId: string) => void;
}

export default function ChatHistory({ userId, onSelectSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedId, setSelectedId] = useState<string>();

  useEffect(() => {
    fetchMessages();
  }, [userId, page]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/messages?userId=${userId}&page=${page}&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      
      // Group messages by sessionId
      const newSessions = { ...sessions };
      data.messages.forEach((message: Message) => {
        if (!newSessions[message.sessionId]) {
          newSessions[message.sessionId] = [];
        }
        newSessions[message.sessionId].push(message);
      });

      setSessions(newSessions);
      setHasMore(page < data.pagination.pages);
    } catch (error) {
      setError('Failed to load chat history');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="space-y-4">
      {loading && page === 1 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-600/20 border-l-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-red-600 bg-red-50 rounded-xl border border-red-100 text-center">
          <p className="font-medium">Error Loading History</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : Object.keys(sessions).length === 0 ? (
        <div className="p-8 text-center bg-white/60 backdrop-blur-sm border border-indigo-100 rounded-xl">
          <div className="w-12 h-12 mx-auto mb-4 text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium">No Chat History</p>
          <p className="text-sm text-gray-500 mt-1">Start a new chat to begin your journey</p>
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(sessions).map(([sessionId, messages]) => {
            const lastMessage = messages[0]; // Messages are sorted by date desc
            const date = new Date(lastMessage.createdAt);
            return (
              <div
                key={sessionId}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${sessionId === selectedId
                  ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500'
                  : 'bg-white/60 backdrop-blur-sm border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50/50'
                }`}
                onClick={() => {
                  setSelectedId(sessionId);
                  onSelectSession(sessionId);
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {format(date, 'MMM d')}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      lastMessage.isPaidSession
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {lastMessage.isPaidSession ? 'Paid' : 'Free'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(date, 'h:mm a')}
                  </div>
                </div>
                <p className="text-sm text-gray-900 line-clamp-2">{lastMessage.content}</p>
                <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                  <span>{messages.length} messages</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasMore && !loading && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-colors duration-200"
        >
          Load More
        </button>
      )}

      {loading && page > 1 && (
        <div className="py-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-[2px] border-indigo-600/20 border-l-indigo-600"></div>
        </div>
      )}
    </div>
  );
}
