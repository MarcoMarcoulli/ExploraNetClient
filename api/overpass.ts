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
    
    // Usiamo una configurazione esplicita per evitare che Axios aggiunga header non graditi
    const response = await axios({
      method: 'post',
      url: 'https://overpass-api.de/api/interpreter',
      data: query, // Passiamo la stringa nuda e cruda
      headers: { 
        'Content-Type': 'text/plain',
        // Forziamo l'Accept a */* o stringa vuota per non far insospettire il server Apache
        'Accept': '*/*' 
      },
      // Evita che Axios provi a parsare l'output se non è strettamente necessario, 
      // anche se Overpass risponde in JSON pulito
      responseType: 'json' 
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