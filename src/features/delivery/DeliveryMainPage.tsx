'use client';

import React, { useState } from 'react';
import {
  Bike,
  Package,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  Banknote,
  Navigation2,
  Sparkles,
} from 'lucide-react';
import { useDeliveryPartner } from './hooks/useDeliveryPartner';
import ActiveDeliveryCard from './components/ActiveDeliveryCard';
import AvailablePickupsList from './components/AvailablePickupsList';
import DutyStatusBanner from './components/DutyStatusBanner';
import DeliveryCompleteModal from './components/DeliveryCompleteModal';
import IncomingOrderModal from './components/IncomingOrderModal';
import { DeliveryOrder } from './types/deliveryTypes';

export default function DeliveryMainPage() {
  const {
    profile,
    isOnDuty,
    activeDeliveries,
    availableOrders,
    incomingOrderOffer,
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
    dismissIncomingOffer,
  } = useDeliveryPartner();

  const [selectedOrderToComplete, setSelectedOrderToComplete] = useState<DeliveryOrder | null>(null);
  const [selectedTabOrderIndex, setSelectedTabOrderIndex] = useState<number | 'all'>('all');

  const handleConfirmComplete = async () => {
    if (!selectedOrderToComplete) return;
    await handleCompleteDelivery(selectedOrderToComplete.id);
    setSelectedOrderToComplete(null);
  };

  // Calculate total COD cash to collect across all current active orders
  const totalCodToCollect = activeDeliveries.reduce((sum, del) => {
    if (del.order_details?.payment_status === 'pending') {
      return sum + Number(del.order_details.total_price || 0);
    }
    return sum;
  }, 0);

  // Filter deliveries based on active tab
  const displayedDeliveries =
    selectedTabOrderIndex === 'all'
      ? activeDeliveries
      : activeDeliveries.filter((_, idx) => idx === selectedTabOrderIndex);

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

      {/* 🚴 Shift Stats Quick Bar */}
      {profile && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black shrink-0">
              <Package size={17} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Today&apos;s Run
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
                Total Career
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
            <div className="h-28 bg-gray-50 rounded-2xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* 🛵 Active Deliveries Section (Swiggy/Zomato Batch Management: Up to 4 Orders) */}
          {activeDeliveries.length > 0 && (
            <div className="space-y-3.5">
              
              {/* Batch Overview Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-2xl p-3.5 border border-slate-800 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h2 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                      <Layers size={14} />
                      Active Delivery Run ({activeDeliveries.length}/{maxBatchLimit})
                    </h2>
                  </div>

                  {canAcceptMore ? (
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700">
                      Can take {maxBatchLimit - activeDeliveries.length} more
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700">
                      Capacity Full (4/4)
                    </span>
                  )}
                </div>

                {/* Total Cash to Collect in Run */}
                {totalCodToCollect > 0 && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                      <Banknote size={15} className="text-amber-400" />
                      Total COD Cash to Collect:
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      ₹{totalCodToCollect}
                    </span>
                  </div>
                )}
              </div>

              {/* 🎛️ Segmented Tabs if Multiple Orders Active (Swiggy Multi-Order Switcher) */}
              {activeDeliveries.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={() => setSelectedTabOrderIndex('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition shrink-0 cursor-pointer ${
                      selectedTabOrderIndex === 'all'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    All ({activeDeliveries.length})
                  </button>

                  {activeDeliveries.map((del, idx) => (
                    <button
                      key={del.id}
                      onClick={() => setSelectedTabOrderIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        selectedTabOrderIndex === idx
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span>Order #{del.order_details?.id || del.order}</span>
                      <span className="text-[10px] opacity-80">
                        ₹{del.order_details?.total_price}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Active Delivery Cards */}
              <div className="space-y-4">
                {displayedDeliveries.map((delivery, index) => {
                  const originalIndex = activeDeliveries.findIndex((d) => d.id === delivery.id);
                  return (
                    <ActiveDeliveryCard
                      key={delivery.id}
                      delivery={delivery}
                      orderIndex={originalIndex + 1}
                      totalOrders={activeDeliveries.length}
                      onOpenCompleteModal={() => setSelectedOrderToComplete(delivery.order_details)}
                      isCompleting={
                        isCompleting === delivery.order ||
                        isCompleting === delivery.order_details?.id
                      }
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 📦 Available Orders for Pickup */}
          {canAcceptMore ? (
            <div className="space-y-2.5">
              {activeDeliveries.length > 0 && (
                <div className="border-t border-gray-200 pt-3 flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    Add More Pickups ({activeDeliveries.length}/{maxBatchLimit} active)
                  </span>
                  <span className="text-[10px] font-bold text-blue-600">
                    Up to 4 orders allowed
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
                🛵 Maximum Batch Limit Reached ({maxBatchLimit}/{maxBatchLimit} Active Orders)
              </span>
              <p className="text-[11px] text-amber-700">
                You currently have 4 active orders. Deliver one of them to accept new pickups.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 🚨 Swiggy/Zomato Prominent Incoming Order Pop-up Modal with Sound */}
      <IncomingOrderModal
        order={incomingOrderOffer}
        isOpen={Boolean(incomingOrderOffer)}
        onAccept={handleAcceptOrder}
        onDismiss={dismissIncomingOffer}
        isAccepting={Boolean(isAccepting && isAccepting === incomingOrderOffer?.id)}
        activeCount={activeDeliveries.length}
        maxBatchLimit={maxBatchLimit}
      />

      {/* 🏁 Delivery Completion Modal */}
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
