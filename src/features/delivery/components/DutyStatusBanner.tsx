'use client';

import React from 'react';
import { Power, RotateCw, Wifi, WifiOff } from 'lucide-react';

interface DutyStatusBannerProps {
  isOnDuty: boolean;
  onToggleDuty: () => void;
  isToggling: boolean;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function DutyStatusBanner({
  isOnDuty,
  onToggleDuty,
  isToggling,
  onRefresh,
  refreshing,
}: DutyStatusBannerProps) {
  return (
    <div
      className={`rounded-2xl p-3 sm:p-3.5 border transition-all flex items-center justify-between gap-3 ${
        isOnDuty
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : 'bg-red-50 border-red-200 text-red-950'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`w-3 h-3 rounded-full shrink-0 ${
            isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        <div>
          <span className="text-xs font-black uppercase tracking-wider block">
            {isOnDuty ? 'On Duty (Online)' : 'Off Duty (Offline)'}
          </span>
          <span className="text-[11px] text-gray-500 font-medium">
            {isOnDuty
              ? 'Ready to accept incoming delivery orders'
              : 'Turn ON duty to receive kitchen dispatch orders'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-slate-900 hover:bg-gray-50 transition cursor-pointer"
          title="Refresh orders"
        >
          <RotateCw size={14} className={refreshing ? 'animate-spin' : ''} />
        </button>

        <button
          onClick={onToggleDuty}
          disabled={isToggling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-xs ${
            isOnDuty
              ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          <Power size={13} />
          <span>{isOnDuty ? 'Go Offline' : 'Go Online'}</span>
        </button>
      </div>
    </div>
  );
}
