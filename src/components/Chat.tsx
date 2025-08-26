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
  // Optional IANA timezone for DST-aware computation (e.g., "America/New_York")
  ianaTimezone?: string;
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

// Payment feature flags (booleans for clarity)
// Set to true to bypass payment flow, false to show payment options
const skipPayment: boolean = true; // true => skip payment and go directly to chat

// Set to true to disable Razorpay, false to enable it
const disableRazorpay: boolean = true; // true => Razorpay disabled

// Set to true to disable PayPal, false to enable it
const disablePaypal: boolean = true; // true => PayPal disabled

// Timezone behavior toggle
// If true: derive timezone number (-12..14) from selected city's IANA timezone on the DOB (DST-aware)
// If false: use the numeric timezone provided in the user details as-is
const useDSTFromCityDOB: boolean = false;
//check
// Compute offset (in hours) for a given UTC date at local wall-time using an IANA timezone.
// Strategy: use Intl.DateTimeFormat to materialize the local wall-time and reconstruct a UTC timestamp.
function getTimeZoneOffsetHoursOnDate(dob: string, timeZone: string): number {
  try {
    // Parse YYYY-MM-DD
    const [y, m, d] = dob.split('-').map(Number);
    if (!y || !m || !d) return NaN;

    // Use 12:00 local time to avoid DST edge cases at midnight
    const dateUtcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const parts = dtf.formatToParts(dateUtcNoon);
    const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
    const asUTC = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(map.hour),
      Number(map.minute),
      Number(map.second)
    );

    // Difference between local wall-time in the target zone and the original UTC time
    const offsetMinutes = (asUTC - dateUtcNoon.getTime()) / 60000;
    // Positive east of UTC
    return offsetMinutes / 60;
  } catch (e) {
    console.warn('Failed to compute timezone offset from IANA timezone:', e);
    return NaN;
  }
}

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
    if (skipPayment) {
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
    if (showPaymentSection && (disableRazorpay || !razorpayLoaded)) {
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
    if (selectedPaymentMethod === 'paypal' && paypalLoaded && !disablePaypal) {
      // Render PayPal button in the paypal-button-container
      initializePayPalButton(
        'paypal-button-container', 
        4.99, // $4.99 USD
        handlePaymentComplete,
        handlePaymentError
      );
    } else if (selectedPaymentMethod === 'razorpay' && !disableRazorpay) {
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
        const { lat, lon, timezone, ianaTimezone } = userDetails;
        // Decide which timezone number to send
        const timezoneToSend = (useDSTFromCityDOB && ianaTimezone)
          ? (Number.isFinite(getTimeZoneOffsetHoursOnDate(userDetails.dob, ianaTimezone))
              ? getTimeZoneOffsetHoursOnDate(userDetails.dob, ianaTimezone)
              : timezone)
          : timezone;
        
        // Prepare the payload for the astrology API
        const payload = {
          year,
          month,
          date,
          hours,
          minutes,
          latitude: lat,
          longitude: lon,
          timezone: timezoneToSend
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
        content: 'Fetching astrological insights... This may take upto 30 seconds. ',
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
        timezone: (useDSTFromCityDOB && userDetails.ianaTimezone)
          ? (Number.isFinite(getTimeZoneOffsetHoursOnDate(dob, userDetails.ianaTimezone!))
              ? getTimeZoneOffsetHoursOnDate(dob, userDetails.ianaTimezone!)
              : timezone)
          : timezone,
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
    <div className="flex flex-col flex-grow p-3 sm:p-6 glass rounded-2xl shadow-2xl border border-white/20">
      {/* Dynamic loading of payment scripts */}
      {!disablePaypal && (
        <Script
          src="https://www.paypal.com/sdk/js?client-id=test&currency=USD"
          onLoad={handlePayPalScriptLoad}
          onError={() => console.error('Failed to load PayPal script')}
        />
      )}
      {!disableRazorpay && (
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
      <div className="flex items-center justify-between mb-3 sm:mb-4 p-3 sm:p-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm">
        <span className="text-lg sm:text-xl font-semibold text-coffee-700">AIstroGPT Chat</span>
        {showChatSection && (
          <div className="flex items-center text-xs sm:text-sm font-medium text-gray-600">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-1.5 text-coffee-500" />
            <span>Time: {timerStarted ? `${Math.floor(countdown / 60)}:${('0' + (countdown % 60)).slice(-2)}` : '10:00'}</span>
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
                      <div className="bg-white/90 p-4 sm:p-6 rounded-xl shadow-md w-full max-w-md">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">Validate Your Information</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Please validate your personal details before starting the chat.</p>
            
            <button
              onClick={handleSetDataClick}
              className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-coffee-400 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-hover text-sm sm:text-base"
              disabled={disabled}
            >
              Confirm Data
            </button>
            </div>
          ) : (
            // Confirmation UI
            <div className="bg-white/90 p-4 sm:p-6 rounded-xl shadow-md w-full max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Confirm Your Details</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">Please review your information before starting the chat.</p>
              
              {userDetails && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-xl mb-3 sm:mb-4">
                  <div className="grid grid-cols-2 gap-y-1 sm:gap-y-2 text-xs sm:text-sm">
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
              
              <div className="flex justify-between gap-2">
                <button 
                  onClick={handleCancelConfirm}
                  className="py-2 px-3 sm:px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirmData}
                  className="py-2 px-3 sm:px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm"
                >
                  Confirm & Start
                </button>
              </div>
            </div>
          )}
        </div>
      ) : showPaymentSection ? (
        // Payment UI
        <div className="flex-1 flex flex-col justify-center items-center animate-fade-in">
          <div className="bg-white/90 p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 text-lg font-mozilla-headline">Choose Payment Method</h3>
              <CreditCardIcon className="w-6 h-6 text-coffee-600" />
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl mb-6 flex flex-col items-center">
              <p className="text-base text-gray-700 mb-1 font-mozilla-headline">Access to AIstroGPT Chat</p>
              <p className="text-2xl font-extrabold text-black font-mozilla-headline">4.99 USD</p>
              <p className="text-xs text-gray-500 mt-2 font-mozilla-headline">One-time payment for 10 minutes of chat access</p>
            </div>
            <div className="space-y-4 mb-6">
              {!disablePaypal && (
                <div
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedPaymentMethod === 'paypal'}
                  onClick={() => setSelectedPaymentMethod('paypal')}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedPaymentMethod('paypal')}
                  className={`w-full flex items-center justify-between border rounded-2xl px-5 py-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-400 group font-mozilla-headline ${selectedPaymentMethod === 'paypal' ? 'border-coffee-500 bg-coffee-50 shadow-md' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-7" />
                    <span className="font-medium text-gray-800 font-mozilla-headline">PayPal</span>
                  </div>
                  {selectedPaymentMethod === 'paypal' && (
                    <span className="ml-2 text-green-600 font-mozilla-headline" aria-label="Selected">✔</span>
                  )}
                </div>
              )}
              {!disableRazorpay && (
                <div
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedPaymentMethod === 'razorpay'}
                  onClick={() => setSelectedPaymentMethod('razorpay')}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedPaymentMethod('razorpay')}
                  className={`w-full flex items-center justify-between border rounded-2xl px-5 py-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-400 group ${selectedPaymentMethod === 'razorpay' ? 'border-coffee-500 bg-coffee-50 shadow-md' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-7" />
                    <span className="font-medium text-gray-800 font-mozilla-headline">Razorpay</span>
                  </div>
                  {selectedPaymentMethod === 'razorpay' && (
                    <span className="ml-2 text-green-600 font-mozilla-headline" aria-label="Selected">✔</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowPaymentSection(false)}
                className="py-2 px-5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-coffee-400 font-mozilla-headline"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!selectedPaymentMethod) {
                    alert('Please select a valid payment method');
                    return;
                  }
                  if (isLoading) return;
                  processPayment();
                }}
                className={`py-2 px-6 flex items-center justify-center gap-2 font-mozilla-headline ${selectedPaymentMethod ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-coffee-400 ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
                disabled={isLoading || !selectedPaymentMethod}
                aria-disabled={isLoading || !selectedPaymentMethod}
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                )}
                {isLoading ? 'Processing...' : selectedPaymentMethod ? 'Proceed to Payment' : 'Select Payment Method'}
              </button>
            </div>
            {/* Payment provider button containers, shown only if selected */}
            {selectedPaymentMethod === 'paypal' && (
              <div className="w-full mt-4 flex flex-col items-center">
                <div id="paypal-button-container" className="w-full"></div>
              </div>
            )}
            {selectedPaymentMethod === 'razorpay' && (
              <div className="w-full mt-4 flex flex-col items-center">
                {/* Razorpay button or container can be placed here if needed */}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto mb-3 sm:mb-4 space-y-2 sm:space-y-3 rounded-xl p-3 sm:p-4 bg-white/90 backdrop-blur-sm border border-white/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] relative p-2.5 sm:p-3 mb-1.5 sm:mb-2 rounded-xl shadow-md transition-all duration-200
                    ${message.sender === 'user' ? 'bg-gradient-to-r from-coffee-500 to-purple-600 text-white' : 'bg-slate-100 text-gray-900'}`}
                >
                  <div className={`chat-header font-medium text-xs sm:text-sm ${message.sender === 'user' ? '' : 'text-coffee-700'}`}>
                    {message.sender === 'user' ? 'You' : 'AIstroGPT'}{' '}
                    <time className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </time>
                  </div>
                  <div className={`chat-bubble max-w-md break-words mt-1 text-sm sm:text-base ${message.sender === 'user' ? 'chat-bubble-primary text-white' : 'text-gray-800'}`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[75%] relative p-3 mb-2 rounded-xl shadow-md bg-slate-100 text-gray-900">
                  <div className="chat-header font-medium text-coffee-700">AIstroGPT</div>
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
              className="flex-1 p-2.5 sm:p-3 bg-white border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 transition-all duration-200 text-sm sm:text-base"
              disabled={isTyping || !chatStarted}
            />
          </form>
          
          {/* Footer with other controls */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2">
            { (
              <button
                onClick={() => {
                  if (!chatStarted) {
                    setChatStarted(true);
                  }
                  handleTestAstroApi();
                }}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-coffee-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-xs sm:text-sm"
                disabled={isTyping}
              >
                Start/Send
              </button>
            )}
            <button
              onClick={onEndChat}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-medium text-xs sm:text-sm flex items-center"
            >
              <XMarkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              End Chat
            </button>
          </div>
        </>
      )}
    </div>
  );
}
