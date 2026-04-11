import axiosInstance from "./axiosInstance";

export const getUserProfile = async () => {
  const response = await axiosInstance.get("/profile");
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await axiosInstance.post("/address", addressData);
  return response.data;
};
