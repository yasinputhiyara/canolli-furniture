import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { showToast } from '../components/layout/Toast';
import '../styles/Home.css';
import ProductCard from '../components/product/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES as STATIC_CATEGORIES } from '../constants/categories';
import { getAllProducts, getAllCategories } from '../services/productService';
import SEOHead from '../components/SEOHead';
import { getPublicTestimonials } from '../services/testimonialService';
import { getPublicFaqs } from '../services/faqService';
import '../styles/Testimonials.css';
import '../styles/Faq.css';

const PRODUCTS = [
  { id: 1, name: 'Royal Teak 3-Seater Sofa', cat: 'Sofas', price: '₹45,000', orig: '₹89,000', badge: 'Hot', stars: '★★★★★', reviews: 124, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=75&auto=format&fit=crop' },
  { id: 2, name: 'Heritage Teak King Bed', cat: 'Beds', price: '₹78,000', orig: '₹1,20,000', badge: 'Sale', stars: '★★★★★', reviews: 87, img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=75&auto=format&fit=crop' },
  { id: 3, name: 'Nilambur Dining Set 6S', cat: 'Dining', price: '₹62,000', orig: '₹95,000', badge: null, stars: '★★★★☆', reviews: 56, img: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=400&q=75&auto=format&fit=crop' },
  { id: 4, name: 'Sliding 3-Door Wardrobe', cat: 'Wardrobes', price: '₹42,000', orig: '₹68,000', badge: 'New', stars: '★★★★★', reviews: 33, img: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&q=75&auto=format&fit=crop' },
];

const TICKER_ITEMS = ['GI Certified Nilambur Teak', 'Lifetime Warranty', '50,000+ Happy Customers', 'Free Delivery Above ₹10,000', 'Cash on Delivery Available', 'Expert Assembly Service', 'Eco-Responsible Sourcing'];

export default function HomePage() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [catActiveIndex, setCatActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const catTrackRef = useRef(null);

  const handleTestimonialScroll = () => {
    if (!trackRef.current) return;
    const scrollPos = trackRef.current.scrollLeft;
    const cardWidth = trackRef.current.children[0]?.offsetWidth || 350;
    const gap = 24;
    const index = Math.round(scrollPos / (cardWidth + gap));
    setActiveTestimonial(index);
  };

  const scrollToTestimonial = (index) => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.children[0]?.offsetWidth || 350;
    const gap = 24;
    trackRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
    setActiveTestimonial(index);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const fetchedProducts = Array.isArray(data) ? data : data.products || [];
        setProducts(fetchedProducts.length > 0 ? fetchedProducts : PRODUCTS);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data?.length > 0 ? data : STATIC_CATEGORIES);
      } catch (error) {
        setCategories(STATIC_CATEGORIES);
      }
    };

    fetchProducts();
    fetchCats();
    getPublicTestimonials().then(data => setTestimonials(data || [])).catch(() => {});
    getPublicFaqs().then(data => setFaqs(data || [])).catch(() => {});
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <SEOHead
        title="Canolli Furniture | Premium Nilambur Teak Furniture – Kerala"
        description="Shop GI-certified Nilambur teak furniture handcrafted by master artisans in Kerala. Sofas, beds, dining sets, wardrobes & more. Free delivery & lifetime warranty."
        url="/"
        keywords="teak furniture, Nilambur teak, Kerala furniture, wooden sofa, teak bed, dining table, wardrobe"
      />

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

      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="ticker-item"><span className="ticker-dot">✦</span>{t}</span>
          ))}
        </div>
      </div>

      {/* ── COLLECTIONS (circular carousel) ── */}
      <section className="cat-carousel-section">
        <div className="cat-carousel-inner">
          <div className="cat-carousel-header">
            <div>
              <h2 className="cat-carousel-title">Our Collections</h2>
              <p className="cat-carousel-sub">Each collection is built in our workshop — solid wood, traditional joints, no shortcuts.</p>
            </div>
            <Link to="/shop" className="cat-view-more">View All →</Link>
          </div>

          <div
            className="cat-carousel-track"
            ref={catTrackRef}
            onScroll={() => {
              if (!catTrackRef.current) return;
              const el = catTrackRef.current;
              const itemW = (el.children[0]?.offsetWidth || 160) + 32;
              setCatActiveIndex(Math.round(el.scrollLeft / itemW));
            }}
          >
            {categories.map((c, i) => (
              <Link
                to={`/shop?category=${encodeURIComponent(c.name)}`}
                className="cat-circle-item"
                key={i}
              >
                <div className="cat-circle-img-wrap">
                  <img
                    src={c.bannerImage || c.img || `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=75&auto=format&fit=crop`}
                    alt={c.name}
                    loading="lazy"
                  />
                </div>
                <span className="cat-circle-name">{c.name}</span>
              </Link>
            ))}
          </div>

          <div className="cat-carousel-dots">
            {Array.from({ length: Math.max(1, categories.length - 3) }).map((_, i) => (
              <button
                key={i}
                className={`cat-dot ${i === catActiveIndex ? 'active' : ''}`}
                onClick={() => {
                  if (!catTrackRef.current) return;
                  const el = catTrackRef.current;
                  const itemW = (el.children[0]?.offsetWidth || 160) + 32;
                  el.scrollTo({ left: i * itemW, behavior: 'smooth' });
                  setCatActiveIndex(i);
                }}
                aria-label={`Go to collection ${i + 1}`}
              />
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
            {products.map(p => (
              <ProductCard product={p} key={p.id} />
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

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="testimonials-header">
            <div className="testimonials-eyebrow">Our Valuable Customers</div>
            <h2 className="testimonials-title">What They <em>Say About Us</em></h2>
            <p className="testimonials-subtitle">
              Real words from real homeowners across India who chose Canolli for their forever furniture.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="testimonials-empty">
              <div className="testimonials-empty-icon">💬</div>
              <p>Customer stories coming soon…</p>
            </div>
          ) : (
            <>
              <div className="testimonials-track" ref={trackRef} onScroll={handleTestimonialScroll}>
                {testimonials.map(t => (
                  <div className="testimonial-card" key={t._id}>
                    <span className="testimonial-quote-icon">"</span>
                    <div className="testimonial-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`testimonial-star ${s <= t.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                    <p className="testimonial-text">"{t.description}"</p>
                    <div className="testimonial-customer">
                      {t.photo ? (
                        <img src={t.photo} alt={t.name} className="testimonial-avatar" />
                      ) : (
                        <div className="testimonial-avatar-placeholder">
                          {t.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="testimonial-info">
                        <div className="testimonial-name">{t.name}</div>
                        {t.location && <div className="testimonial-location">📍 {t.location}</div>}
                      </div>
                      <div className="testimonial-verified">✓ Verified</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="testimonials-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                    onClick={() => scrollToTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <div className="testimonials-summary">
                <div className="tsum-item">
                  <div className="tsum-num">{(testimonials.reduce((a, t) => a + t.rating, 0) / testimonials.length).toFixed(1)}</div>
                  <div className="tsum-label">Average Rating</div>
                </div>
                <div className="tsum-divider" />
                {/* <div className="tsum-item">
                  <div className="tsum-num">{testimonials.length}+</div>
                  <div className="tsum-label">Happy Reviews</div>
                </div> */}
                <div className="tsum-divider" />
                <div className="tsum-item">
                  <div className="tsum-num">50K+</div>
                  <div className="tsum-label">Customers Served</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="faq-section">
        <div className="faq-inner">
          <div className="faq-header">
            <span className="faq-eyebrow">Ordering Guide</span>
            <h2 className="faq-title">Everything you need to know <em>before ordering</em></h2>
          </div>

          <div className="faq-list">
            {faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div 
                  key={faq._id} 
                  className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                >
                  <button 
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <div className="faq-icon"></div>
                  </button>
                  <div className="faq-answer-wrap">
                    <div className="faq-answer">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="faq-footer-text">FAQs coming soon...</div>
            )}
          </div>

          <div className="faq-footer">
            <p className="faq-footer-text">Still have questions? We're here to help you build your dream home.</p>
            <Link to="/about" className="faq-contact-btn">
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </section>

      {/* <Footer /> */}


    </>
  );
}
