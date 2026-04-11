import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../services/authService';
import { loginSuccess } from '../features/auth/authSlice';
import '../styles/Login.css';

export default function LoginPage() {
    const [tab, setTab] = useState('login');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();

    // Form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const redirectTo = searchParams.get('redirect') || '/';
        if (token) {
            dispatch(loginSuccess({ user: { name: name || 'User' }, token }));
            navigate(redirectTo);
        }
        const err = searchParams.get('error');
        if (err) {
            setError("Google login failed. Please try again.");
        }
    }, [searchParams, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        const redirectTo = searchParams.get('redirect') || '/';
        try {
            const data = await loginUser({ email, password });
            dispatch(loginSuccess({ user: data.user, token: data.token }));
            navigate(redirectTo);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password) {
            setError("All fields are required.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await registerUser({
                name: fullName,
                email,
                password
            });
            setSuccess("Account created successfully! Please sign in.");
            setTab('login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* <Navbar dark /> */}
            <div className="auth-page-wrap">
                {/* Left panel */}
                <div className="auth-left">
                    <div className="auth-left-bg" />
                    <div className="auth-left-vignette" />
                    <div className="trust-pills">
                        {['GI Certified Nilambur Teak', '50,000+ Happy Customers', 'Cash on Delivery Available'].map(t => (
                            <div className="trust-pill" key={t}><span className="trust-dot" />{t}</div>
                        ))}
                    </div>
                    <div className="auth-left-content">
                        <div className="left-badge"><span className="left-badge-line" />Est. 2010 · Nilambur, Kerala</div>
                        <h2 className="left-quote">Furniture that<br />tells a <em>story.</em></h2>
                        <p className="left-sub">Join thousands of homeowners, designers, and hoteliers who trust Canolli for premium teak wood furniture.</p>
                        <div className="left-stats">
                            {[['100K+', 'Followers'], ['50K+', 'Customers'], ['15+', 'Years']].map(([n, l]) => (
                                <div className="lstat" key={l}><div className="lstat-num">{n}</div><div className="lstat-lbl">{l}</div></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="auth-right">
                    <div className="auth-form-card">
                        {/* Tabs */}
                        <div className="auth-tabs">
                            <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Login</button>
                            <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Create Account</button>
                        </div>

                        {/* LOGIN */}
                        {tab === 'login' && (
                            <div className="au">
                                <div className="form-eyebrow"><span className="form-eyebrow-line" />Welcome Back</div>
                                <h1 className="form-title">Sign in to<br /><em>your account</em></h1>
                                <p className="form-subtitle">Your orders, addresses and wishlist are waiting.</p>
                                
                                {error && <div className="auth-error-msg" style={{color: 'red', marginBottom: '1rem', fontSize: '0.85rem'}}>{error}</div>}
                                {success && <div className="auth-success-msg" style={{color: 'green', marginBottom: '1rem', fontSize: '0.85rem'}}>{success}</div>}

                                <form onSubmit={handleLogin}>
                                    <div className="auth-field">
                                        <label>Email Address</label>
                                        <div className="input-wrap"><span className="input-icon">✉</span>
                                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="auth-field">
                                        <label>Password <a href="#" className="forgot-link">Forgot password?</a></label>
                                        <div className="input-wrap"><span className="input-icon">🔒</span>
                                            <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                                        </div>
                                    </div>
                                    <div className="auth-checkbox-row">
                                        <input type="checkbox" id="remember" />
                                        <label htmlFor="remember" className="checkbox-label">Remember me on this device</label>
                                    </div>
                                    <button className="btn-auth-submit" type="submit" disabled={loading}>
                                        {loading ? <><span className="spinner" />Signing in…</> : <span>Sign In →</span>}
                                    </button>
                                </form>
                                <div className="or-divider"><span className="or-line" />or continue with<span className="or-line" /></div>
                                <div className="social-logins">
                                    <button type="button" className="btn-social" onClick={() => window.location.href = 'http://localhost:5001/api/v1/auth/google'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        Google
                                    </button>

                                </div>
                                <p className="switch-text">Don't have an account? <span className="switch-link" onClick={() => setTab('signup')}>Create one free →</span></p>
                            </div>
                        )}

                        {/* SIGNUP */}
                        {tab === 'signup' && (
                            <div className="au">
                                <div className="form-eyebrow"><span className="form-eyebrow-line" />New Account</div>
                                <h1 className="form-title">Create your<br /><em>account</em></h1>
                                <p className="form-subtitle">Start exploring Kerala's finest teak furniture.</p>
                                
                                {error && <div className="auth-error-msg" style={{color: 'red', marginBottom: '1rem', fontSize: '0.85rem'}}>{error}</div>}

                                <form onSubmit={handleSignup}>
                                    <div className="auth-field">
                                        <label>Full Name</label>
                                        <div className="input-wrap"><span className="input-icon">👤</span><input type="text" placeholder="Arjun Menon" value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
                                    </div>
                                    <div className="auth-field">
                                        <label>Email Address</label>
                                        <div className="input-wrap"><span className="input-icon">✉</span><input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                                    </div>
                                    <div className="auth-field">
                                        <label>Password</label>
                                        <div className="input-wrap"><span className="input-icon">🔒</span>
                                            <input type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                                            <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>{showPw ? 'Hide' : 'Show'}</button>
                                        </div>
                                    </div>
                                    <div className="auth-checkbox-row" style={{ marginTop: '.8rem' }}>
                                        <input type="checkbox" id="terms" />
                                        <label htmlFor="terms" className="checkbox-label">I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></label>
                                    </div>
                                    <button className="btn-auth-submit" type="submit" disabled={loading}>
                                        {loading ? <><span className="spinner" />Creating Account…</> : <span>Create Account →</span>}
                                    </button>
                                </form>
                                <div className="or-divider"><span className="or-line" />or continue with<span className="or-line" /></div>
                                <div className="social-logins">
                                    <button type="button" className="btn-social" onClick={() => window.location.href = 'http://localhost:5001/api/v1/auth/google'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        Google
                                    </button>
                                </div>
                                <p className="switch-text">Already have an account? <span className="switch-link" onClick={() => setTab('login')}>Sign in →</span></p>
                            </div>
                        )}


                    </div>
                    <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
                        <Link to="/" style={{ fontSize: '.7rem', color: 'var(--amber)' }}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
