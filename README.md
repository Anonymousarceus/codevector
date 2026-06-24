# 🚀 CodeVector Product Browser (Full-Stack)

> A lightweight, high-performance full-stack application built with **React, Node.js, Express, and SQLite**. Designed to browse large product datasets efficiently using highly optimized **cursor-based pagination**.

---

## ✨ Features

**Frontend (React)**

* 🖥️ **Responsive UI** with a clean, modern product grid (Pure CSS, no external UI libraries).
* 🔄 **Seamless "Load More" Pagination** that appends products smoothly without page reloads.
* 🎛️ **Category Filtering** with automatic state and cursor resets.
* 🚦 **Robust State Handling** including loading indicators, empty states, and error catching.

**Backend (Node.js & SQLite)**

* ⚡ **Cursor-Based Pagination** for fast, O(1) offset performance on large datasets.
* 🏎️ **Efficient Bulk Seeding** of 200,000 products using batched transactions.
* 🗄️ **Optimized Database Queries** using composite B-Tree indexes.
* 🛡️ **SQL Injection Protection** using strict parameterized queries.
* 📈 **Stable Browsing:** No duplicate or missing products if database records change during pagination.

---

## 🛠️ Tech Stack

| Domain | Technology | Usage |
| --- | --- | --- |
| **Frontend** | React (Vite) | UI Library & Build Tool |
|  | Axios | HTTP Client |
|  | Plain CSS | Styling & Responsive Grid |
| **Backend** | Node.js & Express.js | Runtime & REST API Framework |
|  | SQLite (`better-sqlite3`) | Database & Driver |
|  | Nodemon | Development Server |

---

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or above)
* npm

### Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd codevector

```

Since this is a full-stack project, you will need to install dependencies for both the backend and the frontend.

**1. Setup Backend:**

```bash
cd backend      # Or your backend root folder
npm install

```

**2. Setup Frontend:**

```bash
cd frontend     # Or your frontend root folder
npm install

```

---

## 🗄️ Database Initialization

Navigate to your backend directory and generate the 200,000 mock products:

```bash
npm run seed

```

*The seed script uses prepared statements and batched transactions to insert records in seconds.*

**(Optional)** Insert 50 new products to test pagination consistency while browsing:

```bash
npm run insert:new

```

---

## ▶️ Running the Application

You will need two terminal windows to run both the frontend and backend simultaneously.

### 1. Start the Backend API

```bash
cd backend
npm run dev

```

*The backend server runs on `http://localhost:5000`.*

### 2. Start the React Frontend

```bash
cd frontend
npm run dev

```

*The frontend development server typically runs on `http://localhost:5173`.*

---

## 🏗️ Project Structure

```text
codevector/
│
├── database/
│   │   ├── db.js             # SQLite connection & schema
│   │   └── products.db       # Generated SQLite database
│   ├── routes/
│   │   └── products.js       # Cursor pagination API logic
│   ├── scripts/
│   │   ├── seed.js           # 200K bulk insertion script
│   │   └── addNewProducts.js 
│   └── server.js             # Express application entry point
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Main React component & API logic
    │   ├── App.css           # Responsive grid and styling
    │   └── main.jsx          # React DOM mounting
    ├── index.html
    └── package.json

```

---

## 📡 API Documentation

### Health Check

Verify that the API is running.
**Endpoint:** `GET /`
**Response:**

```json
{ "message": "CodeVector Backend API is running" }

```

### Get Products

Fetch products with support for filtering and cursor-based pagination.
**Endpoint:** `GET /api/products`

**Query Parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | Number | 20 | Number of products per page (Maximum: 100) |
| `category` | String | - | Filter products by category |
| `cursorCreatedAt` | String | - | Cursor timestamp from previous response |
| `cursorId` | Number | - | Cursor product ID from previous response |

**Success Response:**

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

> **Pagination UI Logic:** The frontend passes `nextCursor.created_at` and `nextCursor.id` to the backend when the "Load More" button is clicked.

---

## 🚀 Backend Performance Optimizations

This project was built with a strong focus on backend performance and database efficiency:

### 1. Cursor-Based Pagination

Traditional `OFFSET/LIMIT` pagination becomes exponentially slower as data grows and can return duplicate or missing records when data changes. This project queries via:

```sql
ORDER BY created_at DESC, id DESC

```

**Benefits:** Constant O(1) query times, no duplicate products while browsing, and no missing products when new records are inserted.

### 2. Composite Indexing

The following indexes ensure the database never performs a full-table scan:

```sql
CREATE INDEX idx_products_created_id ON products(created_at DESC, id DESC);
CREATE INDEX idx_products_category_created_id ON products(category, created_at DESC, id DESC);

```

### 3. Zero-Count Pagination

Instead of using expensive `SELECT COUNT(*)` queries to check if a "Load More" button should be rendered, the API fetches `limit + 1` rows to safely determine the `hasMore` boolean.

### 4. Database Optimizations

SQLite is configured with `journal_mode = WAL` to drastically improve concurrent read/write performance.

---

## 🤖 AI Usage

AI tools such as ChatGPT and Gemini were used to:

* Discuss pagination strategies.
* Review implementation approaches.
* Assist in generating boilerplate CSS and boilerplate code.

All generated code was manually reviewed, tested, modified, and validated to ensure correctness and performance constraints were met.

---

## 🔮 Future Improvements

Given more time, the following enhancements could be added:

* **Frontend:** React Router for distinct product pages, Dark Mode UI, and Debounced Search.
* **Backend:** Automated testing using Jest/Supertest and API documentation using Swagger/OpenAPI.
* **Infrastructure:** Redis caching for frequently accessed categories and Docker containerization.

---

## 📄 License

ISC License
