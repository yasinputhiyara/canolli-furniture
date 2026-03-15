import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getProductById, updateProduct } from "../../services/productService";

const CATEGORIES = [
  "Living Room", "Bedroom", "Dining", "Office", "Outdoor", "Accessories"
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    material: "",
    dimensions: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        const p = data.product;
        setProduct({
          name: p.name || "",
          price: p.price || "",
          stock: p.stockCount ?? p.stock ?? "",
          category: p.category || "",
          description: p.description || "",
          material: p.material || "",
          dimensions: p.dimensions || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProduct(id, product);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error(err);
      alert("Error updating product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product" breadcrumb="Admin / Products / Edit">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <div className="admin-loading-text">Loading product…</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product" breadcrumb="Admin / Products / Edit">

      <div style={{ maxWidth: "860px" }}>

        {success && (
          <div
            className="admin-login-error"
            style={{ background: "var(--adm-success-bg)", color: "var(--adm-success)", borderColor: "rgba(45,122,79,0.2)", marginBottom: "1.25rem" }}
          >
            <span>✅</span> Product updated successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-panel adm-au">

            {/* ── BASIC INFO ── */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">Basic Information</div>
              <div className="admin-form-grid">
                <div className="admin-field full-width">
                  <label className="admin-label">Product Name *</label>
                  <input
                    name="name"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Elan Modular Sofa"
                    value={product.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Category</label>
                  <select
                    name="category"
                    className="admin-select"
                    value={product.category}
                    onChange={handleChange}
                  >
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Material</label>
                  <input
                    name="material"
                    type="text"
                    className="admin-input"
                    placeholder="e.g. Solid Oak, Velvet"
                    value={product.material}
                    onChange={handleChange}
                  />
                </div>
                <div className="admin-field full-width">
                  <label className="admin-label">Description</label>
                  <textarea
                    name="description"
                    className="admin-textarea"
                    placeholder="Write a detailed product description…"
                    value={product.description}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* ── PRICING & STOCK ── */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">Pricing & Inventory</div>
              <div className="admin-form-grid grid-3">
                <div className="admin-field">
                  <label className="admin-label">Price (₹) *</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    className="admin-input"
                    placeholder="0.00"
                    value={product.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Stock Quantity *</label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    className="admin-input"
                    placeholder="0"
                    value={product.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Dimensions</label>
                  <input
                    name="dimensions"
                    type="text"
                    className="admin-input"
                    placeholder="L × W × H cm"
                    value={product.dimensions}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ── FORM FOOTER ── */}
          <div className="admin-form-footer">
            <button
              type="button"
              className="adm-btn-secondary"
              onClick={() => navigate("/admin/products")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="adm-btn-primary"
              disabled={saving}
            >
              <span>{saving ? "Saving…" : "✓ Update Product"}</span>
            </button>
          </div>
        </form>
      </div>

    </AdminLayout>
  );
}
