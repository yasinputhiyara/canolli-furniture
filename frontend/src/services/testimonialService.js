import axiosInstance from "./axiosInstance";

// Public: get active testimonials (no auth needed)
export const getPublicTestimonials = async () => {
  const res = await axiosInstance.get("/testimonials");
  return res.data;
};

// Admin: get all testimonials
export const getAdminTestimonials = async () => {
  const res = await axiosInstance.get("/admin/testimonials");
  return res.data;
};

// Admin: create
export const createTestimonial = async (formData) => {
  const res = await axiosInstance.post("/admin/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// Admin: update
export const updateTestimonial = async (id, formData) => {
  const res = await axiosInstance.put(`/admin/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// Admin: delete
export const deleteTestimonial = async (id) => {
  const res = await axiosInstance.delete(`/admin/testimonials/${id}`);
  return res.data;
};
