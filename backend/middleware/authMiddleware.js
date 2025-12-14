// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Keep dev working even if JWT_SECRET is missing; production should set it.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-12345';

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};