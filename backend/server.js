// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Use JSON database by default for simplicity
// Set USE_JSON_DB=false in environment to use SQLite
const useJsonDb = process.env.USE_JSON_DB !== 'false';
console.log(`📦 Using ${useJsonDb ? 'JSON' : 'SQLite'} storage`);

const db = useJsonDb 
  ? require('./database-json')
  : require('./database');

const {
  getTodaySignups,
  addSignup,
  getAndIncrementVisits,
  getGuestbookEntries,
  addGuestbookEntry,
} = db;

// Initialize cron job only for non-serverless environments
if (!useJsonDb) {
  require('./cron');
}

const app = express();
const PORT = process.env.PORT || 6001;

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🍕 OBIAD TEAM API', 
    version: '1.0',
    endpoints: {
      health: '/api/health',
      signups: '/api/signups',
      visits: '/api/visits',
      guestbook: '/api/guestbook'
    }
  });
});

// Routes
app.get('/api/signups', (req, res) => {
  try {
    const signups = getTodaySignups();
    res.json({ signups });
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
});

app.post('/api/signups', (req, res) => {
  try {
    const { nick, time, comment, moodIcon } = req.body;
    
    if (!nick) {
      return res.status(400).json({ error: 'Nick is required' });
    }

    const result = addSignup(nick, time || '', comment || '', moodIcon || '🍕');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding signup:', error);
    res.status(500).json({ error: 'Failed to add signup' });
  }
});

app.get('/api/visits', (req, res) => {
  try {
    const counter = getAndIncrementVisits();
    res.json({ visits: counter });
  } catch (error) {
    console.error('Error updating visits:', error);
    res.status(500).json({ error: 'Failed to update visits' });
  }
});

app.get('/api/guestbook', (req, res) => {
  try {
    const entries = getGuestbookEntries();
    res.json({ entries });
  } catch (error) {
    console.error('Error fetching guestbook:', error);
    res.status(500).json({ error: 'Failed to fetch guestbook' });
  }
});

app.post('/api/guestbook', (req, res) => {
  try {
    const { nick, comment } = req.body;
    
    if (!nick || !comment) {
      return res.status(400).json({ error: 'Nick and comment are required' });
    }

    const result = addGuestbookEntry(nick, comment);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    res.status(500).json({ error: 'Failed to add guestbook entry' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OBIAD TEAM API is running!',
    database: useJsonDb ? 'JSON' : 'SQLite'
  });
});

// Only listen in non-serverless environments
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🍕 OBIAD TEAM Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
