import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from "../../services/testimonialService";
import "../../styles/Admin.css";

const EMPTY_FORM = {
  name: "",
  rating: 5,
  description: "",
  location: "",
  isActive: true,
  order: 0
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getAdminTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      name: t.name,
      rating: t.rating,
      description: t.description,
      location: t.location || "",
      isActive: t.isActive,
      order: t.order || 0
    });
    setPhotoPreview(t.photo || "");
    setPhotoFile(null);
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setPhotoFile(null);
    setPhotoPreview("");
    setEditingId(null);
    setShowForm(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("rating", form.rating);
      fd.append("description", form.description);
      fd.append("location", form.location);
      fd.append("isActive", form.isActive);
      fd.append("order", form.order);
      if (photoFile) fd.append("photo", photoFile);

      if (editingId) {
        await updateTestimonial(editingId, fd);
        setSuccess("Testimonial updated successfully!");
      } else {
        await createTestimonial(fd);
        setSuccess("Testimonial added successfully!");
      }
      handleReset();
      fetchAll();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      await deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t._id !== id));
    } catch {
      setError("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const StarDisplay = ({ count }) => (
    <span style={{ color: "#D4A958", letterSpacing: "1px" }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );

  return (
    <AdminLayout title="Testimonials" breadcrumb="Admin / Testimonials">
      <div className="admin-toolbar">
        <div>
          <div className="admin-topbar-title" style={{ fontSize: "1rem" }}>
            Customer Testimonials
          </div>
          <div className="admin-topbar-breadcrumb">{testimonials.length} total reviews</div>
        </div>
        {!showForm && (
          <button
            className="adm-btn-primary"
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
          >
            <span>+ Add Testimonial</span>
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="admin-form-panel" style={{ marginBottom: "2rem" }}>
          <div className="admin-panel-header">
            <div>
              <div className="admin-panel-title">{editingId ? "Edit Testimonial" : "Add New Testimonial"}</div>
              <div className="admin-panel-sub">Fill in the customer details below</div>
            </div>
          </div>

          {error && (
            <div style={{ margin: "1rem 1.5rem", padding: "0.75rem 1rem", background: "#FFF2F4", border: "1px solid rgba(155,35,53,.2)", borderRadius: "6px", color: "#9B2335", fontSize: "0.85rem" }}>
              ⚠ {error}
            </div>
          )}
          {success && (
            <div style={{ margin: "1rem 1.5rem", padding: "0.75rem 1rem", background: "#F0FBF5", border: "1px solid rgba(45,122,79,.2)", borderRadius: "6px", color: "#2D7A4F", fontSize: "0.85rem" }}>
              ✓ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="admin-form-section">
              <div className="admin-form-section-title">Customer Photo</div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                {photoPreview ? (
                  <img src={photoPreview} alt="preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--adm-gold)" }} />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--adm-parch)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", border: "2px dashed var(--adm-border)" }}>👤</div>
                )}
                <div>
                  <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                  <label htmlFor="photo-upload" className="adm-btn-secondary" style={{ cursor: "pointer", display: "inline-flex" }}>
                    {photoPreview ? "Change Photo" : "Upload Photo"}
                  </label>
                  <div style={{ fontSize: "0.72rem", color: "var(--adm-muted)", marginTop: "0.4rem" }}>JPG, PNG – max 10MB</div>
                </div>
              </div>
            </div>

            <div className="admin-form-section">
              <div className="admin-form-section-title">Customer Details</div>
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label className="admin-form-label">Full Name *</label>
                  <input
                    className="admin-form-input"
                    type="text"
                    placeholder="e.g. Rahul Menon"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-field">
                  <label className="admin-form-label">Location</label>
                  <input
                    className="admin-form-input"
                    type="text"
                    placeholder="e.g. Kochi, Kerala"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-field" style={{ marginTop: "1rem" }}>
                <label className="admin-form-label">Rating *</label>
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "1.8rem", color: star <= form.rating ? "#D4A958" : "#ddd",
                        transition: "color 0.15s"
                      }}
                    >★</button>
                  ))}
                  <span style={{ alignSelf: "center", fontSize: "0.85rem", color: "var(--adm-muted)", marginLeft: "0.5rem" }}>
                    {form.rating} / 5
                  </span>
                </div>
              </div>

              <div className="admin-form-field" style={{ marginTop: "1rem" }}>
                <label className="admin-form-label">Review / Description *</label>
                <textarea
                  className="admin-form-input"
                  rows={4}
                  placeholder="What did the customer say about us?"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <div className="admin-form-section">
              <div className="admin-form-section-title">Display Settings</div>
              <div className="admin-form-grid">
                <div className="admin-form-field">
                  <label className="admin-form-label">Display Order</label>
                  <input
                    className="admin-form-input"
                    type="number"
                    min={0}
                    value={form.order}
                    onChange={e => setForm({ ...form, order: e.target.value })}
                  />
                </div>
                <div className="admin-form-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label className="admin-form-label">Status</label>
                    <div className="admin-switch">
                      <input
                        type="checkbox"
                        id="t-status"
                        checked={form.isActive}
                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      />
                      <label htmlFor="t-status"></label>
                    </div>
                    <span>Show on homepage</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.2rem 1.5rem", display: "flex", gap: "0.8rem", borderTop: "1px solid var(--adm-border)" }}>
              <button type="submit" className="adm-btn-primary" disabled={saving}>
                <span>{saving ? "Saving…" : (editingId ? "Update Testimonial" : "Add Testimonial")}</span>
              </button>
              <button type="button" className="adm-btn-secondary" onClick={handleReset}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">All Testimonials</div>
            <div className="admin-panel-sub">Manage customer reviews shown on the homepage</div>
          </div>
          {!showForm && (
            <button className="adm-btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}>
              <span>+ Add</span>
            </button>
          )}
        </div>
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-muted)" }}>Loading…</div>
          ) : testimonials.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>💬</div>
              <div>No testimonials yet. Add your first one!</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {t.photo ? (
                          <img src={t.photo} alt={t.name} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--adm-border)" }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--adm-gold), var(--adm-teak))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>
                            {t.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--adm-bark)" }}>{t.name}</span>
                      </div>
                    </td>
                    <td><StarDisplay count={t.rating} /></td>
                    <td style={{ maxWidth: 280 }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--adm-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 260 }}>
                        "{t.description}"
                      </div>
                    </td>
                    <td style={{ fontSize: "0.8rem", color: "var(--adm-muted)" }}>{t.location || "—"}</td>
                    <td>
                      <span className={`adm-badge ${t.isActive ? "adm-badge-success" : "adm-badge-danger"}`}>
                        {t.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", fontWeight: 600 }}>{t.order}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="adm-btn-icon" title="Edit" onClick={() => handleEdit(t)}>✏️</button>
                        <button
                          className="adm-btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(t._id)}
                          disabled={deleting === t._id}
                        >
                          {deleting === t._id ? "…" : "🗑️"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
