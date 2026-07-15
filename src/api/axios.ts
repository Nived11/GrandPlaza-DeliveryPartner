import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: '/api', // Rewrouted internally to backend via Next.js rewrites
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enables automatic cookie handling
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // 1. Target Login Route
    const loginRedirect = '/login';

    // 🚨 1. Security enforcement logic (403 Blocked status)
    if (error.response?.status === 403) {
      const errorDetail = error.response.data?.detail;
      if (errorDetail === "Your account has been blocked by the admin. You are logged out.") {
        console.warn("[Security] Session terminated by backend. Clearing storage...");
        
        if (typeof window !== 'undefined') {
          localStorage.clear(); 
          toast.error("Your account has been blocked by the admin.", {
            description: "Access denied. Logging you out now.",
            duration: 5000,
          });

          setTimeout(() => {
            window.location.href = loginRedirect;
          }, 1500);
        }
        return Promise.reject(error);
      }
    }

    // 🔄 2. Automated Token Refresh Logic (401 Unauthorized status)
    const skipUrls = ['login', 'refresh', 'token/refresh', 'auth/user'];
    const isSkippedUrl = skipUrls.some(url => originalRequest.url?.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isSkippedUrl) {
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 2. Automated Token Refresh Logic (Targeting ONLY Delivery)
        let refreshUrl = '/auth/delivery/token/refresh';

        // Post request triggered to refresh authentication token
        await axiosInstance.post(refreshUrl);

        isRefreshing = false;
        processQueue(null);

        // Retry the initial failed request with fresh session state
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Evict expired session and enforce portal re-authentication
        if (typeof window !== 'undefined') {
          localStorage.clear();
          toast.error('Session expired. Please login again!');
          setTimeout(() => {
            window.location.href = loginRedirect;
          }, 1500);
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;