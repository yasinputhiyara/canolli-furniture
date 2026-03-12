import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-name">Canolli<span>.</span></div>
          <div className="footer-logo-sub">Wood Furniture · Nilambur, Kerala</div>
          <p className="footer-tagline">
            Crafting heirloom furniture from GI-certified Nilambur teak since 1987.
            Every piece tells a story of craft, forest, and family.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">📸</a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn">👥</a>
            <a href="https://wa.me/919400000000" target="_blank" rel="noreferrer" className="social-btn">💬</a>
          </div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Shop</div>
          <Link to="/shop">All Furniture</Link>
          <Link to="/shop?cat=sofas">Sofas & Seating</Link>
          <Link to="/shop?cat=beds">Beds & Storage</Link>
          <Link to="/shop?cat=dining">Dining Sets</Link>
          <Link to="/shop?cat=wardrobes">Wardrobes</Link>
          <Link to="/shop?cat=new">New Arrivals</Link>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Company</div>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact Us</Link>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Sustainability</a>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Help</div>
          <a href="#">Track Your Order</a>
          <a href="#">Returns & Exchanges</a>
          <a href="#">Warranty Policy</a>
          <a href="#">Care Instructions</a>
          <a href="#">Assembly Support</a>
          <a href="#">FAQs</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© 2025 Canolli Wood Furniture. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
