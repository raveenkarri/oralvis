// db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'oralvis.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Could not open db', err);
  else console.log('Connected to SQLite DB at', dbPath);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT,
    patientId TEXT,
    scanType TEXT,
    region TEXT,
    imageUrl TEXT,
    uploadDate TEXT
  )`);
});

module.exports = db;
