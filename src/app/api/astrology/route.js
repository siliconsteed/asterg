import { NextResponse } from 'next/server';
import axios from 'axios';

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

    // API provider toggle: 0 = Free Astro API, 1 = RVA API
    const ASTRO_API_PROVIDER = 1; // Set to 1 for RVA API, 0 for Free Astro API

    let astroApiResult = null;
    if (ASTRO_API_PROVIDER === 1) {
      // RVA API expects: date (YYYY-MM-DD), time (HH:mm), lat, lon, timezone
      try {
        const dateStr = `${body.year}-${String(body.month).padStart(2, '0')}-${String(body.date).padStart(2, '0')}`;
        const timeStr = `${String(body.hours).padStart(2, '0')}:${String(body.minutes).padStart(2, '0')}`;
        const payload = {
          date: dateStr,
          time: timeStr,
          lat: body.latitude,
          lon: body.longitude,
          timezone: typeof body.timezone === 'string' ? parseFloat(body.timezone) : body.timezone
        };
        const apiResponse = await axios.post('https://rva-api.onrender.com/calculate-planets', payload);
        astroApiResult = apiResponse.data;
      } catch (err) {
        console.error('Failed to fetch from RVA API:', err);
        astroApiResult = { error: 'Failed to fetch from RVA API' };
      }
    } else {
      // Free Astrology API
      if (!process.env.FREE_ASTRO_API_KEY) {
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
      try {
        const payload = {
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
        };
        const apiResponse = await axios.post('https://json.freeastrologyapi.com/planets', payload, {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.FREE_ASTRO_API_KEY
          },
          timeout: 10000
        });
        astroApiResult = apiResponse.data;
      } catch (err) {
        console.error('Failed to fetch from Free Astrology API:', err);
        astroApiResult = { error: 'Failed to fetch from Free Astrology API' };
      }
    }

    console.log('Astro API Response:', astroApiResult);
    return NextResponse.json({ astroApiResult }, { status: 200 });
  } catch (error) {
    console.error('Astrology Route Internal/Network Error:', error);
    const errorDetails = {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Stack trace hidden in production'
    };
    if (error.isAxiosError) {
      errorDetails.axiosError = {
        message: error.message,
        config: error.config,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : undefined
      };
    }
    return NextResponse.json({ error: 'Internal server error', details: errorDetails }, { status: 500 });
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
