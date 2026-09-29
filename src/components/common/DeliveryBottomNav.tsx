'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bike, User, LogOut } from 'lucide-react';
import { useDeliveryLogout } from '@/features/auth/hooks/useDeliveryLogout';

export default function DeliveryBottomNav() {
  const pathname = usePathname();
  const { logout, loggingOut } = useDeliveryLogout();

  const isOrdersActive = pathname === '/' || pathname.startsWith('/orders');
  const isProfileActive = pathname === '/profile';

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-gray-200 flex items-center justify-around text-xs font-semibold z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] max-w-md mx-auto">
      {/* 📦 Live Orders Option */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${
          isOrdersActive
            ? 'text-emerald-600 font-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1 rounded-xl transition ${isOrdersActive ? 'bg-emerald-50' : ''}`}>
          <Bike size={20} className={isOrdersActive ? 'text-emerald-600' : 'text-gray-400'} />
        </div>
        <span className="text-[10px] uppercase tracking-wider">Deliveries</span>
      </Link>

      {/* 👤 Profile & History Option */}
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${
          isProfileActive
            ? 'text-emerald-600 font-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <div className={`p-1 rounded-xl transition ${isProfileActive ? 'bg-emerald-50' : ''}`}>
          <User size={20} className={isProfileActive ? 'text-emerald-600' : 'text-gray-400'} />
        </div>
        <span className="text-[10px] uppercase tracking-wider">Profile</span>
      </Link>

      {/* 🚪 Logout Session Handler */}
      <button
        onClick={logout}
        disabled={loggingOut}
        className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
      >
        <div className="p-1 rounded-xl hover:bg-red-50 transition">
          <LogOut size={20} />
        </div>
        <span className="text-[10px] uppercase tracking-wider">
          {loggingOut ? 'Exiting...' : 'Sign Out'}
        </span>
      </button>
    </nav>
  );
}