import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import { getAdminProducts, deleteProduct } from "../../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAdminProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => (p._id || p.id) !== id));
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout title="Products" breadcrumb="Admin / Products">
        <div className="admin-loading">
          <div className="admin-spinner" />
          <div className="admin-loading-text">Loading products…</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products" breadcrumb="Admin / Products">

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="admin-search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--adm-muted)" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <Link to="/admin/products/add" className="adm-btn-primary">
            <span>+</span>
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-panel adm-au">
        <div className="admin-table-wrap">
          {filtered.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">🪑</div>
              <div className="admin-empty-title">
                {search ? "No products found" : "No products yet"}
              </div>
              <div className="admin-empty-desc">
                {search
                  ? `No results for "${search}". Try a different search.`
                  : "Start adding products to your catalogue."}
              </div>
              {!search && (
                <Link to="/admin/products/add" className="adm-btn-primary">
                  <span>+ Add First Product</span>
                </Link>
              )}
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const id = p._id || p.id;
                  const stock = p.stockCount ?? p.stock ?? 0;
                  const imgSrc = Array.isArray(p.images) ? p.images[0] : p.image;

                  return (
                    <tr key={id}>
                      <td>
                        <div className="admin-table-product-cell">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={p.name}
                              className="admin-table-product-img"
                            />
                          ) : (
                            <div className="admin-table-product-img-placeholder">🪑</div>
                          )}
                          <div>
                            <div className="admin-table-product-name">{p.name}</div>
                            {p.category && (
                              <div className="admin-table-product-cat">{p.category.name || p.category}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-table-price">
                          ₹{Number(p.price).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`adm-badge ${
                            stock > 10
                              ? "adm-badge-success"
                              : stock > 0
                              ? "adm-badge-warning"
                              : "adm-badge-danger"
                          }`}
                        >
                          {stock > 0 ? `${stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td>
                        <span className={`adm-badge ${stock > 0 ? "adm-badge-success" : "adm-badge-danger"}`}>
                          {stock > 0 ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/products/edit/${id}`}
                            className="adm-btn-icon"
                            title="Edit product"
                          >
                            ✏️
                          </Link>
                          <button
                            className="adm-btn-icon danger"
                            title="Delete product"
                            onClick={() => handleDelete(id)}
                            disabled={deleting === id}
                            style={{ opacity: deleting === id ? 0.5 : 1 }}
                          >
                            {deleting === id ? "…" : "🗑️"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </AdminLayout>
  );
}
