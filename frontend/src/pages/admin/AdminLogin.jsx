import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin.css";
import "../../styles/globals.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate short delay for UX
    await new Promise((r) => setTimeout(r, 600));

    if (email === "admin@canolli.com" && password === "123456") {
      localStorage.setItem("admin", true);
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-wrap">

      {/* ── LEFT PANEL ── */}
      <div className="admin-login-left">

        {/* Brand */}
        <div className="admin-login-brand">
          <div className="admin-login-brand-icon">🪑</div>
          <div>
            <div className="admin-login-brand-name">Canolli</div>
            <div className="admin-login-brand-tag">Furniture Studio</div>
          </div>
        </div>

        {/* Central copy */}
        <div className="admin-login-left-body">
          <div className="admin-login-left-eyebrow">Admin Portal</div>
          <h1 className="admin-login-left-h">
            Manage your<br />
            <em>store with ease</em>
          </h1>
          <p>
            The Canolli admin panel gives you complete control over your
            products, orders, and customers in one beautifully crafted workspace.
          </p>
          <ul className="admin-login-features">
            <li>
              <span className="feat-icon">📊</span>
              Real-time sales analytics & insights
            </li>
            <li>
              <span className="feat-icon">🪑</span>
              Full product catalogue management
            </li>
            <li>
              <span className="feat-icon">📦</span>
              Order tracking & fulfilment tools
            </li>
            <li>
              <span className="feat-icon">👤</span>
              Customer relationship management
            </li>
          </ul>
        </div>

        {/* Footer stats */}
        <div className="admin-login-left-footer">
          <div className="admin-login-stat">
            <span className="admin-login-stat-num">120+</span>
            <span className="admin-login-stat-lbl">Products</span>
          </div>
          <div className="admin-login-stat">
            <span className="admin-login-stat-num">340</span>
            <span className="admin-login-stat-lbl">Customers</span>
          </div>
          <div className="admin-login-stat">
            <span className="admin-login-stat-num">56</span>
            <span className="admin-login-stat-lbl">Orders</span>
          </div>
        </div>

      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="admin-login-right">
        <div className="admin-login-form-wrap">

          <div className="admin-login-form-header">
            <div className="admin-login-form-eyebrow">Secure Access</div>
            <h2 className="admin-login-form-h">Welcome back</h2>
            <p className="admin-login-form-sub">Sign in to your admin account to continue.</p>
          </div>

          <form className="admin-login-form" onSubmit={handleLogin}>

            {error && (
              <div className="admin-login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <div className="admin-login-field">
              <label className="admin-login-label" htmlFor="email">Email Address</label>
              <div className="admin-login-input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  id="email"
                  type="email"
                  className="admin-login-input"
                  placeholder="admin@canolli.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label className="admin-login-label" htmlFor="password">Password</label>
              <div className="admin-login-input-wrap">
                <span className="input-icon">🔐</span>
                <input
                  id="password"
                  type="password"
                  className="admin-login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              <span className="admin-login-submit-text">
                {loading ? "Signing in…" : "Sign in to Dashboard →"}
              </span>
            </button>

          </form>

          <div className="admin-login-divider">
            <span>Demo credentials</span>
          </div>

          <div className="admin-login-hint">
            📧 <strong>admin@canolli.com</strong>&nbsp;·&nbsp;🔑 <strong>123456</strong>
          </div>

        </div>
      </div>

    </div>
  );
}