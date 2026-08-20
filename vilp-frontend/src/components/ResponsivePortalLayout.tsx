import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogOut,
  Bell,
  PanelLeftClose,
  PanelLeft,
  Volume2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { notificationApi } from '@/services/vilpApi';
import {
  subscribeToRealtimeNotifications,
  playNotificationChime,
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

      // Auto dismiss live toast after 6 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotif.id ? null : current));
      }, 6000);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // safe fallback
    }
  };

  const handleTriggerTestChime = () => {
    playNotificationChime();
    const testNotif: NotificationItem = {
      id: `test-${Date.now()}`,
      userId: user?.id || 'system',
      title: 'Realtime Alert: Offer Confirmed',
      message: 'Google Cloud India verified your 240-hour institutional clearance.',
      type: 'OFFER',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [testNotif, ...prev]);
    setUnreadCount((prev) => prev + 1);
    setActiveToast(testNotif);
    setTimeout(() => setActiveToast((current) => (current?.id === testNotif.id ? null : current)), 6000);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const roleName = user?.role ? user.role.replace('_', ' ') : 'USER';

  return (
    <div className="min-h-screen bg-[#F4EEF7] text-[#171024] flex flex-col font-mono selection:bg-[#723ECF] selection:text-white antialiased relative">
      {/* ── Live Toast Notification Banner (Top Right) ────────────────────────── */}
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-2 border-[#723ECF] shadow-2xl p-4 rounded-sm animate-bounce-short">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ED4B86] animate-ping" />
              <span className="text-[10px] font-bold text-[#ED4B86] uppercase tracking-wider">
                ● LIVE SUPABASE EVENT
              </span>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-zinc-400 hover:text-zinc-700 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="font-bold text-xs text-[#171024] mt-1.5">{activeToast.title}</p>
          <p className="text-[11px] text-zinc-600 mt-0.5 leading-snug">{activeToast.message}</p>
          <div className="mt-2 pt-2 border-t border-[#E0D3E8] flex justify-between items-center text-[10px] text-zinc-500">
            <span className="text-[#723ECF] font-bold">{activeToast.type}</span>
            <span>Just now</span>
          </div>
        </div>
      )}

      {/* ── Top Editorial Status Ribbon (Off Yellow #FEF8E7) ───────────────── */}
      <div className="bg-[#FEF8E7] border-b border-[#E0D3E8] text-[10px] text-[#171024] px-4 sm:px-6 py-1.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#723ECF]">[ VILP // OS ]</span>
          <span className="text-[#E0D3E8]">|</span>
          <span className="font-bold">PORTAL: {portalTitle.toUpperCase()}</span>
          <span className="hidden md:inline text-[#E0D3E8]">|</span>
          <span className="hidden md:inline text-[#059669] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            SUPABASE REALTIME ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 font-mono">AUTH: {user?.email || 'OFFLINE'}</span>
          <span className="text-[#E0D3E8]">|</span>
          <span className="text-[#723ECF] font-bold">[CTRL+B COLLAPSE]</span>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* ── Desktop Editorial Sidebar (#FEF8E7) ─────────────────────────── */}
        <aside
          className={`hidden md:flex flex-col bg-[#FEF8E7] border-r border-[#E0D3E8] transition-all duration-150 select-none z-30 ${
            sidebarCollapsed ? 'w-[72px]' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#E0D3E8]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 bg-[#723ECF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                V
              </div>
              {!sidebarCollapsed && (
                <div className="truncate">
                  <p className="text-xs font-bold text-[#171024] tracking-wider">VILP OS</p>
                  <p className="text-[10px] text-[#723ECF] font-bold tracking-tight">{roleName}</p>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 text-zinc-600 hover:text-[#723ECF] hover:bg-[#faefcb] transition-colors"
              title={sidebarCollapsed ? 'Expand Sidebar (Ctrl+B)' : 'Collapse Sidebar (Ctrl+B)'}
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#723ECF] text-white font-bold'
                        : 'text-zinc-700 hover:bg-[#faefcb] hover:text-[#171024]'
                    }`
                  }
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                  {!sidebarCollapsed && item.badge && (
                    <span className="ml-auto text-[10px] font-bold bg-[#ED4B86] text-white px-1.5 py-0.2">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* User Profile / Logout Footer */}
          <div className="p-3 border-t border-[#E0D3E8] bg-[#faefcb]/50">
            {!sidebarCollapsed ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-[#723ECF] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="truncate text-[11px]">
                    <p className="font-bold text-[#171024] truncate">{user?.email || 'Guest User'}</p>
                    <p className="text-[10px] text-zinc-500">{roleName}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 border border-[#E0D3E8] bg-white hover:border-[#ED4B86] hover:text-[#ED4B86] text-[10px] font-bold text-zinc-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> [ EXIT PORTAL ]
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full p-2 flex items-center justify-center text-zinc-700 hover:text-[#ED4B86] transition-colors"
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
            <div className="relative w-4/5 max-w-xs bg-[#FEF8E7] flex flex-col h-full z-10 border-r border-[#E0D3E8] shadow-2xl">
              <div className="h-16 px-4 flex items-center justify-between border-b border-[#E0D3E8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#723ECF] text-white flex items-center justify-center font-bold text-xs">
                    V
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#171024]">VILP OS</p>
                    <p className="text-[10px] text-[#723ECF] font-bold">{roleName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-zinc-600 hover:text-[#171024]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#723ECF] text-white font-bold'
                            : 'text-zinc-700 hover:bg-[#faefcb]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[#E0D3E8]">
                <button
                  onClick={handleLogout}
                  className="w-full btn-secondary text-[#ED4B86] border-[#ED4B86] justify-center font-bold"
                >
                  <LogOut className="w-4 h-4" /> TERMINATE SESSION
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Main Application Viewport (#F4EEF7) ────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F4EEF7]">
          {/* Top Operational Bar */}
          <header className="h-16 border-b border-[#E0D3E8] bg-[#F4EEF7] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="md:hidden p-2 text-[#171024] hover:text-[#723ECF] border border-[#E0D3E8] bg-[#FEF8E7]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-bold text-[#171024] uppercase tracking-wider">
                {portalTitle}
              </h2>
            </div>

            {/* Right Tools (Notifications & Realtime Sound Trigger) */}
            <div className="flex items-center gap-3 relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 border border-[#E0D3E8] bg-[#FEF8E7] hover:border-[#723ECF] text-[#171024] hover:text-[#723ECF] relative transition-colors flex items-center gap-1.5"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#ED4B86] text-white px-1.5 py-0.2 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Ledger */}
              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-[#E0D3E8] shadow-2xl z-50 animate-slide-down">
                  <div className="p-3 border-b border-[#E0D3E8] bg-[#FEF8E7] flex items-center justify-between text-xs">
                    <span className="font-bold text-[#171024]">SYSTEM NOTIFICATIONS ({unreadCount})</span>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] text-[#723ECF] hover:underline font-bold"
                    >
                      [ MARK ALL READ ]
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#E0D3E8] text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-zinc-500">Zero unread event dispatches.</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 space-y-1 transition-colors ${
                            n.isRead ? 'bg-white' : 'bg-[#FEF8E7]/70'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-zinc-500">
                            <span className="text-[#723ECF] font-bold font-mono">
                              {n.type || 'SYSTEM'}
                            </span>
                            <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="font-bold text-[#171024] text-xs">{n.title}</p>
                          <p className="text-[11px] text-zinc-600">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Test Realtime Sound Trigger Button */}
                  <div className="p-2.5 bg-[#FEF8E7] border-t border-[#E0D3E8] flex justify-between items-center text-[10px]">
                    <span className="text-zinc-500 font-medium">Supabase Realtime Feed</span>
                    <button
                      onClick={handleTriggerTestChime}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-[#E0D3E8] hover:border-[#723ECF] text-[#723ECF] font-bold hover:bg-[#723ECF] hover:text-white transition-colors"
                    >
                      <Volume2 className="w-3 h-3" /> Test Chime & Alert
                    </button>
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

      {/* ── Mobile Editorial Bottom Navigation Bar ─────────────────────────── */}
      {mobileBottomNavItems && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FEF8E7] border-t border-[#E0D3E8] flex justify-around items-center h-14">
          {mobileBottomNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full text-[10px] ${
                    isActive ? 'text-white font-bold bg-[#723ECF]' : 'text-zinc-600'
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
