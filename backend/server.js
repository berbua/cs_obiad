// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { validateSignup, validateGuestbookEntry, validateLikeRequest } = require('./validator');

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
  incrementSignupLikes,
} = db;

// Initialize cron job only for non-serverless environments
if (!useJsonDb) {
  require('./cron');
}

const app = express();
const PORT = process.env.PORT || 6001;

// Rate limiting - max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Zbyt wiele żądań, spróbuj ponownie za chwilę' }
});

// Stricter rate limit for POST requests - max 20 per 15 minutes
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Zbyt wiele zapisów, poczekaj chwilę' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(limiter);

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

app.post('/api/signups', postLimiter, (req, res) => {
  try {
    const validation = validateSignup(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.errors.join(', ') 
      });
    }

    const { nick, time, comment, moodIcon } = validation.data;
    const result = addSignup(nick, time, comment, moodIcon);
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

app.post('/api/guestbook', postLimiter, (req, res) => {
  try {
    const validation = validateGuestbookEntry(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.errors.join(', ') 
      });
    }

    const { nick, comment } = validation.data;
    const result = addGuestbookEntry(nick, comment);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding guestbook entry:', error);
    res.status(500).json({ error: 'Failed to add guestbook entry' });
  }
});

// Like signup
app.post('/api/signup-like', postLimiter, (req, res) => {
  try {
    const validation = validateLikeRequest(req.body);
    
    if (!validation.valid) {
      return res.status(400).json({ 
        error: validation.errors.join(', ') 
      });
    }

    const { id } = validation.data;
    const likes = incrementSignupLikes(id);
    res.json({ success: true, likes });
  } catch (error) {
    console.error('Error incrementing likes:', error);
    res.status(500).json({ error: 'Failed to increment likes' });
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
