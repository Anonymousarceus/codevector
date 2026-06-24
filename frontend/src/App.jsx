import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api/products';

const CATEGORIES = [
  'All',
  'Electronics',
  'Books',
  'Fashion',
  'Sports',
  'Home',
  'Beauty',
  'Toys'
];

function App() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Formatter for price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Formatter for date (e.g., 24 Jun 2026)
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Fetch data from backend
  const fetchProducts = async (isLoadMore = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = { limit: 20 };
      
      if (category !== 'All') {
        params.category = category;
      }

      // If we are paginating, attach the cursor parameters
      if (isLoadMore && nextCursor) {
        params.cursorCreatedAt = nextCursor.created_at;
        params.cursorId = nextCursor.id;
      }

      const response = await axios.get(API_BASE_URL, { params });
      const { products: fetchedProducts, nextCursor: newCursor, hasMore: newHasMore } = response.data;

      if (isLoadMore) {
        setProducts(prev => [...prev, ...fetchedProducts]);
      } else {
        setProducts(fetchedProducts);
      }
      
      setNextCursor(newCursor);
      setHasMore(newHasMore);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch products. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when category changes
  useEffect(() => {
    // Clear existing data immediately for better UX
    setProducts([]);
    setNextCursor(null);
    setHasMore(false);
    
    // Fetch fresh page 1
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchProducts(true);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>CodeVector Product Browser</h1>
        <p className="subtitle">Browse 200,000+ products efficiently</p>
        
        <div className="controls">
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="category-select"
            disabled={isLoading && products.length === 0}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </header>

      {error && <div className="error-state">⚠️ {error}</div>}

      {!isLoading && !error && products.length === 0 && (
        <div className="empty-state">No products found for this category.</div>
      )}

      <main>
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h2 className="product-name">{product.name}</h2>
              <hr className="divider" />
              <div className="product-details">
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> {formatPrice(product.price)}</p>
                <br />
                <p><strong>Created:</strong><br /> {formatDate(product.created_at)}</p>
                <br />
                <p className="product-id">ID: {product.id}</p>
              </div>
            </div>
          ))}
        </div>

        {products.length > 0 && (
          <div className="load-more-container">
            <button 
              className="load-more-btn" 
              onClick={handleLoadMore}
              disabled={!hasMore || isLoading}
            >
              {isLoading ? 'Loading...' : hasMore ? 'Load More' : 'End of Results'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;