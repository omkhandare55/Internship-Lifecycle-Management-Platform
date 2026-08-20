import { supabase } from './supabaseClient';
import { subscribeToFirebaseNotifications } from './firebaseNotificationService';
import type { NotificationItem } from '@/types/vilp.types';

/**
 * Generates an elegant, crystal-clear Swiss audio chime using standard Web Audio API
 */
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Harmonic arpeggio from 587.33Hz (D5) to 880Hz (A5)
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.38);
  } catch {
    // Audio Context may be muted or blocked by browser policy until interaction
  }
}

/**
 * Subscribes to live realtime notifications (Supabase + Firebase dual-engine with deduplication)
 */
export function subscribeToRealtimeNotifications(
  userId: string | undefined,
  onNewNotification: (notification: NotificationItem) => void
) {
  const seenNotificationIds = new Set<string>();

  const handleIncomingNotification = (notification: NotificationItem) => {
    if (seenNotificationIds.has(notification.id)) {
      return;
    }
    seenNotificationIds.add(notification.id);
    onNewNotification(notification);
  };

  // 1. Subscribe to Firebase Firestore Realtime Stream
  const unsubFirebase = subscribeToFirebaseNotifications(userId, handleIncomingNotification);

  // 2. Subscribe to Supabase PostgreSQL Realtime Stream
  let unsubSupabase = () => {};

  if (supabase) {
    const channelName = userId ? `user-notifications-${userId}` : 'global-notifications';

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          ...(userId ? { filter: `user_id=eq.${userId}` } : {}),
        },
        (payload) => {
          const row = payload.new as any;
          const formattedNotification: NotificationItem = {
            id: row.id || `notif-${Date.now()}`,
            userId: row.user_id,
            title: row.title || 'System Notification',
            message: row.message || '',
            type: (row.type || 'SYSTEM').toUpperCase() as any,
            isRead: false,
            createdAt: row.created_at || new Date().toISOString(),
          };

          playNotificationChime();
          handleIncomingNotification(formattedNotification);
        }
      )
      .subscribe();

    unsubSupabase = () => {
      supabase.removeChannel(channel);
    };
  }

  // Return unified unsubscription cleanup
  return () => {
    unsubFirebase();
    unsubSupabase();
  };
}
