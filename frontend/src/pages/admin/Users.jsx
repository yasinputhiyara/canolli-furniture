import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { getAdminUsers } from "../../services/adminService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout title="Customers" breadcrumb="Admin / Customers">
      <div className="admin-panel adm-au adm-d2">
        <div className="admin-panel-header">
          <div>
            <div className="admin-panel-title">Registered Customers</div>
            <div className="admin-panel-sub">Manage your store's users</div>
          </div>
        </div>
        
        {loading ? (
          <div style={{ padding: "2rem", textAlign: "center" }}>Loading customers...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 600, fontFamily: "'Playfair Display', serif", fontSize: "0.82rem" }}>
                      #{u._id.substring(u._id.length - 6).toUpperCase()}
                    </td>
                    <td>{u.name}</td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.85rem" }}>{u.email}</td>
                    <td style={{ color: "var(--adm-muted)", fontSize: "0.75rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`adm-badge ${u.isBlocked ? "adm-badge-danger" : "adm-badge-success"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center", padding: "2rem" }}>
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
