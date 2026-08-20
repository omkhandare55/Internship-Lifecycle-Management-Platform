export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ACTION_REQUIRED' | 'OFFER' | 'LOGBOOK' | 'SYSTEM';
  isRead: boolean;
  targetUrl?: string;
  createdAt: string;
}
