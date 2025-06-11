/** @type {import('next').NextConfig} */

// Load API key directly (this ensures it's available throughout the app)
const FREE_ASTRO_API_KEY = process.env.FREE_ASTRO_API_KEY || "";


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
