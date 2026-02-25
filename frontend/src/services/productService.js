
import axiosInstance from  "./axiosInstance"

export const fetchProductsAPI = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const fetchProductByIdAPI = async (id) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};