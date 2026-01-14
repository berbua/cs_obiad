const { sql } = require('@vercel/postgres');

// Vercel Postgres with OBIAD_ prefix
if (process.env.OBIAD_POSTGRES_URL && !process.env.POSTGRES_URL) {
  process.env.POSTGRES_URL = process.env.OBIAD_POSTGRES_URL;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    // Add likes column to signups if it doesn't exist
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
      error: error.message
    });
  }
};
