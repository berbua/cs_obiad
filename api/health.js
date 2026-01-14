module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.json({ 
    status: 'OK', 
    message: 'OBIAD TEAM API is running!',
    database: 'PostgreSQL',
    endpoints: ['/api/signups', '/api/visits', '/api/guestbook']
  });
};
