import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { showToast } from '../components/layout/Toast';
import './Home.css';

const CATEGORIES = [
  { name: 'Sofas & Seating', count: '48 pieces', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80&auto=format&fit=crop', span: true },
  { name: 'Beds & Storage', count: '32 pieces', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80&auto=format&fit=crop' },
  { name: 'Dining Sets', count: '24 pieces', img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=800&q=80&auto=format&fit=crop' },
  { name: 'Wardrobes', count: '19 pieces', img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80&auto=format&fit=crop' },
];

const PRODUCTS = [
  { id: 1, name: 'Royal Teak 3-Seater Sofa', cat: 'Sofas', price: '₹45,000', orig: '₹89,000', badge: 'Hot', stars: '★★★★★', reviews: 124, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop' },
  { id: 2, name: 'Heritage Teak King Bed', cat: 'Beds', price: '₹78,000', orig: '₹1,20,000', badge: 'Sale', stars: '★★★★★', reviews: 87, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=75&auto=format&fit=crop' },
  { id: 3, name: 'Nilambur Dining Set 6S', cat: 'Dining', price: '₹62,000', orig: '₹95,000', badge: null, stars: '★★★★☆', reviews: 56, img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400&q=75&auto=format&fit=crop' },
  { id: 4, name: 'Sliding 3-Door Wardrobe', cat: 'Wardrobes', price: '₹42,000', orig: '₹68,000', badge: 'New', stars: '★★★★★', reviews: 33, img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=75&auto=format&fit=crop' },
];

const TICKER_ITEMS = ['GI Certified Nilambur Teak', 'Lifetime Warranty', '50,000+ Happy Customers', 'Free Delivery Above ₹10,000', 'Cash on Delivery Available', 'Expert Assembly Service', 'Eco-Responsible Sourcing'];

export default function HomePage() {
  return (
    <>
      {/* <Navbar dark /> */}

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content au">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            Est. 2010 · Nilambur, Kerala
          </div>
          <h1 className="hero-h1">
            Furniture that<br />
            <em className="italic-gold">lasts</em> a<br />
            <span className="underlined">lifetime.</span>
          </h1>
          <p className="hero-tagline">
            Premium teak wood furniture, directly from the forest capital of India.
            Crafted by master artisans, delivered to your doorstep.
          </p>
          <div className="hero-btns">
            <Link to="/shop" className="btn-primary"><span>Explore Collection →</span></Link>
            <a href="https://wa.me/919400000000" className="btn-wa-hero" target="_blank" rel="noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg>
              WhatsApp Us
            </a>
          </div>
          <div className="hero-kpi">
            {[['100K+', 'Followers'], ['50K+', 'Customers'], ['15+', 'Years']].map(([n, l]) => (
              <div className="kpi-item" key={l}>
                <div className="kpi-num">{n}</div>
                <div className="kpi-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-float-card">
          <div className="hfc-label">Featured Piece</div>
          <div className="hfc-name">Royal Teak 3-Seater Sofa Set</div>
          <div className="hfc-row">
            <span className="hfc-price">₹45,000</span>
            <span className="hfc-orig">₹89,000</span>
            <span className="hfc-badge">49% off</span>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="ticker-item"><span className="ticker-dot">✦</span>{t}</span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="sec-eyebrow">Our Collections</div>
          <h2 className="sec-title" style={{ marginBottom: '2rem' }}>Shop by <em>Category</em></h2>
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <Link to="/shop" className={`cat-card${c.span ? ' cat-span' : ''}`} key={i}>
                <img src={c.img} alt={c.name} className="cat-img" loading="lazy" />
                <div className="cat-vignette" />
                <div className="cat-content">
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-count">{c.count}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section" style={{ background: 'white' }}>
        <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div className="sec-eyebrow">Bestsellers</div>
          <h2 className="sec-title" style={{ marginBottom: '2rem' }}>Most <em>Loved</em> Pieces</h2>
          <div className="prod-grid">
            {PRODUCTS.map(p => (
              <div className="prod-card" key={p.id}>
                {p.badge && <div className={`prod-badge badge-${p.badge.toLowerCase()}`}>{p.badge}</div>}
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
                    <button className="prod-add-btn" onClick={() => showToast('Added to cart!', '🛒')}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/shop" className="btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* ── WHY CANOLLI ── */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-text">
            <div className="sec-eyebrow">Why Canolli</div>
            <h2 className="sec-title">Where Forest Meets <em>Craft</em></h2>
            <p className="why-body">
              Nilambur, Kerala — the teak capital of the world. Our furniture starts life
              as a GI-certified Nilambur teak tree, sustainably harvested and seasoned for
              years before a master craftsman touches it. The result is furniture that
              appreciates in value, not depreciates.
            </p>
            <div className="why-features">
              {[['🌳', 'GI Certified Teak', 'Sourced directly from Nilambur forest estates.'],
              ['🔨', 'Master Craftsmen', '3rd generation artisans with 30+ years of experience.'],
              ['🚚', 'Free Delivery', 'Free delivery and professional assembly pan-India.'],
              ['🛡', 'Lifetime Warranty', 'Every piece covered by our no-questions warranty.']
              ].map(([i, t, d]) => (
                <div className="why-feat" key={t}>
                  <span className="why-feat-icon">{i}</span>
                  <div>
                    <div className="why-feat-title">{t}</div>
                    <div className="why-feat-desc">{d}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-primary"><span>Our Full Story →</span></Link>
          </div>
          <div className="why-img-wrap">
            <img src="https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=900&q=80&auto=format&fit=crop" alt="Craftsman" />
          </div>
        </div>
      </section>

      {/* <Footer /> */}

      <a href="https://wa.me/919400000000" className="wa-fab" title="WhatsApp" target="_blank" rel="noreferrer">
        <svg width="21" height="21" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.559 4.118 1.531 5.848L0 24l6.343-1.512A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.021-1.38l-.36-.213-3.767.899.951-3.657-.235-.377A9.818 9.818 0 0112 2.182c5.427 0 9.818 4.391 9.818 9.818s-4.391 9.818-9.818 9.818z" /></svg>
      </a>
    </>
  );
}
