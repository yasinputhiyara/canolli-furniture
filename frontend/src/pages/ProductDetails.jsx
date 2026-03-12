import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showToast } from '../components/layout/Toast';
import './ProductDetailPage.css';

const PRODUCT = {
    name: 'Royal Teak 3-Seater Sofa Set',
    cat: 'Sofas & Seating',
    price: '₹45,000', orig: '₹89,000', save: '₹44,000', pct: '49%',
    rating: 4.8, reviews: 124,
    sku: 'CAN-SF-RT3S',
    inStock: true, stockCount: 5,
    description: 'Hand-crafted from GI-certified Nilambur teak, this 3-seater sofa set brings the warmth of Kerala\'s forest directly into your living space. Each joint is hand-fitted, each surface hand-polished to a mirror finish.',
    imgs: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85&auto=format&fit=crop',
    ],
    colors: [{ label: 'Natural Teak', hex: '#8B5E3C' }, { label: 'Dark Walnut', hex: '#3B1F0E' }, { label: 'Honey Oak', hex: '#C8916A' }],
    sizes: ['2-Seater', '3-Seater', '5-Seater Set'],
};

const REVIEWS = [
    { name: 'Arjun Menon', date: 'Jan 2025', rating: '★★★★★', text: 'Absolutely stunning quality. The teak is rich, heavy, and polished to perfection. Delivered and assembled in Malappuram within 5 days.', verified: true },
    { name: 'Priya Nair', date: 'Dec 2024', rating: '★★★★★', text: 'Worth every rupee. We were worried about online furniture but Canolli exceeded expectations. Customer service was also excellent.', verified: true },
    { name: 'Rahul Sharma', date: 'Nov 2024', rating: '★★★★☆', text: 'Beautiful piece, slight delay in delivery but quality is top notch. Would definitely recommend to anyone looking for real teak furniture.', verified: false },
];

export default function ProductDetails() {
    const [activeImg, setActiveImg] = useState(0);
    const [activeColor, setActiveColor] = useState(0);
    const [activeSize, setActiveSize] = useState(1);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wished, setWished] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* <Navbar /> */}
            <div className="product-shell">
                {/* Breadcrumb */}
                <nav className="breadcrumb-bar">
                    <Link to="/">Home</Link><span>/</span>
                    <Link to="/shop">Shop</Link><span>/</span>
                    <span className="current">{PRODUCT.name}</span>
                </nav>

                {/* Main section */}
                <div className="product-section">
                    {/* LEFT: Gallery */}
                    <div className="gallery-panel">
                        <div className="thumb-strip">
                            {PRODUCT.imgs.map((img, i) => (
                                <div key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                                    <img src={img} alt="" />
                                </div>
                            ))}
                        </div>
                        <div className="main-img-wrap">
                            <img src={PRODUCT.imgs[activeImg]} alt={PRODUCT.name} className="main-img" />
                            <div className="img-badge-tl">
                                <span className="img-badge badge-sale">Sale</span>
                                <span className="img-badge" style={{ background: 'rgba(184,136,60,.2)', color: 'var(--gold-lt)', border: '1px solid rgba(184,136,60,.35)' }}>GI Certified</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Info */}
                    <div className="info-panel">
                        <div className="product-eyebrow">{PRODUCT.cat} · SKU: {PRODUCT.sku}</div>
                        <div className="product-title-row">
                            <h1 className="product-title">{PRODUCT.name}</h1>
                            <button className={`wish-btn${wished ? ' active' : ''}`} onClick={() => { setWished(!wished); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist!', '♡'); }}>♡</button>
                        </div>
                        <div className="product-rating-row">
                            <span className="p-stars">{'★'.repeat(Math.floor(PRODUCT.rating))}{'☆'.repeat(5 - Math.floor(PRODUCT.rating))}</span>
                            <span className="p-rating-val">{PRODUCT.rating}</span>
                            <span className="p-review-count">({PRODUCT.reviews} reviews)</span>
                        </div>

                        <div className="price-main">
                            <span className="price-curr">{PRODUCT.price}</span>
                            <span className="price-orig">{PRODUCT.orig}</span>
                            <span className="price-save">Save {PRODUCT.save} ({PRODUCT.pct} off)</span>
                        </div>
                        <div className="price-sub">
                            <span>🚚</span> Free delivery · Assembly included
                        </div>

                        <div className="info-divider" />

                        {/* Color */}
                        <div className="option-label">Finish: <strong>{PRODUCT.colors[activeColor].label}</strong></div>
                        <div className="swatch-row">
                            {PRODUCT.colors.map((c, i) => (
                                <div key={i} className={`swatch${activeColor === i ? ' active' : ''}`}
                                    style={{ background: c.hex }} title={c.label}
                                    onClick={() => setActiveColor(i)} />
                            ))}
                        </div>

                        {/* Size */}
                        <div className="option-label" style={{ marginTop: '1.2rem' }}>Configuration</div>
                        <div className="size-btns">
                            {PRODUCT.sizes.map((s, i) => (
                                <button key={i} className={`size-btn${activeSize === i ? ' active' : ''}`} onClick={() => setActiveSize(i)}>{s}</button>
                            ))}
                        </div>

                        <div className="info-divider" />

                        {/* Stock */}
                        <div className="stock-row">
                            <span className="stock-indicator" />
                            <span className="stock-text">In Stock · Only {PRODUCT.stockCount} left</span>
                        </div>

                        {/* Qty */}
                        <div className="option-label">Quantity</div>
                        <div className="qty-row">
                            <div className="qty-ctrl">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                                <span className="qty-num">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}>+</button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="cta-row">
                            <button className="btn-add-cart" onClick={() => { showToast('Added to cart!', '🛒'); }}>
                                <span>Add to Cart</span>
                            </button>
                            <button className="btn-buy-now" onClick={() => navigate('/checkout')}>
                                <span>Buy Now →</span>
                            </button>
                        </div>

                        <div className="info-divider" />
                        <div className="delivery-row">
                            <span className="delivery-icon">📦</span>
                            <div>
                                <div className="delivery-title">Estimated Delivery</div>
                                <div className="delivery-date">Mon–Wed, Mar 10–12 · Free</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-bar">
                    {['description', 'reviews', 'delivery'].map(t => (
                        <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'reviews' ? ` (${PRODUCT.reviews})` : ''}
                        </button>
                    ))}
                </div>

                <div className="tab-content-wrap">
                    {activeTab === 'description' && (
                        <div className="desc-content">
                            <p className="desc-text">{PRODUCT.description}</p>
                            <ul className="spec-list">
                                {[['Material', 'GI Certified Nilambur Teak'], ['Finish', 'Hand-polished Natural'], ['Dimensions', '210 × 85 × 90 cm'], ['Weight', '48 kg'], ['Warranty', 'Lifetime Structural Warranty'], ['Assembly', 'Free professional assembly included']].map(([k, v]) => (
                                    <li key={k}><span className="spec-key">{k}</span><span className="spec-val">{v}</span></li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            <div className="rating-overview">
                                <div className="big-rating">{PRODUCT.rating}</div>
                                <div>
                                    <div className="p-stars" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>★★★★★</div>
                                    <div style={{ fontSize: '.75rem', color: 'var(--sand)', marginTop: '.3rem' }}>{PRODUCT.reviews} reviews</div>
                                </div>
                            </div>
                            {REVIEWS.map((r, i) => (
                                <div className="review-card" key={i}>
                                    <div className="reviewer-row">
                                        <span className="reviewer-name">{r.name}</span>
                                        <span className="reviewer-date">{r.date}</span>
                                        {r.verified && <span className="reviewer-verified">✓ Verified</span>}
                                    </div>
                                    <div style={{ color: 'var(--gold)', fontSize: '.75rem', margin: '.3rem 0' }}>{r.rating}</div>
                                    <p className="review-text">{r.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'delivery' && (
                        <div className="delivery-content">
                            <div className="delivery-items">
                                {[['📦', 'Standard Delivery', 'Free · 5–7 working days'], ['🚀', 'Express Delivery', '₹599 · 2–3 working days'], ['🔨', 'Assembly', 'Free professional assembly'], ['↩', 'Returns', '30-day hassle-free returns']].map(([i, t, d]) => (
                                    <div className="del-item" key={t}><span>{i}</span><div><div className="del-title">{t}</div><div className="del-desc">{d}</div></div></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* <Footer /> */}
        </>
    );
}
