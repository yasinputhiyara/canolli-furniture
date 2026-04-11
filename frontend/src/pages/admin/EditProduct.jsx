import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getProductById, updateProduct, getAllCategories } from "../../services/productService";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  
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
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        const p = data.product || data;
        
        setProduct((prev) => ({
          ...prev,
          name: p.name || "",
          price: p.price || "",
          discountPrice: p.discountPrice || "",
          stock: p.stockCount ?? p.stock ?? "",
          category: p.category?.name || p.category || "",
          description: p.description || "",
          material: p.material || "",
        }));

        if (p.images) setExistingImages(p.images);
        if (p.videos) setExistingVideos(p.videos);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    
    const fetchCats = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    
    fetchCats();
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // --- NEW MEDIA HANDLERS ---
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, images: [...(prev.images || []), ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewPreview = (idx) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setProduct((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleVideos = (e) => {
    const files = Array.from(e.target.files);
    setProduct((prev) => ({ ...prev, videos: [...(prev.videos || []), ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setVideoPreviews((prev) => [...prev, ...previews]);
  };

  const removeNewVideoPreview = (idx) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== idx));
    setProduct((prev) => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));
  };

  // --- EXISTING MEDIA REMOVERS ---
  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeExistingVideo = (idx) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const totalImages = existingImages.length + product.images.length;
    if (totalImages < 3) {
      setErrorMsg("At least 3 photos are required.");
      window.scrollTo(0, 0);
      return;
    }

    const totalVideos = existingVideos.length + product.videos.length;
    if (totalVideos > 2) {
      setErrorMsg("A maximum of 2 videos can be added.");
      window.scrollTo(0, 0);
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      if (product.discountPrice) formData.append("discountPrice", product.discountPrice);
      formData.append("stock", product.stock);
      formData.append("category", product.category);
      formData.append("description", product.description);
      formData.append("material", product.material);

      // Append Existing URLs to keep
      for (const url of existingImages) formData.append("existingImages", url);
      for (const url of existingVideos) formData.append("existingVideos", url);

      // Append New Files
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

      await updateProduct(id, formData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error updating product. Please try again.");
      window.scrollTo(0, 0);
    } finally {
      setSaving(false);
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
            <span>✅</span> Product updated safely! Redirecting…
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
                <input type="file" multiple accept="image/*" onChange={handleImages} />
                <div className="admin-upload-icon">📷</div>
                <div className="admin-upload-label">Drag new images here</div>
                <div className="admin-upload-hint">Upload new files to append (3 photos total combined min)</div>
              </div>

              {(existingImages.length > 0 || imagePreviews.length > 0) && (
                <div className="admin-image-preview-grid">
                  
                  {existingImages.map((src, i) => (
                    <div className="admin-img-preview" key={`old-${i}`}>
                      <img src={src} alt="Existing product" />
                      <div className="existing-badge" style={{position:'absolute', bottom:'5px', left:'5px', background:'rgba(0,0,0,0.6)', color:'#fff', padding:'2px 6px', borderRadius:'10px', fontSize:'10px'}}>Saved</div>
                      <button type="button" className="admin-img-preview-remove" onClick={() => removeExistingImage(i)}>×</button>
                    </div>
                  ))}

                  {imagePreviews.map((src, i) => (
                    <div className="admin-img-preview" key={`new-${i}`}>
                      <img src={src} alt="New Upload" />
                      <div className="existing-badge" style={{position:'absolute', bottom:'5px', left:'5px', background:'green', color:'#fff', padding:'2px 6px', borderRadius:'10px', fontSize:'10px'}}>New</div>
                      <button type="button" className="admin-img-preview-remove" onClick={() => removeNewPreview(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── VIDEOS ── */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">Product Videos</div>
              
              <div className="admin-upload-area">
                <input type="file" multiple accept="video/*" onChange={handleVideos} />
                <div className="admin-upload-icon">🎥</div>
                <div className="admin-upload-label">Drag new videos here</div>
                <div className="admin-upload-hint">Upload new files to append (Max 2 total combined)</div>
              </div>

              {(existingVideos.length > 0 || videoPreviews.length > 0) && (
                <div className="admin-image-preview-grid">
                  
                  {existingVideos.map((src, i) => (
                    <div className="admin-img-preview" key={`vold-${i}`}>
                      <video src={src} controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      <div className="existing-badge" style={{position:'absolute', bottom:'5px', left:'25px', background:'rgba(0,0,0,0.6)', color:'#fff', padding:'2px 6px', borderRadius:'10px', fontSize:'10px'}}>Saved</div>
                      <button type="button" className="admin-img-preview-remove" onClick={() => removeExistingVideo(i)}>×</button>
                    </div>
                  ))}

                  {videoPreviews.map((src, i) => (
                    <div className="admin-img-preview" key={`vnew-${i}`}>
                      <video src={src} controls style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                      <div className="existing-badge" style={{position:'absolute', bottom:'5px', left:'25px', background:'green', color:'#fff', padding:'2px 6px', borderRadius:'10px', fontSize:'10px'}}>New</div>
                      <button type="button" className="admin-img-preview-remove" onClick={() => removeNewVideoPreview(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          <div className="admin-form-footer">
            <button type="button" className="adm-btn-secondary" onClick={() => navigate("/admin/products")}>
              Cancel
            </button>
            <button type="submit" className="adm-btn-primary" disabled={saving}>
              <span>{saving ? "Updating..." : "✓ Update Product"}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
