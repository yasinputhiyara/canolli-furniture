import axiosInstance from "./axiosInstance";

export const getAllOrders = async () => {
  const response = await axiosInstance.get("/admin/orders");
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.put(`/admin/orders/${id}/status`, { status });
  return response.data;
};

export const createOrderAPI = async (orderData) => {
  const response = await axiosInstance.post("/orders", orderData);
  return response.data;
};

export const getUserOrdersAPI = async () => {
  const response = await axiosInstance.get("/orders");
  return response.data;
};

export const cancelUserOrderAPI = async (id) => {
  const response = await axiosInstance.put(`/orders/${id}/cancel`);
  return response.data;
};
