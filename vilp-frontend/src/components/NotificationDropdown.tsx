import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Loader2 } from 'lucide-react';
import { notificationApi } from '@/services/vilpApi';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: countData } = useQuery({
    queryKey: ['unreadCount'],
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: 15000,
  });

  const { data: notifsData, isLoading } = useQuery({
    queryKey: ['myNotifications'],
    queryFn: notificationApi.getMyNotifications,
    enabled: isOpen,
  });

  const unreadCount = countData?.data || 0;
  const notifications = notifsData?.data || [];

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['myNotifications'] });
    },
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-xl relative transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden animate-slide-down">
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/70">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-[11px] text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
            {isLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 transition-colors ${
                    n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-primary-50/30 hover:bg-primary-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5
                      className={`text-xs ${
                        n.isRead ? 'font-medium text-gray-800' : 'font-bold text-gray-900'
                      }`}
                    >
                      {n.title}
                    </h5>
                    {!n.isRead && (
                      <button
                        onClick={() => markReadMutation.mutate(n.id)}
                        className="text-gray-400 hover:text-primary-600 p-0.5"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[9px] text-gray-400 mt-2 block font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ·{' '}
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-gray-400">
                You're all caught up! No notifications right now.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
