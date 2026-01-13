const cron = require('node-cron');
const { cleanupOldSignups } = require('./database');

// Run daily cleanup at midnight (00:00)
cron.schedule('0 0 * * *', () => {
  console.log('🧹 Running daily cleanup of old signups...');
  try {
    const result = cleanupOldSignups();
    console.log(`✅ Cleaned up ${result.changes} old signups`);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
});

console.log('⏰ Cron job scheduled: Daily cleanup at midnight');

module.exports = {};
