import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { resetCart, loadCart } from '../../features/cart/cartSlice';
import './Navbar.css';

export default function Navbar({ dark = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCart());
    }
  }, [isAuthenticated, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'US';

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}${dark ? ' dark' : ''}`}>
        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`ham-line${mobileMenuOpen ? ' open' : ''}`} />
          <span className={`ham-line${mobileMenuOpen ? ' open' : ''}`} />
          <span className={`ham-line${mobileMenuOpen ? ' open' : ''}`} />
        </button>

        <Link to="/" className="nav-logo">
          <span className="nav-logo-name">Canolli<span>.</span></span>
          <span className="nav-logo-sub">Wood Furniture · Nilambur, Kerala</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-links">
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/shop">Shop</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        {/* Desktop actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="profile-dropdown-container" ref={menuRef}>
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                {userInitials}
              </button>
              {dropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/orders" onClick={() => setDropdownOpen(false)} className="pd-link">Orders</Link>
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="pd-link">Profile Settings</Link>
                  <button onClick={handleLogout} className="pd-logout">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-btn-ghost">Sign In</Link>
          )}

          <Link to="/cart" className="btn-cart" aria-label="Cart">
            🛒
            {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
          </Link>
        </div>

        {/* Mobile-only right actions */}
        <div className="nav-mobile-actions">
          {isAuthenticated ? (
            <>
              <Link to="/orders" className="nav-mobile-icon" aria-label="Orders">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </Link>
              <button onClick={handleLogout} className="nav-mobile-logout" aria-label="Logout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-mobile-signin" aria-label="Sign In">Sign In</Link>
          )}
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside className={`mobile-drawer${mobileMenuOpen ? ' drawer-open' : ''}`}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="nav-logo-name">Canolli<span>.</span></span>
            <span className="nav-logo-sub">Wood Furniture · Nilambur</span>
          </Link>
          <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">✕</button>
        </div>

        {/* User info if logged in */}
        {isAuthenticated && (
          <div className="drawer-user">
            <div className="drawer-avatar">{userInitials}</div>
            <div className="drawer-user-info">
              <div className="drawer-user-name">{user?.name || 'User'}</div>
              <div className="drawer-user-email">{user?.email || ''}</div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="drawer-nav">
          <div className="drawer-nav-section">
            <div className="drawer-section-label">Browse</div>
            <NavLink to="/" end className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
              <span className="drawer-link-icon">🏠</span> Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
              <span className="drawer-link-icon">🛋️</span> Shop
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
              <span className="drawer-link-icon">ℹ️</span> About
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
              <span className="drawer-link-icon">📞</span> Contact
            </NavLink>
          </div>

          {isAuthenticated && (
            <div className="drawer-nav-section">
              <div className="drawer-section-label">Account</div>
              <NavLink to="/orders" className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
                <span className="drawer-link-icon">📦</span> Orders
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => `drawer-link${isActive ? ' drawer-active' : ''}`}>
                <span className="drawer-link-icon">🛒</span> Cart {cartCount > 0 && <span className="drawer-cart-count">{cartCount}</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="drawer-logout-btn">
              <span>🚪</span> Logout
            </button>
          ) : (
            <Link to="/login" className="drawer-signin-btn" onClick={() => setMobileMenuOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
