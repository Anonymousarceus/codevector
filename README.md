# 🚀 CodeVector Backend

> A lightweight, high-performance REST API built with **Node.js, Express, and SQLite** for browsing large product datasets efficiently using **cursor-based pagination**.

---

## ✨ Features

* ⚡ **Cursor-Based Pagination** for fast and consistent performance on large datasets.
* 🏎️ **Efficient Bulk Seeding** of 200,000 products using batched transactions.
* 🗄️ **Optimized Database Queries** using composite indexes.
* 🔍 **Category Filtering** support.
* 🛡️ **SQL Injection Protection** using parameterized queries.
* 📈 Designed to handle data changes while users browse without duplicates or missing products.

---

## 🛠️ Tech Stack

| Technology     | Usage               |
| -------------- | ------------------- |
| Node.js        | Runtime Environment |
| Express.js     | Backend Framework   |
| SQLite         | Database            |
| better-sqlite3 | SQLite Driver       |
| Nodemon        | Development Server  |

---

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or above)
* npm

---

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd codevector-backend
```

Install dependencies:

```bash
npm install
```

---

## 🗄️ Database Initialization

Generate and seed the database with 200,000 products:

```bash
npm run seed
```

The seed script:

* Generates 200,000 products.
* Inserts records in batches of 5000.
* Uses transactions for improved performance.

---

### Optional Testing Script

Insert 50 new products to test pagination consistency:

```bash
npm run insert:new
```

---

## ▶️ Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server runs by default on:

```text
http://localhost:5000
```

---

## 📡 API Documentation

### Health Check

Verify that the API is running.

**Endpoint**

```http
GET /
```

**Response**

```json
{
  "message": "CodeVector Backend API is running"
}
```

---

## Get Products

Fetch products with support for filtering and cursor-based pagination.

**Endpoint**

```http
GET /api/products
```

### Query Parameters

| Parameter       | Type   | Default | Description                                |
| --------------- | ------ | ------- | ------------------------------------------ |
| limit           | Number | 20      | Number of products per page (Maximum: 100) |
| category        | String | -       | Filter products by category                |
| cursorCreatedAt | String | -       | Cursor timestamp from previous response    |
| cursorId        | Number | -       | Cursor product ID from previous response   |

---

### Available Categories

```text
Electronics
Books
Fashion
Sports
Home
Beauty
Toys
```

---

### Example Requests

Get first page:

```http
GET /api/products?limit=5
```

Filter by category:

```http
GET /api/products?category=Books&limit=5
```

Fetch next page using cursor:

```http
GET /api/products?limit=5&cursorCreatedAt=2026-06-24T12:02:16.195Z&cursorId=112993
```

---

### Success Response

```json
{
  "products": [
    {
      "id": 1,
      "name": "Product 1",
      "category": "Electronics",
      "price": 1999.99,
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T10:00:00.000Z"
    }
  ],
  "nextCursor": {
    "created_at": "2024-01-01T10:00:00.000Z",
    "id": 1
  },
  "hasMore": true
}
```

> To fetch the next page, pass `nextCursor.created_at` and `nextCursor.id` as query parameters.

---

## 🏗️ Project Structure

```text
codevector-backend/
│
├── database/
│   ├── db.js
│   └── products.db
│
├── routes/
│   └── products.js
│
├── scripts/
│   ├── seed.js
│   └── addNewProducts.js
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 🚀 Performance Optimizations

This project was built with performance and scalability in mind.

### 1. Cursor-Based Pagination

Traditional `OFFSET/LIMIT` pagination becomes slower as data grows and can return duplicate or missing records when data changes.

This project uses **cursor-based pagination** using:

```sql
ORDER BY created_at DESC, id DESC
```

Benefits:

* Faster queries on large datasets.
* No duplicate products while browsing.
* No missing products when new products are inserted.

---

### 2. Composite Indexing

The following indexes are created:

```sql
CREATE INDEX idx_products_created_id
ON products(created_at DESC, id DESC);

CREATE INDEX idx_products_category_created_id
ON products(category, created_at DESC, id DESC);
```

These indexes optimize:

* Sorting
* Filtering
* Cursor lookups

and help avoid expensive full-table scans.

---

### 3. Efficient Pagination

Instead of using expensive:

```sql
SELECT COUNT(*)
```

queries, the API fetches:

```text
limit + 1 rows
```

to determine whether additional pages exist.

---

### 4. Database Optimizations

SQLite is configured with:

```js
journal_mode = WAL
synchronous = NORMAL
```

to improve read/write performance.

---

### 5. High-Speed Bulk Inserts

The seed script:

* Uses prepared statements.
* Uses transactions.
* Inserts records in batches of 5000.

This significantly reduces disk I/O overhead.

---

## 🤖 AI Usage

AI tools such as ChatGPT and Gemini were used to:

* Discuss pagination strategies.
* Review implementation approaches.
* Assist in generating boilerplate code.

All generated code was manually reviewed, tested, modified, and validated to ensure correctness and performance.

---

## 🔮 Future Improvements

Given more time, the following enhancements could be added:

* Automated testing using Jest.
* API documentation using Swagger/OpenAPI.
* Redis caching for frequently accessed queries.
* Docker containerization.
* Frontend interface for browsing products.
* Rate limiting and request throttling.
* CI/CD pipeline integration.

---

## 📄 License

ISC License
