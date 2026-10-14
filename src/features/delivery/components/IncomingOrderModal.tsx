'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  BellRing,
  MapPin,
  Utensils,
  Volume2,
  VolumeX,
  X,
  ArrowRight,
  ShieldAlert,
  Store,
  Clock,
  Layers,
} from 'lucide-react';
import { DeliveryOrder } from '../types/deliveryTypes';
import { startIncomingOrderLoop, stopIncomingOrderLoop } from '../utils/deliveryAudio';

interface IncomingOrderModalProps {
  order: DeliveryOrder | null;
  isOpen: boolean;
  onAccept: (orderId: number) => void;
  onDismiss: () => void;
  isAccepting: boolean;
  activeCount: number;
  maxBatchLimit: number;
}

export default function IncomingOrderModal({
  order,
  isOpen,
  onAccept,
  onDismiss,
  isAccepting,
  activeCount,
  maxBatchLimit,
}: IncomingOrderModalProps) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound loop management & 30s countdown
  useEffect(() => {
    if (isOpen && order) {
      setTimeLeft(30);
      if (!isMuted) {
        startIncomingOrderLoop();
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopIncomingOrderLoop();
            if (timerRef.current) clearInterval(timerRef.current);
            onDismiss();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopIncomingOrderLoop();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      stopIncomingOrderLoop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, order, onDismiss, isMuted]);

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startIncomingOrderLoop();
    } else {
      setIsMuted(true);
      stopIncomingOrderLoop();
    }
  };

  const handleAcceptClick = () => {
    if (!order) return;
    stopIncomingOrderLoop();
    onAccept(order.id);
  };

  const handleDismissClick = () => {
    stopIncomingOrderLoop();
    onDismiss();
  };

  if (!isOpen || !order) return null;

  const isCOD = order.payment_status === 'pending';
  const progressPercent = (timeLeft / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-t-4 border-emerald-500 sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden text-white animate-in slide-in-from-bottom duration-300">
        
        {/* ⏳ Animated Countdown Bar (30 seconds) */}
        <div className="h-1.5 w-full bg-slate-800">
          <div
            className={`h-full transition-all duration-1000 linear ${
              timeLeft > 10 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 🚨 Flashing Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
              <BellRing size={18} className="text-white" />
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                New Delivery Offer
              </span>
              <span className="text-[11px] text-emerald-100 font-semibold">
                Order #{order.id} • Auto-dismiss in {timeLeft}s
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-pulse" />}
            </button>
            <button
              onClick={handleDismissClick}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* 💰 Price & Payment Box */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Order Total Value
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{order.total_price}
              </span>
            </div>

            <div className="text-right">
              {isCOD ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400/20 border border-amber-400/50 rounded-xl text-amber-300 font-black text-xs">
                  💵 Cash on Delivery
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-400/20 border border-emerald-400/50 rounded-xl text-emerald-300 font-black text-xs">
                  💳 Paid Online
                </span>
              )}
              <span className="text-[10px] text-slate-400 block mt-1">
                {isCOD ? 'Collect full cash from customer' : 'Do not collect cash'}
              </span>
            </div>
          </div>

          {/* 📍 Swiggy/Zomato Route Journey Representation */}
          <div className="bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800 space-y-3">
            {/* Pick up */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Store size={12} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pickup Store
                </span>
                <p className="text-xs font-bold text-slate-200">
                  Empire Plaza Kitchen
                </p>
                <p className="text-[11px] text-slate-400">Cheruvathur</p>
              </div>
            </div>

            {/* Dotted Route Connector */}
            <div className="ml-3 pl-3 border-l-2 border-dashed border-emerald-500/40 py-1">
              <span className="text-[10px] text-emerald-400/90 font-semibold flex items-center gap-1">
                <Clock size={11} /> Est. Delivery: ~15 mins
              </span>
            </div>

            {/* Drop off */}
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-900/60 border border-red-500/50 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={12} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <p className="text-xs font-bold text-slate-100">
                  {order.customer_name}
                </p>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {order.delivery_address}
                </p>
              </div>
            </div>
          </div>

          {/* 📦 Items Preview */}
          <div className="bg-slate-800/40 rounded-xl px-3 py-2 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Utensils size={13} className="text-amber-400" />
              {order.items?.length || 0} Items
            </span>
            <span className="text-[11px] font-bold text-slate-200 truncate max-w-[200px]">
              {order.items?.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
            </span>
          </div>

          {/* Multi-Order Capacity Pill */}
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Layers size={13} className="text-blue-400" />
              Current Active Run:
            </span>
            <span className="font-bold text-blue-300">
              {activeCount} of {maxBatchLimit} Orders
            </span>
          </div>

          {/* 🔘 Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleAcceptClick}
              disabled={isAccepting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <span>{isAccepting ? 'Accepting Order...' : 'ACCEPT ORDER'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={handleDismissClick}
              disabled={isAccepting}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Decline / Skip
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
