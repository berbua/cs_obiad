// Auto-select database based on environment
// Use Postgres on Vercel (production), JSON locally
if (process.env.VERCEL || process.env.OBIAD_POSTGRES_URL) {
  module.exports = require('../backend/database-postgres');
} else {
  module.exports = require('../backend/database-json');
}
