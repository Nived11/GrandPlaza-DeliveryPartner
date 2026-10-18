'use client';

import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Share, PlusSquare, MoreVertical, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallButtonProps {
  variant?: 'login' | 'profile';
}

export default function PWAInstallButton({ variant = 'login' }: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already installed & running in standalone app mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(isStandaloneMode));

      // 2. Detect iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isAppleDevice);

      // 3. Connect to prompt captured early by head script
      if ((window as unknown as { __pwaDeferredPrompt?: BeforeInstallPromptEvent }).__pwaDeferredPrompt) {
        setDeferredPrompt((window as unknown as { __pwaDeferredPrompt: BeforeInstallPromptEvent }).__pwaDeferredPrompt);
      }

      const handleEarlyPrompt = () => {
        if ((window as unknown as { __pwaDeferredPrompt?: BeforeInstallPromptEvent }).__pwaDeferredPrompt) {
          setDeferredPrompt((window as unknown as { __pwaDeferredPrompt: BeforeInstallPromptEvent }).__pwaDeferredPrompt);
        }
      };
      window.addEventListener('pwa-prompt-available', handleEarlyPrompt);

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        (window as unknown as { __pwaDeferredPrompt: Event }).__pwaDeferredPrompt = e;
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      // 4. Listen for appinstalled
      const handleAppInstalled = () => {
        setIsStandalone(true);
        setDeferredPrompt(null);
        toast.success('🎉 Empire Plaza Delivery App installed successfully!');
      };
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('pwa-prompt-available', handleEarlyPrompt);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  // If already running inside installed standalone app, don't clutter the login screen
  if (isStandalone) {
    return (
      <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-400 text-[10px] font-semibold">
        <CheckCircle2 size={13} className="text-emerald-400" />
        <span>Rider App Installed (Standalone Mode)</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const prompt =
      deferredPrompt ||
      (typeof window !== 'undefined'
        ? (window as unknown as { __pwaDeferredPrompt?: BeforeInstallPromptEvent }).__pwaDeferredPrompt
        : null);

    if (prompt) {
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        if (choice.outcome === 'accepted') {
          toast.success('🎉 Installing Delivery Partner App...');
        }
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') {
          (window as unknown as { __pwaDeferredPrompt?: null }).__pwaDeferredPrompt = null;
        }
        return;
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }

    // If native prompt not triggered by browser (iOS or disabled), show instructions modal
    setShowInstructions(true);
  };

  return (
    <>
      {/* 📲 INSTALL BUTTON */}
      {variant === 'login' ? (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/50 text-brand-gold font-bold text-xs flex items-center justify-between transition-all active:scale-[0.98] shadow-lg backdrop-blur-md cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0 group-hover:scale-105 transition">
              <Smartphone size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-brand-gold flex items-center gap-1.5">
                Download Rider App
                <span className="text-[9px] bg-brand-gold text-brand-green-dark px-1.5 py-0.2 rounded font-black tracking-normal">
                  APK / PWA
                </span>
              </span>
              <span className="text-[10px] text-brand-cream/70 font-normal">
                Add to Home Screen for full app experience
              </span>
            </div>
          </div>

          <div className="p-1 rounded-lg bg-brand-gold text-brand-green-dark shrink-0">
            <Download size={15} className="animate-bounce" />
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs flex items-center justify-between shadow-md active:scale-[0.98] transition cursor-pointer"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Smartphone size={18} />
            </div>
            <div>
              <div className="font-extrabold text-[12px] uppercase tracking-wider">
                Install Delivery App
              </div>
              <div className="text-[10px] text-white/80">
                Launch directly from phone home screen
              </div>
            </div>
          </div>
          <Download size={16} className="text-white shrink-0" />
        </button>
      )}

      {/* 📖 STEP-BY-STEP INSTRUCTIONS MODAL (Fallback for iOS & Manual Android) */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-brand-gold/40 rounded-3xl p-5 sm:p-6 text-white shadow-2xl space-y-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-full bg-white/10"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-serif font-black text-lg">
                èp
              </div>
              <div>
                <h3 className="font-bold text-sm text-brand-gold uppercase tracking-wider">
                  Install on Phone
                </h3>
                <p className="text-[11px] text-gray-300">
                  Add to Home Screen in 2 easy steps:
                </p>
              </div>
            </div>

            {/* Instructions based on OS */}
            {isIOS ? (
              <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    1
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Tap the <strong>Share</strong> button <Share size={12} className="inline mx-1 text-sky-400" /> at the bottom of Safari.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    2
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Scroll down and tap <strong>&apos;Add to Home Screen&apos;</strong> <PlusSquare size={12} className="inline mx-1 text-emerald-400" />.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    3
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Tap <strong>&apos;Add&apos;</strong> in top-right. The app will appear on your phone home screen!
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-white/5 p-3.5 rounded-2xl border border-white/10 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    1
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Tap the <strong>Menu (3 dots)</strong> <MoreVertical size={12} className="inline mx-1 text-brand-gold" /> at top-right of your browser.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    2
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Select <strong>&apos;Install app&apos;</strong> or <strong>&apos;Add to Home screen&apos;</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-gold/20 text-brand-gold flex items-center justify-center text-[11px] font-bold shrink-0">
                    3
                  </div>
                  <div className="text-[11px] text-gray-200">
                    Tap <strong>&apos;Install&apos;</strong>. You can now open Empire Plaza as a standalone app without the browser address bar!
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-green-dark font-black text-xs uppercase tracking-wider shadow-lg active:scale-[0.98] transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
