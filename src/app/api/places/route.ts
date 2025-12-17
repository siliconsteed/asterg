import { NextResponse } from 'next/server';

// Simple in-memory cache to reduce Nominatim calls during a session
const cache = new Map<string, any>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const cacheKey = q.toLowerCase();
  if (cache.has(cacheKey)) {
    return NextResponse.json({ results: cache.get(cacheKey) });
  }

  // Guard: Nominatim generally expects at least 2 characters to avoid overly broad queries
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Nominatim policy: include a descriptive User-Agent and referer
  // Configure via environment if available
  const defaultContact = process.env.CONTACT_EMAIL ? ` (contact: ${process.env.CONTACT_EMAIL})` : '';
  const userAgent = process.env.NOMINATIM_USER_AGENT || `AIstroGPT/1.0${defaultContact}`;
  const acceptLanguage = (typeof request.headers.get === 'function' && (request.headers.get('accept-language') || 'en')) || 'en';
  const referer = (typeof request.headers.get === 'function' && (request.headers.get('referer') || request.headers.get('origin'))) || undefined;

  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(q)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept-Language': acceptLanguage,
        ...(referer ? { Referer: referer } : {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      // Surface upstream status; still keep shape
      return NextResponse.json({ results: [] }, { status: res.status });
    }

    const json = await res.json();

    const results = (json as any[]).slice(0, 10).map((item) => {
      const addr = item.address || {};
      const locality = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || addr.county;
      const parts = [locality, addr.state, addr.country]
        .filter(Boolean)
        .join(', ');
      const name: string = parts || item.display_name;
      return {
        name,
        lat: Number(item.lat),
        lon: Number(item.lon),
      };
    });

    cache.set(cacheKey, results);
    return NextResponse.json({ results });
  } catch (e) {
    console.error('Nominatim error', e);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
