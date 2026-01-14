const db = require('./_db');

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
      const signups = db.getTodaySignups();
      return res.json({ signups });
    } catch (error) {
      console.error('Error fetching signups:', error);
      return res.status(500).json({ error: 'Failed to fetch signups' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nick, time, comment, moodIcon } = req.body;
      
      console.log('Received signup request:', { nick, time, comment, moodIcon });
      
      if (!nick) {
        return res.status(400).json({ error: 'Nick is required' });
      }

      const result = db.addSignup(nick, time || '', comment || '', moodIcon || '🍕');
      console.log('Signup successful:', result);
      return res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error('Error adding signup:', error);
      return res.status(500).json({ error: 'Failed to add signup', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
