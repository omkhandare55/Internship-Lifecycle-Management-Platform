import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Bell,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { notificationApi } from '@/services/vilpApi';
import {
  subscribeToRealtimeNotifications,
} from '@/services/realtimeNotificationService';
import { CommandPaletteHUD } from './CommandPaletteHUD';
import type { NotificationItem } from '@/types/vilp.types';

export interface NavItemConfig {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string | number;
}

interface ResponsivePortalLayoutProps {
  portalTitle: string;
  brandIcon: React.ComponentType<{ className?: string }>;
  brandBgColor?: string;
  navItems: NavItemConfig[];
  mobileBottomNavItems?: NavItemConfig[];
  children: React.ReactNode;
}

export function ResponsivePortalLayout({
  portalTitle,
  navItems,
  mobileBottomNavItems,
  children,
}: ResponsivePortalLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vilp_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('vilp_sidebar_collapsed', String(next));
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationApi.getMyNotifications();
        if (res.data) {
          const list = Array.isArray(res.data) ? res.data : [];
          setNotifications(list);
          setUnreadCount(list.filter((n: NotificationItem) => !n.isRead).length);
        }
      } catch {
        // standalone safe fallback
      }
    };
    fetchNotifications();

    // ─── Live Supabase Realtime Subscription ─────────────────────────────────
    const unsubscribe = subscribeToRealtimeNotifications(user?.id, (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setActiveToast(newNotif);

      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 6000);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const roleName = user?.role ? user.role.replace('_', ' ') : 'USER';

  return (
    <div className="w-100 h-screen max-h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] d-flex flex-column font-mono selection:bg-[#2563EB] selection:text-white antialiased position-relative">
      {/* ── Live Toast Notification Banner (Top Right) ────────────────────────── */}
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-[#2563EB] shadow-2xl p-4 rounded-xs animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-wider">
                ● LIVE SYSTEM EVENT
              </span>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="font-bold text-xs text-[#0A2540] mt-1.5">{activeToast.title}</p>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{activeToast.message}</p>
          <div className="mt-2 pt-2 border-t border-[#E2E8F0] flex justify-between items-center text-[10px] text-slate-500">
            <span className="text-[#2563EB] font-bold">{activeToast.type}</span>
            <span>Just now</span>
          </div>
        </div>
      )}

      <div className="flex flex-1 relative overflow-hidden h-screen">
        {/* ── Desktop Sidebar (#F1F5F9) ────────────────────────────────────── */}
        <aside
          className={`hidden md:flex flex-col bg-[#F1F5F9] border-r border-[#CBD5E1] transition-all duration-150 select-none z-30 h-full shrink-0 overflow-hidden ${
            sidebarCollapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#CBD5E1] shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs shrink-0 rounded-xs shadow-xs">
                V
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0A2540] tracking-wider">VILP OS</p>
                  <p className="text-[10px] text-[#2563EB] font-bold tracking-tight">{roleName}</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-slate-600 hover:text-[#2563EB] hover:bg-[#E2E8F0] transition-colors rounded-xs cursor-pointer"
              title={sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links (Non-scrollable, fits viewport) */}
          <div className="flex-1 py-3 px-2 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xs transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-[#E2E8F0] hover:text-[#0A2540]'
                    }`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold bg-[#F97316] text-white px-1.5 py-0.2 rounded-xs">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* User Profile / Logout Footer */}
          <div className="p-3 border-t border-[#CBD5E1] bg-[#E2E8F0]/50">
            {!sidebarCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-[#0A2540] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="truncate text-[11px]">
                    <p className="font-bold text-[#0A2540] truncate">{user?.email || 'Guest User'}</p>
                    <p className="text-[10px] text-slate-500">{roleName}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-[#CBD5E1] bg-white hover:border-red-400 hover:text-red-600 text-[10px] font-bold text-slate-700 transition-colors rounded-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> [ EXIT PORTAL ]
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full p-2 flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors rounded-xs cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </aside>

        {/* ── Mobile Sidebar Drawer (Off-Canvas) ───────────────────────────── */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative w-4/5 max-w-xs bg-[#F1F5F9] flex flex-col h-full z-10 border-r border-[#CBD5E1] shadow-2xl">
              <div className="h-16 px-4 flex items-center justify-between border-b border-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0A2540] text-white flex items-center justify-center font-bold text-xs rounded-xs">
                    V
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0A2540]">VILP OS</p>
                    <p className="text-[10px] text-[#2563EB] font-bold">{roleName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-slate-600 hover:text-[#0A2540] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-xs transition-all ${
                          isActive
                            ? 'bg-[#2563EB] text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-[#E2E8F0]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[#CBD5E1]">
                <button
                  onClick={handleLogout}
                  className="w-full btn-secondary text-red-600 border-red-300 justify-center font-bold"
                >
                  <LogOut className="w-4 h-4" /> TERMINATE SESSION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Application Viewport (#F8FAFC) ────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          {/* Top Operational Bar */}
          <header className="h-16 border-b border-[#E2E8F0] bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 text-[#0A2540] hover:text-[#2563EB] border border-[#CBD5E1] bg-[#F8FAFC] rounded-xs cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-bold text-[#0A2540] uppercase tracking-wider">
                {portalTitle}
              </h2>
            </div>

            {/* Right Tools (Notifications & Realtime Sound Trigger) */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 border border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] text-[#0A2540] hover:text-[#2563EB] relative transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#F97316] text-white px-1.5 py-0.2 rounded-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#CBD5E1] shadow-2xl z-50 animate-slide-down rounded-xs">
                  <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0A2540]">SYSTEM NOTIFICATIONS ({unreadCount})</span>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] text-[#2563EB] hover:underline font-bold cursor-pointer"
                    >
                      [ MARK ALL READ ]
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E2E8F0] text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-500">Zero unread event dispatches.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 space-y-1 transition-colors ${
                            n.isRead ? 'bg-white' : 'bg-[#F8FAFC]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="text-[#2563EB] font-bold font-mono">
                              {n.type || 'SYSTEM'}
                            </span>
                            <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="font-bold text-[#0A2540] text-xs">{n.title}</p>
                          <p className="text-[11px] text-slate-600">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Realtime Live Sync Status */}
                  <div className="p-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-between items-center text-[10px]">
                    <span className="text-slate-600 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Supabase Realtime Live Feed
                    </span>
                    <span className="text-slate-400 font-mono">TLS 1.3 Encrypted</span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 md:pb-8">
            {children}
          </main>
        </div>
      </div>

      {/* ── Mobile Bottom Navigation Bar ──────────────────────────────────── */}
      {mobileBottomNavItems && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F1F5F9] border-t border-[#CBD5E1] flex justify-around items-center h-14">
          {mobileBottomNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full text-[10px] ${
                    isActive ? 'text-white font-bold bg-[#2563EB]' : 'text-slate-600'
                  }`
                }
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

      {/* Raycast/Linear-style Universal Command Palette HUD */}
      <CommandPaletteHUD />
    </div>
  );
}
