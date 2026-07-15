"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DeliveryBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around text-xs font-semibold z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {/* Active Orders Option */}
      <Link 
        href="/delivery" 
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${
          pathname === "/delivery" || pathname.startsWith("/delivery/orders")
            ? "text-orange-600" 
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <span className="text-lg">📦</span>
        <span>Orders</span>
      </Link>

      {/* Profile & History Option */}
      <Link 
        href="/delivery/profile" 
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition ${
          pathname === "/delivery/profile" 
            ? "text-orange-600" 
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <span className="text-lg">👤</span>
        <span>Profile</span>
      </Link>

      {/* Logout Session Handler */}
      <button 
        onClick={() => {
          if (typeof window !== 'undefined') {
            localStorage.clear();
            window.location.href = '/delivery/auth';
          }
        }}
        className="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 hover:text-red-500 transition"
      >
        <span className="text-lg">🚪</span>
        <span>Logout</span>
      </button>
    </nav>
  );
}