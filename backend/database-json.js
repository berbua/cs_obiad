const fs = require('fs');
const path = require('path');

// For serverless environments, we'll use a JSON file in /tmp
const DATA_FILE = process.env.VERCEL ? '/tmp/obiad_data.json' : path.join(__dirname, 'obiad_data.json');

// Initialize data structure
function getInitialData() {
  return {
    signups: [],
    visits: 0,
    guestbook: [],
    lastCleanup: new Date().toISOString().split('T')[0]
  };
}

// Read data from file
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return data;
    }
  } catch (error) {
    console.error('Error reading data file:', error);
  }
  return getInitialData();
}

// Write data to file
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
}

// Check and perform daily cleanup
function checkAndCleanup(data) {
  const today = new Date().toISOString().split('T')[0];
  if (data.lastCleanup !== today) {
    data.signups = [];
    data.lastCleanup = today;
    console.log('🧹 Performed daily cleanup');
  }
  return data;
}

// Functions for signups
function getTodaySignups() {
  let data = readData();
  data = checkAndCleanup(data);
  writeData(data);
  return data.signups;
}

function addSignup(nick, time, comment, moodIcon) {
  let data = readData();
  data = checkAndCleanup(data);
  
  const newSignup = {
    id: Date.now(),
    nick,
    time,
    comment,
    mood_icon: moodIcon,
    date: new Date().toISOString().split('T')[0]
  };
  
  data.signups.push(newSignup);
  writeData(data);
  return { lastInsertRowid: newSignup.id };
}

// Functions for visits
function getAndIncrementVisits() {
  let data = readData();
  data.visits += 1;
  writeData(data);
  return data.visits;
}

// Functions for guestbook
function getGuestbookEntries(limit = 50) {
  const data = readData();
  return data.guestbook.slice(0, limit);
}

function addGuestbookEntry(nick, comment) {
  let data = readData();
  
  const newEntry = {
    id: Date.now(),
    nick,
    comment,
    likes: 0,
    date: new Date().toISOString().split('T')[0]
  };
  
  data.guestbook.unshift(newEntry);
  
  // Keep only last 100 entries
  if (data.guestbook.length > 100) {
    data.guestbook = data.guestbook.slice(0, 100);
  }
  
  writeData(data);
  return { lastInsertRowid: newEntry.id };
}

function incrementGuestbookLikes(id) {
  let data = readData();
  const entry = data.guestbook.find(e => e.id === parseInt(id));
  
  if (entry) {
    entry.likes = (entry.likes || 0) + 1;
    writeData(data);
    return entry.likes;
  }
  
  return 0;
}

module.exports = {
  getTodaySignups,
  addSignup,
  getAndIncrementVisits,
  getGuestbookEntries,
  addGuestbookEntry,
  incrementGuestbookLikes,
};
