import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './MobileBottomNav.css';

export default function MobileBottomNav() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const navigate = useNavigate();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <NavLink to="/" end className={({ isActive }) => `mbn-item${isActive ? ' mbn-active' : ''}`}>
        <span className="mbn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </span>
        <span className="mbn-label">Home</span>
      </NavLink>

      <NavLink to="/shop" className={({ isActive }) => `mbn-item${isActive ? ' mbn-active' : ''}`}>
        <span className="mbn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
        </span>
        <span className="mbn-label">Category</span>
      </NavLink>

      <NavLink to="/shop" className="mbn-item mbn-search-center">
        <span className="mbn-icon mbn-search-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <span className="mbn-label">Search</span>
      </NavLink>

      <NavLink to="/about" className={({ isActive }) => `mbn-item${isActive ? ' mbn-active' : ''}`}>
        <span className="mbn-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </span>
        <span className="mbn-label">About</span>
      </NavLink>

      {isAuthenticated ? (
        <NavLink to="/cart" className={({ isActive }) => `mbn-item${isActive ? ' mbn-active' : ''}`}>
          <span className="mbn-icon mbn-cart-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className="mbn-cart-badge">{cartCount}</span>}
          </span>
          <span className="mbn-label">Cart</span>
        </NavLink>
      ) : (
        <NavLink to="/login" className={({ isActive }) => `mbn-item${isActive ? ' mbn-active' : ''}`}>
          <span className="mbn-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <span className="mbn-label">Sign In</span>
        </NavLink>
      )}
    </nav>
  );
}
