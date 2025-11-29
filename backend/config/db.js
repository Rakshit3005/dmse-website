// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const dbPath = process.env.DB_PATH || '../lab_system.db';
console.log('DB_PATH:', dbPath, typeof dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
    throw err;
  }
  console.log('Connected to SQLite database');
});

module.exports = db;