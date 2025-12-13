'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  activateEmergencyClosureAction,
  deactivateEmergencyClosureAction,
  extendEmergencyClosureAction,
} from '@/features/system-settings';

export function useEmergencyClosure() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [until, setUntil] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  async function handleActivate() {
    if (!reason || !message || !confirmed) {
      toast.error('Please fill all fields and confirm');
      return;
    }

    setIsLoading(true);
    try {
      const result = await activateEmergencyClosureAction({
        reason,
        message,
        until: until ? new Date(until) : undefined,
      });

      if (result.success) {
        toast.success('Emergency closure activated');
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to activate');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeactivate() {
    if (!window.confirm('Are you sure you want to deactivate emergency closure?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deactivateEmergencyClosureAction();

      if (result.success) {
        toast.success('Emergency closure deactivated - Restaurant is now open');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to deactivate');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExtend(minutes: number = 30) {
    setIsLoading(true);
    try {
      const result = await extendEmergencyClosureAction(minutes);

      if (result.success) {
        toast.success(`Extended by ${minutes} minutes`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to extend');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    isLoading,
    showForm,
    setShowForm,
    reason,
    setReason,
    message,
    setMessage,
    until,
    setUntil,
    confirmed,
    setConfirmed,
    handleActivate,
    handleDeactivate,
    handleExtend,
  };
}
