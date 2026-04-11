import axiosInstance from "./axiosInstance";

export const getDashboardStats = async () => {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

// --- Categories ---
export const getAdminCategories = async () => {
  const res = await axiosInstance.get("/admin/categories");
  return res.data;
};

export const addCategory = async (formData) => {
  const res = await axiosInstance.post("/admin/categories", formData);
  return res.data;
};

export const updateCategory = async (id, formData) => {
  const res = await axiosInstance.put(`/admin/categories/${id}`, formData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axiosInstance.delete(`/admin/categories/${id}`);
  return res.data;
};
