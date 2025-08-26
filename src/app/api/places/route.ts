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

  // Nominatim policy: include a descriptive User-Agent and referer
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'AIstroGPT/1.0 (contact: example@example.com)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] }, { status: res.status });
    }

    const json = await res.json();

    const results = (json as any[]).slice(0, 10).map((item) => {
      const addr = item.address || {};
      const parts = [addr.city || addr.town || addr.village || addr.hamlet, addr.state, addr.country]
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
