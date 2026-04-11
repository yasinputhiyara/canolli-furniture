import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showToast } from '../components/layout/Toast';
import { logout } from '../features/auth/authSlice';
import { resetCart } from '../features/cart/cartSlice';
import { getUserOrdersAPI, cancelUserOrderAPI } from '../services/orderService';
import '../styles/ProfilePage.css';

export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState('orders');
    const [filter, setFilter] = useState('all');
    const [ordersData, setOrdersData] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const data = await getUserOrdersAPI();
                setOrdersData(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchUserOrders();
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(resetCart());
        showToast('Logged out successfully', '👋');
        navigate('/');
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            const updatedOrder = await cancelUserOrderAPI(orderId);
            setOrdersData(prev => prev.map(o => (o._id === orderId ? updatedOrder : o)));
            showToast('Order cancelled successfully', '✅');
        } catch (error) {
            showToast(error?.response?.data?.message || 'Failed to cancel order', '❌');
        }
    };

    const MAPPED_ORDERS = ordersData.map(o => {
        const orderId = o._id;
        const status = o.orderStatus || 'processing';
        let statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        const mappedItems = o.orderItems || [];
        const imgs = mappedItems.filter(item => item.image).map(item => item.image);
        
        return {
            id: `#CAN-${orderId.toString().slice(-6).toUpperCase()}`,
            rawId: orderId,
            date: `${new Date(o.createdAt).toLocaleDateString()} · ${mappedItems.length} item(s) · ${o.paymentMethod || 'COD'}`,
            status: status.toLowerCase(),
            statusLabel: statusLabel,
            total: `₹${(o.totalAmount || 0).toLocaleString('en-IN')}`,
            savings: null,
            imgs: imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=150&q=70']
        };
    });

    const filtered = filter === 'all' ? MAPPED_ORDERS : MAPPED_ORDERS.filter(o => o.status === filter);

    const userInitials = user?.name ? user.name.substring(0, 1).toUpperCase() : 'A';

    return (
        <div className="profile-shell" style={{ paddingTop: '0' }}>
            <nav className="bc au" style={{ padding: '0.68rem 0' }}>
                <Link to="/">Home</Link><span className="bc-sep">/</span><span className="bc-cur">My Account</span>
            </nav>
            <div className="account-layout" style={{ padding: '1.75rem 0' }}>
                {/* Sidebar */}
                <aside className="profile-sidebar au d1">
                    <div className="avatar-card">
                        <div className="avatar-ring">{userInitials}</div>
                        <div className="avatar-name">{user?.name || 'Customer'}</div>
                        <div className="avatar-email">{user?.email || 'customer@example.com'}</div>
                        <div className="avatar-since">Member since {new Date().getFullYear()}</div>
                    </div>
                    <div className="stats-row" style={{ justifyContent: 'center' }}>
                        <div className="stat-cell" style={{ flex: 'none', padding: '1rem 2rem' }}>
                            <div className="stat-val">{ordersData.length}</div>
                            <div className="stat-lbl">Orders</div>
                        </div>
                    </div>
                    <nav className="sidenav">
                        {[
                            ['orders', '📦', 'My Orders', ordersData.length.toString()],
                            ['addresses', '📍', 'Saved Addresses', null],
                            ['profile', '👤', 'Profile Settings', null]
                        ].map(([key, icon, label, badge]) => (
                            <div key={key} className={`sidenav-item${activeSection === key ? ' active' : ''}`} onClick={() => setActiveSection(key)}>
                                <span className="si-icon">{icon}</span>
                                <span className="si-label">{label}</span>
                                {badge ? <span className="si-badge">{badge}</span> : <span className="si-arrow">›</span>}
                            </div>
                        ))}
                        <div className="sidenav-item danger" onClick={handleLogout}>
                            <span className="si-icon">↩</span><span className="si-label">Sign Out</span>
                        </div>
                    </nav>
                </aside>

                {/* Main */}
                <div className="profile-main au d2">
                    {/* ORDERS */}
                    {activeSection === 'orders' && (
                        <>
                            <div className="filter-tab-row">
                                {['all', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'].map(f => (
                                    <button key={f} className={`ftab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                                ))}
                            </div>
                            
                            {loadingOrders && <p>Loading orders...</p>}

                            {!loadingOrders && filtered.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '8px' }}>
                                    <h3 style={{ marginBottom: '10px' }}>No orders found</h3>
                                    <p style={{ color: '#888' }}>You have no orders tracking here yet.</p>
                                </div>
                            )}

                            {!loadingOrders && filtered.map(o => (
                                <div className="order-card" key={o.rawId}>
                                    <div className="oc-header">
                                        <div className="oc-header-left">
                                            <div className="oc-id">{o.id}</div>
                                            <div className="oc-date">Placed {o.date.split('·')[0].trim()}</div>
                                        </div>
                                        <span className={`status-chip ${o.status}`}><span className="sdot" />{o.statusLabel}</span>
                                    </div>
                                    <div className="oc-items">
                                        {o.imgs.map((img, i) => (
                                            <div className="oc-thumb" key={i}><img src={img} alt="" /></div>
                                        ))}
                                        <div className="oc-item-meta">{o.id} · {o.date.split('·')[1].trim()}</div>
                                    </div>
                                    <div className="oc-footer">
                                        <div className="oc-total-row">
                                            <span className="oc-total-lbl">Total</span>
                                            <span className="oc-total-val">{o.total}</span>
                                            {o.savings && <span className="oc-savings">{o.savings}</span>}
                                        </div>
                                        <div className="oc-actions">
                                            {(o.status === 'placed' || o.status === 'processing') && (
                                                <button className="btn-oc primary cancel-btn" style={{backgroundColor: '#e74c3c', color: 'white', borderColor: '#e74c3c'}} onClick={() => handleCancelOrder(o.rawId)}>
                                                    Cancel Order
                                                </button>
                                            )}
                                            {o.status === 'delivered' && <button className="btn-oc primary" onClick={() => showToast('Reordering is coming soon!', '🛒')}>Reorder</button>}
                                            {o.status === 'cancelled' && <button className="btn-oc primary" onClick={() => showToast('Reordering is coming soon!', '🛒')}>Reorder</button>}
                                            <button className="btn-oc outline" onClick={() => showToast('Invoice download started', '📄')}>Invoice</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* ADDRESSES */}
                    {activeSection === 'addresses' && (
                        <div className="addr-grid">
                            <div className="addr-card default">
                                <div className="addr-card-type">🏠 Home <span className="default-tag">Default</span></div>
                                <div className="addr-card-name">{user?.name || "Customer"}</div>
                                <div className="addr-card-addr">12/B, Thiruvali Residency, Manjeri, Malappuram – 676121</div>
                                <div className="addr-card-phone">📞 +91 94001 23456</div>
                                <div className="addr-actions"><button className="btn-addr edit" onClick={() => showToast('Edit form opening…', '✏')}>Edit</button></div>
                            </div>
                            <button className="btn-add-addr" onClick={() => navigate('/checkout')}>+ Add New Address (via Checkout)</button>
                        </div>
                    )}

                    {/* PROFILE */}
                    {activeSection === 'profile' && (
                        <div className="profile-form">
                            <div className="ps-section">
                                <div className="ps-hd"><span className="ps-hd-title">Personal Information</span><button className="ps-hd-action" onClick={() => showToast('Profile saved!', '✓')}>Save Changes</button></div>
                                <div className="ps-body">
                                    <div className="field-grid cols-2">
                                        {[['Name', user?.name || 'User'], ['Email', user?.email || 'user@example.com']].map(([l, v]) => (
                                            <div className="p-field" key={l}><label>{l}</label><input type="text" defaultValue={v} readOnly={l === 'Email'} /></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="ps-section">
                                <div className="ps-hd"><span className="ps-hd-title">Security</span></div>
                                <div className="ps-body">
                                    <div className="field-grid cols-2">
                                        <div className="p-field"><label>Current Password</label><input type="password" placeholder="••••••••" /></div>
                                        <div className="p-field"><label>New Password</label><input type="password" placeholder="••••••••" /></div>
                                    </div>
                                    <button className="btn-save" style={{ marginTop: '1rem' }} onClick={() => showToast('Password updated!', '🔒')}><span>Update Password</span></button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
