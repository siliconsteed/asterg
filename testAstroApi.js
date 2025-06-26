// testAstroApi.js
const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise((resolve) => rl.question(q, resolve));
}

(async () => {
  const apiKey = process.env.FREE_ASTRO_API_KEY || await ask('Enter your Free Astrology API Key: ');
  const dob = await ask('Enter Date of Birth (YYYY-MM-DD): ');
  const tob = await ask('Enter Time of Birth (HH:MM): ');
  const latitude = await ask('Enter Latitude (e.g., 28.6139): ');
  const longitude = await ask('Enter Longitude (e.g., 77.2090): ');
  const timezone = await ask('Enter Timezone (e.g., 5.5 for IST): ');

  const [year, month, date] = dob.split('-').map(Number);
  const [hours, minutes] = tob.split(':').map(Number);

  const payload = {
    year,
    month,
    date,
    hours,
    minutes,
    seconds: 0,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    timezone: parseFloat(timezone),
    settings: {
      observation_point: "topocentric",
      ayanamsha: "lahiri"
    }
  };

  try {
    const response = await axios.post(
      'https://json.freeastrologyapi.com/planets',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        timeout: 10000
      }
    );
    console.log('API Response:', JSON.stringify(response.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Request Error:', err.message);
    }
  } finally {
    rl.close();
  }
})();
