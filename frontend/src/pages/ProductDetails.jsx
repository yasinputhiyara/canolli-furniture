import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getProductById, getRelatedProducts } from "../services/productService";
import { addToCart } from "../features/cart/cartSlice";
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import '../styles/ProductDetailPage.css';

const REVIEWS = [
    { name: 'Arjun Menon', date: 'Jan 2025', rating: '★★★★★', text: 'Absolutely stunning quality. The teak is rich, heavy, and polished to perfection. Delivered and assembled in Malappuram within 5 days.', verified: true },
    { name: 'Priya Nair', date: 'Dec 2024', rating: '★★★★★', text: 'Worth every rupee. We were worried about online furniture but Canolli exceeded expectations. Customer service was also excellent.', verified: true },
    { name: 'Rahul Sharma', date: 'Nov 2024', rating: '★★★★☆', text: 'Beautiful piece, slight delay in delivery but quality is top notch. Would definitely recommend to anyone looking for real teak furniture.', verified: false },
];

export default function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeImg, setActiveImg] = useState(0);
    const [activeColor, setActiveColor] = useState(0);
    const [activeSize, setActiveSize] = useState(1);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wished, setWished] = useState(false);

    // Zoom and Review state
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data.product);
            } catch (err) {
                console.error("Error loading product", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const fetchRelated = async () => {
            try {
                // Ensure we use the correct category field
                const category = product.category || product.cat;
                if (!category) return;
                const data = await getRelatedProducts(category);
                setRelatedProducts(data.products.filter(p => p._id !== id).slice(0, 4));
            } catch (err) {
                console.error("Error loading related products", err);
            }
        };

        fetchRelated();
    }, [product, id]);

    if (loading) return <ProductSkeleton />;
    if (!product) return <p>Product not found</p>;

    // derived images, colors, sizes arrays to avoid crashing if backend doesn't have them
    const imgs = product.images || product.imgs || [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop'
    ];
    const colors = product.colors || [{ label: 'Natural Teak', hex: '#8B5E3C' }, { label: 'Dark Walnut', hex: '#3B1F0E' }, { label: 'Honey Oak', hex: '#C8916A' }];
    const sizes = product.sizes || ['2-Seater', '3-Seater', '5-Seater Set'];

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: 'scale(2)'
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
    };

    const nextImage = () => {
        setActiveImg((prev) => (prev + 1) % imgs.length);
    };

    const prevImage = () => {
        setActiveImg((prev) =>
            prev === 0 ? imgs.length - 1 : prev - 1
        );
    };

    return (
        <>
            {/* <Navbar /> */}
            <div className="product-shell">
                {/* Breadcrumb */}
                <nav className="breadcrumb-bar">
                    <Link to="/">Home</Link><span>/</span>
                    <Link to="/shop">Shop</Link><span>/</span>
                    <span className="current">{product.name}</span>
                </nav>

                {/* Main section */}
                <div className="product-section">
                    {/* LEFT: Gallery */}
                    <div className="gallery-panel">
                        <div className="thumb-strip">
                            {imgs.map((img, i) => (
                                <div key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                                    <img src={img} alt="" />
                                </div>
                            ))}
                        </div>
                        <div className="main-img-wrap"
                             onMouseMove={handleMouseMove}
                             onMouseLeave={handleMouseLeave}
                             style={{ overflow: 'hidden', cursor: 'zoom-in', position: 'relative' }}>
                            <img src={imgs[activeImg]} alt={product.name} className="main-img" style={{ ...zoomStyle, transition: 'transform 0.1s ease-out', width: '100%', height: '100%', objectFit: 'cover' }} />
                            
                            <button className="img-nav left" onClick={(e) => { e.stopPropagation(); prevImage(); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>‹</button>
                            <button className="img-nav right" onClick={(e) => { e.stopPropagation(); nextImage(); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>›</button>

                            <div className="img-badge-tl">
                                <span className="img-badge badge-sale">Sale</span>
                                <span className="img-badge" style={{ background: 'rgba(184,136,60,.2)', color: 'var(--gold-lt)', border: '1px solid rgba(184,136,60,.35)' }}>GI Certified</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Info */}
                    <div className="info-panel">
                        <div className="product-eyebrow">{product.cat || product.category || 'Sofas & Seating'} · SKU: {product.sku || 'CAN-SF-RT3S'}</div>
                        <div className="product-title-row">
                            <h1 className="product-title">{product.name}</h1>
                            <button className={`wish-btn${wished ? ' active' : ''}`} onClick={() => { setWished(!wished); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist!', '♡'); }}>♡</button>
                        </div>
                        <div className="product-rating-row">
                            <span className="p-stars">{'★'.repeat(Math.floor(product.rating || 5))}{'☆'.repeat(5 - Math.floor(product.rating || 5))}</span>
                            <span className="p-rating-val">{product.rating || 4.8}</span>
                            <span className="p-review-count">({product.reviews || 124} reviews)</span>
                        </div>

                        <div className="price-main">
                            <span className="price-curr">₹{product.price}</span>
                            <span className="price-orig">{product.orig || `₹${product.price * 2 || 89000}`}</span>
                            <span className="price-save">Save {product.save || '50%'}</span>
                        </div>
                        <div className="price-sub">
                            <span>🚚</span> Free delivery · Assembly included
                        </div>

                        <div className="info-divider" />

                        {/* Color */}
                        <div className="option-label">Finish: <strong>{colors[activeColor]?.label}</strong></div>
                        <div className="swatch-row">
                            {colors.map((c, i) => (
                                <div key={i} className={`swatch${activeColor === i ? ' active' : ''}`}
                                    style={{ background: c.hex }} title={c.label}
                                    onClick={() => setActiveColor(i)} />
                            ))}
                        </div>

                        {/* Size */}
                        <div className="option-label" style={{ marginTop: '1.2rem' }}>Configuration</div>
                        <div className="size-btns">
                            {sizes.map((s, i) => (
                                <button key={i} className={`size-btn${activeSize === i ? ' active' : ''}`} onClick={() => setActiveSize(i)}>{s}</button>
                            ))}
                        </div>

                        <div className="info-divider" />

                        {/* Stock */}
                        <div className="stock-row">
                            <span className="stock-indicator" />
                            <span className="stock-text">In Stock · Only {product.stockCount || product.stock || 5} left</span>
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
                            <button className="btn-add-cart" onClick={() => {
                                dispatch(addToCart({
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images?.[0],
                                    quantity: qty
                                }));
                                showToast("Added to cart!", "🛒");
                            }}>
                                <span>Add to Cart</span>
                            </button>
                            <button className="btn-buy-now" onClick={() => {
                                dispatch(addToCart({
                                    id: product._id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.images?.[0],
                                    quantity: qty
                                }));
                                navigate("/checkout");
                            }}>
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
                            {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'reviews' ? ` (${product.reviews || 124})` : ''}
                        </button>
                    ))}
                </div>

                <div className="tab-content-wrap">
                    {activeTab === 'description' && (
                        <div className="desc-content">
                            <p className="desc-text">{product.description}</p>
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
                                <div className="big-rating">{product.rating || 4.8}</div>
                                <div>
                                    <div className="p-stars" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>★★★★★</div>
                                    <div style={{ fontSize: '.75rem', color: 'var(--sand)', marginTop: '.3rem' }}>{product.reviews || 124} reviews</div>
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

                            {/* Write Review Form */}
                            <div className="write-review-section" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Write a Review</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!reviewText.trim()) return showToast("Please write something", "⚠️");
                                    showToast("Review submitted successfully", "✅");
                                    setReviewText('');
                                    setReviewRating(5);
                                }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
                                        <select 
                                            value={reviewRating} 
                                            onChange={e => setReviewRating(Number(e.target.value))}
                                            style={{ padding: '0.5rem', width: '100px', borderRadius: '4px', border: '1px solid #ccc' }}
                                        >
                                            <option value={5}>5 Stars</option>
                                            <option value={4}>4 Stars</option>
                                            <option value={3}>3 Stars</option>
                                            <option value={2}>2 Stars</option>
                                            <option value={1}>1 Star</option>
                                        </select>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Review Summary</label>
                                        <textarea 
                                            value={reviewText}
                                            onChange={e => setReviewText(e.target.value)}
                                            rows="4" 
                                            placeholder="What did you like or dislike?"
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', fontFamily: 'inherit' }}
                                        />
                                    </div>
                                    <button type="submit" style={{ background: 'var(--brand-dark)', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                                        Submit Review
                                    </button>
                                </form>
                            </div>
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

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="related-products-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}>You Might Also Like</h2>
                        <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                            {relatedProducts.map(p => (
                                <ProductCard product={p} key={p._id || p.id} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* <Footer /> */}
        </>
    );
}
