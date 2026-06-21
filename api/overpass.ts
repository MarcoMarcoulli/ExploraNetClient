// api/overpass.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Il body conterrà la stringa della query Overpass
    const query = req.body; 
    const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
      headers: { 'Content-Type': 'text/plain' }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: 'Errore proxy Overpass' });
  }
}