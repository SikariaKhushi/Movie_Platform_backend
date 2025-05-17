// config/redis.js
const { createClient } = require('redis');

// Get Redis URL with fallback
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Configure TLS only for Render's Redis
const tlsConfig = redisUrl.startsWith('rediss://') ? { 
  tls: true,
  servername: new URL(redisUrl).hostname 
} : {};

const redisClient = createClient({
  url: redisUrl,
  socket: tlsConfig
});

// Connection handlers
redisClient.on('connect', () => {
  console.log(`Redis connected to: ${redisUrl.includes('render.com') ? 'Render' : 'Local'}`);
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

// Connect with retries
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection successful');
  } catch (error) {
    console.error('Redis connection failed:', error.message);
  }
})();

module.exports = redisClient;
