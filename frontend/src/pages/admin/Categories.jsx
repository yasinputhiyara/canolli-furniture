import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  getAdminCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from "../../services/adminService";
import { showToast } from "../../components/layout/Toast";
import "../../styles/Admin.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load categories", "❌");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setName(""); setDescription(""); setFile(null); setPreview(null);
    setEditingCatId(null); setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setName(cat.name); setDescription(cat.description || "");
    setFile(null); setPreview(cat.bannerImage || null);
    setEditingCatId(cat._id); setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { showToast("Category name is required", "❌"); return; }
    try {
      setIsSubmitting(true);
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", description);
      if (file) fd.append("bannerImage", file);

      if (editingCatId) {
        await updateCategory(editingCatId, fd);
        showToast("Category updated successfully", "✅");
      } else {
        await addCategory(fd);
        showToast("Category added successfully", "✅");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      showToast(err?.response?.data?.message || "Operation failed", "❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      showToast("Category deleted", "🗑️");
      setCategories(cats => cats.filter(c => c._id !== id));
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to delete", "❌");
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Categories" breadcrumb="Admin / Categories">

      {/* ── Toolbar ── */}
      <div className="admin-toolbar">
        <div>
          <div className="admin-topbar-title" style={{ fontSize: "1rem" }}>Product Categories</div>
          <div className="admin-topbar-breadcrumb">{categories.length} total categories</div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div className="admin-search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="admin-search"
              type="text"
              placeholder="Search categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="adm-btn-primary" onClick={openAddModal}>
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {/* ── Table Panel ── */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">All Categories</div>
            <div className="admin-panel-sub">Manage your furniture collections and categories</div>
          </div>
        </div>
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <span className="admin-loading-text">Loading categories…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🏷️</div>
              <div className="admin-empty-title">No categories found</div>
              <div className="admin-empty-desc">
                {search ? `No results for "${search}"` : "Add your first category to get started."}
              </div>
              {!search && (
                <button className="adm-btn-primary" onClick={openAddModal}>
                  <span>+ Add Category</span>
                </button>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Banner</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(cat => (
                  <tr key={cat._id}>
                    <td>
                      {cat.bannerImage ? (
                        <img
                          src={cat.bannerImage}
                          alt={cat.name}
                          className="admin-table-product-img"
                          style={{ borderRadius: "8px" }}
                        />
                      ) : (
                        <div className="admin-table-product-img-placeholder">🏷️</div>
                      )}
                    </td>
                    <td>
                      <div className="admin-table-product-name">{cat.name}</div>
                    </td>
                    <td style={{ maxWidth: 260 }}>
                      <div style={{ fontSize: "0.82rem", color: "var(--adm-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>
                        {cat.description || <span style={{ opacity: 0.5, fontStyle: "italic" }}>No description</span>}
                      </div>
                    </td>
                    <td>
                      <span className="adm-badge adm-badge-gold">
                        {cat.productCount ?? 0} products
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button className="adm-btn-icon" title="Edit" onClick={() => openEditModal(cat)}>✏️</button>
                        <button className="adm-btn-icon danger" title="Delete" onClick={() => handleDelete(cat._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(15, 9, 5, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
            animation: "slideUp 0.25s ease"
          }}
          onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div style={{
            background: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "520px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 24px 80px rgba(15, 9, 5, 0.2)"
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "1.75rem 2rem 1.25rem",
              borderBottom: "1px solid var(--adm-border)",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <div className="admin-panel-title">
                  {editingCatId ? "Edit Category" : "Add New Category"}
                </div>
                <div className="admin-panel-sub">Fill in the category details below</div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  width: 36, height: 36, borderRadius: "8px", border: "1px solid var(--adm-border)",
                  background: "white", cursor: "pointer", fontSize: "1rem", color: "var(--adm-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >✕</button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ padding: "1.75rem 2rem" }}>
              {/* Name */}
              <div className="admin-form-field" style={{ marginBottom: "1.25rem" }}>
                <label className="admin-form-label">Category Name *</label>
                <input
                  className="admin-form-input"
                  type="text"
                  placeholder="e.g. Dining Sets"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div className="admin-form-field" style={{ marginBottom: "1.25rem" }}>
                <label className="admin-form-label">Description</label>
                <textarea
                  className="admin-form-input"
                  rows={3}
                  placeholder="Brief description of this collection…"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Image Upload */}
              <div className="admin-form-field" style={{ marginBottom: "1.5rem" }}>
                <label className="admin-form-label">Banner Image</label>
                <div className="admin-upload-area">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  <div className="admin-upload-icon">🖼️</div>
                  <div className="admin-upload-label">
                    {file ? file.name : "Click or drag to upload"}
                  </div>
                  <div className="admin-upload-hint">JPG, PNG, WEBP – max 10 MB</div>
                </div>
                {preview && (
                  <div style={{ marginTop: "1rem", borderRadius: "10px", overflow: "hidden", height: "140px" }}>
                    <img
                      src={preview}
                      alt="Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "1px solid var(--adm-border)" }}>
                <button type="button" className="adm-btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary" disabled={isSubmitting}>
                  <span>{isSubmitting ? "Saving…" : (editingCatId ? "Update Category" : "Save Category")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
