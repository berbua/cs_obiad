const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Add likes column to signups if it doesn't exist
    await pool.query(`
      ALTER TABLE signups 
      ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0
    `);
    
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
  } finally {
    await pool.end();
  }
};
