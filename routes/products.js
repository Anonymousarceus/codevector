const express = require('express');
const router = express.Router();

// 2. Import database connection
const db = require('../database/db');

/**
 * GET /
 * Fetches products using cursor-based pagination.
 */
router.get('/', (req, res) => {
  try {
    // --- 1. Parse and validate query parameters ---
    
    // Set default limit to 20, cap maximum at 100 to prevent database overload
    let limit = parseInt(req.query.limit, 10) || 20;
    if (limit > 100) limit = 100;

    const category = req.query.category;
    const cursorCreatedAt = req.query.cursorCreatedAt;
    const cursorId = parseInt(req.query.cursorId, 10);

    // --- 2. Construct the SQL Query dynamically ---
    
    // We use an array for conditions and an object for parameters to ensure 
    // we strictly use prepared statements, which prevents SQL injection.
    const conditions = [];
    const params = {};

    // Filter by category if provided
    if (category) {
      conditions.push('category = @category');
      params.category = category;
    }

    // --- INTERVIEW NOTE: The Cursor Logic ---
    // Why sort by BOTH created_at and id? 
    // Timestamps are rarely unique. If two products are created at the exact same millisecond,
    // the database needs a reliable tie-breaker (the unique ID) to ensure a stable sort order.
    // 
    // Why use < and =? 
    // Since we are sorting DESCENDING, the "next" page must contain older items (created_at < cursor).
    // If the timestamp is exactly the same as our cursor, we use the ID tie-breaker to find
    // items that came "after" our cursor in the descending list (id < cursorId).
    if (cursorCreatedAt && !isNaN(cursorId)) {
      conditions.push(`
        (created_at < @cursorCreatedAt 
        OR (created_at = @cursorCreatedAt AND id < @cursorId))
      `);
      params.cursorCreatedAt = cursorCreatedAt;
      params.cursorId = cursorId;
    }

    // Combine conditions into a WHERE clause if any exist
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';

    // --- INTERVIEW NOTE: The Limit + 1 Trick ---
    // Instead of running a heavy `SELECT COUNT(*)` query to see if more pages exist,
    // we simply ask the database for one extra row (limit + 1). 
    // If we get that extra row back, we know there is a next page.
    params.limitPlusOne = limit + 1;

    const sql = `
      SELECT * FROM products
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT @limitPlusOne
    `;

    // Execute the prepared statement
    const products = db.prepare(sql).all(params);

    // --- 3. Process the results for the client ---
    
    let hasMore = false;
    let nextCursor = null;

    // If we received more rows than the requested limit, it means another page exists.
    if (products.length > limit) {
      hasMore = true;
      // Remove that extra row so we don't send it to the client yet
      products.pop(); 
    }

    // If we have items to return, generate the cursor for the next request
    // using the absolute last item in our current result set.
    if (products.length > 0) {
      const lastProduct = products[products.length - 1];
      nextCursor = {
        created_at: lastProduct.created_at,
        id: lastProduct.id
      };
    }

    // --- 4. Send the final response ---
    res.json({
      products,
      nextCursor,
      hasMore
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 10. Export the router
module.exports = router;