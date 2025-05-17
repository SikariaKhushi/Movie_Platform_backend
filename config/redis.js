const { createClient } = require('redis');

// Create Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD || undefined
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.log('Redis client error', err);
});

// Connect to Redis when this module is imported
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Redis connection failed:', error);
    // Continue even if Redis is not available
  }
})();

module.exports = redisClient;