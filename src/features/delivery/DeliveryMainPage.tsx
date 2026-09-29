'use client';

import React, { useState } from 'react';
import { Bike, Package, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useDeliveryPartner } from './hooks/useDeliveryPartner';
import ActiveDeliveryCard from './components/ActiveDeliveryCard';
import AvailablePickupsList from './components/AvailablePickupsList';
import DutyStatusBanner from './components/DutyStatusBanner';
import DeliveryCompleteModal from './components/DeliveryCompleteModal';

export default function DeliveryMainPage() {
  const {
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
  } = useDeliveryPartner();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmComplete = async () => {
    if (!activeDelivery) return;
    await handleCompleteDelivery(activeDelivery.order_details.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* 🟢 Online / Offline Status Toggle Banner */}
      <DutyStatusBanner
        isOnDuty={isOnDuty}
        onToggleDuty={handleToggleDuty}
        isToggling={isTogglingDuty}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* 🚴 Shift Stats Quick Pills */}
      {profile && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black shrink-0">
              <Package size={17} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Today
              </span>
              <span className="text-sm font-black text-slate-900">
                {profile.today_delivered} Delivered
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
              <CheckCircle2 size={17} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Total
              </span>
              <span className="text-sm font-black text-slate-900">
                {profile.total_delivered} Orders
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 🔄 Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded-lg" />
            <div className="h-4 w-48 bg-gray-100 rounded-md" />
            <div className="h-24 bg-gray-50 rounded-2xl" />
            <div className="h-10 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ) : activeDelivery ? (
        /* 🛵 In-Transit Active Delivery Hero Card */
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800">
              Active Delivery In Progress
            </h2>
          </div>

          <ActiveDeliveryCard
            delivery={activeDelivery}
            onOpenCompleteModal={() => setIsModalOpen(true)}
            isCompleting={isCompleting}
          />

          <DeliveryCompleteModal
            order={activeDelivery.order_details}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmComplete}
            loading={isCompleting}
          />
        </div>
      ) : (
        /* 📦 Available Orders for Pickup */
        <AvailablePickupsList
          orders={availableOrders}
          onAccept={handleAcceptOrder}
          isAccepting={isAccepting}
          isOnDuty={isOnDuty}
        />
      )}
    </div>
  );
}
