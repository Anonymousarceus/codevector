const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'products.db');
const db = new Database(dbPath);

// Improve performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  );
`;

const createDateIndexQuery = `
  CREATE INDEX IF NOT EXISTS idx_products_created_id
  ON products(created_at DESC, id DESC);
`;

const createCategoryDateIndexQuery = `
  CREATE INDEX IF NOT EXISTS idx_products_category_created_id
  ON products(category, created_at DESC, id DESC);
`;

db.exec(createTableQuery);
db.exec(createDateIndexQuery);
db.exec(createCategoryDateIndexQuery);

module.exports = db;