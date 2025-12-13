'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { SoundToggle } from './SoundToggle';
import { NoCourierUrgentBanner } from './NoCourierUrgentBanner';

interface WaitingOrder {
  id: number;
  fullName: string;
  address: string;
  waitingMinutes: number;
}

interface DashboardClientWrapperProps {
  children: ReactNode;
  alertsCount: number;
  waitingForCourierOrders: WaitingOrder[];
}

const REFRESH_INTERVAL = 30000; // 30 seconds
const STORAGE_KEY = 'dashboard-sound-enabled';

export function DashboardClientWrapper({
  children,
  alertsCount,
  waitingForCourierOrders
}: DashboardClientWrapperProps) {
  const router = useRouter();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevAlertsCount = useRef(alertsCount);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load sound preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setSoundEnabled(stored === 'true');
    }
  }, []);

  // Auto-refresh dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [router]);

  // Play sound when alerts increase
  useEffect(() => {
    if (soundEnabled && alertsCount > prevAlertsCount.current) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/alert.mp3');
        audioRef.current.volume = 0.5;
      }
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors (browser policy)
      });
    }
    prevAlertsCount.current = alertsCount;
  }, [alertsCount, soundEnabled]);

  const handleToggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  };

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-4">
        <div />
        <SoundToggle enabled={soundEnabled} onToggle={handleToggleSound} />
      </div>

      {/* Urgent banner for no-courier situation */}
      <NoCourierUrgentBanner
        waitingOrders={waitingForCourierOrders}
        soundEnabled={soundEnabled}
      />

      {children}
    </div>
  );
}
