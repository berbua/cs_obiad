// Vercel serverless function for all API routes
const express = require('express');
const cors = require('cors');

// Use JSON database for Vercel
const db = require('../backend/database-json');

const {
  getTodaySignups,
  addSignup,
  getAndIncrementVisits,
  getGuestbookEntries,
  addGuestbookEntry,
} = db;

const app = express();

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
app.get('/signups', (req, res) => {
  try {
    const signups = getTodaySignups();
    res.json({ signups });
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ error: 'Failed to fetch signups' });
  }
});

app.post('/signups', (req, res) => {
  try {
    const { nick, time, comment, moodIcon } = req.body;
    
    if (!nick || !time) {
      return res.status(400).json({ error: 'Nick and time are required' });
    }

    const result = addSignup(nick, time, comment || '', moodIcon || '🍕');
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error adding signup:', error);
    res.status(500).json({ error: 'Failed to add signup' });
  }
});

app.get('/visits', (req, res) => {
  try {
    const counter = getAndIncrementVisits();
    res.json({ visits: counter });
  } catch (error) {
    console.error('Error updating visits:', error);
    res.status(500).json({ error: 'Failed to update visits' });
  }
});

app.get('/guestbook', (req, res) => {
  try {
    const entries = getGuestbookEntries();
    res.json({ entries });
  } catch (error) {
    console.error('Error fetching guestbook:', error);
    res.status(500).json({ error: 'Failed to fetch guestbook' });
  }
});

app.post('/guestbook', (req, res) => {
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
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OBIAD TEAM API is running!',
    database: 'JSON'
  });
});

// Export for Vercel
module.exports = app;
