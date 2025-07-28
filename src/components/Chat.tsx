import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { ClockIcon, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Added for Supabase integration
import Script from 'next/script';
import { initializePayPalButton } from '@/lib/paypalClient';
import { initializeRazorpayCheckout } from '@/lib/razorpayClient';

// Add TypeScript declaration for global Razorpay object
declare global {
  interface Window {
    Razorpay: any;
  }
}

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

// Validation results interface
interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

// Function to validate user details comprehensively - returns result object
// but doesn't add messages to the chat
const validateUserDetails = (details: UserDetails | undefined): ValidationResult => {
  // Check if details exist
  if (!details) {
    return { isValid: false, errorMessage: 'User details are not available.' };
  }
  
  // Destructure for easier access
  const { email, dob, tob, pob, lat, lon, timezone } = details;
  
  // Check all required fields are present
  if (!email || !dob || !tob || !pob || lat === undefined || lon === undefined || timezone === undefined) {
    return { 
      isValid: false, 
      errorMessage: 'Please fill in all required fields (Email, Date of Birth, Time of Birth, Place of Birth, Coordinates).' 
    };
  }
  
  // Validate email format using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, errorMessage: 'Please enter a valid email address.' };
  }
  
  // Validate date format and values
  try {
    const [yearStr, monthStr, dateStr] = dob.replace(/-/g, '/').split('/');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const date = parseInt(dateStr, 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(date) || String(yearStr).length !== 4 || 
        month < 1 || month > 12 || date < 1 || date > 31) {
      return { 
        isValid: false, 
        errorMessage: `Invalid Date of Birth format. Please use YYYY/MM/DD or YYYY-MM-DD format. Received: '${dob}'` 
      };
    }
    
    // Additional date validation (e.g., February having max 29 days in leap years)
    const maxDaysInMonth = new Date(year, month, 0).getDate();
    if (date > maxDaysInMonth) {
      return { 
        isValid: false, 
        errorMessage: `Invalid date. ${month}/${year} has only ${maxDaysInMonth} days.` 
      };
    }
  } catch (error) {
    return { 
      isValid: false, 
      errorMessage: `Invalid Date of Birth format. Please use YYYY/MM/DD or YYYY-MM-DD format. Received: '${dob}'` 
    };
  }
  
  // Validate time format and values
  try {
    const [hoursStr, minutesStr] = tob.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return { 
        isValid: false, 
        errorMessage: `Invalid Time of Birth format. Please use HH:MM (24-hour) format. Received: '${tob}'` 
      };
    }
  } catch (error) {
    return { 
      isValid: false, 
      errorMessage: `Invalid Time of Birth format. Please use HH:MM format. Received: '${tob}'` 
    };
  }
  
  // Validate coordinates
  if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
    return { isValid: false, errorMessage: 'Latitude must be a number between -90 and 90.' };
  }
  
  if (typeof lon !== 'number' || isNaN(lon) || lon < -180 || lon > 180) {
    return { isValid: false, errorMessage: 'Longitude must be a number between -180 and 180.' };
  }
  
  // Validate timezone (basic validation)
  if (typeof timezone !== 'number' || isNaN(timezone) || timezone < -12 || timezone > 14) {
    return { isValid: false, errorMessage: 'Timezone must be a number between -12 and 14.' };
  }
  
  // All validations passed
  return { isValid: true };
};

interface ChatProps {
  onEndChat: () => void;
  onReturnToDetails?: () => void;
  userDetails?: UserDetails;
  disabled?: boolean;
}

// Set to 0 to bypass payment flow, 1 to show payment options
const skipPayment: number = 1; // When 0, payment step is skipped

// Set to 1 to disable Razorpay, 0 to enable it
const disableRazorpay: number = 0; // When 1, Razorpay payment option is disabled

// Set to 1 to disable PayPal, 0 to enable it
const disablePaypal: number = 0; // When 1, PayPal payment option is disabled

export default function Chat({ onEndChat, onReturnToDetails, userDetails, disabled }: ChatProps) {
  // Payment script loading states
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for payment processing
  
  // PayPal script loading handler
  const handlePayPalScriptLoad = () => {
    setPaypalLoaded(true);
    console.log('PayPal script loaded');
  };
  
  // Razorpay script loading handler
  const handleRazorpayScriptLoad = () => {
    // Double check that Razorpay is actually available
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayLoaded(true);
      console.log('Razorpay script loaded successfully');
    } else {
      console.warn('Razorpay script loaded event fired but window.Razorpay is not available. Possible ad blocker interference.');
      setRazorpayLoaded(false);
    }
  };
  
  // Check periodically if Razorpay is available despite script loading issues
  useEffect(() => {
    // If already loaded, no need to check
    if (razorpayLoaded) return;
    
    const checkRazorpay = () => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        setRazorpayLoaded(true);
        console.log('Razorpay detected through periodic check');
      }
    };
    
    // Check immediately and then every 2 seconds
    checkRazorpay();
    const interval = setInterval(checkRazorpay, 2000);
    
    return () => clearInterval(interval);
  }, [razorpayLoaded]);

  // State for validation errors and data confirmation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [showChatSection, setShowChatSection] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
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
  
  // Countdown timer states
  const [timerStarted, setTimerStarted] = useState(false);
  const [countdown, setCountdown] = useState(10 * 60); // 10 minutes in seconds

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to validate user data and show error if invalid
  const validateAndConfirmUserData = () => {
    if (!userDetails) {
      setValidationError('User details are not available.');
      // Return to details form when validation fails
      onReturnToDetails?.();
      return false;
    }
    
    const validation = validateUserDetails(userDetails);
    if (!validation.isValid) {
      setValidationError(validation.errorMessage || 'Invalid user details.');
      // Return to details form when validation fails
      onReturnToDetails?.();
      return false;
    }
    
    // If valid, clear error and prepare for confirmation
    setValidationError(null);
    return true;
  };

  // Handle the Set Data button click
  const handleSetDataClick = () => {
    if (validateAndConfirmUserData()) {
      setDataConfirmed(true);
    } else {
      // Reset confirmation status if validation fails
      setDataConfirmed(false);
      // Return to details form for editing if the callback is provided
      onReturnToDetails?.();
    }
  };

  // Handle user confirmation of data
  const handleConfirmData = () => {
    if (skipPayment === 0) {
      // Skip payment and go directly to chat
      setShowChatSection(true);
      // Timer will start when user sends first message
    } else {
      // Show payment options
      setShowPaymentSection(true);
    }
  };
  
  // With Razorpay disabled, auto-select PayPal
  useEffect(() => {
    if (showPaymentSection && (disableRazorpay === 1 || !razorpayLoaded)) {
      setSelectedPaymentMethod('paypal');
    }
  }, [showPaymentSection, disableRazorpay, razorpayLoaded]);
  
  // Handle payment completion
  const handlePaymentComplete = (details: any) => {
    console.log('Payment completed', details);
    setPaymentCompleted(true);
    setShowPaymentSection(false);
    setShowChatSection(true);
    // Timer will start when user sends first message
  };
  
  // Handle payment error
  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    
    // Get a more specific error message if available
    let errorMessage = 'There was an error processing your payment.';
    
    if (error instanceof Error) {
      errorMessage = `Payment failed: ${error.message}`;
      console.debug('Error details:', error);
    } else if (typeof error === 'string') {
      errorMessage = `Payment failed: ${error}`;
    } else if (error && typeof error === 'object') {
      errorMessage = error.description || error.message || errorMessage;
      console.debug('Error object:', JSON.stringify(error));
    }
    
    // Reset payment UI state
    setIsLoading(false);
    
    // Show error to user
    alert(errorMessage + ' Please try again or choose a different payment method.');
  };
  
  // Process payment based on selected payment method
  const processPayment = () => {
    if (selectedPaymentMethod === 'paypal' && paypalLoaded && disablePaypal === 0) {
      // Render PayPal button in the paypal-button-container
      initializePayPalButton(
        'paypal-button-container', 
        5.00, // $5 USD
        handlePaymentComplete,
        handlePaymentError
      );
    } else if (selectedPaymentMethod === 'razorpay' && disableRazorpay === 0) {
      // Check if Razorpay is properly loaded
      if (!window.Razorpay) {
        console.error('Razorpay not available. Ensure the script is loaded.');
        alert('Razorpay payment service is not available right now. Please try PayPal or try again later.');
        return;
      }
      
      // Show loading indicator
      setIsLoading(true);
      
      // Launch Razorpay checkout with user details if available
      try {
        console.log('Initializing Razorpay checkout with 429 INR...');
        initializeRazorpayCheckout(
          429, // 429 INR
          'INR',
          (response) => {
            console.log('Razorpay payment successful', response);
            setIsLoading(false);
            handlePaymentComplete(response);
          },
          (error) => {
            console.error('Razorpay payment error:', error);
            setIsLoading(false);
            handlePaymentError(error);
          },
          userDetails ? { 
            email: userDetails.email,
            name: userDetails.email.split('@')[0], // Use part of email as name
            // You could add phone if you collect it
          } : undefined
        );
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        handlePaymentError(error);
      }
    } else {
      // Fallback for development/testing without payment SDKs
      alert('Processing payment with ' + selectedPaymentMethod);
      // Simulate payment processing
      setTimeout(() => {
        handlePaymentComplete({ status: 'COMPLETED', id: 'test-' + Date.now() });
      }, 1500);
    }
  };
  
  
  
  // Additional methods and handlers for chat functionality continue below...

  // Handle user cancellation of data confirmation
  const handleCancelConfirm = () => {
    setDataConfirmed(false);
    // Return to details form for editing if the callback is provided
    onReturnToDetails?.();
  };

  // Restore astroData and threadId from localStorage on mount
  useEffect(() => {
    const storedAstro = localStorage.getItem('astroData');
    const storedThreadId = localStorage.getItem('threadId');
    if (storedAstro) setAstroData(JSON.parse(storedAstro));
    if (storedThreadId) setThreadId(storedThreadId);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (timerStarted && countdown > 0) {
      timerInterval = setInterval(() => {
        setCountdown(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval!);
            // Redirect to home page when timer reaches zero
            router.push('/');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerStarted, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;

    if (!chatStarted) {
      setChatStarted(true);
      // Start countdown timer when user sends their first message
      setTimerStarted(true);
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input, // content will be taken from currentInput later
      sender: 'user' as 'user',
      timestamp: new Date(),
    };
    // Store current input *before* clearing and adding user message to UI
    const currentInput = input;
    setMessages((prev) => [...prev, { ...userMessage, content: currentInput }]); // Use currentInput for UI

    // Send the message to the Supabase backend
    try {
      fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ msg: currentInput }),
      });
    } catch (error) {
      console.error('Failed to send message to Supabase:', error);
    }

    setInput('');
    setIsTyping(true);
    
    try {
      // If we have astrology data and a thread ID from previous calls
      if (astroData && threadId) {
        // For subsequent messages in a thread, include the thread ID
        const assistantRes = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId, // Send the current thread ID for conversation continuity
            userQuery: currentInput, // The user's message
          }),
        });
        
        const assistantData = await assistantRes.json();
        
        if (assistantRes.ok && assistantData.result) {
          // Add the assistant's response to the chat
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: assistantData.result,
              sender: 'system' as 'system',
              timestamp: new Date(),
            },
          ]);
        } else if (assistantData.error) {
          // Handle API error responses
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: 'AI Assistant Error: ' + assistantData.error,
              sender: 'system' as 'system',
              timestamp: new Date(),
            },
          ]);
        } else {
          // Handle unexpected response format
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              content: 'Received an unexpected response from the AI Assistant.',
              sender: 'system' as 'system',
              timestamp: new Date(),
            },
          ]);
        }
      } else {
        // If we don't have astrology data yet, we need to fetch it first
        if (!userDetails) {
          setMessages((prev) => [
            ...prev, 
            {
              id: (Date.now() + 1).toString(),
              content: 'User details are required to process your query.',
              sender: 'system' as 'system',
              timestamp: new Date()
            }
          ]);
          setIsTyping(false);
          return;
        }
        
        // First-time chat - extract user details and get astrology data
        const [year, month, date] = userDetails.dob.split('-').map(Number);
        const [hours, minutes] = userDetails.tob.split(':').map(Number);
        const { lat, lon, timezone } = userDetails;
        
        // Prepare the payload for the astrology API
        const payload = {
          year,
          month,
          date,
          hours,
          minutes,
          latitude: lat,
          longitude: lon,
          timezone
        };
        
        setMessages((prev) => [
          ...prev, 
          {
            id: (Date.now() + 1).toString(),
            content: 'Fetching your astrological data...',
            sender: 'system' as 'system',
            timestamp: new Date()
          }
        ]);
        
        // Call the astrology API to get chart data
        const res = await fetch('/api/astrology', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          let errorMessage = 'Failed to fetch astrological data.';
          if (data.error) {
            errorMessage += ' ' + data.error;
          }
          
          setMessages((prev) => [...prev, {
            id: (Date.now() + 2).toString(),
            content: errorMessage,
            sender: 'system' as 'system',
            timestamp: new Date(),
          }]);
          setIsTyping(false);
          return;
        }
        
        // Store the astrology data for future messages
        setAstroData(data);
        
        setMessages((prev) => [...prev, {
          id: (Date.now() + 3).toString(),
          content: 'Astrological data received. Processing your query...',
          sender: 'system' as 'system',
          timestamp: new Date(),
        }]);
        
        // Now send both astrology data and user query to the assistant API
        try {
          const assistantRes = await fetch('/api/assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              astrologyData: data, // Send the astrology data
              userQuery: currentInput, // The user's question/message
            }),
          });
          
          const assistantData = await assistantRes.json();
          
          if (assistantRes.ok) {
            // Save the thread ID if provided for future messages
            if (assistantData.threadId) {
              setThreadId(assistantData.threadId);
            }
            
            // Add the assistant's response to the chat
            setMessages((prev) => [...prev, {
              id: (Date.now() + 4).toString(),
              content: assistantData.result || 'No response from the AI assistant.',
              sender: 'system' as 'system',
              timestamp: new Date(),
            }]);
          } else {
            // Handle API errors
            setMessages((prev) => [...prev, {
              id: (Date.now() + 4).toString(),
              content: 'AI Assistant Error: ' + (assistantData.error || 'Unknown error'),
              sender: 'system' as 'system',
              timestamp: new Date(),
            }]);
          }
        } catch (err) {
          console.error('Error calling assistant API:', err);
          setMessages((prev) => [...prev, {
            id: (Date.now() + 4).toString(),
            content: 'Error processing your query: ' + (err instanceof Error ? err.message : String(err)),
            sender: 'system' as 'system',
            timestamp: new Date(),
          }]);
        }
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 5).toString(),
        content: 'An unexpected error occurred: ' + (err instanceof Error ? err.message : String(err)),
        sender: 'system',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to test the astrology API without starting a chat
  const handleTestAstroApi = async () => {
    if (!userDetails) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        content: 'User details are not available. Please enter your birth details first.',
        sender: 'system',
        timestamp: new Date(),
      }]);
      return;
    }

    // Use the comprehensive validation function
    const validation = validateUserDetails(userDetails);
    
    if (!validation.isValid) {
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        content: validation.errorMessage || 'Invalid user details. Please check all fields.',
        sender: 'system',
        timestamp: new Date(),
      }]);
      return;
    }

    // If validation passed, extract the required fields
    const { dob, tob, lat, lon, timezone } = userDetails;

    try {
      setIsTyping(true);
      
      // Show a message that astrology data is being fetched
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        content: 'Fetching astrological insights... This may take upto 2 minutes. ',
        sender: 'system',
        timestamp: new Date(),
      }]);

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
        timezone,
      };

      // Call the astrology API
      const astroRes = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Improved Error Handling
      if (!astroRes.ok) {
        const errorText = await astroRes.text();
        console.error('--- ASTROLOGY API TEST FAILED ---');
        console.error('Status:', astroRes.status, astroRes.statusText);
        console.error('Response Body:', errorText);
        throw new Error(`Astrology API request failed with status ${astroRes.status}`);
      }

      const astroDataResp = await astroRes.json();
      setAstroData(astroDataResp);
      localStorage.setItem('astroData', JSON.stringify(astroDataResp));
      
      // Display confirmation that astrology data was fetched
      const astroConfirmationMsg = {
        id: Date.now().toString(),
        content: 'Astrology data fetched successfully. AIstroGPT with the astrology data...',
        sender: 'system' as 'system',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, astroConfirmationMsg]);

      // Now send astrology data to the Assistant API endpoint for a test response
      const assistantRes = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          astrologyData: astroDataResp,
          userQuery: 'Give me a brief astrological insight based on this data.',
        }),
      });

      const assistantData = await assistantRes.json();
      
      if (assistantRes.ok && assistantData.result) {
        // Save the thread_id if one is returned
        if (assistantData.thread_id) {
          setThreadId(assistantData.thread_id);
          localStorage.setItem('threadId', assistantData.thread_id);
        }
        
        // Display the AI assistant response
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          content: assistantData.result,
          sender: 'assistant' as 'assistant',
          timestamp: new Date(),
        }]);
      } else {
        const errorMsg = assistantData.error || 'Unexpected response from AI Assistant.';
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          content: `AI Assistant Error: ${errorMsg}`,
          sender: 'system' as 'system',
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      console.error('Error testing astrology API:', err);
      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        content: 'Error testing astrology API: ' + (err instanceof Error ? err.message : String(err)),
        sender: 'system',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // (other hooks or declarations can be here)

  return (
    <div className="flex flex-col flex-grow p-6 bg-gradient-to-b from-indigo-50 via-white to-white rounded-2xl shadow-xl border border-indigo-100">
      {/* Dynamic loading of payment scripts */}
      {disablePaypal === 0 && (
        <Script
          src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
          onLoad={handlePayPalScriptLoad}
          onError={() => console.error('Failed to load PayPal script')}
        />
      )}
      {disableRazorpay === 0 && (
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js" 
          strategy="afterInteractive" 
          onLoad={handleRazorpayScriptLoad}
          onError={() => {
            console.error('Failed to load Razorpay script');
            setRazorpayLoaded(false);
          }} 
        />
      )}
      <div className="flex items-center justify-between mb-4 p-4 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-xl shadow-sm">
        <span className="text-xl font-semibold text-indigo-700">AIstroGPT Chat</span>
        {showChatSection && (
          <div className="flex items-center text-sm font-medium text-gray-600">
            <ClockIcon className="w-5 h-5 mr-1.5 text-indigo-500" />
            <span>Time Remaining: {timerStarted ? `${Math.floor(countdown / 60)}:${('0' + (countdown % 60)).slice(-2)}` : '10:00'}</span>
          </div>
        )}
      </div>
      
      {!showChatSection && !showPaymentSection ? (
        // Validation and confirmation UI
        <div className="flex-1 flex flex-col justify-center items-center">
          
          {/* Validation error in red */}
          {validationError && (
            <div className="bg-red-50 border border-red-300 text-red-600 p-3 rounded-md w-full max-w-md mb-4">
              <div className="flex flex-col gap-3">
                <div>{validationError}</div>
                <button
                  onClick={onReturnToDetails}
                  className="bg-white text-red-600 border border-red-400 rounded-md py-2 px-4 hover:bg-red-50 text-sm font-medium self-end"
                >
                  Return to Details
                </button>
              </div>
            </div>
          )}
          
          {!dataConfirmed ? (
            // Initial validation UI with Set Data button
            <div className="bg-white/90 p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-4">Validate Your Information</h3>
              <p className="text-gray-600 mb-4">Please validate your personal details before starting the chat.</p>
              
              <button
                onClick={handleSetDataClick}
                className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                disabled={disabled}
              >
                Confirm Data
              </button>
            </div>
          ) : (
            // Confirmation UI
            <div className="bg-white/90 p-6 rounded-lg shadow-md w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">Confirm Your Details</h3>
              <p className="text-gray-600 mb-4 text-sm">Please review your information before starting the chat.</p>
              
              {userDetails && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium">Email:</div>
                    <div>{userDetails.email}</div>
                    
                    <div className="font-medium">Date of Birth:</div>
                    <div>{userDetails.dob}</div>
                    
                    <div className="font-medium">Time of Birth:</div>
                    <div>{userDetails.tob}</div>
                    
                    <div className="font-medium">Place of Birth:</div>
                    <div>{userDetails.pob}</div>
                    
                    <div className="font-medium">Coordinates:</div>
                    <div>{userDetails.lat}, {userDetails.lon}</div>
                    
                    <div className="font-medium">Timezone:</div>
                    <div>UTC{userDetails.timezone >= 0 ? '+' : ''}{userDetails.timezone}</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <button 
                  onClick={handleCancelConfirm}
                  className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirmData}
                  className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Confirm & Start Chat
                </button>
              </div>
            </div>
          )}
        </div>
      ) : showPaymentSection ? (
        // Payment UI
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="bg-white/90 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-semibold text-gray-800">Choose Payment Method</h3>
              <CreditCardIcon className="w-5 h-5 text-indigo-600" />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-5">
              <p className="text-sm text-gray-600 mb-2">Access to AIstroGPT Chat</p>
              <p className="text-lg font-bold text-indigo-700"> 5 USD</p>
              <p className="text-xs text-gray-500 mt-1">One-time payment for 10 minutes of chat access</p>
            </div>
            
            <div className="space-y-3 mb-5">
              {disablePaypal === 0 && (
                <button 
                  onClick={() => setSelectedPaymentMethod('paypal')}
                  className={`w-full py-3 px-4 border ${selectedPaymentMethod === 'paypal' 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-300'} rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors`}
                >
                  <span className="font-medium">PayPal</span>
                  <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6" />
                </button>
              )}
              
              {disableRazorpay === 0 && (
                <div>
                  <button 
                    onClick={() => setSelectedPaymentMethod('razorpay')}
                    className={`w-full py-3 px-4 border ${selectedPaymentMethod === 'razorpay' 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-300'} rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors`}
                  >
                    <span className="font-medium">Razorpay</span>
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-6" />
                  </button>
                  <p className="text-xs text-gray-700 font-normal mt-1 text-left">Razorpay for India</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setShowPaymentSection(false)}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              {selectedPaymentMethod === 'paypal' ? (
                <div className="w-48">
                  <div id="paypal-button-container" className="mt-2"></div>
                  <button
                    onClick={processPayment}
                    className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors w-full mt-2"
                  >
                    Pay with PayPal
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    // Handle fallback if user somehow selects an invalid payment method
                    if (!selectedPaymentMethod) {
                      alert('Please select a valid payment method');
                      return;
                    }
                    
                    // Disable the button while processing payment
                    if (isLoading) return;
                    
                    processPayment();
                  }}
                  className={`py-2 px-4 ${selectedPaymentMethod ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-md transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : selectedPaymentMethod ? 'Proceed to Payment' : 'Select Payment Method'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 rounded-xl p-4 bg-white/80 backdrop-blur-sm border border-indigo-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] relative p-3 mb-2 rounded-xl shadow-md transition-all duration-200
                    ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-gray-900'}`}
                >
                  <div className={`chat-header font-medium ${message.sender === 'user' ? '' : 'text-indigo-700'}`}>
                    {message.sender === 'user' ? 'You' : 'AIstroGPT'}{' '}
                    <time className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                  <div className={`chat-bubble max-w-md break-words mt-1 ${message.sender === 'user' ? 'chat-bubble-primary text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[75%] relative p-3 mb-2 rounded-xl shadow-md bg-slate-100 text-gray-900">
                  <div className="chat-header font-medium text-indigo-700">AIstroGPT</div>
                  <div className="chat-bubble mt-1 text-gray-800">
                    <span className="typing">...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
          
          {/* Chat input form */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={!chatStarted ? 'Click Start/Send to begin...' : (isTyping ? 'AIstroGPT is thinking...' : 'Type your message...')}
              className="flex-1 p-3 bg-white border border-indigo-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              disabled={isTyping || !chatStarted}
            />
          </form>
          
          {/* Footer with other controls */}
          <div className="flex items-center justify-between mt-4">
            { (
              <button
                onClick={() => {
                  if (!chatStarted) {
                    setChatStarted(true);
                  }
                  handleTestAstroApi();
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all duration-200 font-medium text-sm"
                disabled={isTyping}
              >
                Start/Send
              </button>
            )}
            <button
              onClick={onEndChat}
              className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all duration-200 font-medium text-sm flex items-center"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              End Chat
            </button>
          </div>
        </>
      )}
    </div>
  );
}
