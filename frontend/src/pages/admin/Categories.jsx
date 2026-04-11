import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { 
  getAdminCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from "../../services/adminService";
import { showToast } from "../../components/layout/Toast";
import "../../styles/Admin.css"; // Reuse existing styles if possible or add basic table styling

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      showToast("Failed to load categories", "❌");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setName("");
    setDescription("");
    setFile(null);
    setPreview(null);
    setEditingCatId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setName(cat.name);
    setDescription(cat.description || "");
    setFile(null);
    setPreview(cat.bannerImage || null);
    setEditingCatId(cat._id);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast("Category name is required", "❌");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("bannerImage", file);
      }

      if (editingCatId) {
        await updateCategory(editingCatId, formData);
        showToast("Category updated successfully", "✅");
      } else {
        await addCategory(formData);
        showToast("Category added successfully", "✅");
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      showToast(error?.response?.data?.message || "Operation failed", "❌");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      showToast("Category deleted", "🗑️");
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to delete category", "❌");
    }
  };

  return (
    <AdminLayout title="Categories" breadcrumb="Admin / Categories">
      <div className="admin-page-header">
        <div className="admin-page-search">
          <input type="text" placeholder="Search categories..." />
        </div>
        <button className="btn-admin-primary" onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>No categories found.</div>
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
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    {cat.bannerImage ? (
                      <img src={cat.bannerImage} alt={cat.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏷️</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{cat.name}</td>
                  <td>{cat.description || <span style={{color: '#999'}}>No description</span>}</td>
                  <td>
                     <span style={{ 
                        background: 'rgba(184, 136, 60, 0.1)', 
                        color: 'var(--gold, #b8883c)',
                        padding: '4px 8px', 
                        borderRadius: '100px', 
                        fontWeight: 'bold', 
                        fontSize: '0.8rem' 
                     }}>
                       {cat.productCount || 0}
                     </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button className="btn-icon" onClick={() => openEditModal(cat)} title="Edit">✏️</button>
                      <button className="btn-icon danger" onClick={() => handleDelete(cat._id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content" style={{ 
            background: 'white', padding: '2rem', borderRadius: '8px', 
            width: '100%', maxWidth: '500px',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Playfair Display, serif' }}>
              {editingCatId ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Category Name *</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Description</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={3}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: '#555' }}>Banner Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px dashed #ccc', borderRadius: '4px' }}
                />
                {preview && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>Preview:</p>
                    <img src={preview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'var(--bark, #2c1f14)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
