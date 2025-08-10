import { NextResponse } from 'next/server';
import axios from 'axios';
import { Redis } from '@upstash/redis';

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

    // Daily quota with Upstash Redis: first N requests use Free API, then use RVA
    const DAILY_LIMIT = Number(process.env.FREE_API_DAILY_LIMIT || 48);

    const secondsUntilNextUtcMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      next.setUTCHours(24, 0, 0, 0);
      return Math.floor((+next - +now) / 1000);
    };

    let chosenProvider = 'FREE';
    try {
      const redis = Redis.fromEnv();
      const dateKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      const key = `astro:free-usage:${dateKey}`;
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, secondsUntilNextUtcMidnight());
      }
      if (count > DAILY_LIMIT) {
        chosenProvider = 'RVA';
      }
    } catch (err) {
      console.warn('Upstash Redis unavailable or not configured. Proceeding without quota enforcement.', err?.message || err);
      chosenProvider = 'FREE';
    }

    let astroApiResult = null;

    const callRva = async () => {
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
      return apiResponse.data;
    };

    const callFree = async () => {
      if (!process.env.FREE_ASTRO_API_KEY) {
        throw new Error('Missing FREE_ASTRO_API_KEY environment variable');
      }
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
          observation_point: 'topocentric',
          ayanamsha: 'lahiri'
        }
      };
      const apiResponse = await axios.post('https://json.freeastrologyapi.com/planets', payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.FREE_ASTRO_API_KEY
        },
        timeout: 10000
      });
      return apiResponse.data;
    };

    try {
      if (chosenProvider === 'FREE') {
        astroApiResult = await callFree();
      } else {
        astroApiResult = await callRva();
      }
    } catch (err) {
      if (chosenProvider === 'FREE') {
        console.warn('Free API failed or not configured; falling back to RVA. Reason:', err?.message || err);
        try {
          astroApiResult = await callRva();
        } catch (rvaErr) {
          console.error('Fallback to RVA failed:', rvaErr);
          astroApiResult = { error: 'Failed to fetch from RVA API after Free API failure' };
        }
      } else {
        console.error('Failed to fetch from RVA API:', err);
        astroApiResult = { error: 'Failed to fetch from RVA API' };
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
