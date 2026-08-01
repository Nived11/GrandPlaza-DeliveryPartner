"use client";

import React, { useState } from "react";
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, Shield, Bike, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeliveryAuth } from "../hooks/useDeliveryAuth"; // 👈 Updated Hook

export default function DeliveryLoginForm() {
  const { login, loading, error } = useDeliveryAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    // 👑 STRICT 100vh / NO-SCROLL CANVAS (Fixed Mobile Scroll Issues)
    <div className="h-[100dvh] w-full flex flex-col lg:flex-row font-sans antialiased empire-geometric-bg bg-[var(--brand-green-dark)] overflow-hidden relative">
      
      {/* 🟢 LEFT SIDE: EMPIRE DARK GREEN GEOMETRIC BRANDING PANEL (Desktop / Laptop Only) */}
      <div className="hidden lg:flex lg:w-1/2 text-brand-cream flex-col justify-between p-8 xl:p-16 relative overflow-hidden h-full">
        
        {/* BRAND LOGO (CINZEL / SERIF) */}
        <div className="flex items-center gap-4 z-10 shrink-0">
          <div className="w-13 h-13 xl:w-14 xl:h-14 rounded-2xl bg-brand-gold/15 border border-brand-gold/40 flex items-center justify-center font-serif font-black text-brand-gold text-2xl tracking-tighter shadow-2xl backdrop-blur-md shrink-0">
            èp
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-black text-brand-cream tracking-widest text-2xl xl:text-3xl leading-none uppercase">
              èmpire plaza
            </span>
            <span className="text-[10px] text-brand-gold tracking-[0.35em] font-sans font-bold uppercase mt-1.5">
              Delivery Partner Portal
            </span>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="mt-18 mb-auto z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-wider font-sans uppercase">
            <ShieldCheck size={14} /> Fleet Delivery Gateway
          </div>
          
          <h1 className="text-3xl xl:text-5xl font-black text-brand-cream leading-[1.15] font-sans tracking-tight">
            Fast & Reliable <br />
            <span className="text-brand-gold font-bold">Delivery</span> Operations.
          </h1>

          <p className="text-brand-cream/80 text-xs xl:text-sm leading-relaxed font-normal font-sans pt-1">
            Log in to manage assigned orders, track live drop-off routes, and update delivery statuses seamlessly.
          </p>

          {/* 📊 LIVE METRIC CARDS */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                  <Bike size={18} />
                </div>
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-cream">
                  Active Fleet
                </h4>
                <p className="text-[9px] font-semibold text-brand-cream/50 uppercase tracking-tight leading-tight">
                  Real-time Route Tracking
                </p>
              </div>
            </div>

            <div className="p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold">
                  <Package size={18} />
                </div>
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-cream">
                  Order Dispatches
                </h4>
                <p className="text-[9px] font-semibold text-brand-cream/50 uppercase tracking-tight leading-tight">
                  Instant Drop-off Updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="z-10 text-[11px] text-brand-cream/50 tracking-widest uppercase font-sans font-semibold pt-6 shrink-0">
          © {new Date().getFullYear()} Empire Plaza. All rights reserved.
        </div>
      </div>

      {/* 🏆 GOLD VERTICAL DIVIDER BAR (Laptop Only) */}
      <div className="hidden lg:block w-[1px] h-120 bg-gradient-to-b from-transparent via-brand-gold to-transparent z-20 shrink-0 my-auto" />

      {/* 🟢 RIGHT SIDE / MOBILE PANEL */}
      <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-6 xl:p-12 relative overflow-hidden">
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-brand-green-light/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full flex flex-col items-center gap-3 my-auto z-10">

          {/* 📱 TOP BRAND LOGO (OUTSIDE FORM CARD - MOBILE ONLY) */}
          <div className="flex lg:hidden flex-col items-center text-center shrink-0 mb-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center font-serif font-black text-brand-gold text-lg tracking-tighter shadow-lg backdrop-blur-md shrink-0">
                èp
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-black text-brand-cream tracking-widest text-base leading-none uppercase">
                  èmpire plaza
                </span>
                <span className="text-[8px] text-brand-gold tracking-[0.3em] font-sans font-bold uppercase mt-1">
                  Delivery Partner Portal
                </span>
              </div>
            </div>
          </div>

          {/* 🤍 GLASSMORPHIC FORM CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-black/15 border border-brand-gold/40 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-2xl relative space-y-6"
          >
            
            {/* 👤 TOP ROUNDED RIDER ICON & FORM HEADER */}
            <div className="flex flex-col items-center text-center space-y-2 pb-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 text-brand-gold border border-brand-gold/40 flex items-center justify-center shadow-lg backdrop-blur-md">
                <Bike size={26} />
              </div>
              
              <header className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-brand-gold font-sans uppercase">
                  Delivery Login
                </h2>
                <p className="text-brand-cream/70 text-[11px] sm:text-xs font-medium font-sans">
                  Enter your delivery partner credentials to sign in
                </p>
              </header>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5 font-sans">
              
              {/* 🚨 ERROR ALERT */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="w-full p-2.5 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center gap-2 text-left font-sans">
                      <AlertCircle size={15} className="text-red-400 shrink-0" />
                      <p className="text-red-200 text-xs font-semibold leading-snug font-sans">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* USERNAME INPUT */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-gold font-sans">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gold">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter your username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-black/40 border border-brand-gold/30 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all font-medium text-brand-cream outline-none placeholder:text-brand-cream/40 font-sans shadow-sm"
                  />
                </div>
              </div>

              {/* PASSWORD INPUT WITH EYE TOGGLE */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-brand-gold font-sans">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-gold">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-black/40 border border-brand-gold/30 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 transition-all font-medium text-brand-cream outline-none placeholder:text-brand-cream/40 font-sans shadow-sm"
                  />
                  
                  {/* Eye Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-gold/70 hover:text-brand-gold transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold hover:bg-[#d89c28] text-brand-green-dark py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 transition shadow-xl font-sans cursor-pointer mt-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin text-brand-green-dark" size={16} />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Authenticate Rider</span>
                )}
              </button>

              {/* 🛡️ SECURITY BADGE */}
              <div className="flex items-center justify-center gap-1.5 text-brand-cream/60 text-[10px] font-medium font-sans pt-0.5">
                <Shield size={12} className="text-brand-gold shrink-0" />
                <span>Secured Delivery Access</span>
              </div>
            </form>

          </motion.div>

        </div>
        
      </div>

    </div>
  );
}