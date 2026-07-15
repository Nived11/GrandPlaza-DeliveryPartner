"use client";

import React, { useState } from "react";

export default function DeliveryHeader() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <header className="h-16 bg-orange-600 text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow-md shrink-0">
      <div className="flex flex-col">
        <span className="font-black tracking-wide text-base">EP DELIVERY</span>
        <span className="text-[10px] text-orange-200 uppercase font-bold tracking-wider">Field Console</span>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Toggle Switch for Online / Offline Status */}
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
            isOnline ? "bg-green-500 text-white animate-pulse" : "bg-gray-700 text-gray-300"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-white" : "bg-gray-400"}`}></span>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </button>
      </div>
    </header>
  );
}