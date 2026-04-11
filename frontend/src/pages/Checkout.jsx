import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { clearCartThunk } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/orderSlice";
import { getUserProfile, addAddress } from "../services/userService";
import { createOrderAPI } from "../services/orderService";
import { showToast } from "../components/layout/Toast";
import "../styles/Checkout.css";

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    house: "",
    area: "",
    landmark: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setAddresses(data.addresses || []);
      } catch (err) {
        showToast("Error loading addresses", "❌");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      showToast("Please fill all required fields", "⚠️");
      return;
    }
    try {
      setIsSubmitting(true);
      const data = await addAddress(newAddress);
      setAddresses(data.addresses || data);
      setShowAddForm(false);
      setSelectedAddressIndex((data.addresses || data).length - 1);
      showToast("Address saved!", "✅");
      setNewAddress({ fullName: "", phone: "", city: "", state: "", pincode: "", house: "", area: "", landmark: "" });
    } catch (err) {
      showToast("Failed to save address", "❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const prepareOrderData = () => {
    if (addresses.length === 0) {
      showToast("Please add an address first.", "⚠️");
      return null;
    }
    const shippingAddress = addresses[selectedAddressIndex];
    const orderItems = items.map(item => ({
      product: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity
    }));

    return {
      orderItems,
      shippingAddress,
      paymentMethod: "COD",
      totalAmount
    };
  };

  const handlePlaceOrderCOD = async () => {
    const orderData = prepareOrderData();
    if (!orderData) return;

    try {
      setIsSubmitting(true);
      const createdOrder = await createOrderAPI(orderData);
      
      dispatch(addOrder(createdOrder));
      await dispatch(clearCartThunk());
      
      showToast("Order placed successfully!", "🎉");
      navigate("/order-success");
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to place order", "❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const orderData = prepareOrderData();
    if (!orderData) return;

    // build whatsapp message
    let text = "Hello Canolli Furniture, I would like to place an order:%0A%0A";
    text += "*Items:*%0A";
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.name} x${item.quantity} - ₹${item.price.toLocaleString('en-IN')}%0A`;
    });
    
    text += `%0A*Total Amount:* ₹${totalAmount.toLocaleString('en-IN')}%0A%0A`;
    
    const addr = orderData.shippingAddress;
    text += `*Shipping Address:*%0A${addr.fullName}, ${addr.phone}%0A${addr.house || ''} ${addr.area || ''}%0A${addr.city}, ${addr.state} - ${addr.pincode}%0A`;

    const waUrl = `https://wa.me/919778520190?text=${text}`;
    window.open(waUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page empty" style={{ textAlign: "center", padding: "8rem 2rem" }}>
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn-shop-now" style={{ display: "inline-block", marginTop: "1rem", padding: "10px 20px", background: "var(--amber)", color: "white", textDecoration: "none", borderRadius: "4px" }}>Go to Shop</Link>
      </div>
    );
  }

  const priceFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 8 });

  return (
    <div className="checkout-page wrapper">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>
      
      <div className="checkout-container">
        <div className="checkout-left">
          <h2>Shipping Address</h2>
          
          {loading ? (
            <p className="loading-text">Loading addresses...</p>
          ) : addresses.length === 0 && !showAddForm ? (
            <div className="no-address">
              <p>You don't have any saved addresses.</p>
              <button className="btn-add-address" onClick={() => setShowAddForm(true)}>+ Add New Address</button>
            </div>
          ) : (
            <>
              {!showAddForm && (
                <div className="address-list">
                  {addresses.map((addr, idx) => (
                    <div 
                      key={addr._id || idx} 
                      className={`address-card ${selectedAddressIndex === idx ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressIndex(idx)}
                    >
                      <div className="radio-btn">{selectedAddressIndex === idx ? '●' : '○'}</div>
                      <div className="addr-details">
                        <strong>{addr.fullName}</strong>
                        <p>{addr.phone}</p>
                        <p>{addr.house} {addr.area}</p>
                        <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    </div>
                  ))}
                  
                  <button className="btn-add-address inline" onClick={() => setShowAddForm(true)}>+ Add Another Address</button>
                </div>
              )}
            </>
          )}

          {showAddForm && (
            <form className="address-form" onSubmit={handleSaveAddress}>
              <h3>Add New Address</h3>
              
              <div className="form-row row-2">
                <input name="fullName" placeholder="Full Name *" value={newAddress.fullName} onChange={handleChange} required />
                <input name="phone" placeholder="Phone Number *" value={newAddress.phone} onChange={handleChange} required />
              </div>
              
              <div className="form-row row-2">
                <input name="pincode" placeholder="Pincode *" value={newAddress.pincode} onChange={handleChange} required />
                <input name="state" placeholder="State *" value={newAddress.state} onChange={handleChange} required />
              </div>

              <div className="form-row row-2">
                <input name="city" placeholder="City *" value={newAddress.city} onChange={handleChange} required />
                <input name="house" placeholder="House/Flat/Building" value={newAddress.house} onChange={handleChange} />
              </div>

              <div className="form-row row-2">
                <input name="area" placeholder="Area/Street/Sector" value={newAddress.area} onChange={handleChange} />
                <input name="landmark" placeholder="Landmark" value={newAddress.landmark} onChange={handleChange} />
              </div>

              <div className="form-actions">
                {addresses.length > 0 && <button type="button" className="btn-cancel" onClick={() => setShowAddForm(false)}>Cancel</button>}
                <button type="submit" className="btn-submit-addr" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="checkout-right">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="s-item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="s-item-price">
                  {priceFormat.format(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="s-row">
              <span>Subtotal</span>
              <span>{priceFormat.format(totalAmount)}</span>
            </div>
            <div className="s-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="s-row s-total">
              <span>Total</span>
              <span>{priceFormat.format(totalAmount)}</span>
            </div>
          </div>

          <div className="checkout-actions">
            <button 
              className="btn-cod" 
              onClick={handlePlaceOrderCOD} 
              disabled={isSubmitting || addresses.length === 0}
            >
              Complete Order (COD)
            </button>
            
            <button 
              className="btn-wa" 
              onClick={handleWhatsAppOrder}
              disabled={addresses.length === 0}
            >
              Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
