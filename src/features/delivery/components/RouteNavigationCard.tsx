'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  Store,
  Navigation,
  Phone,
  MessageSquare,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { DeliveryOrder } from '../types/deliveryTypes';

interface RouteNavigationCardProps {
  order: DeliveryOrder;
}

export default function RouteNavigationCard({ order }: RouteNavigationCardProps) {
  const mapsNavigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    order.delivery_address || 'Empire Plaza'
  )}`;

  // Clean phone number for WhatsApp
  const cleanPhone = order.customer_phone ? order.customer_phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello ${order.customer_name}, I am your Empire Plaza delivery partner for Order #${order.id}. I am on my way to your location!`
  )}`;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-800 text-white space-y-4 shadow-xl">
      
      {/* 🧭 Visual Step-by-Step Route */}
      <div className="space-y-3 relative">
        
        {/* Step 1: Restaurant Pickup */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Store size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Pickup Point
              </span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                Order Dispatched
              </span>
            </div>
            <h4 className="text-sm font-black text-white">
              Empire Plaza Kitchen
            </h4>
            <p className="text-xs text-slate-400">Cheruvathur</p>
          </div>
        </div>

        {/* Step Connector Line with Live Bike Icon */}
        <div className="ml-4 pl-4 border-l-2 border-dashed border-emerald-500/50 py-1.5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1.5 bg-emerald-900/40 px-2.5 py-1 rounded-lg border border-emerald-800/60">
            <Clock size={12} className="text-emerald-400" />
            Turn-by-turn route to customer
          </span>
          {order.delivery_distance_km !== undefined && order.delivery_distance_km > 0 && (
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 flex items-center gap-1">
              <span>📍 {order.delivery_distance_km} KM</span>
            </span>
          )}
        </div>

        {/* Step 2: Customer Destination */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-400/40 text-red-400 flex items-center justify-center shrink-0">
            <MapPin size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Drop Destination
              </span>
            </div>
            <h4 className="text-sm font-black text-white truncate">
              {order.customer_name}
            </h4>
            <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
              {order.delivery_address}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Note / Special Instructions */}
      {order.special_instructions && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-amber-200 text-xs">
          <AlertCircle size={15} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="font-bold text-amber-300 block">Customer Instructions:</span>
            <span className="text-amber-100">{order.special_instructions}</span>
          </div>
        </div>
      )}

      {/* 🚀 Quick Turn-by-Turn Navigation & Contact Action Bar */}
      <div className="space-y-2 pt-1">
        {/* Primary Full Navigation Button */}
        <a
          href={mapsNavigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition active:scale-[0.98]"
        >
          <Compass size={17} className="animate-spin" style={{ animationDuration: '6s' }} />
          <span>Start Turn-by-Turn GPS Navigation</span>
          <ExternalLink size={14} className="opacity-70" />
        </a>

        {/* Quick Contact Options */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${order.customer_phone}`}
            className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Phone size={14} />
            <span>Call Customer</span>
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95"
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

    </div>
  );
}
