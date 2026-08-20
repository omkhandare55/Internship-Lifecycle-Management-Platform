import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { firestoreDb } from './firebaseClient';
import { playNotificationChime } from './realtimeNotificationService';
import type { NotificationItem } from '@/types/vilp.types';

/**
 * Subscribes to real-time Firestore notification events for a specific user
 */
export function subscribeToFirebaseNotifications(
  userId: string | undefined,
  onNotificationReceived: (notification: NotificationItem) => void
): Unsubscribe {
  if (!userId || !firestoreDb) {
    return () => {};
  }

  try {
    const notificationsRef = collection(firestoreDb, 'notifications');
    const userQuery = query(
      notificationsRef,
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      userQuery,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const notificationItem: NotificationItem = {
              id: change.doc.id,
              userId: data.userId || userId,
              title: data.title || 'Institutional Event Alert',
              message: data.message || 'A new update is available on your dashboard.',
              type: data.type || 'SYSTEM',
              isRead: data.isRead || false,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };

            // Play Swiss audio chime
            playNotificationChime();

            // Trigger browser native OS notification if permitted
            showNativeBrowserNotification(notificationItem.title, {
              body: notificationItem.message,
              icon: '/favicon.ico',
            });

            onNotificationReceived(notificationItem);
          }
        });
      },
      (error) => {
        // Fallback gracefully without blocking offline demo
        console.warn('[Firebase Realtime] Listener standby:', error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firebase Realtime] Setup standby:', err);
    return () => {};
  }
}

/**
 * Dispatches a new notification to Firestore
 */
export async function sendFirebaseNotification(
  notification: Omit<NotificationItem, 'id' | 'createdAt'>
): Promise<string | null> {
  try {
    const notificationsRef = collection(firestoreDb, 'notifications');
    const docRef = await addDoc(notificationsRef, {
      ...notification,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.warn('[Firebase Realtime] Dispatch skipped (offline mode):', err);
    return null;
  }
}

/**
 * Requests native browser permission for background push notifications
 */
export async function requestBrowserPushPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  try {
    if (Notification.permission === 'granted') {
      return true;
    }
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
  } catch (e) {
    console.warn('[Push Notification] Permission request warning:', e);
  }
  return false;
}

/**
 * Displays a native desktop/mobile OS notification banner
 */
export function showNativeBrowserNotification(
  title: string,
  options?: NotificationOptions
) {
  if (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    Notification.permission === 'granted'
  ) {
    try {
      new Notification(title, options);
    } catch {
      // Ignored if browser policy blocks instant window focus
    }
  }
}
