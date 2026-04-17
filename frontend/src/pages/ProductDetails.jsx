import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getProductById, getRelatedProducts, getProductReviews, addProductReview, deleteProductReview } from "../services/productService";
import { addToCartThunk } from "../features/cart/cartSlice";
import { showToast } from "../components/layout/Toast";
import ProductCard from '../components/product/ProductCard';
import ProductSkeleton from '../components/ui/ProductSkeleton';
import SEOHead from '../components/SEOHead';
import '../styles/ProductDetailPage.css';


export default function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user: authUser } = useSelector((state) => state.auth);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeMedia, setActiveMedia] = useState(0);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [wished, setWished] = useState(false);

    // Zoom state
    const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

    // Review state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [ratings, setRatings] = useState({ average: 0, count: 0 });
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewHover, setReviewHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data.product || data);
                window.scrollTo(0, 0);
            } catch (err) {
                console.error("Error loading product", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const data = await getProductReviews(id);
                setReviews(data.reviews || []);
                setRatings(data.ratings || { average: 0, count: 0 });
                // Check if current user already reviewed
                const userId = authUser?._id || authUser?.id;
                if (userId) {
                    setHasReviewed((data.reviews || []).some(r => r.user === userId || r.user?._id === userId));
                }
            } catch (err) {
                console.error("Error loading reviews", err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const fetchRelated = async () => {
            try {
                // Fetch all products essentially
                const data = await getRelatedProducts('');
                let prds = Array.isArray(data) ? data : data.products || [];
                setRelatedProducts(prds.filter(p => p._id !== id).slice(0, 4));
            } catch (err) {
                console.error("Error loading related products", err);
            }
        };

        fetchRelated();
    }, [product, id]);

    if (loading) return <ProductSkeleton />;
    if (!product) return <div style={{padding: "8rem", textAlign: "center"}}><h2>Product not found</h2><Link to="/shop">Back to Shop</Link></div>;

    // derived images, videos mapping
    const imgs = product.images && product.images.length > 0 ? product.images : [
        product.img || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=85&auto=format&fit=crop'
    ];
    const vids = product.videos || [];
    const mediaArray = [...imgs.map(u => ({ type: 'image', url: u })), ...vids.map(u => ({ type: 'video', url: u }))];

    const currentMedia = mediaArray[activeMedia];

    const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 });
    const displayPrice = product.discountPrice ? priceFormat.format(product.discountPrice) : priceFormat.format(product.price);
    const displayOrig = product.discountPrice ? priceFormat.format(product.price) : null;
    
    let savePercent = 0;
    if (product.price && product.discountPrice && product.price > product.discountPrice) {
        savePercent = Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }

    const inStock = product.stock > 0 || product.inStock !== false;

    const handleMouseMove = (e) => {
        if (currentMedia.type === 'video') return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
    };

    const handleMouseLeave = () => {
        if (currentMedia.type === 'video') return;
        setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
    };

    const nextMedia = () => setActiveMedia((prev) => (prev + 1) % mediaArray.length);
    const prevMedia = () => setActiveMedia((prev) => prev === 0 ? mediaArray.length - 1 : prev - 1);

    const activeCatName = product.category?.name || product.cat || 'Furniture';

    // JSON-LD Product Schema
    const productJsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": imgs,
      "description": product.description || `Premium ${activeCatName.toLowerCase()} crafted from Nilambur teak.`,
      "sku": product.slug || product.sku || product._id,
      "brand": {
        "@type": "Brand",
        "name": "Canolli Furniture"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.canollifurniture.com/product/${id}`,
        "priceCurrency": "INR",
        "price": product.discountPrice ? product.discountPrice : product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }
    };

    if (ratings.count > 0 || product.ratings?.count > 0) {
      productJsonLd.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": ratings.average > 0 ? ratings.average : product.ratings.average,
        "reviewCount": ratings.count > 0 ? ratings.count : product.ratings.count
      };
    }

    return (
        <>
            <SEOHead 
                title={`${product.name} | Canolli Furniture`}
                description={product.description?.substring(0, 155) + "..." || `Buy ${product.name} crafted from solid Nilambur teak. Premium ${activeCatName.toLowerCase()} with lifetime warranty.`}
                url={`/product/${id}`}
                image={imgs[0]}
                type="product"
                jsonLd={productJsonLd}
            />
            <div className="product-shell">
                <nav className="breadcrumb-bar">
                    <Link to="/">Home</Link><span>/</span>
                    <Link to="/shop">Shop</Link><span>/</span>
                    <span className="current">{product.name}</span>
                </nav>

                <div className="product-section">
                    <div className="gallery-panel">
                        <div className="thumb-strip">
                            {mediaArray.map((m, i) => (
                                <div key={i} className={`thumb${activeMedia === i ? ' active' : ''}`} onClick={() => setActiveMedia(i)}>
                                    {m.type === 'video' ? (
                                        <div style={{width:'100%', height:'100%', background:'#000', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'12px'}}>▶</div>
                                    ) : (
                                        <img src={m.url} alt="" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="main-img-wrap"
                             onMouseMove={handleMouseMove}
                             onMouseLeave={handleMouseLeave}
                             style={{ overflow: 'hidden', cursor: currentMedia.type==='video' ? 'default' : 'zoom-in', position: 'relative' }}>
                            
                            {currentMedia.type === 'video' ? (
                                <video src={currentMedia.url} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <img src={currentMedia.url} alt={product.name} className="main-img" style={{ ...zoomStyle, transition: 'transform 0.1s ease-out', width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            
                            <button className="img-nav left" onClick={(e) => { e.stopPropagation(); prevMedia(); }} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>‹</button>
                            <button className="img-nav right" onClick={(e) => { e.stopPropagation(); nextMedia(); }} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.5rem', cursor: 'pointer', zIndex: 10 }}>›</button>

                            {product.badge && (
                                <div className="img-badge-tl">
                                    <span className="img-badge badge-sale">{product.badge}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-panel">
                        <div className="product-eyebrow">{activeCatName} · SKU: {product.slug?.toUpperCase() || product.sku || 'CAN-SF'}</div>
                        <div className="product-title-row">
                            <h1 className="product-title">{product.name}</h1>
                            <button className={`wish-btn${wished ? ' active' : ''}`} onClick={() => { setWished(!wished); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist!', '♡'); }}>♡</button>
                        </div>
                        <div className="product-rating-row">
                            <span className="p-stars">
                                {[1,2,3,4,5].map(s => (
                                    <span key={s} style={{ color: s <= Math.round(ratings.average || product.ratings?.average || 0) ? 'var(--sand)' : '#ddd' }}>★</span>
                                ))}
                            </span>
                            <span className="p-rating-val">{ratings.average > 0 ? ratings.average.toFixed(1) : (product.ratings?.average || '—')}</span>
                            <span className="p-review-count">({ratings.count ?? product.ratings?.count ?? 0} reviews)</span>
                        </div>

                        <div className="price-main">
                            <span className="price-curr">{displayPrice}</span>
                            {displayOrig && <span className="price-orig" style={{textDecoration: 'line-through', opacity: 0.6}}>{displayOrig}</span>}
                            {savePercent > 0 && <span className="price-save" style={{color: 'green', marginLeft: '12px'}}>Save {savePercent}%</span>}
                        </div>
                        <div className="price-sub">
                            <span>🚚</span> Free delivery · Assembly included
                        </div>

                        <div className="info-divider" />

                        {product.material && (
                           <>
                             <div className="option-label">Material</div>
                             <div style={{fontSize: '15px'}}>{product.material}</div>
                             <div className="info-divider" />
                           </>
                        )}

                        <div className="stock-row">
                            <span className={`stock-indicator${!inStock ? ' oos' : ''}`} style={!inStock ? {background: 'red'} : {}} />
                            <span className="stock-text">{inStock ? `In Stock · ${product.stock || 5} left` : 'Out of Stock'}</span>
                        </div>

                        <div className="option-label" style={{marginTop:'15px'}}>Quantity</div>
                        <div className="qty-row">
                            <div className="qty-ctrl">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!inStock}>−</button>
                                <span className="qty-num">{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} disabled={!inStock || qty >= (product.stock||5)}>+</button>
                            </div>
                        </div>

                        <div className="cta-row">
                            <button className="btn-add-cart" disabled={!inStock} onClick={async () => {
                                if (!isAuthenticated) {
                                    showToast("Please sign in to add items to cart", "🔒");
                                    navigate(`/login?redirect=/product/${id}`);
                                    return;
                                }
                                try {
                                    await dispatch(addToCartThunk({ productId: product._id, quantity: qty })).unwrap();
                                    showToast("Added to cart!", "🛒");
                                } catch (err) {
                                    showToast(err || "Could not add to cart", "❌");
                                }
                            }}>
                                <span>{inStock ? "Add to Cart" : "Out of Stock"}</span>
                            </button>
                            <button className="btn-buy-now" disabled={!inStock} onClick={async () => {
                                if (!isAuthenticated) {
                                    showToast("Please sign in to continue", "🔒");
                                    navigate(`/login?redirect=/checkout`);
                                    return;
                                }
                                try {
                                    await dispatch(addToCartThunk({ productId: product._id, quantity: qty })).unwrap();
                                    navigate("/checkout");
                                } catch (err) {
                                    showToast(err || "Could not add to cart", "❌");
                                }
                            }}>
                                <span>Buy Now →</span>
                            </button>
                        </div>

                        <div className="info-divider" />
                        <div className="delivery-row">
                            <span className="delivery-icon">📦</span>
                            <div>
                                <div className="delivery-title">Estimated Delivery</div>
                                <div className="delivery-date">Within 5-7 working days</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tabs-bar">
                    {['description', 'reviews', 'delivery'].map(t => (
                        <button key={t} className={`tab-btn${activeTab === t ? ' active' : ''}`} onClick={() => setActiveTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'reviews' ? ` (${ratings.count || 0})` : ''}
                        </button>
                    ))}
                </div>

                <div className="tab-content-wrap">
                    {activeTab === 'description' && (
                        <div className="desc-content">
                            <p className="desc-text">{product.description || "No description provided."}</p>
                            <ul className="spec-list">
                                {product.material && <li><span className="spec-key">Material</span><span className="spec-val">{product.material}</span></li>}
                                <li><span className="spec-key">Warranty</span><span className="spec-val">Lifetime Structural Warranty</span></li>
                                <li><span className="spec-key">Assembly</span><span className="spec-val">Free professional assembly included</span></li>
                            </ul>
                        </div>
                    )}
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            {/* Rating Summary */}
                            <div className="rating-summary">
                                <div className="rating-big">{ratings.average > 0 ? ratings.average.toFixed(1) : '—'}</div>
                                <div className="rating-stars-big">
                                    {[1,2,3,4,5].map(s => (
                                        <span key={s} style={{ color: s <= Math.round(ratings.average) ? 'var(--sand)' : '#ddd', fontSize: '1.5rem' }}>★</span>
                                    ))}
                                </div>
                                <div className="rating-count">{ratings.count || 0} review{ratings.count !== 1 ? 's' : ''}</div>
                            </div>

                            {/* Submit Form */}
                            {isAuthenticated && !hasReviewed && (
                                <div className="review-form">
                                    <h3 className="review-form-title">Write a Review</h3>
                                    <div className="star-picker">
                                        {[1,2,3,4,5].map(s => (
                                            <span
                                                key={s}
                                                className={`star-pick${(reviewHover || reviewRating) >= s ? ' active' : ''}`}
                                                onMouseEnter={() => setReviewHover(s)}
                                                onMouseLeave={() => setReviewHover(0)}
                                                onClick={() => setReviewRating(s)}
                                            >★</span>
                                        ))}
                                        <span className="star-pick-label">{['','Poor','Fair','Good','Great','Excellent'][reviewHover || reviewRating]}</span>
                                    </div>
                                    <textarea
                                        className="review-textarea"
                                        placeholder="Share your experience with this product..."
                                        value={reviewText}
                                        onChange={e => setReviewText(e.target.value)}
                                        rows={4}
                                    />
                                    <button
                                        className="review-submit-btn"
                                        disabled={submitting}
                                        onClick={async () => {
                                            if (!reviewText.trim()) { showToast('Please write a comment', '⚠️'); return; }
                                            setSubmitting(true);
                                            try {
                                                const res = await addProductReview(id, { rating: reviewRating, comment: reviewText });
                                                setRatings(res.ratings);
                                                // Refresh reviews
                                                const fresh = await getProductReviews(id);
                                                setReviews(fresh.reviews || []);
                                                setHasReviewed(true);
                                                setReviewText('');
                                                showToast('Review submitted!', '⭐');
                                            } catch (err) {
                                                showToast(err?.response?.data?.message || 'Could not submit review', '❌');
                                            } finally {
                                                setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {submitting ? 'Submitting…' : 'Submit Review'}
                                    </button>
                                </div>
                            )}
                            {isAuthenticated && hasReviewed && (
                                <div className="review-already">✓ You have reviewed this product</div>
                            )}
                            {!isAuthenticated && (
                                <div className="review-login-prompt">
                                    <Link to={`/login?redirect=/product/${id}`}>Sign in</Link> to write a review
                                </div>
                            )}

                            {/* Reviews List */}
                            {reviewsLoading ? (
                                <div className="reviews-loading">Loading reviews…</div>
                            ) : reviews.length === 0 ? (
                                <div className="reviews-empty">No reviews yet. Be the first to review this product!</div>
                            ) : (
                                reviews.map((r, i) => {
                                    const userId = authUser?._id || authUser?.id;
                                    const isOwn = userId && (r.user === userId || r.user?._id === userId);
                                    return (
                                        <div className="review-card" key={r._id || i}>
                                            <div className="reviewer-row">
                                                <div className="reviewer-avatar">{(r.name || 'U')[0].toUpperCase()}</div>
                                                <div>
                                                    <span className="reviewer-name">{r.name || 'Anonymous'}</span>
                                                    <span className="reviewer-date">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : ''}</span>
                                                </div>
                                                {isOwn && (
                                                    <button className="review-delete-btn" onClick={async () => {
                                                        try {
                                                            await deleteProductReview(id, r._id);
                                                            const fresh = await getProductReviews(id);
                                                            setReviews(fresh.reviews || []);
                                                            setRatings(fresh.ratings || { average: 0, count: 0 });
                                                            setHasReviewed(false);
                                                            showToast('Review deleted', '🗑️');
                                                        } catch (err) {
                                                            showToast('Could not delete review', '❌');
                                                        }
                                                    }}>Delete</button>
                                                )}
                                            </div>
                                            <div className="review-stars">
                                                {[1,2,3,4,5].map(s => (
                                                    <span key={s} style={{ color: s <= r.rating ? 'var(--sand)' : '#ddd' }}>★</span>
                                                ))}
                                            </div>
                                            <p className="review-text">{r.comment}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                    {activeTab === 'delivery' && (
                        <div className="delivery-content">
                            <div className="delivery-items">
                                {[['📦', 'Standard Delivery', 'Free · 5–7 working days'], ['🚀', 'Express Delivery', '₹599 · 2–3 working days'], ['🔨', 'Assembly', 'Free professional assembly']].map(([i, t, d]) => (
                                    <div className="del-item" key={t}><span>{i}</span><div><div className="del-title">{t}</div><div className="del-desc">{d}</div></div></div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
        </>
    );
}
