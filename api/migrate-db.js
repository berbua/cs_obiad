const { createPool } = require('@vercel/postgres');

// Use OBIAD_ prefixed connection string
const connectionString = process.env.OBIAD_POSTGRES_URL || 
                         process.env.OBIAD_POSTGRES_PRISMA_URL;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (!connectionString) {
      throw new Error('No OBIAD_POSTGRES_URL or OBIAD_POSTGRES_PRISMA_URL found');
    }

    // Create a pool connection which works better with Vercel Postgres
    const pool = createPool({ connectionString });
    const client = await pool.connect();
    
    try {
      // Add likes column to signups if it doesn't exist
      await client.query(`
        ALTER TABLE signups 
        ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0
      `);
      
      res.json({ 
        status: 'OK', 
        message: 'Database migration completed! Likes column added to signups.'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error running migration:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Failed to run migration',
      error: error.message,
      hint: 'Check if OBIAD_POSTGRES_URL or OBIAD_POSTGRES_PRISMA_URL is set correctly'
    });
  }
};
