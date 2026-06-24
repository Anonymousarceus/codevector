const db = require('../database/db');

const stmt = db.prepare(`
INSERT INTO products (name, category, price, created_at, updated_at)
VALUES (?, ?, ?, ?, ?)
`);

for (let i = 1; i <= 50; i++) {
  const now = new Date().toISOString();

  stmt.run(
    `New Product ${i}`,
    'Electronics',
    999,
    now,
    now
  );
}

console.log('50 products inserted');