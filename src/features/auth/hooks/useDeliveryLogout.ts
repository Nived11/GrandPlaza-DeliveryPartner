import { useState } from "react";
import { deliveryLogoutApi } from "../api/authApi";
import { toast } from "sonner";

export const useDeliveryLogout = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearClientSession = () => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("is_logging_out", "true");
        localStorage.clear();
        sessionStorage.clear();
        // Clear all cookies client-side across root
        const cookies = [
          "user_role",
          "username",
          "access_token",
          "refresh_token",
          "delivery_session_token",
          "access",
          "refresh"
        ];
        cookies.forEach((c) => {
          document.cookie = `${c}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
          document.cookie = `${c}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        });
      } catch (e) {
        console.warn("Storage clear notice:", e);
      }
    }
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setError(null);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("is_logging_out", "true");
    }

    const toastId = toast.loading("Signing out...");

    try {
      // Call backend to mark off-duty, remove active session and delete HttpOnly cookies.
      // Timeout after 3.5s so a slow mobile connection never hangs the UI.
      await Promise.race([
        deliveryLogoutApi(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3500)),
      ]);
    } catch (err: any) {
      console.warn("Logout API notice:", err);
    } finally {
      clearClientSession();
      toast.dismiss(toastId);
      toast.success("Logged out successfully");

      // Hard redirect replaces window location immediately, terminating all background
      // intervals, GPS watchers, and React loops.
      if (typeof window !== "undefined") {
        window.location.replace("/login");
      }
    }
  };

  return { logout, loggingOut, error, setError };
};