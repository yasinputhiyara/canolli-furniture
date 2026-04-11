import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { showToast } from '../components/layout/Toast';
import { getAllProducts, getAllCategories } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import '../styles/Shop.css';

const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest'];

export default function ShopPage() {
  const [activecat, setActiveCat] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const fetchedProducts = Array.isArray(data) ? data : data.products || [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching shop products", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        if (data && data.length > 0) {
          setCategories(['All', ...data.map(c => c.name)]);
        } else {
            setCategories(['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Accessories']);
        }
      } catch (err) {
        setCategories(['All', 'Living Room', 'Bedroom', 'Dining', 'Office', 'Outdoor', 'Accessories']);
      }
    };
    
    fetchProducts();
    fetchCats();
  }, []);

  const filtered = products.filter(p => {
    const catName = p.category?.name || p.cat || 'General';
    const priceToCompare = p.discountPrice || p.price || 0;
    
    const isCatMatch = activecat === 'All' || catName === activecat;
    const isSearchMatch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const isPriceMatch = priceToCompare <= maxPrice;
    const isStockMatch = !inStockOnly || (p.stock > 0 || p.stockCount > 0);
    
    return isCatMatch && isSearchMatch && isPriceMatch && isStockMatch;
  }).sort((a, b) => {
    const priceA = a.discountPrice || a.price || 0;
    const priceB = b.discountPrice || b.price || 0;
    
    if (sort === 'Price: Low to High') return priceA - priceB;
    if (sort === 'Price: High to Low') return priceB - priceA;
    if (sort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <>
      <div className="shop-shell">
        {/* ── HERO BAR ── */}
        <div className="shop-hero">
          <div className="shop-hero-content">
            <div className="hero-breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span>Shop</span>
            </div>
            <h1 className="shop-hero-title">Shop All <em>Furniture</em></h1>
            <p className="shop-hero-sub">
              {products.length} pieces of GI-certified Nilambur teak furniture
            </p>
          </div>
        </div>

        <div className="shop-layout">
          {/* ── SIDEBAR ── */}
          <aside className="sidebar">
            <div className="filter-section">
              <div className="filter-header">
                <span className="filter-title">Categories</span>
              </div>
              {categories.map(c => {
                const count = c === 'All' ? products.length : products.filter(p => (p.category?.name || p.cat || 'General') === c).length;
                if (c !== 'All' && count === 0) return null; // hide empty categories dynamically
                return (
                  <div key={c}
                    className={`cat-pill${activecat === c ? ' active' : ''}`}
                    onClick={() => setActiveCat(c)}>
                    <span className="cat-pill-name">{c}</span>
                    <span className="cat-pill-count">{count}</span>
                  </div>
                );
              })}
            </div>

            <div className="filter-section">
              <div className="filter-header"><span className="filter-title">Max Price</span></div>
              <div className="price-range-info">
                <span>₹0</span><span>₹{Number(maxPrice).toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="0" max="200000" step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="price-slider" />
            </div>

            <div className="filter-section">
              <div className="filter-header"><span className="filter-title">Availability</span></div>
              <label className="filter-check">
                <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} /> In Stock Only
              </label>
            </div>

            <button className="clear-filters-btn" onClick={() => { setActiveCat('All'); setSearch(''); setMaxPrice(200000); setInStockOnly(false); }}>
              Clear All Filters
            </button>
          </aside>

          {/* ── MAIN ── */}
          <div className="shop-main">
            {/* Toolbar */}
            <div className="toolbar">
              <span className="result-count">{filtered.length} results</span>
              <input
                className="shop-search"
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SORTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Product grid */}
            {loading ? (
               <div style={{ padding: "4rem", textAlign: "center", color: "#666" }}>Loading catalogue...</div>
            ) : filtered.length === 0 ? (
               <div style={{ padding: "4rem", textAlign: "center", color: "#666" }}>No products found matching your filters.</div>
            ) : (
                <div className="shop-grid">
                {filtered.map(p => (
                    <ProductCard key={p._id || p.id} product={p} />
                ))}
                </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  );
}
