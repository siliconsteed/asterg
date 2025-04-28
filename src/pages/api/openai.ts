import type { NextApiRequest, NextApiResponse } from 'next';

// You need to set OPENAI_API_KEY in your .env.local file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key on server' });
  }

  const { prompt, messages } = req.body;

  if (!prompt && (!messages || !Array.isArray(messages) || messages.length === 0)) {
    return res.status(400).json({ error: 'Missing prompt or messages' });
  }

  try {
    const apiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages
          ? messages
          : [
              { role: 'user', content: prompt },
            ],
        max_tokens: 100,
        temperature: 0.7,
      }),
    });
    const data = await apiRes.json();
    if (data.error) {
      return res.status(400).json({ error: data.error.message || 'OpenAI error' });
    }
    const result = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: 'OpenAI API request failed' });
  }
}
