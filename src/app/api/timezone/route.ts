import { NextResponse } from 'next/server';

// GET /api/timezone?lat=..&lon=..&date=YYYY-MM-DD
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const date = searchParams.get('date');

  if (!latStr || !lonStr || !date) {
    return NextResponse.json({ error: 'lat, lon and date are required' }, { status: 400 });
  }

  const lat = Number(latStr);
  const lon = Number(lonStr);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat/lon must be numbers' }, { status: 400 });
  }

  // Open-Meteo Timezone API returns timezone name and utc_offset_seconds for the specified date
  // https://open-meteo.com/en/docs/timezone-api
  const url = `https://api.open-meteo.com/v1/timezone?latitude=${lat}&longitude=${lon}&date=${encodeURIComponent(
    date
  )}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to resolve timezone' }, { status: res.status });
    }
    const json = await res.json();
    // Expected fields
    // {
    //   timezone: "Asia/Kolkata",
    //   utc_offset_seconds: 19800,
    //   ...
    // }
    const timezone: string | undefined = json.timezone;
    const secondsRaw = json.utc_offset_seconds;
    const secondsNum = typeof secondsRaw === 'number' ? secondsRaw : Number(secondsRaw);
    const timezoneNumber = Number.isFinite(secondsNum) ? secondsNum / 3600 : undefined;

    return NextResponse.json({ ianaTimezone: timezone, timezoneNumber });
  } catch (e) {
    console.error('Timezone API error', e);
    return NextResponse.json({ error: 'Timezone service error' }, { status: 500 });
  }
}
