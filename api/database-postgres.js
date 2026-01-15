const { Pool } = require('pg');

// Create a singleton pool instance
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL || process.env.PRISMA_DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

// Helper function to execute queries
async function query(text, params) {
  const pool = getPool();
  return pool.query(text, params);
}

// Initialize database tables
async function initDatabase() {
  try {
    // Create signups table
    await query(`
      CREATE TABLE IF NOT EXISTS signups (
        id SERIAL PRIMARY KEY,
        nick VARCHAR(100) NOT NULL,
        time VARCHAR(10),
        comment TEXT,
        mood_icon VARCHAR(10),
        likes INTEGER NOT NULL DEFAULT 0,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create visits table
    await query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        counter INTEGER NOT NULL DEFAULT 0
      )
    `);

    // Create guestbook table
    await query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        nick VARCHAR(100) NOT NULL,
        comment TEXT NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Initialize visits counter if empty
    const { rows } = await query('SELECT COUNT(*) as count FROM visits');
    if (rows[0].count === '0') {
      await query('INSERT INTO visits (counter) VALUES (0)');
    }

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Get today's signups
async function getTodaySignups() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { rows } = await query(
      'SELECT * FROM signups WHERE date = $1 ORDER BY created_at DESC',
      [today]
    );
    return rows;
  } catch (error) {
    console.error('Error getting signups:', error);
    return [];
  }
}

// Add signup
async function addSignup(nick, time, comment, moodIcon) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { rows } = await query(
      'INSERT INTO signups (nick, time, comment, mood_icon, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nick, time, comment, moodIcon, today]
    );
    return { lastInsertRowid: rows[0].id };
  } catch (error) {
    console.error('Error adding signup:', error);
    throw error;
  }
}

// Get and increment visits
async function getAndIncrementVisits() {
  try {
    const { rows } = await query(
      'UPDATE visits SET counter = counter + 1 WHERE id = 1 RETURNING counter'
    );
    return rows[0].counter;
  } catch (error) {
    console.error('Error updating visits:', error);
    return 0;
  }
}

// Get guestbook entries
async function getGuestbookEntries(limit = 50) {
  try {
    const { rows } = await query(
      'SELECT * FROM guestbook ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return rows;
  } catch (error) {
    console.error('Error getting guestbook:', error);
    return [];
  }
}

// Add guestbook entry
async function addGuestbookEntry(nick, comment) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { rows } = await query(
      'INSERT INTO guestbook (nick, comment, date) VALUES ($1, $2, $3) RETURNING id',
      [nick, comment, today]
    );
    return { lastInsertRowid: rows[0].id };
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    throw error;
  }
}

// Increment likes for signup entry
async function incrementSignupLikes(id) {
  try {
    const { rows } = await query(
      'UPDATE signups SET likes = likes + 1 WHERE id = $1 RETURNING likes',
      [id]
    );
    return rows[0] ? rows[0].likes : 0;
  } catch (error) {
    console.error('Error incrementing likes:', error);
    throw error;
  }
}

// Cleanup old signups (for cron)
async function cleanupOldSignups() {
  try {
    const today = new Date().toISOString().split('T')[0];
    await query('DELETE FROM signups WHERE date < $1', [today]);
    console.log('🧹 Cleaned up old signups');
  } catch (error) {
    console.error('Error cleaning up signups:', error);
  }
}

module.exports = {
  initDatabase,
  getTodaySignups,
  addSignup,
  getAndIncrementVisits,
  getGuestbookEntries,
  addGuestbookEntry,
  incrementSignupLikes,
  cleanupOldSignups,
};
