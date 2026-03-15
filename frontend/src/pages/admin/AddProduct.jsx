import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { createProduct } from "../../services/productService";

const CATEGORIES = [
  "Living Room", "Bedroom", "Dining", "Office", "Outdoor", "Accessories"
];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    material: "",
    dimensions: "",
    images: null,
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = e.target.files;
    setProduct({ ...product, images: files });
    const previews = [];
    for (const file of files) {
      previews.push(URL.createObjectURL(file));
    }
    setImagePreviews(previews);
  };

  const removePreview = (idx) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProduct(product);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error) {
      console.error(error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Add Product" breadcrumb="Admin / Products / Add">

      <div style={{ maxWidth: "860px" }}>

        {success && (
          <div
            className="admin-login-error"
            style={{ background: "var(--adm-success-bg)", color: "var(--adm-success)", borderColor: "rgba(45,122,79,0.2)", marginBottom: "1.25rem" }}
          >
            <span>✅</span> Product added successfully! Redirecting…
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

            {/* ── IMAGES ── */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">Product Images</div>
              <div className="admin-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                />
                <div className="admin-upload-icon">📷</div>
                <div className="admin-upload-label">Click or drag images here</div>
                <div className="admin-upload-hint">PNG, JPG or WEBP · Up to 5 MB each</div>
              </div>
              {imagePreviews.length > 0 && (
                <div className="admin-image-preview-grid">
                  {imagePreviews.map((src, i) => (
                    <div className="admin-img-preview" key={i}>
                      <img src={src} alt={`Preview ${i + 1}`} />
                      <button
                        type="button"
                        className="admin-img-preview-remove"
                        onClick={() => removePreview(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={loading}
            >
              <span>{loading ? "Adding Product…" : "✓ Add Product"}</span>
            </button>
          </div>
        </form>
      </div>

    </AdminLayout>
  );
}
