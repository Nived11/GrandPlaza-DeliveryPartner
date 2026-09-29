'use client';

import React, { useState, useEffect } from 'react';
import { Bike, ShieldCheck } from 'lucide-react';

export default function DeliveryHeader() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('username');
      const employeeId = localStorage.getItem('employee_id');
      setUsername(employeeId || stored || 'Rider');
    }
  }, []);

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm max-w-md mx-auto w-full">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-serif font-black text-base shadow-sm">
          èp
        </div>
        <div className="flex flex-col text-left">
          <span className="font-serif font-black tracking-wider text-sm leading-none uppercase text-white">
            Empire Plaza
          </span>
          <span className="text-[9px] text-amber-400 uppercase font-bold tracking-widest mt-0.5">
            Delivery Partner
          </span>
        </div>
      </div>

      {/* Rider Badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span className="text-[11px] font-black">{username || 'Partner'}</span>
        </div>
      </div>
    </header>
  );
}