const db = require('./_db');
const { validateSignup } = require('./validator');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const signups = await db.getTodaySignups();
      return res.json({ signups });
    } catch (error) {
      console.error('Error fetching signups:', error);
      return res.status(500).json({ error: 'Failed to fetch signups' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validation = validateSignup(req.body);
      
      if (!validation.valid) {
        return res.status(400).json({ 
          error: validation.errors.join(', ') 
        });
      }

      const { nick, time, comment, moodIcon } = validation.data;
      const result = await db.addSignup(nick, time, comment, moodIcon);
      return res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error('Error adding signup:', error);
      return res.status(500).json({ error: 'Failed to add signup' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
