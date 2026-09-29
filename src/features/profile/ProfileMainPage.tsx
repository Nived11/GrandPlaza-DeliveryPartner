'use client';

import React, { useEffect, useState } from 'react';
import {
  Bike,
  User,
  Phone,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  Package,
  LogOut,
  Power,
  RotateCw,
  Navigation,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { extractErrorMessages } from '@/utils/extractErrorMessages';
import {
  getDeliveryHistoryApi,
  getDeliveryProfileApi,
  toggleDutyStatusApi,
} from '../delivery/api/deliveryApi';
import {
  DeliveryAssignment,
  DeliveryBoyProfileData,
} from '../delivery/types/deliveryTypes';
import { useDeliveryLogout } from '../auth/hooks/useDeliveryLogout';

export default function ProfileMainPage() {
  const { logout, loggingOut } = useDeliveryLogout();

  const [profile, setProfile] = useState<DeliveryBoyProfileData | null>(null);
  const [history, setHistory] = useState<DeliveryAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTogglingDuty, setIsTogglingDuty] = useState(false);

  const fetchProfileAndHistory = async () => {
    setLoading(true);
    try {
      const [profileData, historyData] = await Promise.all([
        getDeliveryProfileApi(),
        getDeliveryHistoryApi(),
      ]);
      setProfile(profileData);
      setHistory(Array.isArray(historyData) ? historyData : []);
    } catch (err: unknown) {
      console.error('Failed to load profile data:', err);
      toast.error(extractErrorMessages(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndHistory();
  }, []);

  const handleToggleDuty = async () => {
    setIsTogglingDuty(true);
    try {
      const res = await toggleDutyStatusApi();
      if (profile) {
        setProfile({ ...profile, is_on_duty: res.is_on_duty });
      }
      if (res.is_on_duty) {
        toast.success('🟢 Duty status switched to ONLINE');
      } else {
        toast.warning('🔴 Duty status switched to OFFLINE');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessages(err));
    } finally {
      setIsTogglingDuty(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-6">
      
      {/* 👤 Rider Identity Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden border border-slate-700/50">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-400/20 shrink-0">
              <Bike size={30} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px] uppercase tracking-wider">
                  {profile?.employee_id || 'RIDER'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified Partner
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1 truncate">
                {profile?.name || 'Delivery Partner'}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                @{profile?.username || 'partner'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchProfileAndHistory}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Refresh profile"
          >
            <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Contact & Vehicle Details Strip */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Phone size={13} className="text-amber-400 shrink-0" />
            <span className="font-semibold truncate">
              {profile?.phone_number || 'N/A'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Navigation size={13} className="text-amber-400 shrink-0" />
            <span className="font-semibold truncate">
              {profile?.vehicle_number || 'Vehicle: Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* 🟢 Online / Offline Shift Switch */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
              profile?.is_on_duty
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            <Power size={18} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Shift Duty Status
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              {profile?.is_on_duty
                ? '🟢 Active Online • Receiving orders'
                : '🔴 Offline • Orders paused'}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleDuty}
          disabled={isTogglingDuty}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-sm cursor-pointer ${
            profile?.is_on_duty
              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          {profile?.is_on_duty ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      {/* 📊 Rider Lifetime Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
            <Package size={16} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block pt-1">
            Today Delivered
          </span>
          <span className="text-xl font-black text-slate-900">
            {profile?.today_delivered || 0}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 size={16} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block pt-1">
            Total Deliveries
          </span>
          <span className="text-xl font-black text-slate-900">
            {profile?.total_delivered || 0}
          </span>
        </div>
      </div>

      {/* 📜 Past Deliveries History */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Clock size={14} className="text-gray-400" />
            Recent Delivery History ({history.length})
          </h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Latest 50
          </span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs font-medium space-y-1">
            <p>No completed deliveries recorded yet.</p>
            <p className="text-[11px] text-gray-400">
              Completed orders will appear here automatically!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-1">
            {history.map((item) => {
              const order = item.order_details;
              const deliveredTime = item.delivered_at
                ? new Date(item.delivered_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : 'Delivered';

              return (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900">
                        Order #{item.order}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Delivered
                      </span>
                    </div>

                    <span className="font-black text-slate-900">
                      ₹{order?.total_price || 0}
                    </span>
                  </div>

                  {order && (
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="truncate max-w-[200px]">
                        {order.customer_name} • {order.delivery_address}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {deliveredTime}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🚪 Logout Button */}
      <button
        onClick={logout}
        disabled={loggingOut}
        className="w-full py-3.5 rounded-2xl bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] cursor-pointer"
      >
        <LogOut size={16} />
        <span>{loggingOut ? 'Signing out...' : 'Sign Out Delivery Account'}</span>
      </button>

      {/* App Branding Footer */}
      <div className="text-center pt-2 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
        Empire Plaza • Delivery Partner v1.0
      </div>

    </div>
  );
}
