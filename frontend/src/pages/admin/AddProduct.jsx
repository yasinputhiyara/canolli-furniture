import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { createProduct, getAllCategories } from "../../services/productService";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "",
    description: "",
    material: "",
    images: [],
    videos: [],
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, images: [...(prev.images || []), ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removePreview = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleVideos = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, videos: [...(prev.videos || []), ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...previews]);
  };

  const removeVideoPreview = (idx) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setProduct((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!product.images || product.images.length < 3) {
      setErrorMsg("At least 3 photos are required.");
      return;
    }
    if (product.videos && product.videos.length > 2) {
      setErrorMsg("A maximum of 2 videos can be uploaded.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      if (product.discountPrice) formData.append("discountPrice", product.discountPrice);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("material", product.material);

      if (product.images) {
        for (let i = 0; i < product.images.length; i++) {
          formData.append("images", product.images[i]);
        }
      }
      
      if (product.videos) {
        for (let i = 0; i < product.videos.length; i++) {
          formData.append("videos", product.videos[i]);
        }
      }

      await createProduct(formData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  let discountPercent = 0;
  if (product.price && product.discountPrice) {
    const orig = Number(product.price);
    const offer = Number(product.discountPrice);
    if (orig > 0 && offer > 0 && orig > offer) {
      discountPercent = Math.round(((orig - offer) / orig) * 100);
    }
  }

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

        {errorMsg && (
          <div className="admin-login-error" style={{ marginBottom: "1.25rem" }}>
            <span>⚠️</span> {errorMsg}
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
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
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
                  <label className="admin-label">Original Price (₹) *</label>
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
                  <label className="admin-label">
                    Offer Price (₹) {discountPercent > 0 && <span style={{color: "green", marginLeft: "8px"}}>({discountPercent}% Off)</span>}
                  </label>
                  <input
                    name="discountPrice"
                    type="number"
                    min="0"
                    className="admin-input"
                    placeholder="0.00"
                    value={product.discountPrice}
                    onChange={handleChange}
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
                <div className="admin-upload-hint">PNG, JPG or WEBP · Up to 5 MB each (At least 3 required)</div>
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

            {/* ── VIDEOS ── */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">Product Videos</div>
              <div className="admin-upload-area">
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideos}
                />
                <div className="admin-upload-icon">🎥</div>
                <div className="admin-upload-label">Click or drag videos here</div>
                <div className="admin-upload-hint">MP4, WEBM · Up to 50 MB each (Max 2)</div>
              </div>
              {videoPreviews.length > 0 && (
                <div className="admin-image-preview-grid">
                  {videoPreviews.map((src, i) => (
                    <div className="admin-img-preview" key={i}>
                      <video src={src} controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      <button
                        type="button"
                        className="admin-img-preview-remove"
                        onClick={() => removeVideoPreview(i)}
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
