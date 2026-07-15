"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bike, Phone, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Delivery agent initialization workflow redirection points
    setTimeout(() => {
      setLoading(false);
      if (phone.length === 10) {
        // Redirecting directly to the agent runtime layout dashboard
        router.push("/delivery");
      } else {
        setError("Please register a valid active terminal device phone number.");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-[#0c0a09] flex items-center justify-center px-6 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-stone-900/40 border border-stone-800 p-6 rounded-3xl"
      >
        <header className="text-center mb-8">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bike className="text-amber-500" size={22} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight italic">
            Runners <span className="text-amber-500">Hub.</span>
          </h2>
          <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest mt-1">
            Log in to initiate field operational shifts
          </p>
        </header>

        <form onSubmit={handleDeliverySubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-amber-500 font-bold text-xs pr-2 border-r border-stone-800">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              required
              placeholder="Runner Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full pl-16 pr-4 py-3 text-sm bg-stone-950 border border-stone-800 rounded-xl focus:border-amber-500 transition-all font-semibold tracking-wide text-white outline-none placeholder:text-stone-600 placeholder:font-normal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black py-3 rounded-xl font-black uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <><Loader2 className="animate-spin text-black" size={14} /> <span>Sending Code...</span></>
            ) : (
              <span className="text-black">Request Access Token</span>
            )}
          </button>
        </form>

        <div className="w-full min-h-[40px] mt-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={14} className="text-red-500 shrink-0" />
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}