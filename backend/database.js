const Database = require('better-sqlite3');
const path = require('path');

// Initialize database with better settings
const db = new Database(path.join(__dirname, 'obiad.db'), {
  verbose: console.log, // Debug mode
  timeout: 5000 // 5 second timeout
});

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS signups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nick TEXT NOT NULL,
    time TEXT NOT NULL,
    comment TEXT,
    mood_icon TEXT,
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    counter INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS guestbook (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nick TEXT NOT NULL,
    comment TEXT NOT NULL,
    date TEXT NOT NULL
  );
`);

// Initialize visits counter if it doesn't exist
const initVisits = db.prepare('INSERT OR IGNORE INTO visits (id, counter) VALUES (1, 0)');
initVisits.run();

// Functions for signups
function getTodaySignups() {
  const today = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('SELECT * FROM signups WHERE date = ? ORDER BY time ASC');
  return stmt.all(today);
}

function addSignup(nick, time, comment, moodIcon) {
  const today = new Date().toISOString().split('T')[0];
  const stmt = db.prepare(
    'INSERT INTO signups (nick, time, comment, mood_icon, date) VALUES (?, ?, ?, ?, ?)'
  );
  return stmt.run(nick, time, comment, moodIcon, today);
}

function cleanupOldSignups() {
  const today = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('DELETE FROM signups WHERE date < ?');
  return stmt.run(today);
}

// Functions for visits
function getAndIncrementVisits() {
  const updateStmt = db.prepare('UPDATE visits SET counter = counter + 1 WHERE id = 1');
  const getStmt = db.prepare('SELECT counter FROM visits WHERE id = 1');
  
  updateStmt.run();
  const result = getStmt.get();
  return result ? result.counter : 0;
}

// Functions for guestbook
function getGuestbookEntries(limit = 50) {
  const stmt = db.prepare('SELECT * FROM guestbook ORDER BY id DESC LIMIT ?');
  return stmt.all(limit);
}

function addGuestbookEntry(nick, comment) {
  const date = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('INSERT INTO guestbook (nick, comment, date) VALUES (?, ?, ?)');
  return stmt.run(nick, comment, date);
}

module.exports = {
  getTodaySignups,
  addSignup,
  cleanupOldSignups,
  getAndIncrementVisits,
  getGuestbookEntries,
  addGuestbookEntry,
};
