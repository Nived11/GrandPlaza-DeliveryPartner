"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import DeliveryHeader from "@/components/common/DeliveryHeader";
import DeliveryBottomNav from "@/components/common/DeliveryBottomNav";
import "@/app/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login";

  return (
    <html lang="en">
      <head>
        <title>Empire Plaza Delivery</title>
      </head>
      <body className={`${inter.className} min-h-screen w-full m-0 p-0`}>
        {isAuthPage ? (
          <div className="min-h-screen w-full bg-orange-50 flex items-center justify-center">
            {children}
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 flex flex-col w-full relative">
            <DeliveryHeader />

            {/* Main Core Viewport Context (pb-20 ensures content is not blocked by bottom navigation bar) */}
            <main className="flex-1 overflow-y-auto p-4 pb-20 w-full max-w-md mx-auto">
              {children}
            </main>

            {/* Sticky Mobile App-Style Bottom Navigation Bar */}
            <DeliveryBottomNav />
          </div>
        )}
        
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}