'use client';

import React from 'react';
import {
  PackageCheck,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
  UtensilsCrossed,
  Sparkles,
} from 'lucide-react';
import { DeliveryOrder } from '../types/deliveryTypes';

interface AvailablePickupsListProps {
  orders: DeliveryOrder[];
  onAccept: (orderId: number) => void;
  isAccepting: number | null;
  isOnDuty: boolean;
}

export default function AvailablePickupsList({
  orders,
  onAccept,
  isAccepting,
  isOnDuty,
}: AvailablePickupsListProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <UtensilsCrossed size={28} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-800">
            {isOnDuty ? 'No Pickups Ready Right Now' : 'You are currently Offline'}
          </h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            {isOnDuty
              ? 'The kitchen is preparing food. As soon as an order is packed, it will appear here instantly!'
              : 'Switch to Online status to see and accept ready orders from the kitchen.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          Ready for Pickup ({orders.length})
        </h3>
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
          Instant Accept
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isCOD = order.payment_status === 'pending';
          const itemsSummary = order.items
            ?.map((i) => `${i.quantity}x ${i.item_name}`)
            .join(', ');

          const formattedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return (
            <div
              key={order.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm hover:shadow-md transition space-y-3.5"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black text-sm shrink-0">
                    <PackageCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Order #{order.id}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                      <Clock size={11} /> {formattedTime}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900 block">
                    ₹{order.total_price}
                  </span>
                  <span
                    className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isCOD
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isCOD ? 'COD' : 'Paid'}
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-slate-700 flex items-start gap-2">
                <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-bold block text-slate-900">
                    {order.customer_name}
                  </span>
                  <p className="text-gray-500 truncate text-[11px]">
                    {order.delivery_address}
                  </p>
                </div>
              </div>

              {/* Items summary */}
              {itemsSummary && (
                <div className="text-[11px] text-gray-500 bg-gray-50/50 px-2 py-1.5 rounded-lg border border-gray-100">
                  <span className="font-bold text-gray-700">Items: </span>
                  <span className="truncate">{itemsSummary}</span>
                </div>
              )}

              {/* Accept Order Button */}
              <button
                onClick={() => onAccept(order.id)}
                disabled={isAccepting === order.id || !isOnDuty}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isAccepting === order.id ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Accepting Order...</span>
                  </>
                ) : (
                  <>
                    <span>Accept Order</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
