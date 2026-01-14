const { sql } = require('@vercel/postgres');

// Vercel Postgres with OBIAD_ prefix
// Try different connection string variants - @vercel/postgres needs pooled connection
// Priority: URL (usually pooled) > PRISMA_URL > URL_NON_POOLING (last resort)
if (!process.env.POSTGRES_URL) {
  if (process.env.OBIAD_POSTGRES_URL) {
    process.env.POSTGRES_URL = process.env.OBIAD_POSTGRES_URL;
  } else if (process.env.OBIAD_POSTGRES_PRISMA_URL) {
    process.env.POSTGRES_URL = process.env.OBIAD_POSTGRES_PRISMA_URL;
  } else if (process.env.OBIAD_POSTGRES_URL_NON_POOLING) {
    console.warn('Using non-pooled connection - this might cause issues');
    process.env.POSTGRES_URL = process.env.OBIAD_POSTGRES_URL_NON_POOLING;
  }
}

console.log('Using Postgres connection:', process.env.POSTGRES_URL ? 'Yes' : 'No');

// Initialize database tables
async function initDatabase() {
  try {
    // Create signups table
    await sql`
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
    `;

    // Create visits table
    await sql`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        counter INTEGER NOT NULL DEFAULT 0
      )
    `;

    // Create guestbook table
    await sql`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        nick VARCHAR(100) NOT NULL,
        comment TEXT NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Initialize visits counter if empty
    const { rows } = await sql`SELECT COUNT(*) as count FROM visits`;
    if (rows[0].count === '0') {
      await sql`INSERT INTO visits (counter) VALUES (0)`;
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
    const { rows } = await sql`
      SELECT * FROM signups 
      WHERE date = ${today}
      ORDER BY created_at DESC
    `;
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
    const { rows } = await sql`
      INSERT INTO signups (nick, time, comment, mood_icon, date)
      VALUES (${nick}, ${time}, ${comment}, ${moodIcon}, ${today})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  } catch (error) {
    console.error('Error adding signup:', error);
    throw error;
  }
}

// Get and increment visits
async function getAndIncrementVisits() {
  try {
    const { rows } = await sql`
      UPDATE visits 
      SET counter = counter + 1 
      WHERE id = 1
      RETURNING counter
    `;
    return rows[0].counter;
  } catch (error) {
    console.error('Error updating visits:', error);
    return 0;
  }
}

// Get guestbook entries
async function getGuestbookEntries(limit = 50) {
  try {
    const { rows } = await sql`
      SELECT * FROM guestbook 
      ORDER BY created_at DESC 
      LIMIT ${limit}
    `;
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
    const { rows } = await sql`
      INSERT INTO guestbook (nick, comment, date)
      VALUES (${nick}, ${comment}, ${today})
      RETURNING id
    `;
    return { lastInsertRowid: rows[0].id };
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    throw error;
  }
}

// Increment likes for signup entry
async function incrementSignupLikes(id) {
  try {
    const { rows } = await sql`
      UPDATE signups 
      SET likes = likes + 1 
      WHERE id = ${id}
      RETURNING likes
    `;
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
    await sql`DELETE FROM signups WHERE date < ${today}`;
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
