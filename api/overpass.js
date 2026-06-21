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
      
    const urlWithQuery = `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`;
    
    const response = await axios({
      method: 'get', 
      url: urlWithQuery,
      headers: { 
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
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