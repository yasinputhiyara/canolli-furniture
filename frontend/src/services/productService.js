import axiosInstance from "./axiosInstance";

export const getAllProducts = async () => {
  const response = await axiosInstance.get("/products");
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
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axiosInstance.put(
    `/products/${id}`,
    productData
  );
  return response.data;
};