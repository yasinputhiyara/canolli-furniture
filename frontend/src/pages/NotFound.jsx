import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import './NotFound.css';

const LINKS = [
  { href: '/', icon: '🏠', label: 'Home', sub: 'Back to start' },
  { href: '/shop', icon: '🪑', label: 'Shop', sub: 'Browse all furniture' },
  { href: '/cart', icon: '🛒', label: 'My Cart', sub: 'View saved items' },
  { href: '/about', icon: '🌳', label: 'Our Story', sub: 'Nilambur heritage' },
  { href: '/contact', icon: '💬', label: 'Contact', sub: 'We\'ll help you' },
];

export default function NotFoundPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const doSearch = () => {
    if (query.trim()) navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      <Navbar />
      <div className="nf-page">
        <div className="nf-content">
          {/* Illustration */}
          <div className="illus au">
            <div className="dust d1" /><div className="dust d2" /><div className="dust d3" />
            <div className="dust d4" /><div className="dust d5" />
            <span className="four-zero-four">404</span>
            <div className="wood-chip">🪵</div>
          </div>

          <div className="nf-eyebrow au">Page Not Found</div>
          <h1 className="nf-headline au d1">This Page Has Been<br /><em>Sanded Away</em></h1>
          <p className="nf-sub au d2">
            The page you're looking for has moved, been removed, or perhaps it was never there —
            like a chair ordered and never built. Let's get you back on solid ground.
          </p>

          {/* Search */}
          <div className="nf-search au d3">
            <input className="nf-search-in" type="text" placeholder="Search for sofas, beds, wardrobes…"
              value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} />
            <button className="nf-search-btn" onClick={doSearch}><span>Search →</span></button>
          </div>

          <div className="nf-divider au d4" />

          {/* Quick links */}
          <div className="ql-title au d4">Where would you like to go?</div>
          <div className="ql-grid au d5">
            {LINKS.map(l => (
              <Link key={l.href} to={l.href} className="ql-card">
                <div className="ql-icon">{l.icon}</div>
                <div className="ql-label">{l.label}</div>
                <div className="ql-sub">{l.sub}</div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="nf-actions au">
            <Link to="/" className="btn-primary"><span>← Go Home</span></Link>
            <button className="btn-outline" onClick={() => window.history.back()}>Go Back</button>
          </div>

          <div className="nf-err-code">Error 404 · canolli.in · Page Not Found</div>
        </div>
      </div>
    </>
  );
}
