import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getDashboardStats } from "../../services/adminService";

const STAT_META = [
  {
    label: "Total Revenue",
    key: "totalRevenue",
    format: (v) => `₹${Number(v ?? 0).toLocaleString("en-IN")}`,
    icon: "💰",
    iconClass: "stat-icon-gold",
    trend: "+12.5%",
    trendType: "up",
    sub: "vs last month",
  },
  {
    label: "Total Orders",
    key: "totalOrders",
    format: (v) => v ?? "—",
    icon: "📦",
    iconClass: "stat-icon-teak",
    trend: "+8.2%",
    trendType: "up",
    sub: "3 pending today",
  },
  {
    label: "Total Products",
    key: "totalProducts",
    format: (v) => v ?? "—",
    icon: "🪑",
    iconClass: "stat-icon-green",
    trend: "+4",
    trendType: "up",
    sub: "added this week",
  },
  {
    label: "Customers",
    key: "totalUsers",
    format: (v) => v ?? "—",
    icon: "👤",
    iconClass: "stat-icon-blue",
    trend: "+22",
    trendType: "up",
    sub: "registered this month",
  },
];

const recentOrders = [
  { id: "#ORD-8821", customer: "Arjun Mehta", product: "Elan Sofa Set", amount: "₹26,200", status: "Delivered", date: "14 Mar 2026" },
  { id: "#ORD-8820", customer: "Priya Sharma", product: "Nordic Side Table", amount: "₹8,400", status: "Processing", date: "13 Mar 2026" },
  { id: "#ORD-8819", customer: "Ravi Kumar", product: "Luxe Bed Frame", amount: "₹38,000", status: "Shipped", date: "13 Mar 2026" },
  { id: "#ORD-8818", customer: "Neha Patel", product: "Modular Bookshelf", amount: "₹14,500", status: "Pending", date: "12 Mar 2026" },
  { id: "#ORD-8817", customer: "Kiran Das", product: "Solid Oak Chair", amount: "₹9,800", status: "Delivered", date: "11 Mar 2026" },
];

const topProducts = [
  { name: "Elan Sofa Set", sales: 24, dot: "dot-gold" },
  { name: "Luxe Bed Frame", sales: 18, dot: "dot-success" },
  { name: "Nordic Side Table", sales: 15, dot: "dot-warning" },
  { name: "Modular Bookshelf", sales: 12, dot: "dot-danger" },
  { name: "Solid Oak Chair", sales: 9, dot: "dot-gold" },
];

const activity = [
  { icon: "🪑", iconBg: "rgba(184,136,60,0.12)", desc: "New product \"Elan Sofa Set\" added", time: "2 hours ago" },
  { icon: "📦", iconBg: "rgba(45,122,79,0.1)", desc: "Order #ORD-8821 marked as Delivered", time: "3 hours ago" },
  { icon: "👤", iconBg: "rgba(26,79,122,0.1)", desc: "New customer Arjun Mehta registered", time: "5 hours ago" },
  { icon: "✏️", iconBg: "rgba(107,62,31,0.1)", desc: "Product \"Luxe Bed Frame\" updated", time: "Yesterday" },
];

const statusClass = {
  Delivered: "adm-badge-success",
  Processing: "adm-badge-info",
  Shipped: "adm-badge-warning",
  Pending: "adm-badge-gold",
  Cancelled: "adm-badge-danger",
};

export default function Dashboard() {
  const [liveStats, setLiveStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setLiveStats(data);
      } catch (err) {
        console.error("Dashboard stats error:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Dashboard" breadcrumb="Admin / Dashboard">

      {/* ── STATS ── */}
      <div className="admin-stats-grid">
        {STAT_META.map((s, i) => (
          <div className={`admin-stat-card adm-au adm-d${i + 1}`} key={s.label}>
            <div className="admin-stat-card-header">
              <div className={`admin-stat-card-icon ${s.iconClass}`}>{s.icon}</div>
              <span className={`admin-stat-card-trend trend-${s.trendType}`}>
                {s.trendType === "up" ? "▲" : "▼"} {s.trend}
              </span>
            </div>
            <div className="admin-stat-card-value">{s.format(liveStats[s.key])}</div>
            <div>
              <div className="admin-stat-card-label">{s.label}</div>
              <div className="admin-stat-card-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="admin-dashboard-grid">

        {/* Recent Orders */}
        <div className="admin-panel adm-au adm-d2">
          <div className="admin-panel-header">
            <div>
              <div className="admin-panel-title">Recent Orders</div>
              <div className="admin-panel-sub">Latest 5 orders from your store</div>
            </div>
            <a href="/admin/orders" className="admin-panel-action">View all →</a>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: "0.82rem" }}>{o.id}</td>
                    <td>{o.customer}</td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.78rem" }}>{o.product}</td>
                    <td className="admin-table-price">{o.amount}</td>
                    <td>
                      <span className={`adm-badge ${statusClass[o.status] || "adm-badge-gold"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.75rem" }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Top Products */}
          <div className="admin-panel adm-au adm-d3">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-title">Top Products</div>
                <div className="admin-panel-sub">By sales volume</div>
              </div>
            </div>
            <ul className="admin-quick-list">
              {topProducts.map((p) => (
                <li className="admin-quick-item" key={p.name}>
                  <span className={`admin-quick-dot ${p.dot}`} />
                  <span className="admin-quick-label">{p.name}</span>
                  <span className="admin-quick-val">{p.sales}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="admin-panel adm-au adm-d4">
            <div className="admin-panel-header">
              <div className="admin-panel-title">Recent Activity</div>
            </div>
            <ul className="admin-activity-list">
              {activity.map((a, i) => (
                <li className="admin-activity-item" key={i}>
                  <div className="admin-activity-icon" style={{ background: a.iconBg }}>
                    {a.icon}
                  </div>
                  <div className="admin-activity-text">
                    <div className="admin-activity-desc">{a.desc}</div>
                    <div className="admin-activity-time">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </AdminLayout>
  );
}
