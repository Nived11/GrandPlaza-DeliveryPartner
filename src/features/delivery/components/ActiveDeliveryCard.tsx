'use client';

import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Navigation,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Receipt,
  Bike,
  ShieldAlert,
} from 'lucide-react';
import { DeliveryAssignment } from '../types/deliveryTypes';

interface ActiveDeliveryCardProps {
  delivery: DeliveryAssignment;
  onOpenCompleteModal: () => void;
  isCompleting: boolean;
}

export default function ActiveDeliveryCard({
  delivery,
  onOpenCompleteModal,
  isCompleting,
}: ActiveDeliveryCardProps) {
  const [showItems, setShowItems] = useState(false);
  const order = delivery.order_details;

  if (!order) return null;

  const isCOD = order.payment_status === 'pending';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    order.delivery_address || 'Empire Plaza'
  )}`;

  const formattedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-xl overflow-hidden relative">
      {/* 🟢 Live Active Status Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
            <Bike size={18} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider">
                Out for Delivery
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
        {/* 💵 Payment Warning Banner */}
        {isCOD ? (
          <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-amber-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center font-black shrink-0">
                💵
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-sm sm:text-base font-black text-amber-950">
                  Collect ₹{order.total_price} from Customer
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-2.5 text-emerald-900">
            <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-900 flex items-center justify-center font-black shrink-0">
              💳
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Paid Online (Prepaid)
              </span>
              <span className="text-xs sm:text-sm font-bold text-emerald-950">
                Do NOT collect cash • Already paid
              </span>
            </div>
          </div>
        )}

        {/* 👤 Customer & Quick Call */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              Customer
            </span>
            <h4 className="text-sm font-black text-slate-900 truncate">
              {order.customer_name}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {order.customer_phone}
            </p>
          </div>

          <a
            href={`tel:${order.customer_phone}`}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition active:scale-95 shrink-0"
          >
            <Phone size={14} />
            <span>Call</span>
          </a>
        </div>

        {/* 📍 Delivery Address & Maps Navigation */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
              <MapPin size={12} /> Delivery Address
            </span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Navigation size={12} /> Open Maps
            </a>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
            {order.delivery_address}
          </p>

          {/* Special Instructions */}
          {order.special_instructions && (
            <div className="bg-amber-100/60 border border-amber-300 rounded-xl p-2.5 flex items-start gap-2 text-amber-900 text-xs">
              <AlertCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Note from Customer: </span>
                <span>{order.special_instructions}</span>
              </div>
            </div>
          )}
        </div>

        {/* 📋 Order Items Accordion */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => setShowItems(!showItems)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 bg-gray-50/70 hover:bg-gray-100/70 transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Receipt size={14} className="text-gray-500" />
              {order.items?.length || 0} Items in Package
            </span>
            {showItems ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {showItems && (
            <div className="p-3 divide-y divide-gray-100 text-xs font-medium space-y-2">
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

        {/* 🏁 Action Button: Complete Delivery */}
        <button
          onClick={onOpenCompleteModal}
          disabled={isCompleting}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle2 size={18} />
          <span>{isCompleting ? 'Finishing Delivery...' : 'Mark Order as Delivered'}</span>
        </button>
      </div>
    </div>
  );
}
