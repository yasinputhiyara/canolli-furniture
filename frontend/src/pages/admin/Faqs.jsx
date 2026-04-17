import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq
} from "../../services/faqService";
import "../../styles/Admin.css";

const EMPTY_FORM = {
  question: "",
  answer: "",
  isActive: true,
  order: 0
};

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getAdminFaqs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleEdit = (faq) => {
    setEditingId(faq._id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      order: faq.order || 0
    });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
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
      if (editingId) {
        await updateFaq(editingId, form);
        setSuccess("FAQ updated successfully!");
      } else {
        await createFaq(form);
        setSuccess("FAQ added successfully!");
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
    if (!window.confirm("Delete this FAQ?")) return;
    setDeleting(id);
    try {
      await deleteFaq(id);
      setFaqs(prev => prev.filter(f => f._id !== id));
    } catch {
      setError("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout title="FAQs" breadcrumb="Admin / FAQs">
      <div className="admin-toolbar">
        <div>
          <div className="admin-topbar-title" style={{ fontSize: "1rem" }}>
            Frequently Asked Questions
          </div>
          <div className="admin-topbar-breadcrumb">{faqs.length} total questions</div>
        </div>
        {!showForm && (
          <button
            className="adm-btn-primary"
            onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}
          >
            <span>+ Add FAQ</span>
          </button>
        )}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="admin-form-panel" style={{ marginBottom: "2rem" }}>
          <div className="admin-panel-header">
            <div>
              <div className="admin-panel-title">{editingId ? "Edit FAQ" : "Add New FAQ"}</div>
              <div className="admin-panel-sub">Fill in the question and answer below</div>
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
              <div className="admin-form-section-title">FAQ Details</div>
              
              <div className="admin-form-field">
                <label className="admin-form-label">Question *</label>
                <input
                  className="admin-form-input"
                  type="text"
                  placeholder="e.g. How is the delivery charge calculated?"
                  value={form.question}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-field" style={{ marginTop: "1rem" }}>
                <label className="admin-form-label">Answer *</label>
                <textarea
                  className="admin-form-input"
                  rows={5}
                  placeholder="Provide a detailed answer here..."
                  value={form.answer}
                  onChange={e => setForm({ ...form, answer: e.target.value })}
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
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-muted)", marginTop: "4px" }}>
                    Lower numbers appear first.
                  </div>
                </div>
                <div className="admin-form-field" style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label className="admin-form-label">Status</label>
                    <div className="admin-switch">
                      <input
                        type="checkbox"
                        id="faq-status"
                        checked={form.isActive}
                        onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      />
                      <label htmlFor="faq-status"></label>
                    </div>
                    <span>Show on homepage</span>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.2rem 1.5rem", display: "flex", gap: "0.8rem", borderTop: "1px solid var(--adm-border)" }}>
              <button type="submit" className="adm-btn-primary" disabled={saving}>
                <span>{saving ? "Saving…" : (editingId ? "Update FAQ" : "Add FAQ")}</span>
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
            <div className="admin-panel-title">All FAQs</div>
            <div className="admin-panel-sub">Manage questions shown on the homepage</div>
          </div>
          {!showForm && (
            <button className="adm-btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}>
              <span>+ Add FAQ</span>
            </button>
          )}
        </div>
        <div className="admin-table-wrap">
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-muted)" }}>Loading…</div>
          ) : faqs.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--adm-muted)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>❓</div>
              <div>No FAQs yet. Add your first one!</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map(faq => (
                  <tr key={faq._id}>
                    <td style={{ fontWeight: 600, color: "var(--adm-bark)", maxWidth: 200, whiteSpace: "normal" }}>
                      {faq.question}
                    </td>
                    <td style={{ maxWidth: 350 }}>
                      <div style={{ fontSize: "0.8rem", color: "var(--adm-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {faq.answer}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge ${faq.isActive ? "adm-badge-success" : "adm-badge-danger"}`}>
                        {faq.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", fontWeight: 600 }}>{faq.order}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="adm-btn-icon" title="Edit" onClick={() => handleEdit(faq)}>✏️</button>
                        <button
                          className="adm-btn-icon danger"
                          title="Delete"
                          onClick={() => handleDelete(faq._id)}
                          disabled={deleting === faq._id}
                        >
                          {deleting === faq._id ? "…" : "🗑️"}
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
