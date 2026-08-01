import axiosInstance from "@/lib/axios";

export interface LoginCredentials {
  username: string;
  password: string;
}

// 🔐 Delivery Boy Login API
export const deliveryLoginApi = async (credentials: LoginCredentials) => {
  const response = await axiosInstance.post("/accounts/delivery-boy/login", credentials);
  return response.data; 
};

// 🔄 Token Refresh API
export const deliveryRefreshTokenApi = async () => {
  const response = await axiosInstance.post("/accounts/token/refresh");
  return response.data;
};

// 🚪 Logout API (Clears HttpOnly Cookies from backend)
export const deliveryLogoutApi = async () => {
  const response = await axiosInstance.post("/accounts/logout");
  return response.data;
};