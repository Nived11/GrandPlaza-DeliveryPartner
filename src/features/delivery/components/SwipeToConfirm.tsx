'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronsRight, Check, Loader2, Sparkles } from 'lucide-react';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
  successLabel?: string;
}

export default function SwipeToConfirm({
  onConfirm,
  disabled = false,
  loading = false,
  label = 'Swipe to Deliver',
  successLabel = 'Completed!',
}: SwipeToConfirmProps) {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const currentTranslateRef = useRef<number>(0);
  const maxDragRef = useRef<number>(1);

  // Compute max drag distance
  const updateMaxDrag = useCallback(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.clientWidth;
      const thumbWidth = 52; // Width of the slider button
      maxDragRef.current = Math.max(1, trackWidth - thumbWidth - 8); // 8px for 4px padding on each side
    }
  }, []);

  useEffect(() => {
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, [updateMaxDrag]);

  // Reset completion state if order completes or changes
  useEffect(() => {
    if (!loading && isCompleted) {
      const timer = setTimeout(() => {
        setIsCompleted(false);
        setDragProgress(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, isCompleted]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || loading || isCompleted) return;
    updateMaxDrag();
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled || loading || isCompleted) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startXRef.current;
    const clampedDelta = Math.max(0, Math.min(deltaX, maxDragRef.current));
    currentTranslateRef.current = clampedDelta;
    setDragProgress(clampedDelta / maxDragRef.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragProgress >= 0.82) {
      // Successfully swiped!
      setIsCompleted(true);
      setDragProgress(1);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([40, 50, 40]);
        } catch (_) {}
      }
      onConfirm();
    } else {
      // Snap back
      setDragProgress(0);
      currentTranslateRef.current = 0;
    }
  };

  // Mouse handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || loading || isCompleted) return;
    updateMaxDrag();
    setIsDragging(true);
    startXRef.current = e.clientX;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const clampedDelta = Math.max(0, Math.min(deltaX, maxDragRef.current));
      currentTranslateRef.current = clampedDelta;
      setDragProgress(clampedDelta / maxDragRef.current);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setIsDragging(false);

      if (currentTranslateRef.current / maxDragRef.current >= 0.82) {
        setIsCompleted(true);
        setDragProgress(1);
        onConfirm();
      } else {
        setDragProgress(0);
        currentTranslateRef.current = 0;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const currentTranslateX = dragProgress * maxDragRef.current;

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-14 rounded-2xl select-none overflow-hidden p-1 flex items-center transition-all ${
        disabled
          ? 'bg-gray-100 opacity-60 cursor-not-allowed'
          : isCompleted || loading
          ? 'bg-emerald-600'
          : 'bg-emerald-950/90 shadow-lg shadow-emerald-950/20'
      }`}
      style={{ touchAction: 'none' }}
    >
      {/* 🟢 Expanding Dynamic Fill Behind Thumb */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl transition-all duration-75"
        style={{
          width: `${Math.max(12, dragProgress * 100)}%`,
          opacity: isCompleted || loading ? 1 : 0.85,
        }}
      />

      {/* 🏷️ Central Label with Shimmer Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
        {loading ? (
          <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Finishing Delivery...
          </span>
        ) : isCompleted ? (
          <span className="text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
            <Check size={16} />
            {successLabel}
          </span>
        ) : (
          <div
            className="flex items-center gap-1.5 transition-opacity"
            style={{ opacity: Math.max(0.2, 1 - dragProgress * 1.5) }}
          >
            <span className="text-white/90 text-xs font-black uppercase tracking-wider">
              {label}
            </span>
            <span className="text-emerald-300 font-black animate-pulse text-xs tracking-tighter">
              ➔➔➔
            </span>
          </div>
        )}
      </div>

      {/* 🔘 Draggable Slider Thumb */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          transform: `translateX(${currentTranslateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
        }}
        className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md ${
          isCompleted || loading
            ? 'bg-white text-emerald-700'
            : 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-500/40'
        }`}
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isCompleted ? (
          <Check size={22} className="stroke-[3]" />
        ) : (
          <ChevronsRight size={22} className="stroke-[3] animate-pulse" />
        )}
      </div>
    </div>
  );
}
