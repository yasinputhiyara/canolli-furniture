import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCartThunk } from "../../features/cart/cartSlice";
import { showToast } from "../layout/Toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const imgSrc = product.images && product.images.length > 0 ? product.images[0] : product.img;
  const catName = product.category?.name || product.cat || 'General';
  const name = product.name || 'Untitled';
  
  const inStock = product.stock > 0 || product.inStock !== false;
  
  // Format price
  const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 });
  const displayPrice = product.discountPrice ? priceFormat.format(product.discountPrice) : priceFormat.format(product.price);
  const displayOrig = product.discountPrice ? priceFormat.format(product.price) : (product.orig ? product.orig : null);

  const pid = product?._id || product?.id;
  const linkUrl = pid ? `/product/${pid}` : "#";

  return (
    <div className="prod-card">
      {product.badge && (
        <div className={`prod-badge badge-${product.badge.toLowerCase()}`}>
          {product.badge}
        </div>
      )}
      {!inStock && <div className="prod-badge badge-oos">Out of Stock</div>}

      <div className="prod-img-wrap">
        <img src={imgSrc} alt={name} loading="lazy" />
        <div className="prod-img-overlay" />
        <button className="btn-quick-wish" onClick={() => showToast('Added to wishlist!', '♡')}>♡</button>
      </div>

      <div className="prod-info">
        <div className="prod-cat">{catName}</div>
        <Link to={linkUrl} className="prod-name">
          {name}
        </Link>
        
        {/* Live rating from DB */}
        {product.ratings?.count > 0 ? (
          <div className="prod-stars-row pc-rating">
            <span className="prod-stars pc-stars">
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.round(product.ratings.average) ? '#c89762' : '#ddd' }}>★</span>
              ))}
            </span>
            <span className="prod-reviews">({product.ratings.count})</span>
          </div>
        ) : (
          <div className="prod-stars-row pc-rating" style={{ color: '#bbb', fontSize: '0.75rem' }}>
            No reviews yet
          </div>
        )}
        
        <div className="prod-bottom">
          <div>
            <span className="prod-price">{displayPrice}</span>
            {displayOrig && <span className="prod-price-orig">{displayOrig}</span>}
          </div>
          {inStock
            ? <button className="prod-add-btn" onClick={async () => {
                if (!isAuthenticated) {
                    showToast("Please sign in to add items to cart", "🔒");
                    navigate(`/login?redirect=${location.pathname}`);
                    return;
                }
                try {
                    await dispatch(addToCartThunk({
                      productId: product._id || product.id,
                      quantity: 1
                    })).unwrap();
                    showToast('Added to cart!', '🛒');
                } catch (err) {
                    showToast(err || "Could not add to cart", "❌");
                }
              }}>+</button>
            : <span className="oos-label">Sold Out</span>
          }
        </div>
      </div>
    </div>
  );
}