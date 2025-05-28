/** @type {import('next').NextConfig} */

// Load API key directly (this ensures it's available throughout the app)
const FREE_ASTRO_API_KEY = process.env.FREE_ASTRO_API_KEY || "";
console.log('Next.js Config - FREE_ASTRO_API_KEY is', FREE_ASTRO_API_KEY ? 'set' : 'NOT SET');

const nextConfig = {
  // Make environment variables available to the browser
  env: {
    FREE_ASTRO_API_KEY: FREE_ASTRO_API_KEY,
  },
  
  // Simplified rewrites - removed the proxy config that could be causing issues
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
