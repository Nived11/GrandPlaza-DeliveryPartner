'use client';

import React, { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import DeliveryHeader from '@/components/common/DeliveryHeader';
import DeliveryBottomNav from '@/components/common/DeliveryBottomNav';
import '@/app/globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login';

  useEffect(() => {
    // Register PWA service worker for mobile installability
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.debug('SW reg failed:', err));
    }
  }, []);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>Empire Plaza - Delivery Partner</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        {/* 📱 PWA & Mobile Theme Color (Eliminates white bar on Android/iOS address & status bars) */}
        <meta name="theme-color" content={isAuthPage ? '#015a41' : '#ffffff'} />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EP Delivery" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.className} min-h-screen w-full m-0 p-0 ${
          isAuthPage ? 'bg-[#015a41]' : 'bg-[#F4F6F8]'
        }`}
      >
        {isAuthPage ? (
          /* Pure Full-Screen Canvas for Login - No items-center wrapper causing top white bar! */
          <div className="w-full min-h-[100dvh] bg-[#015a41] m-0 p-0 overflow-x-hidden">
            {children}
          </div>
        ) : (
          <div className="min-h-screen bg-[#F4F6F8] flex flex-col w-full relative">
            <DeliveryHeader />

            {/* Main Viewport Container */}
            <main className="flex-1 overflow-y-auto p-3.5 sm:p-4 pb-24 w-full max-w-md mx-auto">
              {children}
            </main>

            {/* Sticky Mobile Bottom Navigation */}
            <DeliveryBottomNav />
          </div>
        )}

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}