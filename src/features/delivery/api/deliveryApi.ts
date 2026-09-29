import axiosInstance from '@/lib/axios';
import {
  DeliveryAssignment,
  DeliveryBoyProfileData,
  DeliveryOrder,
} from '../types/deliveryTypes';

// 📦 1. Fetch available orders ready for pickup
export const getAvailableDeliveriesApi = async (): Promise<DeliveryOrder[]> => {
  const response = await axiosInstance.get('/delivery/available');
  return response.data;
};

// 🛵 2. Fetch current in-progress delivery assigned to this rider
export const getCurrentDeliveryApi = async (): Promise<{ active_delivery: DeliveryAssignment | null }> => {
  const response = await axiosInstance.get('/delivery/current');
  return response.data;
};

// 📜 3. Fetch past delivered orders history
export const getDeliveryHistoryApi = async (): Promise<DeliveryAssignment[]> => {
  const response = await axiosInstance.get('/delivery/history');
  return response.data;
};

// 👤 4. Fetch rider profile and shift metrics
export const getDeliveryProfileApi = async (): Promise<DeliveryBoyProfileData> => {
  const response = await axiosInstance.get('/delivery/profile');
  return response.data;
};

// ⚡ 5. Toggle Online / Offline duty status
export const toggleDutyStatusApi = async (): Promise<{
  status: boolean;
  is_on_duty: boolean;
  message: string;
}> => {
  const response = await axiosInstance.post('/delivery/toggle-duty');
  return response.data;
};

// 🟢 6. Accept ready_for_pickup order
export const acceptDeliveryApi = async (orderId: number): Promise<DeliveryAssignment> => {
  const response = await axiosInstance.post(`/delivery/orders/${orderId}/accept`);
  return response.data;
};

// 🏁 7. Complete active delivery and collect payment
export const completeDeliveryApi = async (orderId: number): Promise<DeliveryAssignment> => {
  const response = await axiosInstance.post(`/delivery/orders/${orderId}/complete`);
  return response.data;
};
