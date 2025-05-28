import axios from 'axios';

export const getPlanetaryPositions = async (birthData) => {
  try {
    const response = await axios.post('/api/astrology', {
      year: birthData.year,
      month: birthData.month,
      date: birthData.date,
      hours: birthData.hours,
      minutes: birthData.minutes,
      seconds: birthData.seconds || 0,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching planetary positions:', error);
    throw error;
  }
};

export const getAstrologyAnalysis = async (birthData) => {
  try {
    // First get planetary positions
    const planetaryData = await getPlanetaryPositions(birthData);
    
    // Then send to OpenAI for analysis
    const response = await axios.post('/api/openai/analyze', {
      birthData,
      planetaryData
    });
    
    return response.data;
  } catch (error) {
    console.error('Error in astrology analysis:', error);
    throw error;
  }
};
