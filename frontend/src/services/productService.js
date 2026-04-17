import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await axiosInstance.get("/admin/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const getRelatedProducts = async (category) => {
  const res = await axiosInstance.get(`/products?category=${category}`);
  return res.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(`/admin/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/admin/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(
    `/admin/products/${id}`,
    productData
  );
  return response.data;
};

export const getAllCategories = async () => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

// ── Reviews ──
export const getProductReviews = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}/reviews`);
  return response.data;
};

export const addProductReview = async (productId, reviewData) => {
  const response = await axiosInstance.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
};

export const deleteProductReview = async (productId, reviewId) => {
  const response = await axiosInstance.delete(`/products/${productId}/reviews/${reviewId}`);
  return response.data;
};