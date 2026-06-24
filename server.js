const express = require('express');
const cors = require('cors');

// 2. Import the database connection
// Because better-sqlite3 runs synchronously, this guarantees that the database, 
// tables, and indexes are fully initialized before the server starts accepting requests.
require('./database/db');

// 3. Import routes from the products router
const productRoutes = require('./routes/products');

// Initialize the Express application
const app = express();

// --- Middleware Setup ---

// 1. Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// 4. Enable express.json() middleware to parse incoming JSON request bodies
app.use(express.json());

// --- Routing ---

// 6. Create a health check route at the root path
app.get('/', (req, res) => {
  res.json({
    message: "CodeVector Backend API is running"
  });
});

// 5. Mount the product routes under the /api/products base path
app.use('/api/products', productRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// --- Server Startup ---

// 7. Set the port from environment variables, fallback to 5000 if not provided
const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  // 8. Print startup confirmation
  console.log(`Server running on port : http://localhost:${PORT}`);
});