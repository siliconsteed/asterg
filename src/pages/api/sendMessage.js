import { createClient } from '@supabase/supabase-js';

// Create a single Supabase client for interacting with your database
const supabase = createClient(
  "https://rrmmhfuyojecgwzpivhc.supabase.co", // Replace with your Supabase URL
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { msg } = req.body;

    if (!msg) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const { data, error } = await supabase
        .from('messages') // Make sure 'messages' is your table name
        .insert([{ msg }]);

      if (error) {
        throw error;
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
