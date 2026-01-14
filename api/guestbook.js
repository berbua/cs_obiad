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
      const entries = await db.getGuestbookEntries();
      return res.json({ entries });
    } catch (error) {
      console.error('Error fetching guestbook:', error);
      return res.status(500).json({ error: 'Failed to fetch guestbook' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { nick, comment } = req.body;
      
      if (!nick || !comment) {
        return res.status(400).json({ error: 'Nick and comment are required' });
      }

      const result = await db.addGuestbookEntry(nick, comment);
      return res.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
      console.error('Error adding guestbook entry:', error);
      return res.status(500).json({ error: 'Failed to add guestbook entry' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
