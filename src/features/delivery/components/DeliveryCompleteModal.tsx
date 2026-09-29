'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { DeliveryOrder } from '../types/deliveryTypes';

interface DeliveryCompleteModalProps {
  order: DeliveryOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function DeliveryCompleteModal({
  order,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: DeliveryCompleteModalProps) {
  if (!isOpen || !order) return null;

  const isCOD = order.payment_status === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close icon */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={32} />
        </div>

        {/* Title & Warning */}
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-black text-slate-900">
            Confirm Delivery Completion
          </h3>
          <p className="text-xs text-gray-500">
            You are marking Order #{order.id} for {order.customer_name} as delivered.
          </p>
        </div>

        {/* COD Cash Check */}
        {isCOD ? (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 text-left text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 uppercase tracking-wider">
              <AlertTriangle size={14} className="text-amber-600" />
              Cash Collection Check
            </div>
            <p className="text-xs font-semibold">
              Have you received <span className="text-sm font-black text-amber-950">₹{order.total_price}</span> cash in hand from the customer?
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-left text-emerald-900 text-xs font-medium">
            ✅ Payment for this order was already made online. Hand over the package and complete.
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Confirming...' : 'Yes, Confirm Delivered'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
          >
            Cancel / Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
