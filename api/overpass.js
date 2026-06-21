import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { query } = req.body; 

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter in body' });
    }
      
    // Impacchettiamo la query come se fosse un modulo inviato da una pagina web standard
    const params = new URLSearchParams();
    params.append('data', query);
    
    // Torniamo al server principale di Overpass (o puoi tenere kumi, funzionerà con entrambi)
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    const response = await axios.post(overpassUrl, params.toString(), {
      headers: { 
        // Questo è il trucco magico per i firewall: far finta che sia un form HTML
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      responseType: 'json' 
    });
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Overpass Proxy Error:", error.response?.data || error.message);
    
    return res.status(500).json({ 
      error: 'Errore proxy Overpass', 
      details: error.response?.data || error.message 
    });
  }
}