// Geolocation utility for detecting user's country
// Uses IP-based geolocation to determine payment method

const GEOLOCATION_CACHE_KEY = 'user_country_code';

export interface GeolocationResult {
    countryCode: string;
    countryName: string;
    isIndia: boolean;
}

/**
 * Detect user's country using IP geolocation
 * Uses ipinfo.io API with token
 * Caches result in sessionStorage to avoid repeated calls
 */
export async function detectUserCountry(): Promise<GeolocationResult> {
    try {
        // Check cache first
        const cached = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            console.log('Using cached country:', parsed);
            return parsed;
        }

        // Call geolocation API
        console.log('Detecting user location...');
        const response = await fetch('https://ipinfo.io/json?token=e7b9f35fe344d9', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Geolocation API failed: ${response.status}`);
        }

        const data = await response.json();

        const result: GeolocationResult = {
            countryCode: data.country || 'US',
            countryName: data.country || 'Unknown',
            isIndia: data.country === 'IN',
        };

        // Cache the result
        sessionStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify(result));
        console.log('Detected country:', result);

        return result;
    } catch (error) {
        console.error('Error detecting user country:', error);

        // Fallback to non-India (PayPal) on error
        const fallback: GeolocationResult = {
            countryCode: 'US',
            countryName: 'Unknown',
            isIndia: false,
        };

        return fallback;
    }
}

/**
 * Clear cached geolocation data
 * Useful for testing or forcing a refresh
 */
export function clearGeolocationCache(): void {
    sessionStorage.removeItem(GEOLOCATION_CACHE_KEY);
    console.log('Geolocation cache cleared');
}
