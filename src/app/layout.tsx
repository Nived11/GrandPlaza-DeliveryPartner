'use client';

import React from 'react';
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

  return (
    <html lang="en">
      <head>
        <title>Empire Plaza - Delivery Partner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.className} min-h-screen w-full m-0 p-0 bg-[#F4F6F8]`}>
        {isAuthPage ? (
          <div className="min-h-screen w-full flex items-center justify-center">
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