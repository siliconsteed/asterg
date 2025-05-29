import { NextResponse } from 'next/server';
import axios from 'axios';
// Try multiple ways to get the API key
// IMPORTANT: After editing .env.local, you MUST restart your dev server for changes to take effect.
let FREE_ASTRO_API_KEY = process.env.FREE_ASTRO_API_KEY;
console.log('[Astrology API] FREE_ASTRO_API_KEY is', FREE_ASTRO_API_KEY ? 'SET' : 'NOT SET');

// Always use environment variables for API keys in production.
if (!FREE_ASTRO_API_KEY) {
  console.error('FREE_ASTRO_API_KEY is missing! Set it in your .env.local file.');
}

// Debug: Log API key status
console.log('Astrology API:', FREE_ASTRO_API_KEY ? 'Using API key' : 'No API key available');


// Helper function to log requests
function logRequestDetails(request) {
  console.log('Request Headers:', Object.fromEntries(request.headers.entries()));
  console.log('Request URL:', request.url);
  console.log('Request Method:', request.method);
}

export async function POST(request) {
  // Log request details
  logRequestDetails(request);
  
  try {
    const body = await request.json();
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    if (!FREE_ASTRO_API_KEY) {
      const errorMsg = 'Missing FREE_ASTRO_API_KEY environment variable.\n\nTroubleshooting steps:\n1. Ensure .env.local exists in your project root.\n2. Add FREE_ASTRO_API_KEY=your_actual_key_here to .env.local.\n3. Restart your dev server after editing .env.local.';
      console.error(errorMsg);
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
          solution: 'Please set the FREE_ASTRO_API_KEY in your .env.local file'
        },
        { status: 500 }
      );
    }
    
    // Validate required fields
    const requiredFields = ['year', 'month', 'date', 'hours', 'minutes', 'latitude', 'longitude', 'timezone'];
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null);
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation Error:', errorMsg);
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: errorMsg,
          requiredFields
        },
        { status: 400 }
      );
    }

    const options = {
      method: 'POST',
      url: 'https://json.freeastrologyapi.com/planets',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': FREE_ASTRO_API_KEY
      },
      data: {
        year: body.year,
        month: body.month,
        date: body.date,
        hours: body.hours,
        minutes: body.minutes,
        seconds: body.seconds || 0,
        latitude: body.latitude,
        longitude: body.longitude,
        timezone: typeof body.timezone === 'string' ? parseFloat(body.timezone) : body.timezone,
        settings: {
          observation_point: "topocentric",
          ayanamsha: "lahiri"
        }
      },
      // Add timeout and better error handling
      timeout: 10000 // 10 seconds timeout
    };

    console.log('Final payload to Astrology API:', options.data);

    console.log('Sending request to external Astrology API with options:', {
      url: options.url,
      method: options.method,
      data: options.data,
      headers: { ...options.headers, 'x-api-key': '***REDACTED***' }, // Don't log the actual API key
      timeout: options.timeout
    });

    // External API call
    const externalApiResponse = await axios(options);
    
    console.log('Received response from external Astrology API:', {
      status: externalApiResponse.status,
      statusText: externalApiResponse.statusText,
      headers: externalApiResponse.headers,
      data: externalApiResponse.data ? (typeof externalApiResponse.data === 'string' ? externalApiResponse.data.substring(0, 500) + '...' : JSON.stringify(externalApiResponse.data).substring(0,500) + '...') : 'No data in response'
    });
    
    // Check if the external API call was successful
    if (externalApiResponse.status >= 200 && externalApiResponse.status < 300) {
      return NextResponse.json(externalApiResponse.data, { status: externalApiResponse.status });
    } else {
      // External API returned an error (4xx, 5xx)
      console.error(`External Astrology API Error (${externalApiResponse.status}):`, externalApiResponse.data);
      const errorBody = typeof externalApiResponse.data === 'object' && externalApiResponse.data !== null ? 
                        externalApiResponse.data : 
                        { error: `External API request failed`, details: `Status ${externalApiResponse.status}: ${externalApiResponse.statusText}. Response: ${typeof externalApiResponse.data === 'string' ? externalApiResponse.data.substring(0,200) : 'Non-string response.'}` };
      return NextResponse.json(errorBody, { status: externalApiResponse.status });
    }
  } catch (error) {
    // This block catches: 
    // 1. Errors from request.json() if the request body is malformed.
    // 2. Network errors if axios fails to make the request (e.g., DNS resolution, server unreachable).
    // 3. Any other unexpected errors in the try block before or after the axios call.
    console.error('Astrology Route Internal/Network Error:', error);
    
    const errorDetails = {
      message: error.message,
      code: error.code, // For network errors like ENOTFOUND, ECONNREFUSED
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production'
    };

    // If it's an axios error, it might have more specific info
    if (error.isAxiosError) {
      errorDetails.axiosError = {
        message: error.message,
        code: error.code,
        config: error.config ? { url: error.config.url, method: error.config.method, headers: error.config.headers } : undefined,
        request: error.request ? 'Request object present (indicates request was made)' : 'Request object not present',
        response: error.response ? { status: error.response.status, data: error.response.data } : 'No response object (network error or timeout)'
      };
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process astrology request due to an internal or network issue.',
        details: process.env.NODE_ENV === 'development' ? errorDetails : 'Detailed error information is hidden in production.',
        timestamp: new Date().toISOString()
      },
      { status: 500 } // Internal Server Error for these types of issues
    );
  }
}
