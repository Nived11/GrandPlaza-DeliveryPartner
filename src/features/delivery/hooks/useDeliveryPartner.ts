'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { extractErrorMessages } from '@/utils/extractErrorMessages';
import { getPusherClient } from '@/lib/pusherClient';
import {
  getAvailableDeliveriesApi,
  getCurrentDeliveryApi,
  getDeliveryProfileApi,
  toggleDutyStatusApi,
  acceptDeliveryApi,
  completeDeliveryApi,
  updateLocationApi,
} from '../api/deliveryApi';
import {
  DeliveryAssignment,
  DeliveryBoyProfileData,
  DeliveryOrder,
} from '../types/deliveryTypes';
import { playDeliveryCompleteChime } from '../utils/deliveryAudio';

export const MAX_BATCH_LIMIT = 4;

export function useDeliveryPartner() {
  const [profile, setProfile] = useState<DeliveryBoyProfileData | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState<DeliveryAssignment[]>([]);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [incomingOrderOffer, setIncomingOrderOffer] = useState<DeliveryOrder | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAccepting, setIsAccepting] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState<number | null>(null);
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);

  const knownAvailableIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);
  const lastLocationSentRef = useRef<number>(0);
  const activeDeliveriesCountRef = useRef<number>(0);
  const isOnDutyRef = useRef<boolean>(true);

  // Keep refs updated for event callbacks
  activeDeliveriesCountRef.current = activeDeliveries.length;
  isOnDutyRef.current = isOnDuty;

  // 1. Fetch Profile and Duty Status
  const fetchProfile = useCallback(async () => {
    try {
      const data = await getDeliveryProfileApi();
      setProfile(data);
      setIsOnDuty(data.is_on_duty);
    } catch (err: unknown) {
      console.error('Failed to load rider profile:', err);
    }
  }, []);

  // 2. Fetch Active Deliveries & Available Orders
  const loadDeliveryData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);

      try {
        const [currentRes, availableRes] = await Promise.all([
          getCurrentDeliveryApi(),
          getAvailableDeliveriesApi(),
        ]);

        // Support multi-order array from backend
        const currentList: DeliveryAssignment[] =
          currentRes.active_deliveries && currentRes.active_deliveries.length > 0
            ? currentRes.active_deliveries
            : currentRes.active_delivery
            ? [currentRes.active_delivery]
            : [];

        setActiveDeliveries(currentList);

        const orders = Array.isArray(availableRes) ? availableRes : [];
        setAvailableOrders(orders);

        // Check for new incoming orders
        if (isFirstLoadRef.current) {
          orders.forEach((o) => knownAvailableIdsRef.current.add(o.id));
          isFirstLoadRef.current = false;
        } else {
          const freshOrders = orders.filter((o) => !knownAvailableIdsRef.current.has(o.id));
          if (freshOrders.length > 0) {
            // Trigger Swiggy/Zomato style full alert modal if rider is on duty and has capacity
            if (isOnDutyRef.current && activeDeliveriesCountRef.current < MAX_BATCH_LIMIT) {
              setIncomingOrderOffer(freshOrders[0]);
            }
            toast.info(`🛵 New Pickup Ready: Order #${freshOrders[0].id}`, {
              duration: 4000,
            });
          }
          orders.forEach((o) => knownAvailableIdsRef.current.add(o.id));
        }
      } catch (err: unknown) {
        console.error('Failed to load delivery data:', err);
        if (!silent) {
          toast.error(extractErrorMessages(err));
        }
      } finally {
        if (!silent) setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchProfile();
    loadDeliveryData(false);
  }, [fetchProfile, loadDeliveryData]);

  // ⚡ 3. Realtime Pusher Subscription on 'orders-channel'
  useEffect(() => {
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe('orders-channel');

    const handleRealtimeUpdate = (data: any) => {
      console.log('⚡ Pusher event received in Delivery Partner:', data);
      loadDeliveryData(true);
      fetchProfile();
    };

    channel.bind('order-ready-for-pickup', handleRealtimeUpdate);
    channel.bind('order-status-updated', handleRealtimeUpdate);
    channel.bind('new-order', handleRealtimeUpdate);

    return () => {
      channel.unbind('order-ready-for-pickup', handleRealtimeUpdate);
      channel.unbind('order-status-updated', handleRealtimeUpdate);
      channel.unbind('new-order', handleRealtimeUpdate);
      pusher.unsubscribe('orders-channel');
    };
  }, [loadDeliveryData, fetchProfile]);

  // Polling fallback every 12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadDeliveryData(true);
    }, 12000);

    return () => clearInterval(interval);
  }, [loadDeliveryData]);

  // 📍 4. Live GPS Location Tracking
  useEffect(() => {
    if (!isOnDuty || typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        // Throttle updates: send once every 5 seconds for Swiggy-like live tracking
        if (now - lastLocationSentRef.current >= 5000) {
          lastLocationSentRef.current = now;
          updateLocationApi(pos.coords.latitude, pos.coords.longitude).catch(() => {});
        }
      },
      (err) => {
        console.debug('Geolocation watch warning:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 8000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnDuty]);

  // Manual Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), loadDeliveryData(true)]);
    toast.success('Orders refreshed!');
  };

  // Toggle On / Off Duty
  const handleToggleDuty = async () => {
    setIsTogglingDuty(true);
    try {
      const res = await toggleDutyStatusApi();
      setIsOnDuty(res.is_on_duty);
      if (profile) {
        setProfile({ ...profile, is_on_duty: res.is_on_duty });
      }
      if (res.is_on_duty) {
        toast.success('🟢 You are now ONLINE! Ready for delivery orders.');
      } else {
        setIncomingOrderOffer(null);
        toast.warning('🔴 You are now OFFLINE.');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
    } finally {
      setIsTogglingDuty(false);
    }
  };

  // Dismiss Incoming Order Pop-up
  const dismissIncomingOffer = useCallback(() => {
    setIncomingOrderOffer(null);
  }, []);

  // Accept Ready Order (Strict limit up to MAX_BATCH_LIMIT = 4)
  const handleAcceptOrder = async (orderId: number) => {
    if (!isOnDuty) {
      toast.error('You are currently OFFLINE! Turn on duty to accept orders.');
      return;
    }

    if (activeDeliveries.length >= MAX_BATCH_LIMIT) {
      toast.error(`Capacity full! You can hold maximum ${MAX_BATCH_LIMIT} orders simultaneously.`);
      return;
    }

    setIsAccepting(orderId);
    setIncomingOrderOffer(null);
    try {
      const assignedDelivery = await acceptDeliveryApi(orderId);
      setActiveDeliveries((prev) => [...prev, assignedDelivery]);
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(`🛵 Order #${orderId} accepted! (${activeDeliveries.length + 1}/${MAX_BATCH_LIMIT} active)`);
      fetchProfile();
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
      loadDeliveryData(true);
    } finally {
      setIsAccepting(null);
    }
  };

  // Mark Delivery Completed for a specific orderId
  const handleCompleteDelivery = async (orderId: number) => {
    setIsCompleting(orderId);
    try {
      await completeDeliveryApi(orderId);
      setActiveDeliveries((prev) => prev.filter((d) => d.order !== orderId && d.order_details?.id !== orderId));
      playDeliveryCompleteChime();
      toast.success(`🎉 Order #${orderId} delivered successfully! Payment confirmed.`);
      loadDeliveryData(true);
      fetchProfile();
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
    } finally {
      setIsCompleting(null);
    }
  };

  return {
    profile,
    isOnDuty,
    activeDeliveries,
    activeDelivery: activeDeliveries[0] || null, // Backwards compatibility
    availableOrders,
    incomingOrderOffer,
    loading,
    refreshing,
    isAccepting,
    isCompleting,
    isTogglingDuty,
    maxBatchLimit: MAX_BATCH_LIMIT,
    canAcceptMore: isOnDuty && activeDeliveries.length < MAX_BATCH_LIMIT,
    handleRefresh,
    handleToggleDuty,
    handleAcceptOrder,
    handleCompleteDelivery,
    dismissIncomingOffer,
  };
}
