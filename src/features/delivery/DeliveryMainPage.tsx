'use client';

import React, { useState } from 'react';
import { Bike, Package, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { useDeliveryPartner } from './hooks/useDeliveryPartner';
import ActiveDeliveryCard from './components/ActiveDeliveryCard';
import AvailablePickupsList from './components/AvailablePickupsList';
import DutyStatusBanner from './components/DutyStatusBanner';
import DeliveryCompleteModal from './components/DeliveryCompleteModal';
import { DeliveryOrder } from './types/deliveryTypes';

export default function DeliveryMainPage() {
  const {
    profile,
    isOnDuty,
    activeDeliveries,
    availableOrders,
    loading,
    refreshing,
    isAccepting,
    isCompleting,
    isTogglingDuty,
    maxBatchLimit,
    canAcceptMore,
    handleRefresh,
    handleToggleDuty,
    handleAcceptOrder,
    handleCompleteDelivery,
  } = useDeliveryPartner();

  const [selectedOrderToComplete, setSelectedOrderToComplete] = useState<DeliveryOrder | null>(null);

  const handleConfirmComplete = async () => {
    if (!selectedOrderToComplete) return;
    await handleCompleteDelivery(selectedOrderToComplete.id);
    setSelectedOrderToComplete(null);
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
      ) : (
        <div className="space-y-5">
          {/* 🛵 Active Deliveries List (Multi-Order Batching: Up to 4 Orders) */}
          {activeDeliveries.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Layers size={14} />
                    Active Deliveries ({activeDeliveries.length}/{maxBatchLimit})
                  </h2>
                </div>
                {canAcceptMore && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Can take {maxBatchLimit - activeDeliveries.length} more
                  </span>
                )}
              </div>

              {activeDeliveries.map((delivery, index) => (
                <ActiveDeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  orderIndex={index + 1}
                  totalOrders={activeDeliveries.length}
                  onOpenCompleteModal={() => setSelectedOrderToComplete(delivery.order_details)}
                  isCompleting={isCompleting === delivery.order || isCompleting === delivery.order_details?.id}
                />
              ))}
            </div>
          )}

          {/* 📦 Available Orders for Pickup */}
          {canAcceptMore ? (
            <div className="space-y-2">
              {activeDeliveries.length > 0 && (
                <div className="border-t border-gray-200 pt-4 pb-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block px-1">
                    ➕ Pick up more nearby orders
                  </span>
                </div>
              )}
              <AvailablePickupsList
                orders={availableOrders}
                onAccept={handleAcceptOrder}
                isAccepting={isAccepting}
                isOnDuty={isOnDuty}
              />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
              <span className="text-xs font-black text-amber-900 block">
                🛵 Maximum Capacity Reached ({maxBatchLimit}/{maxBatchLimit} Orders)
              </span>
              <p className="text-[11px] text-amber-700">
                Deliver your current assigned orders before accepting more pickups.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Completion Modal */}
      <DeliveryCompleteModal
        order={selectedOrderToComplete}
        isOpen={Boolean(selectedOrderToComplete)}
        onClose={() => setSelectedOrderToComplete(null)}
        onConfirm={handleConfirmComplete}
        loading={Boolean(isCompleting)}
      />
    </div>
  );
}
