import { getAstrologyAnalysis } from './astrology';

export const handleBirthDataSubmit = async (birthData, setMessages, setIsLoading) => {
  try {
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: `Birth Details:\nDate: ${birthData.year}-${birthData.month}-${birthData.date}\nTime: ${birthData.hours}:${birthData.minutes}\nLocation: ${birthData.latitude}°N, ${birthData.longitude}°E`
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Get analysis
    const response = await getAstrologyAnalysis(birthData);
    
    // Add AI response
    const aiMessage = {
      role: 'assistant',
      content: response.analysis
    };
    
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Error in chat:', error);
    
    const errorMessage = {
      role: 'assistant',
      content: 'Sorry, there was an error processing your request. Please try again.'
    };
    
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};

export const formatBirthData = (data) => ({
  year: parseInt(data.year),
  month: parseInt(data.month),
  date: parseInt(data.date),
  hours: parseInt(data.hours),
  minutes: parseInt(data.minutes),
  seconds: 0,
  latitude: parseFloat(data.latitude),
  longitude: parseFloat(data.longitude),
  timezone: parseFloat(data.timezone)
});
