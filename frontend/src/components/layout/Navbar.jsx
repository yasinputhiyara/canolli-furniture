import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ cartCount = 0, dark = false }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}${dark ? ' dark' : ''}`}>
      <Link to="/" className="nav-logo">
        <span className="nav-logo-name">Canolli<span>.</span></span>
        <span className="nav-logo-sub">Wood Furniture · Nilambur, Kerala</span>
      </Link>

      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/shop">Shop</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>

      <div className="nav-actions">
        <Link to="/login" className="nav-btn-ghost">Sign In</Link>
        <Link to="/cart" className="btn-cart" aria-label="Cart">
          🛒
          {cartCount > 0 && <span className="cart-dot">{cartCount}</span>}
        </Link>
      </div>
    </header>
  );
}
