'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { extractErrorMessages } from '@/utils/extractErrorMessages';
import {
  getAvailableDeliveriesApi,
  getCurrentDeliveryApi,
  getDeliveryProfileApi,
  toggleDutyStatusApi,
  acceptDeliveryApi,
  completeDeliveryApi,
} from '../api/deliveryApi';
import {
  DeliveryAssignment,
  DeliveryBoyProfileData,
  DeliveryOrder,
} from '../types/deliveryTypes';

// 🔔 Clean Web Audio API chime for incoming delivery notification
const playNewPickupChime = () => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Upbeat 3-tone alert chime (C5 -> E5 -> G5)
    const tones = [523.25, 659.25, 783.99];
    tones.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.25, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.4);
    });
  } catch (err) {
    console.debug('Audio chime inhibited by browser interaction policy:', err);
  }
};

export function useDeliveryPartner() {
  const [profile, setProfile] = useState<DeliveryBoyProfileData | null>(null);
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryAssignment | null>(null);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAccepting, setIsAccepting] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);

  const knownAvailableIdsRef = useRef<Set<number>>(new Set());
  const isFirstLoadRef = useRef(true);

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

  // 2. Fetch Active Delivery & Available Orders
  const loadDeliveryData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);

      try {
        // Fetch current active delivery and available pickups in parallel
        const [currentRes, availableRes] = await Promise.all([
          getCurrentDeliveryApi(),
          getAvailableDeliveriesApi(),
        ]);

        setActiveDelivery(currentRes.active_delivery);

        const orders = Array.isArray(availableRes) ? availableRes : [];
        setAvailableOrders(orders);

        // Sound chime on new pickup orders arriving
        if (isFirstLoadRef.current) {
          orders.forEach((o) => knownAvailableIdsRef.current.add(o.id));
          isFirstLoadRef.current = false;
        } else {
          const freshOrders = orders.filter((o) => !knownAvailableIdsRef.current.has(o.id));
          if (freshOrders.length > 0) {
            playNewPickupChime();
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

  // Polling every 10 seconds for real-time order updates
  useEffect(() => {
    const interval = setInterval(() => {
      loadDeliveryData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [loadDeliveryData]);

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
        toast.warning('🔴 You are now OFFLINE.');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
    } finally {
      setIsTogglingDuty(false);
    }
  };

  // Accept Ready Order
  const handleAcceptOrder = async (orderId: number) => {
    if (!isOnDuty) {
      toast.error('You are currently OFFLINE! Turn on duty to accept orders.');
      return;
    }

    setIsAccepting(orderId);
    try {
      const assignedDelivery = await acceptDeliveryApi(orderId);
      setActiveDelivery(assignedDelivery);
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast.success(`🛵 Order #${orderId} accepted! Proceed to pickup counter.`);
      // Refresh profile to update is_busy
      fetchProfile();
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
      // Refresh to get updated list
      loadDeliveryData(true);
    } finally {
      setIsAccepting(null);
    }
  };

  // Mark Delivery Completed
  const handleCompleteDelivery = async (orderId: number) => {
    setIsCompleting(true);
    try {
      await completeDeliveryApi(orderId);
      setActiveDelivery(null);
      toast.success(`🎉 Order #${orderId} delivered successfully! Payment confirmed.`);
      // Refresh data to show available orders again
      loadDeliveryData(false);
      fetchProfile();
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
    } finally {
      setIsCompleting(false);
    }
  };

  return {
    profile,
    isOnDuty,
    activeDelivery,
    availableOrders,
    loading,
    refreshing,
    isAccepting,
    isCompleting,
    isTogglingDuty,
    handleRefresh,
    handleToggleDuty,
    handleAcceptOrder,
    handleCompleteDelivery,
  };
}
