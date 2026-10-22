'use client';

import React, { useState } from 'react';
import {
  Bike,
  Receipt,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Layers,
  Banknote,
  CheckCircle,
} from 'lucide-react';
import { DeliveryAssignment } from '../types/deliveryTypes';
import SwipeToConfirm from './SwipeToConfirm';
import RouteNavigationCard from './RouteNavigationCard';

interface ActiveDeliveryCardProps {
  delivery: DeliveryAssignment;
  onOpenCompleteModal: () => void;
  isCompleting: boolean;
  orderIndex?: number;
  totalOrders?: number;
}

export default function ActiveDeliveryCard({
  delivery,
  onOpenCompleteModal,
  isCompleting,
  orderIndex = 1,
  totalOrders = 1,
}: ActiveDeliveryCardProps) {
  const [showItems, setShowItems] = useState(false);
  const order = delivery.order_details;

  if (!order) return null;

  const isCOD = order.payment_status === 'pending';

  const formattedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden relative transition-all space-y-0">
      
      {/* 🟢 Live Active Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bike size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider">
                Out for Delivery {totalOrders > 1 && `(${orderIndex} of ${totalOrders})`}
              </span>
            </div>
            <span className="text-[11px] text-emerald-100 font-medium">
              Order #{order.id} • {formattedTime}
            </span>
          </div>
        </div>

        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black">
          ₹{order.total_price}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        
        {/* 💵 Prominent COD Warning Banner */}
        {isCOD ? (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md shadow-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black shrink-0">
                <Banknote size={22} className="text-white" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-100 block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-base font-black text-white">
                  COLLECT ₹{order.total_price} CASH
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-black/20 font-black uppercase px-2.5 py-1 rounded-lg">
              Collect
            </span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2.5 text-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-black shrink-0">
                <CheckCircle size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                  Paid Online (Prepaid)
                </span>
                <span className="text-xs font-bold text-emerald-950">
                  Do NOT collect cash from customer
                </span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
              PAID
            </span>
          </div>
        )}

        {/* 📍 Visual Route Navigation Card with Google Maps & Contacts */}
        <RouteNavigationCard order={order} />

        {/* 📋 Order Items Accordion */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/50">
          <button
            onClick={() => setShowItems(!showItems)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Receipt size={14} className="text-gray-500" />
              {order.items?.length || 0} Items to Deliver
            </span>
            {showItems ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showItems && (
            <div className="p-3 divide-y divide-gray-100 text-xs font-medium space-y-2 bg-white">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="pt-2 first:pt-0 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                      {item.quantity}x
                    </span>
                    <div>
                      <p className="text-slate-900 font-bold">{item.item_name}</p>
                      {item.variant_name && (
                        <p className="text-[10px] text-gray-500">
                          {item.variant_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-black text-slate-800">
                    ₹{item.line_total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🏁 Interactive "Swipe to Deliver" Slider */}
        <div className="space-y-1.5 pt-1">
          <SwipeToConfirm
            onConfirm={onOpenCompleteModal}
            loading={isCompleting}
            label={isCOD ? `Swipe to Deliver (Collect ₹${order.total_price})` : 'Swipe to Deliver Order'}
            successLabel="Order Delivered!"
          />
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-gray-400">
              Slide thumb to the right to complete
            </span>
            <button
              onClick={onOpenCompleteModal}
              disabled={isCompleting}
              className="text-[10px] text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer"
            >
              Direct Tap
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
