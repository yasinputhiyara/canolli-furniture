import { useState } from 'react';
import '../styles/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send an email and save to DB
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div className="contact-page">
      {/* ── HERO SECTION ── */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have a project in mind or need assistance with our furniture? 
            Our master craftsmen and support team are here to help.
          </p>
        </div>
      </section>

      <div className="contact-container container">
        <div className="contact-grid">
          
          {/* ── LEFT: CONTACT INFO ── */}
          <div className="contact-info">
            <h2 className="info-title">Connect with Us</h2>
            <p className="info-desc">
              Visit our workshop in the heart of Nilambur or reach out through any of these channels.
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div className="info-text">
                  <h3>Our Workshop</h3>
                  <p>Canolli Wood Furniture, Nilambur, Malappuram, Kerala 679329</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div className="info-text">
                  <h3>Phone Number</h3>
                  <p>+91 97785 20190</p>
                  <p className="info-sub">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div className="info-text">
                  <h3>Email Address</h3>
                  <p>yasinmuhammed332@gmail.com</p>
                  <p className="info-sub">We usually reply within 24 hours.</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">💬</div>
                <div className="info-text">
                  <h3>Social Connect</h3>
                  <div className="contact-socials">
                    <a href="#" className="social-link">Instagram</a>
                    <a href="#" className="social-link">Facebook</a>
                    <a href="#" className="social-link">WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: CONTACT FORM ── */}
          <div className="contact-form-wrap">
            <div className="contact-card">
              <h2 className="card-title">Send a Message</h2>
              
              {status === 'success' && (
                <div className="contact-alert success">
                  <span className="alert-icon">✓</span>
                  <div className="alert-body">
                    <strong>Message Sent!</strong>
                    <span>Thank you for reaching out. We'll get back to you soon.</span>
                  </div>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Rahul Menon"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="contact-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="contact-group">
                  <label>Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?"
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="contact-group">
                  <label>Message</label>
                  <textarea 
                    rows={4} 
                    placeholder="Share your thoughts or requirements..."
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  <span>Send Message</span>
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAP SECTION ── */}
      <section className="contact-map-section">
        <div className="map-header">
          <h2 className="map-title">Locate Our Studio</h2>
          <div className="map-badge">Nilambur, Kerala</div>
        </div>
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.7839556817507!2d76.13371997504808!3d11.203614388972367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6390f03d8c60f%3A0x360818732633cde6!2sCanolli%20Wood%20Furniture!5e0!3m2!1sen!2sin!4v1776345357991!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Canolli Furniture Workshop"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
