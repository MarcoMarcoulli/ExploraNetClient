import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { query } = req.body; 

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter in body' });
    }
    
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' }
    });
    
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Overpass Proxy Error:", error.response?.data || error.message);
    
    return res.status(500).json({ 
      error: 'Errore proxy Overpass', 
      details: error.response?.data || error.message 
    });
  }
}