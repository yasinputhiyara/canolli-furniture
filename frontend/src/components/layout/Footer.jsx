import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-logo">
            <img src="/whiteLogo.png" alt="Canolli Logo" className="footer-logo-img" />
            <div className="footer-logo-text">
              <span className="footer-logo-name">Canolli</span>
              <span className="footer-logo-sub">Wood Furniture · Nilambur, Kerala</span>
            </div>
          </div>
          <p className="footer-tagline">
            Crafting heirloom furniture from GI-certified Nilambur teak since 1987.
            Every piece tells a story of craft, forest, and family.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a href="https://wa.me/919778520190" target="_blank" rel="noreferrer" className="social-btn" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.031 0C5.398 0 .012 5.385.012 12.016c0 2.124.551 4.195 1.6 6.01L0 24l6.126-1.597c1.761.94 3.738 1.436 5.892 1.436h.013c6.634 0 12.023-5.388 12.023-12.022C24.041 5.378 18.665 0 12.031 0zm0 21.658h-.01c-1.785 0-3.535-.478-5.068-1.382l-.363-.213-3.766.982.998-3.642-.234-.37A9.851 9.851 0 012.185 12.02c0-5.422 4.417-9.843 9.848-9.843 5.394 0 9.833 4.417 9.833 9.848 0 5.433-4.426 9.833-9.835 9.833zm5.402-7.382c-.296-.148-1.758-.87-2.031-.969-.271-.098-.47-.148-.668.148-.198.297-.768.969-.942 1.166-.173.197-.348.221-.645.073-.298-.148-1.258-.465-2.396-1.488-.885-.794-1.484-1.776-1.659-2.073-.173-.296-.018-.458.13-.605.132-.132.296-.346.444-.52.149-.172.198-.295.297-.492.099-.196.05-.369-.025-.518-.075-.147-.668-1.611-.914-2.205-.24-.582-.486-.503-.668-.511-.173-.01-.371-.01-.569-.01-.198 0-.52.074-.792.371-.272.296-1.04 1.016-1.04 2.476 0 1.46 1.065 2.871 1.213 3.069.148.197 2.08 3.194 5.063 4.47.71.303 1.264.484 1.696.621.714.227 1.365.195 1.88.118.575-.084 1.758-.718 2.006-1.413.248-.695.248-1.291.174-1.413-.075-.121-.274-.196-.571-.344z"/>
              </svg>
            </a>
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
