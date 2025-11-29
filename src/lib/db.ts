// backend/config/db.ts
import sqlite3 from 'sqlite3';
import { config } from 'dotenv';

config();

const dbPath = process.env.DB_PATH || (process.env.VERCEL ? '/tmp/lab_system.db' : './lab_system.db');
console.log('DB_PATH:', dbPath, typeof dbPath);

let db: sqlite3.Database;

try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error connecting to SQLite database:', err.message);
      throw err;
    }
    console.log('Connected to SQLite database');
  });
} catch (error) {
  console.error('Failed to initialize database:', error);
  // For build time or when DB is not available, set to null or handle
  db = null as any; // Temporary fix
}

export default db;
