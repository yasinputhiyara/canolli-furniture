import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import "./OrdersAdmin.css";

const STATUS_COLORS = {
  placed: "#f39c12",
  processing: "#3498db",
  shipped: "#9b59b6",
  delivered: "#2ecc71",
  cancelled: "#e74c3c",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("active"); // "active" or "cancelled"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(orders.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getWhatsAppLink = (phone) => {
    // Sanitize phone number – strip spaces, dashes, parentheses
    const cleaned = phone?.replace(/[\s\-()]/g, "") || "";
    // Add country code if not present
    const withCode = cleaned.startsWith("+") ? cleaned.slice(1) : `91${cleaned.replace(/^0/, "")}`;
    return `https://wa.me/${withCode}`;
  };

  const formatAddress = (addr) => {
    if (!addr) return "—";
    const parts = [addr.house, addr.area, addr.city, addr.state, addr.pincode].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <AdminLayout>
      <div className="admin-orders-header">
        <h1>Order Management</h1>
        <div className="order-tabs">
          <button 
            className={`order-tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Orders ({orders.filter(o => o.orderStatus !== "cancelled").length})
          </button>
          <button 
            className={`order-tab ${activeTab === "cancelled" ? "active" : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled ({orders.filter(o => o.orderStatus === "cancelled").length})
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-msg">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="empty-msg">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders
            .filter(o => activeTab === "active" ? o.orderStatus !== "cancelled" : o.orderStatus === "cancelled")
            .map((order, index) => {
            const addr = order.shippingAddress || {};
            const isExpanded = expandedId === order._id;
            const statusColor = STATUS_COLORS[order.orderStatus] || "#888";
            const shortId = `#CAN-${order._id.slice(-6).toUpperCase()}`;

            return (
              <div key={order._id} className={`order-row-card ${isExpanded ? "expanded" : ""}`}>
                {/* Summary Row */}
                <div className="order-summary-row" onClick={() => toggleExpand(order._id)}>
                  <div className="ors-col ors-num">
                    <span className="order-serial-no">{index + 1}</span>
                  </div>
                  <div className="ors-col ors-id">
                    <span className="order-short-id">{shortId}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  </div>

                  <div className="ors-col ors-customer">
                    <span className="cust-name">{order.user?.name || addr.fullName || "—"}</span>
                    <span className="cust-email">{order.user?.email || "—"}</span>
                  </div>

                  <div className="ors-col ors-items">
                    {order.orderItems?.length || 0} item(s)
                  </div>

                  <div className="ors-col ors-total">
                    ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                  </div>

                  <div className="ors-col ors-status">
                    <span className="status-badge" style={{ background: `${statusColor}22`, color: statusColor, borderColor: `${statusColor}66` }}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                    </span>
                  </div>

                  <div className="ors-col ors-toggle">
                    <span className={`toggle-arrow ${isExpanded ? "open" : ""}`}>›</span>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div className="order-detail-panel">
                    <div className="detail-grid">
                      {/* Shipping Address */}
                      <div className="detail-section">
                        <h4>📦 Shipping Details</h4>
                        <div className="detail-row">
                          <span className="detail-label">Name</span>
                          <span className="detail-value">{addr.fullName || "—"}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Phone</span>
                          <a
                            href={getWhatsAppLink(addr.phone)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-phone-link"
                            title="Open WhatsApp"
                          >
                            <span className="wa-icon">
                              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.855L.057 23.492a.5.5 0 0 0 .541.63l5.821-1.53A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 0 1-5.045-1.393l-.361-.215-3.742.985.997-3.65-.235-.374A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                              </svg>
                            </span>
                            {addr.phone || "—"}
                          </a>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Address</span>
                          <span className="detail-value">{formatAddress(addr)}</span>
                        </div>
                        {addr.landmark && (
                          <div className="detail-row">
                            <span className="detail-label">Landmark</span>
                            <span className="detail-value">{addr.landmark}</span>
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="detail-section">
                        <h4>🛒 Order Items</h4>
                        <div className="order-items-list">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="item-thumb" />
                              )}
                              <div className="item-info">
                                <span className="item-name">{item.name}</span>
                                <span className="item-meta">Qty: {item.quantity} × ₹{(item.price || 0).toLocaleString("en-IN")}</span>
                              </div>
                              <span className="item-subtotal">₹{((item.price || 0) * item.quantity).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>
                        <div className="order-total-row">
                          <span>Total</span>
                          <strong>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
                        </div>
                      </div>

                      {/* Status Management */}
                      <div className="detail-section">
                        <h4>🔧 Manage Order</h4>
                        <div className="detail-row">
                          <span className="detail-label">Payment</span>
                          <span className="detail-value">{order.paymentMethod || "COD"} · {order.paymentStatus || "pending"}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Update Status</span>
                          <select
                            className="status-select"
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
