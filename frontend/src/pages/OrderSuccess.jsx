import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/OrderSuccess.css";

export default function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when this page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-icon">
          <span className="check-mark">✓</span>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for choosing Canolli Furniture. Your order has been placed and is currently being processed.
        </p>
        
        <div className="success-actions">
          <button className="btn-view-orders" onClick={() => navigate("/profile")}>
            View My Orders
          </button>
          <Link to="/shop" className="btn-continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
