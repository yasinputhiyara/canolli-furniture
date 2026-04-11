import axiosInstance from "./axiosInstance";

// Get the current user's cart from DB
export const fetchCartFromDB = async () => {
  const response = await axiosInstance.get("/cart");
  return response.data;
};

// Add a product to cart in DB
export const addItemToCartDB = async (productId, quantity = 1) => {
  const response = await axiosInstance.post("/cart", { productId, quantity });
  return response.data;
};

// Update item quantity in DB
export const updateItemInCartDB = async (productId, quantity) => {
  const response = await axiosInstance.put(`/cart/${productId}`, { quantity });
  return response.data;
};

// Remove an item from cart in DB
export const removeItemFromCartDB = async (productId) => {
  const response = await axiosInstance.delete(`/cart/${productId}`);
  return response.data;
};

// Clear the entire cart in DB
export const clearCartInDB = async () => {
  const response = await axiosInstance.delete("/cart");
  return response.data;
};
