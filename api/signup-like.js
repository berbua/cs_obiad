const db = require('./_db');
const { validateLikeRequest } = require('./validator');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const validation = validateLikeRequest(req.body);
      
      if (!validation.valid) {
        return res.status(400).json({ 
          error: validation.errors.join(', ') 
        });
      }

      const { id } = validation.data;
      const likes = await db.incrementSignupLikes(id);
      return res.json({ success: true, likes });
    } catch (error) {
      console.error('Error incrementing likes:', error);
      return res.status(500).json({ error: 'Failed to increment likes' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
