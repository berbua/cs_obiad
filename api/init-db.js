const db = require('./_db');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    await db.initDatabase();
    res.json({ 
      status: 'OK', 
      message: 'Database initialized successfully!'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to initialize database',
      error: error.message
    });
  }
};
