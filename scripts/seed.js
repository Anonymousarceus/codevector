// Import the database connection
const db = require('../database/db');

// Configuration constants
const TOTAL_RECORDS = 200000;
const BATCH_SIZE = 5000;

const CATEGORIES = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home",
  "Beauty",
  "Toys"
];

// Time helpers
const msInOneYear = 365 * 24 * 60 * 60 * 1000;
const now = Date.now();

console.log('Starting database seeding...');

// Clear existing data and reset auto-increment IDs
db.exec(`
  DELETE FROM products;
  DELETE FROM sqlite_sequence WHERE name='products';
`);

// Prepared statement for fast inserts
const insertStmt = db.prepare(`
  INSERT INTO products (name, category, price, created_at, updated_at)
  VALUES (@name, @category, @price, @created_at, @updated_at)
`);

// Transaction for maximum performance
const insertBatch = db.transaction((batch) => {
  for (const product of batch) {
    insertStmt.run(product);
  }
});

let batch = [];
let insertedCount = 0;

// Generate products
for (let i = 1; i <= TOTAL_RECORDS; i++) {
  const name = `Product ${i}`;

  const category =
    CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];

  // Random price between 100 and 10000
  const price = Number(
    (Math.random() * (10000 - 100) + 100).toFixed(2)
  );

  // Generate logical timestamps
  const createdOffset = Math.random() * msInOneYear;
  const updatedOffset = Math.random() * createdOffset;

  const createdAt = new Date(now - createdOffset).toISOString();
  const updatedAt = new Date(now - updatedOffset).toISOString();

  batch.push({
    name,
    category,
    price,
    created_at: createdAt,
    updated_at: updatedAt
  });

  // Insert batch when it reaches batch size
  if (batch.length === BATCH_SIZE) {
    insertBatch(batch);

    insertedCount += batch.length;

    console.log(
      `Inserted ${insertedCount}/${TOTAL_RECORDS} products`
    );

    batch = [];
  }
}

// Insert any remaining records
if (batch.length > 0) {
  insertBatch(batch);

  insertedCount += batch.length;

  console.log(
    `Inserted ${insertedCount}/${TOTAL_RECORDS} products`
  );
}

console.log('Seeding completed successfully.');