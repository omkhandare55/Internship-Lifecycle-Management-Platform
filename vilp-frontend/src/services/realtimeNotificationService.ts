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
 * Subscribes to live realtime notifications (Firebase Firestore stream)
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
    playNotificationChime();
    onNewNotification(notification);
  };

  // Subscribe to Firebase Firestore Realtime Stream
  return subscribeToFirebaseNotifications(userId, handleIncomingNotification);
}
