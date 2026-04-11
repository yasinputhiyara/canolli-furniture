import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loadCart,
  removeFromCartThunk,
  updateQuantityThunk,
  clearCartThunk,
} from "../features/cart/cartSlice";
import "../styles/Cart.css";

const Cart = () => {
  const { items, totalAmount, loading, error } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load cart from DB when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(loadCart());
    }
  }, [isAuthenticated, dispatch]);

  const priceFormat = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumSignificantDigits: 8,
  });

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>
        <div className="cart-container">
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🔒</div>
            <h2>Please sign in</h2>
            <p>You need to be logged in to view your cart and add items.</p>
            <Link to="/login" className="btn-shop-now">
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <p>
          {loading
            ? "Loading..."
            : `${items.length} item${items.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <div className="cart-container">
        {loading && items.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon" style={{ animation: "spin 1s linear infinite" }}>
              ⏳
            </div>
            <h2>Loading your cart…</h2>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn-shop-now">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="cart-item-img"
                  />

                  <div className="cart-item-info">
                    <div className="cart-item-heading">
                      <h3>
                        <Link to={`/product/${item.id}`}>{item.name}</Link>
                      </h3>
                      <button
                        className="cart-btn-remove"
                        disabled={loading}
                        onClick={() => dispatch(removeFromCartThunk(item.id))}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="cart-item-price-row">
                      <span className="cart-item-price">
                        {priceFormat.format(item.price)}
                      </span>
                    </div>

                    <div className="cart-item-actions">
                      <div className="qty-ctrl">
                        <button
                          disabled={loading || item.quantity <= 1}
                          onClick={() =>
                            dispatch(
                              updateQuantityThunk({
                                productId: item.id,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                        >
                          −
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          disabled={loading}
                          onClick={() =>
                            dispatch(
                              updateQuantityThunk({
                                productId: item.id,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-total">
                        <strong>
                          {priceFormat.format(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart button */}
              <button
                className="cart-btn-clear"
                disabled={loading}
                onClick={() => dispatch(clearCartThunk())}
                style={{
                  marginTop: "1rem",
                  background: "none",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  color: "#888",
                  fontSize: "0.85rem",
                }}
              >
                🗑 Clear Cart
              </button>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{priceFormat.format(totalAmount)}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Delivery</span>
                <span>Free</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total">
                <span>Total</span>
                <span>{priceFormat.format(totalAmount)}</span>
              </div>

              <p className="summary-tax-note">Taxes included if applicable.</p>

              <button
                className="btn-checkout"
                disabled={loading}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>

              <div className="secure-checkout">
                <span>🔒 Secure Encrypted Checkout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
