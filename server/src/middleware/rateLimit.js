const rateLimit = require("express-rate-limit");

// Apply IP-based rate limiting
const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 1 * 60 * 1000, 
  max: 100, // Limiting each IP to 100 requests per 15 minutes
  message: "Too many requests from this IP. Please try again later.",
  
});

module.exports = apiLimiter;
