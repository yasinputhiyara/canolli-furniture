import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const isAdminRoute = config.url && config.url.includes("/admin");
  const token = isAdminRoute
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("userToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;