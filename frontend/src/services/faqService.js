import axiosInstance from "./axiosInstance";

// Note: axiosInstance has baseURL: http://localhost:5001/api/v1
// Admin routes are protected by the interceptor in axiosInstance using localStorage.getItem("adminToken")

/** PUBLIC API */
export const getPublicFaqs = async () => {
  const response = await axiosInstance.get("/faqs");
  return response.data;
};

/** ADMIN APIs */
export const getAdminFaqs = async () => {
  const response = await axiosInstance.get("/admin/faqs");
  return response.data;
};

export const createFaq = async (faqData) => {
  const response = await axiosInstance.post("/admin/faqs", faqData);
  return response.data;
};

export const updateFaq = async (id, faqData) => {
  const response = await axiosInstance.put(`/admin/faqs/${id}`, faqData);
  return response.data;
};

export const deleteFaq = async (id) => {
  const response = await axiosInstance.delete(`/admin/faqs/${id}`);
  return response.data;
};
