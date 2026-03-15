import { useState } from 'react';
import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
import { showToast } from '../components/layout/Toast';
import '../styles/Shop.css';

const PRODUCTS = [
  { id: 1, name: 'Royal Teak 3-Seater Sofa', cat: 'Sofas', price: '₹45,000', orig: '₹89,000', badge: 'Hot', stars: '★★★★★', reviews: 124, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 2, name: 'Heritage Teak King Bed', cat: 'Beds', price: '₹78,000', orig: '₹1,20,000', badge: 'Sale', stars: '★★★★★', reviews: 87, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 3, name: 'Nilambur Dining Set 6-Seater', cat: 'Dining', price: '₹62,000', orig: '₹95,000', badge: null, stars: '★★★★☆', reviews: 56, img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 4, name: 'Sliding 3-Door Wardrobe', cat: 'Wardrobes', price: '₹42,000', orig: '₹68,000', badge: 'New', stars: '★★★★★', reviews: 33, img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 5, name: 'Antique Sheesham Bookshelf', cat: 'Tables', price: '₹18,500', orig: '₹28,000', badge: null, stars: '★★★★☆', reviews: 41, img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&q=75&auto=format&fit=crop', inStock: false },
  { id: 6, name: 'Teak Console Table', cat: 'Tables', price: '₹22,000', orig: '₹35,000', badge: null, stars: '★★★★★', reviews: 19, img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 7, name: 'Teak L-Shaped Sofa', cat: 'Sofas', price: '₹85,000', orig: '₹1,40,000', badge: 'Sale', stars: '★★★★☆', reviews: 28, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=75&auto=format&fit=crop', inStock: true },
  { id: 8, name: 'Rosewood Coffee Table', cat: 'Tables', price: '₹12,000', orig: '₹18,500', badge: null, stars: '★★★★☆', reviews: 65, img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&q=75&auto=format&fit=crop', inStock: true },
];

const CATS = ['All', 'Sofas', 'Beds', 'Dining', 'Wardrobes', 'Tables'];
const SORTS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'];

export default function ShopPage() {
  const [activecat, setActiveCat] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p =>
    (activecat === 'All' || p.cat === activecat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* <Navbar /> */}
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
              {PRODUCTS.length} pieces of GI-certified Nilambur teak furniture
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
              {CATS.map(c => (
                <div key={c}
                  className={`cat-pill${activecat === c ? ' active' : ''}`}
                  onClick={() => setActiveCat(c)}>
                  <span className="cat-pill-name">{c}</span>
                  <span className="cat-pill-count">{c === 'All' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c).length}</span>
                </div>
              ))}
            </div>

            <div className="filter-section">
              <div className="filter-header"><span className="filter-title">Price Range</span></div>
              <div className="price-range-info">
                <span>₹0</span><span>₹2,00,000</span>
              </div>
              <input type="range" min="0" max="200000" defaultValue="200000" className="price-slider" />
            </div>

            <div className="filter-section">
              <div className="filter-header"><span className="filter-title">Availability</span></div>
              <label className="filter-check">
                <input type="checkbox" defaultChecked /> In Stock Only
              </label>
            </div>

            <button className="clear-filters-btn" onClick={() => { setActiveCat('All'); setSearch(''); }}>
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
            <div className="shop-grid">
              {filtered.map(p => (
                <div className="prod-card" key={p.id}>
                  {p.badge && <div className={`prod-badge badge-${p.badge.toLowerCase()}`}>{p.badge}</div>}
                  {!p.inStock && <div className="prod-badge badge-oos">Out of Stock</div>}
                  <div className="prod-img-wrap">
                    <img src={p.img} alt={p.name} loading="lazy" />
                    <div className="prod-img-overlay" />
                    <button className="btn-quick-wish" onClick={() => showToast('Added to wishlist!', '♡')}>♡</button>
                  </div>
                  <div className="prod-info">
                    <div className="prod-cat">{p.cat}</div>
                    <Link to={`/product/${p.id}`} className="prod-name">{p.name}</Link>
                    <div className="prod-stars-row">
                      <span className="prod-stars">{p.stars}</span>
                      <span className="prod-reviews">({p.reviews})</span>
                    </div>
                    <div className="prod-bottom">
                      <div>
                        <span className="prod-price">{p.price}</span>
                        <span className="prod-price-orig">{p.orig}</span>
                      </div>
                      {p.inStock
                        ? <button className="prod-add-btn" onClick={() => showToast('Added to cart!', '🛒')}>+</button>
                        : <span className="oos-label">Sold Out</span>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}
