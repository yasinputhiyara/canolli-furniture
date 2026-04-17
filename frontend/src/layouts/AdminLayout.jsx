import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Admin.css";
import "../styles/globals.css";

const navItems = [
  {
    section: "Main",
    links: [
      { to: "/admin/dashboard", icon: "⬛", label: "Dashboard" },
      { to: "/admin/products", icon: "🪑", label: "Products" },
    ],
  },
  {
    section: "Management",
    links: [
      { to: "/admin/orders", icon: "📦", label: "Orders", badge: "3" },
      { to: "/admin/users", icon: "👤", label: "Customers" },
    ],
  },
  {
    section: "Store",
    links: [
      { to: "/admin/categories", icon: "🏷️", label: "Categories" },
      { to: "/admin/testimonials", icon: "💬", label: "Testimonials" },
      { to: "/admin/faqs", icon: "❓", label: "FAQs" },
      { to: "/admin/settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

export default function AdminLayout({ children, title = "Dashboard", breadcrumb = "Admin / Dashboard" }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState({ name: 'Admin', email: 'Super Admin' });

  useEffect(() => {
    const data = localStorage.getItem("adminData");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setAdminUser({ name: parsed.name || 'Admin', email: parsed.email || 'Super Admin' });
      } catch (e) {
        console.error("Failed to parse admin data", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar-logo">
          <img src="/canollilogoBg.png" alt="Canolli Logo" className="admin-logo-img" />
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navItems.map((group) => (
            <div key={group.section}>
              <div className="admin-nav-section-label">{group.section}</div>
              {group.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`admin-nav-link ${location.pathname === link.to ? "active" : ""}`}
                >
                  <span className="admin-nav-icon">{link.icon}</span>
                  <span className="admin-nav-link-text">{link.label}</span>
                  {link.badge && <span className="admin-nav-badge">{link.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-user-avatar">{adminUser.name.charAt(0).toUpperCase()}</div>
            <div className="admin-user-info">
              <div className="admin-user-name">{adminUser.name}</div>
              <div className="admin-user-role" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{adminUser.email}</div>
            </div>
            <button
              title="Logout"
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                color: "rgba(200,151,106,0.4)",
                padding: "0",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#D4A958"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(200,151,106,0.4)"}
            >
              ⏻
            </button>
          </div>
        </div>

      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="admin-content">

        {/* Top Header */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-topbar-title">{title}</div>
            <div className="admin-topbar-breadcrumb">{breadcrumb}</div>
          </div>
          <div className="admin-topbar-right">
            <button className="admin-topbar-btn" title="Notifications">
              🔔
              <span className="notif-dot" />
            </button>
            <button className="admin-topbar-btn" title="Search">
              🔍
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-page-body">
          {children}
        </main>

      </div>
    </div>
  );
}
