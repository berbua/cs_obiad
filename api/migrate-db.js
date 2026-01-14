const { sql } = require('@vercel/postgres');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Use sql template literal - this handles connection pooling automatically
    await sql`
      ALTER TABLE signups 
      ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0
    `;
    
    res.json({ 
      status: 'OK', 
      message: 'Database migration completed! Likes column added to signups.'
    });
  } catch (error) {
    console.error('Error running migration:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to run migration',
      error: error.message,
      details: error.toString()
    });
  }
};
