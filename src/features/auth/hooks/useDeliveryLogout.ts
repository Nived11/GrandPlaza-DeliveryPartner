import { useState } from "react";
import { useRouter } from "next/navigation";
import { deliveryLogoutApi } from "../api/authApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export const useDeliveryLogout = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearClientSession = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setError(null);

    try {
      await deliveryLogoutApi();
      toast.success("Logged out successfully");
      
      clearClientSession();

      setLoggingOut(false);
      router.push("/login");
      router.refresh();
      return true;
    } catch (err: any) {
      const errorMessage = extractErrorMessages(err);
      setError(errorMessage);
      toast.error(errorMessage);

      clearClientSession();

      setLoggingOut(false);
      return false;
    }
  };

  return { logout, loggingOut, error, setError };
};