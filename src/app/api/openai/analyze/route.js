import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { birthData, planetaryData } = await request.json();
    
    // Prepare the prompt for the AI
    const prompt = `You are a professional astrologer. Analyze the following birth chart data and provide a detailed interpretation:

Birth Details:
- Date: ${birthData.year}-${birthData.month}-${birthData.date}
- Time: ${birthData.hours}:${birthData.minutes}
- Location: ${birthData.latitude}°N, ${birthData.longitude}°E
- Timezone: ${birthData.timezone}

Planetary Positions:
${JSON.stringify(planetaryData, null, 2)}

Please provide a detailed astrological analysis including:
1. Sun sign and its significance
2. Moon sign and emotional characteristics
3. Ascendant/Rising sign and its influence
4. Key planetary aspects and their meanings
5. Overall personality traits and life path insights`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4",
    });

    return NextResponse.json({
      analysis: completion.choices[0]?.message?.content || 'No analysis available',
      planetaryData
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze birth chart' },
      { status: 500 }
    );
  }
}
